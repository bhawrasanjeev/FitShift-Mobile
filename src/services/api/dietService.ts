import { apiClient } from './apiClient';
import { DietPlanData, DietType, SupplementPreference } from '../../types';

export interface DietOptimizationParams {
  nutrition: {
    calorieTarget: number;
    proteinTargetGrams: number;
  };
  dietType: DietType | 'vegetarian' | 'eggetarian' | 'non_vegetarian';
  foodBudget: number;
  supplementPreference?: SupplementPreference | 'no_supplements' | 'open_to_supplements' | 'unsure';
  mealsPerDay?: number;
  rhythm?: unknown;
  training?: unknown;
}

export const dietService = {
  async optimize(params: DietOptimizationParams): Promise<DietPlanData> {
    // Map dietType aliases
    const dietMap: Record<string, 'vegetarian' | 'eggetarian' | 'non_vegetarian'> = {
      pure_veg: 'vegetarian',
      vegetarian: 'vegetarian',
      eggetarian: 'eggetarian',
      non_veg: 'non_vegetarian',
      non_vegetarian: 'non_vegetarian',
    };
    const dietType = dietMap[params.dietType] || 'vegetarian';

    // Map supplement preferences
    const suppMap: Record<string, 'no_supplements' | 'open_to_supplements' | 'unsure'> = {
      no_supplements: 'no_supplements',
      open_to_supplements: 'open_to_supplements',
      not_sure: 'unsure',
      unsure: 'unsure',
    };
    const supplementPreference = suppMap[params.supplementPreference || 'no_supplements'] || 'no_supplements';

    const payload = {
      nutrition: {
        calorieTarget: Math.round(Number(params.nutrition.calorieTarget) || 2500),
        proteinTargetGrams: Math.round(Number(params.nutrition.proteinTargetGrams) || 120),
      },
      dietType,
      foodBudget: Math.round(Number(params.foodBudget) || 75),
      supplementPreference,
      mealsPerDay: Math.max(3, Math.min(6, Number(params.mealsPerDay) || 4)),
      rhythm: params.rhythm,
      training: params.training,
    };

    const res = await apiClient.post<{ success: boolean; data: DietPlanData }>(
      '/api/diet/optimize',
      payload
    );
    return res.data;
  },
};

export default dietService;
