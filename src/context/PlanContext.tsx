import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  OnboardingData,
  GeneratedPlan,
  NutritionPlanData,
  DietPlanData,
  WorkoutPlanData,
  TrainingEnvironment,
  Exercise,
} from '../types';
import { initialEmptyOnboardingData } from '../constants/initialState';
import { planStorage } from '../services/storage/planStorage';
import { nutritionService } from '../services/api/nutritionService';
import { dietService } from '../services/api/dietService';
import { workoutService } from '../services/api/workoutService';

export type MainNavTab = 'overview' | 'workout' | 'diet' | 'schedule' | 'ai';

interface PlanContextType {
  // Plan and Profile Data
  userProfile: OnboardingData;
  plan: GeneratedPlan | null;
  hasPlan: boolean;
  isInitializing: boolean;
  isLoading: boolean;
  error: string | null;

  // Active state
  activeTab: MainNavTab;
  setActiveTab: (tab: MainNavTab) => void;
  isLateTiredActive: boolean;
  setIsLateTiredActive: (active: boolean) => void;

  // Actions
  updateUserProfile: (updater: (prev: OnboardingData) => OnboardingData) => void;
  generatePlan: (customData?: OnboardingData) => Promise<boolean>;
  regeneratePlan: (updatedData: OnboardingData) => Promise<boolean>;
  switchWorkoutEnvironment: (env: TrainingEnvironment) => Promise<boolean>;
  swapExercise: (dayNumber: number, exerciseId: string) => Promise<boolean>;
  resetPlan: () => Promise<void>;
  clearError: () => void;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export const PlanProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<OnboardingData>(initialEmptyOnboardingData);
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<MainNavTab>('overview');
  const [isLateTiredActive, setIsLateTiredActive] = useState<boolean>(false);

  // Restore stored session and plan on app launch
  useEffect(() => {
    async function restoreSession() {
      try {
        const [savedPlan, savedProfile] = await Promise.all([
          planStorage.loadPlan(),
          planStorage.loadUserProfile(),
        ]);

        if (savedPlan) {
          setPlan(savedPlan);
          setUserProfile(savedPlan.userProfile || savedProfile || initialEmptyOnboardingData);
        } else if (savedProfile) {
          setUserProfile(savedProfile);
        }
      } catch (err) {
        console.warn('[PlanContext] Session restoration error:', err);
      } finally {
        setIsInitializing(false);
      }
    }
    restoreSession();
  }, []);

  const updateUserProfile = (updater: (prev: OnboardingData) => OnboardingData) => {
    setUserProfile((prev) => {
      const next = updater(prev);
      planStorage.saveUserProfile(next);
      return next;
    });
  };

