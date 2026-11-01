// FitShift Core Types & Domain Models
// Derived from the verified FitShift Engine architecture

export type FitnessGoal = 'muscle_gain' | 'fat_loss' | 'weight_loss' | 'maintenance';

export type Gender = 'male' | 'female' | 'other';

export type Occupation =
  | 'student'
  | 'working_professional'
  | 'homemaker'
  | 'business_owner'
  | 'freelancer'
  | 'other';

export type ActivityLevel =
  | 'sedentary'
  | 'lightly_active'
  | 'moderately_active'
  | 'very_active';

export type TrainingEnvironment = 'home' | 'gym';

export type WorkoutDuration = 20 | 30 | 45 | 60;

export type PreferredWorkoutTime = 'morning' | 'afternoon' | 'evening' | 'night' | 'flexible';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export type DietType = 'pure_veg' | 'eggetarian' | 'non_veg';

export type CookingSituation = 'hostel_mess' | 'family_provided' | 'self_cooking';

export type IndianFoodStyle =
  | 'north_indian'
  | 'south_indian'
  | 'simple_homestyle'
  | 'high_protein_everyday';

export type BudgetTier = 'ultra_budget' | 'budget' | 'moderate' | 'custom';

export type SupplementPreference =
  | 'no_supplements'
  | 'open_to_supplements'
  | 'not_sure';

export interface PersonalBasics {
  name: string;
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  goal: FitnessGoal;
}

export interface DailyRhythm {
  occupation: Occupation;
  departureTime: string; // e.g. "08:30"
  returnTime: string;    // e.g. "18:00"
  sleepHours: number;    // e.g. 7.5
  wakeUpTime: string;    // e.g. "06:30"
  activityLevel: ActivityLevel;
}

export interface TrainingSetup {
  environment: TrainingEnvironment;
  durationMinutes: WorkoutDuration;
  preferredTime: PreferredWorkoutTime;
  weeklyFrequencyDays: number; // 3, 4, 5, 6
  experienceLevel: ExperienceLevel;
  homeEquipment: string[];
  gymEquipmentLevel: 'full_gym' | 'limited_gym';
}

export interface FoodPreferences {
  dietType: DietType;
  cookingSituation: CookingSituation;
  mealsPerDay: number; // 3, 4, 5
  avoidedFoods: string[];
  allergies: string[];
  indianFoodStyle: IndianFoodStyle;
}

export interface Budget {
  tier: BudgetTier;
  dailyBudgetRupees: number;
  customAmountRupees?: number;
}

export interface Supplements {
  preference: SupplementPreference;
  monthlyBudgetRupees?: number;
}

export interface OnboardingData {
  personal: PersonalBasics;
  rhythm: DailyRhythm;
  training: TrainingSetup;
  food: FoodPreferences;
  budget: Budget;
  supplements: Supplements;
}

// Workout Types
export interface ExerciseAlternative {
  id: string;
  name: string;
  environment: TrainingEnvironment | 'both';
  equipment: string;
  note: string;
  thumbnailUrl?: string;
  instructions?: string[];
  commonMistakes?: string[];
  targetMuscle?: string;
}

export interface Exercise {
  id: string;
  name: string;
  targetMuscle: string;
  setsReps: string;
  restSeconds: number;
  environment: TrainingEnvironment | 'both';
  equipment: string;
  thumbnailUrl?: string;
  videoPlaceholderUrl?: string;
  instructions: string[];
  commonMistakes: string[];
  alternative: ExerciseAlternative;
}

export interface WorkoutDay {
  dayNumber: number;
  dayName: string;
  focus: string;
  isRestDay: boolean;
  estimatedMinutes: number;
  exercises: Exercise[];
  restDayGuidance?: string;
}

export interface WorkoutPlanData {
  gender?: 'male' | 'female' | string;
  environment: TrainingEnvironment;
  durationMinutes: number;
  weeklyFrequencyDays: number;
  experienceLevel: string;
  goal: string;
  days: WorkoutDay[];
}

// Nutrition Types
export interface NutritionPlanData {
  bmr: number;
  tdee: number;
  goal: string;
  calorieTarget: number;
  proteinTargetGrams: number;
  activityLevel: string;
}

// Diet Types
export interface OptimizedFood {
  name: string;
  quantityGrams: number;
  estimatedCost: number;
  proteinGrams: number;
  isSupplement?: boolean;
}

export interface MealItem {
  name: string;
  quantityGrams: number;
  proteinGrams: number;
  estimatedCost: number;
  category: string;
}

export interface PlannedMeal {
  id: string;
  mealType: string;
  title: string;
  totalProteinGrams: number;
  estimatedCost: number;
  items: MealItem[];
  prepTimeMinutes?: number;
  cookingTip?: string;
}

export interface GroceryEntry {
  id: string;
  name: string;
  category: string;
  weeklyQuantity: string;
  weeklyGrams: number;
  estimatedWeeklyCost: number;
  estimatedDailyCost: number;
  checked?: boolean;
}

export interface DailyMealTiming {
  time: string;
  meal: string;
  description?: string;
}

export interface DayMealEntry {
  time: string;
  mealName: string;
  foodAndQuantity: string;
  categoryTag?: string;
}

export interface DayMealPlan {
  dayNumber: number;
  dayName: string;
  focusTitle: string;
  estimatedCalories: string;
  estimatedProtein: string;
  meals: DayMealEntry[];
}

export interface BudgetPortionGuideline {
  food: string;
  portion: string;
  notes?: string;
}

export interface BudgetManagementGuide {
  headline: string;
  description: string;
  guidelines: BudgetPortionGuideline[];
}

export interface DietPlanData {
  feasible: boolean;
  budget: {
    dailyLimit: number;
    estimatedCost: number;
  };
  protein: {
    targetGrams: number;
    achievedGrams: number;
    gapGrams: number;
  };
  foods: OptimizedFood[];
  meals?: PlannedMeal[];
  groceryList?: GroceryEntry[];
  reason?: string;
  warnings?: string[];
  mealTimings?: DailyMealTiming[];
  sevenDayMealPlan?: DayMealPlan[];
  budgetManagement?: BudgetManagementGuide;
}

export interface ScheduleEvent {
  id: string;
  time: string;
  title: string;
  type: 'workout' | 'meal' | 'work' | 'sleep' | 'recovery';
  description: string;
  duration?: string;
}

export interface GeneratedPlan {
  userProfile: OnboardingData;
  nutrition: NutritionPlanData;
  diet: DietPlanData;
  workout: WorkoutPlanData;
  savedAt: string;
}

// AI Assistant Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  followUps?: string[];
  contextUsed?: {
    goal: string;
    environment: string;
    diet: string;
    dailyBudget: number;
    durationMinutes: number;
  };
}

export interface AIStatusResponse {
  configured: boolean;
  provider: 'gemini' | 'openai' | null;
  model?: string;
  message?: string;
}

export interface AIChatResponse {
  reply: string;
  response: string;
  provider: string;
  timestamp: string;
}
