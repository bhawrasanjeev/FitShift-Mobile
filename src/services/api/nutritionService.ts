import { apiClient } from './apiClient';
import { NutritionPlanData, FitnessGoal, Gender, ActivityLevel } from '../../types';

export interface NutritionCalculationParams {
  age: number;
  gender: Gender | 'male' | 'female';
  heightCm: number;
  weightKg: number;
  goal: FitnessGoal | 'muscle_gain' | 'fat_loss' | 'maintenance';
  activityLevel?: ActivityLevel | 'sedentary' | 'light' | 'moderate' | 'very_active';
}

export const nutritionService = {
  async calculate(params: NutritionCalculationParams): Promise<NutritionPlanData> {
    // Sanitize goal ('weight_loss' maps to 'fat_loss' per backend spec)
    const goal = params.goal === 'weight_loss' ? 'fat_loss' : params.goal;
    const gender = params.gender === 'female' ? 'female' : 'male';

    // Activity level mapping
    const activityMap: Record<string, 'sedentary' | 'light' | 'moderate' | 'very_active'> = {
      sedentary: 'sedentary',
      lightly_active: 'light',
      light: 'light',
      moderately_active: 'moderate',
      moderate: 'moderate',
      very_active: 'very_active',
    };
    const activityLevel = activityMap[params.activityLevel || 'moderate'] || 'moderate';

    const payload = {
      age: Math.max(14, Math.min(100, Number(params.age) || 24)),
      gender,
      heightCm: Math.max(100, Math.min(250, Number(params.heightCm) || 175)),
      weightKg: Math.max(30, Math.min(300, Number(params.weightKg) || 70)),
      goal,
      activityLevel,
    };

    const res = await apiClient.post<{ success: boolean; data: NutritionPlanData }>(
      '/api/nutrition/calculate',
      payload
    );
    return res.data;
  },
};

export default nutritionService;