  const generatePlan = async (customData?: OnboardingData): Promise<boolean> => {
    const dataToUse = customData || userProfile;
    setIsLoading(true);
    setError(null);

    try {
      // 1. Calculate Nutrition Targets (Mifflin-St Jeor + Activity + Goal)
      const goal = dataToUse.personal.goal === 'weight_loss' ? 'fat_loss' : dataToUse.personal.goal;
      const gender = dataToUse.personal.gender === 'female' ? 'female' : 'male';
      const activityMap: Record<string, 'sedentary' | 'light' | 'moderate' | 'very_active'> = {
        sedentary: 'sedentary',
        lightly_active: 'light',
        moderately_active: 'moderate',
        very_active: 'very_active',
      };
      const activityLevel = activityMap[dataToUse.rhythm.activityLevel] || 'moderate';

      const nutritionRes: NutritionPlanData = await nutritionService.calculate({
        age: Number(dataToUse.personal.age) || 24,
        gender,
        heightCm: Number(dataToUse.personal.heightCm) || 175,
        weightKg: Number(dataToUse.personal.weightKg) || 70,
        goal,
        activityLevel,
      });

      // 2. Budget Diet Optimization
      const dietMap: Record<string, 'vegetarian' | 'eggetarian' | 'non_vegetarian'> = {
        pure_veg: 'vegetarian',
        eggetarian: 'eggetarian',
        non_veg: 'non_vegetarian',
      };
      const dietType = dietMap[dataToUse.food.dietType] || 'vegetarian';

      const suppMap: Record<string, 'no_supplements' | 'open_to_supplements' | 'unsure'> = {
        no_supplements: 'no_supplements',
        open_to_supplements: 'open_to_supplements',
        not_sure: 'unsure',
      };
      const supplementPreference = suppMap[dataToUse.supplements.preference] || 'no_supplements';

      const dietRes: DietPlanData = await dietService.optimize({
        nutrition: {
          calorieTarget: nutritionRes.calorieTarget,
          proteinTargetGrams: nutritionRes.proteinTargetGrams,
        },
        dietType,
        foodBudget: Number(dataToUse.budget.dailyBudgetRupees) || 65,
        supplementPreference,
        mealsPerDay: Number(dataToUse.food.mealsPerDay) || 3,
        rhythm: dataToUse.rhythm,
        training: dataToUse.training,
      });

      // 3. Deterministic Workout Generation
      const workoutRes: WorkoutPlanData = await workoutService.generate({
        gender,
        environment: dataToUse.training.environment,
        durationMinutes: dataToUse.training.durationMinutes,
        weeklyFrequencyDays: dataToUse.training.weeklyFrequencyDays,
        experienceLevel: dataToUse.training.experienceLevel,
        goal: dataToUse.personal.goal,
      });

      const fullPlan: GeneratedPlan = {
        userProfile: dataToUse,
        nutrition: nutritionRes,
        diet: dietRes,
        workout: workoutRes,
        savedAt: new Date().toISOString(),
      };

      setPlan(fullPlan);
      setUserProfile(dataToUse);
      await planStorage.savePlan(fullPlan);
      await planStorage.saveUserProfile(dataToUse);

      return true;
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Unable to generate plan. Please verify backend connection.';
      setError(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const regeneratePlan = async (updatedData: OnboardingData): Promise<boolean> => {
    return generatePlan(updatedData);
  };

  const switchWorkoutEnvironment = async (newEnv: TrainingEnvironment): Promise<boolean> => {
    if (!plan) return false;
    setIsLoading(true);
    setError(null);

    try {
      const gender = userProfile.personal.gender === 'female' ? 'female' : 'male';
      const goal = userProfile.personal.goal === 'weight_loss' ? 'fat_loss' : userProfile.personal.goal;

      const workoutRes = await workoutService.generate({
        gender,
        environment: newEnv,
        durationMinutes: userProfile.training.durationMinutes,
        weeklyFrequencyDays: userProfile.training.weeklyFrequencyDays,
        experienceLevel: userProfile.training.experienceLevel,
        goal,
      });

      const updatedProfile: OnboardingData = {
        ...userProfile,
        training: {
          ...userProfile.training,
          environment: newEnv,
        },
      };

      const updatedPlan: GeneratedPlan = {
        ...plan,
        userProfile: updatedProfile,
        workout: workoutRes,
      };

      setUserProfile(updatedProfile);
      setPlan(updatedPlan);
      await planStorage.savePlan(updatedPlan);
      await planStorage.saveUserProfile(updatedProfile);
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to switch workout environment.';
      setError(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const swapExercise = async (dayNumber: number, exerciseId: string): Promise<boolean> => {
    if (!plan || !plan.workout || !plan.workout.days) return false;

    try {
      const updatedDays = plan.workout.days.map((day) => {
        if (day.dayNumber !== dayNumber) return day;

        const updatedExercises = day.exercises.map((ex) => {
          if (ex.id !== exerciseId) return ex;

          const alt = ex.alternative;
          const newMain: Exercise = {
            id: alt.id,
            name: alt.name,
            targetMuscle: alt.targetMuscle || ex.targetMuscle,
            setsReps: ex.setsReps,
            restSeconds: ex.restSeconds,
            environment: alt.environment === 'both' ? 'home' : alt.environment,
            equipment: alt.equipment,
            thumbnailUrl: alt.thumbnailUrl || ex.thumbnailUrl,
            instructions:
              alt.instructions && alt.instructions.length > 0
                ? alt.instructions
                : ex.instructions,
            commonMistakes:
              alt.commonMistakes && alt.commonMistakes.length > 0
                ? alt.commonMistakes
                : ex.commonMistakes,
            alternative: {
              id: ex.id,
              name: ex.name,
              targetMuscle: ex.targetMuscle,
              environment: ex.environment,
              equipment: ex.equipment,
              note: `Direct paired movement for ${alt.name}.`,
              thumbnailUrl: ex.thumbnailUrl,
              instructions: ex.instructions,
              commonMistakes: ex.commonMistakes,
            },
          };

          return newMain;
        });

        return { ...day, exercises: updatedExercises };
      });

      const updatedPlan: GeneratedPlan = {
        ...plan,
        workout: {
          ...plan.workout,
          days: updatedDays,
        },
      };

      setPlan(updatedPlan);
      await planStorage.savePlan(updatedPlan);
      return true;
    } catch (err) {
      console.warn('[PlanContext] Swap exercise error:', err);
      return false;
    }
  };

  const resetPlan = async () => {
    await planStorage.clearPlan();
    setPlan(null);
    setIsLateTiredActive(false);
    setActiveTab('overview');
  };

  const clearError = () => setError(null);

  return (
    <PlanContext.Provider
      value={{
        userProfile,
        plan,
        hasPlan: Boolean(plan),
        isInitializing,
        isLoading,
        error,
        activeTab,
        setActiveTab,
        isLateTiredActive,
        setIsLateTiredActive,
        updateUserProfile,
        generatePlan,
        regeneratePlan,
        switchWorkoutEnvironment,
        swapExercise,
        resetPlan,
        clearError,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
};

export const usePlan = (): PlanContextType => {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
};

export default PlanContext;
