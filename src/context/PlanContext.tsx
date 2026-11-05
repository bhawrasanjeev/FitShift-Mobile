import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  OnboardingData,
  GeneratedPlan,
  NutritionPlanData,
  DietPlanData,
  WorkoutPlanData,
  TrainingEnvironment,
  Exercise,
  MealAlternative,
  MealItem,
  GroceryEntry,
  PersonalBasics,
  DailyRhythm,
} from '../types';
import { initialEmptyOnboardingData } from '../constants/initialState';
import { planStorage } from '../services/storage/planStorage';
import { nutritionService } from '../services/api/nutritionService';
import { dietService } from '../services/api/dietService';
import { workoutService } from '../services/api/workoutService';

export type MainNavTab = 'overview' | 'workout' | 'diet' | 'schedule' | 'ai';

export type ProfileSectionKey =
  | 'personal'
  | 'rhythm'
  | 'training'
  | 'food'
  | 'budget'
  | 'supplements';

export interface SectionUpdateResult {
  needsRegeneration: boolean;
  regenerated: boolean;
  success: boolean;
  message?: string;
}

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
  updateProfileSection: (
    section: ProfileSectionKey,
    updatedSectionData: any
  ) => Promise<SectionUpdateResult>;
  generatePlan: (customData?: OnboardingData) => Promise<boolean>;
  regeneratePlan: (updatedData: OnboardingData) => Promise<boolean>;
  switchWorkoutEnvironment: (env: TrainingEnvironment) => Promise<boolean>;
  swapExercise: (dayNumber: number, exerciseId: string) => Promise<boolean>;
  swapMeal: (mealId: string, alternative: MealAlternative) => Promise<boolean>;
  updateGroceryChecklist: (itemId: string, checked: boolean) => Promise<void>;
  resetPlan: () => Promise<void>;
  clearAllData: () => Promise<void>;
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

  const swapMeal = async (mealId: string, alternative: MealAlternative): Promise<boolean> => {
    if (!plan || !plan.diet || !plan.diet.meals) return false;

    try {
      const targetMeal = plan.diet.meals.find((m) => m.id === mealId);
      if (!targetMeal) return false;

      // Create reversed alternative for current meal so the swap can be undone
      const reversedAlternative: MealAlternative = {
        id: `alt-${targetMeal.id}-${Date.now()}`,
        name: targetMeal.title,
        description: `Previous planned selection: ${targetMeal.items.map((i) => i.name).join(', ')}`,
        approxProteinG: targetMeal.totalProteinGrams,
        estCalories: targetMeal.estCalories || Math.round(targetMeal.totalProteinGrams * 16),
        approxCostRupees: targetMeal.estimatedCost,
        prepTimeMinutes: targetMeal.prepTimeMinutes || 15,
        cookingTip: targetMeal.cookingTip,
        ingredients: targetMeal.items.map((i) => `${i.name} (${i.quantityGrams}g)`),
        items: targetMeal.items,
      };

      const updatedAlternatives = [
        reversedAlternative,
        ...(targetMeal.alternatives || []).filter((a) => a.id !== alternative.id),
      ];

      const updatedMeals = plan.diet.meals.map((meal) => {
        if (meal.id !== mealId) return meal;

        const updatedItems: MealItem[] =
          alternative.items && alternative.items.length > 0
            ? alternative.items
            : meal.items;

        const newProtein =
          alternative.approxProteinG ||
          updatedItems.reduce((sum, i) => sum + i.proteinGrams, 0);

        const newCost =
          alternative.approxCostRupees ||
          updatedItems.reduce((sum, i) => sum + i.estimatedCost, 0);

        return {
          ...meal,
          title: alternative.name,
          totalProteinGrams: newProtein,
          estimatedCost: newCost,
          estCalories: alternative.estCalories || meal.estCalories,
          prepTimeMinutes: alternative.prepTimeMinutes || meal.prepTimeMinutes,
          cookingTip: alternative.cookingTip || meal.cookingTip,
          items: updatedItems,
          alternatives: updatedAlternatives,
        };
      });

      // Reconcile grocery list directly from updated meals
      const previousCheckedMap = new Map<string, boolean>();
      (plan.diet.groceryList || []).forEach((item) => {
        previousCheckedMap.set(item.name.toLowerCase().trim(), Boolean(item.checked));
      });

      const totals = new Map<
        string,
        { name: string; category: string; dailyGrams: number; dailyCost: number }
      >();

      updatedMeals.forEach((meal) => {
        meal.items.forEach((item) => {
          const cleanName = item.name.replace(/\s*\([^)]*\)/g, '').trim();
          const key = cleanName.toLowerCase();
          if (!totals.has(key)) {
            totals.set(key, {
              name: cleanName,
              category: item.category || 'Pantry Staples',
              dailyGrams: 0,
              dailyCost: 0,
            });
          }
          const entry = totals.get(key)!;
          entry.dailyGrams += item.quantityGrams;
          entry.dailyCost += item.estimatedCost;
        });
      });

      const updatedGroceryList: GroceryEntry[] = Array.from(totals.values()).map((entry, idx) => {
        const weeklyGrams = entry.dailyGrams * 7;
        const weeklyCost = Math.round(entry.dailyCost * 7);

        let quantityLabel: string;
        if (entry.name.toLowerCase().includes('egg')) {
          const eggsPerDay = Math.max(1, Math.round(entry.dailyGrams / 50));
          quantityLabel = `${eggsPerDay * 7} eggs (~${Math.round((weeklyGrams / 1000) * 10) / 10} kg)`;
        } else if (weeklyGrams >= 1000) {
          quantityLabel = `${(weeklyGrams / 1000).toFixed(1)} kg`;
        } else {
          quantityLabel = `${weeklyGrams} g`;
        }

        const key = entry.name.toLowerCase().trim();
        const wasChecked = previousCheckedMap.get(key) || false;

        return {
          id: `grocery-${idx + 1}`,
          name: entry.name,
          category: entry.category,
          weeklyQuantity: quantityLabel,
          weeklyGrams,
          estimatedWeeklyCost: weeklyCost,
          estimatedDailyCost: Math.round(entry.dailyCost),
          checked: wasChecked,
        };
      });

      const totalDailyCost = updatedMeals.reduce((sum, m) => sum + m.estimatedCost, 0);
      const totalProtein = updatedMeals.reduce((sum, m) => sum + m.totalProteinGrams, 0);

      const updatedPlan: GeneratedPlan = {
        ...plan,
        diet: {
          ...plan.diet,
          meals: updatedMeals,
          groceryList: updatedGroceryList,
          budget: {
            ...plan.diet.budget,
            estimatedCost: totalDailyCost,
          },
          protein: {
            ...plan.diet.protein,
            achievedGrams: totalProtein,
            gapGrams: Math.max(0, plan.diet.protein.targetGrams - totalProtein),
          },
        },
      };

      setPlan(updatedPlan);
      await planStorage.savePlan(updatedPlan);
      return true;
    } catch (err) {
      console.warn('[PlanContext] Swap meal error:', err);
      return false;
    }
  };

  const updateGroceryChecklist = async (itemId: string, checked: boolean): Promise<void> => {
    if (!plan || !plan.diet || !plan.diet.groceryList) return;

    try {
      const updatedGroceryList = plan.diet.groceryList.map((item) =>
        item.id === itemId ? { ...item, checked } : item
      );

      const updatedPlan: GeneratedPlan = {
        ...plan,
        diet: {
          ...plan.diet,
          groceryList: updatedGroceryList,
        },
      };

      setPlan(updatedPlan);
      await planStorage.savePlan(updatedPlan);
    } catch (err) {
      console.warn('[PlanContext] Update grocery checklist error:', err);
    }
  };

  const updateProfileSection = async (
    section: ProfileSectionKey,
    updatedSectionData: any
  ): Promise<SectionUpdateResult> => {
    setIsLoading(true);
    setError(null);

    const mergedProfile: OnboardingData = {
      ...userProfile,
      [section]: {
        ...userProfile[section],
        ...updatedSectionData,
      },
    };

    // If user doesn't have an active plan yet, just persist profile
    if (!plan) {
      setUserProfile(mergedProfile);
      await planStorage.saveUserProfile(mergedProfile);
      setIsLoading(false);
      return { needsRegeneration: false, regenerated: false, success: true };
    }

    // Determine what needs to be regenerated
    let needsNutrition = false;
    let needsDiet = false;
    let needsWorkout = false;
    let needsSchedule = false;

    if (section === 'personal') {
      const p = updatedSectionData as Partial<PersonalBasics>;
      const metricsChanged =
        (p.age !== undefined && p.age !== userProfile.personal.age) ||
        (p.heightCm !== undefined && p.heightCm !== userProfile.personal.heightCm) ||
        (p.weightKg !== undefined && p.weightKg !== userProfile.personal.weightKg) ||
        (p.gender !== undefined && p.gender !== userProfile.personal.gender);
      const goalChanged = p.goal !== undefined && p.goal !== userProfile.personal.goal;

      if (metricsChanged || goalChanged) {
        needsNutrition = true;
        needsDiet = true;
      }
      if (goalChanged) {
        needsWorkout = true;
      }
    } else if (section === 'rhythm') {
      const r = updatedSectionData as Partial<DailyRhythm>;
      if (r.activityLevel !== undefined && r.activityLevel !== userProfile.rhythm.activityLevel) {
        needsNutrition = true;
        needsDiet = true;
      }
      needsSchedule = true;
    } else if (section === 'training') {
      needsWorkout = true;
    } else if (section === 'food' || section === 'budget' || section === 'supplements') {
      needsDiet = true;
    }

    const needsRegeneration = needsNutrition || needsDiet || needsWorkout || needsSchedule;

    if (!needsRegeneration) {
      // Just display name or non-algorithmic field changed
      setUserProfile(mergedProfile);
      const updatedPlan: GeneratedPlan = {
        ...plan,
        userProfile: mergedProfile,
      };
      setPlan(updatedPlan);
      await Promise.all([
        planStorage.saveUserProfile(mergedProfile),
        planStorage.savePlan(updatedPlan),
      ]);
      setIsLoading(false);
      return {
        needsRegeneration: false,
        regenerated: false,
        success: true,
        message: 'Profile updated successfully.',
      };
    }

    // Execute needed regenerations
    try {
      let updatedNutrition = plan.nutrition;
      let updatedDiet = plan.diet;
      let updatedWorkout = plan.workout;

      // 1. Recalculate Nutrition if needed
      if (needsNutrition) {
        const goal = mergedProfile.personal.goal === 'weight_loss' ? 'fat_loss' : mergedProfile.personal.goal;
        const gender = mergedProfile.personal.gender === 'female' ? 'female' : 'male';
        const activityMap: Record<string, 'sedentary' | 'light' | 'moderate' | 'very_active'> = {
          sedentary: 'sedentary',
          lightly_active: 'light',
          moderately_active: 'moderate',
          very_active: 'very_active',
        };
        const activityLevel = activityMap[mergedProfile.rhythm.activityLevel] || 'moderate';

        updatedNutrition = await nutritionService.calculate({
          age: Number(mergedProfile.personal.age) || 24,
          gender,
          heightCm: Number(mergedProfile.personal.heightCm) || 175,
          weightKg: Number(mergedProfile.personal.weightKg) || 70,
          goal,
          activityLevel,
        });
      }

      // 2. Re-optimize Diet if needed
      if (needsDiet) {
        const dietMap: Record<string, 'vegetarian' | 'eggetarian' | 'non_vegetarian'> = {
          pure_veg: 'vegetarian',
          eggetarian: 'eggetarian',
          non_veg: 'non_vegetarian',
        };
        const dietType = dietMap[mergedProfile.food.dietType] || 'vegetarian';

        const suppMap: Record<string, 'no_supplements' | 'open_to_supplements' | 'unsure'> = {
          no_supplements: 'no_supplements',
          open_to_supplements: 'open_to_supplements',
          not_sure: 'unsure',
        };
        const supplementPreference = suppMap[mergedProfile.supplements.preference] || 'no_supplements';

        updatedDiet = await dietService.optimize({
          nutrition: {
            calorieTarget: updatedNutrition.calorieTarget,
            proteinTargetGrams: updatedNutrition.proteinTargetGrams,
          },
          dietType,
          foodBudget: Number(mergedProfile.budget.dailyBudgetRupees) || 65,
          supplementPreference,
          mealsPerDay: Number(mergedProfile.food.mealsPerDay) || 3,
          rhythm: mergedProfile.rhythm,
          training: mergedProfile.training,
        });
      }

      // 3. Regenerate Workout if needed
      if (needsWorkout) {
        const gender = mergedProfile.personal.gender === 'female' ? 'female' : 'male';
        const goal = mergedProfile.personal.goal === 'weight_loss' ? 'fat_loss' : mergedProfile.personal.goal;

        updatedWorkout = await workoutService.generate({
          gender,
          environment: mergedProfile.training.environment,
          durationMinutes: mergedProfile.training.durationMinutes,
          weeklyFrequencyDays: mergedProfile.training.weeklyFrequencyDays,
          experienceLevel: mergedProfile.training.experienceLevel,
          goal,
        });
      }

      const updatedPlan: GeneratedPlan = {
        ...plan,
        userProfile: mergedProfile,
        nutrition: updatedNutrition,
        diet: updatedDiet,
        workout: updatedWorkout,
        savedAt: new Date().toISOString(),
      };

      setUserProfile(mergedProfile);
      setPlan(updatedPlan);
      await Promise.all([
        planStorage.saveUserProfile(mergedProfile),
        planStorage.savePlan(updatedPlan),
      ]);

      return {
        needsRegeneration: true,
        regenerated: true,
        success: true,
        message: 'Plan regenerated and updated successfully.',
      };
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Failed to regenerate plan with updated parameters. Your previous plan was preserved.';
      setError(msg);
      // NOTE: Existing valid plan is preserved! We do not overwrite setPlan with broken data.
      return {
        needsRegeneration: true,
        regenerated: false,
        success: false,
        message: msg,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const resetPlan = async () => {
    await planStorage.clearPlan();
    setPlan(null);
    setIsLateTiredActive(false);
    setActiveTab('overview');
  };

  const clearAllData = async (): Promise<void> => {
    await planStorage.clearAllData();
    setPlan(null);
    setUserProfile(initialEmptyOnboardingData);
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
        updateProfileSection,
        generatePlan,
        regeneratePlan,
        switchWorkoutEnvironment,
        swapExercise,
        swapMeal,
        updateGroceryChecklist,
        resetPlan,
        clearAllData,
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
