import { apiClient } from './apiClient';
import {
  WorkoutPlanData,
  TrainingEnvironment,
  WorkoutDuration,
  ExperienceLevel,
  FitnessGoal,
} from '../../types';

export interface WorkoutGenerationParams {
  gender?: 'male' | 'female' | string;
  environment?: TrainingEnvironment;
  durationMinutes?: WorkoutDuration | number;
  weeklyFrequencyDays?: number;
  experienceLevel?: ExperienceLevel | string;
  goal?: FitnessGoal | string;
}

export const workoutService = {
  async generate(params: WorkoutGenerationParams): Promise<WorkoutPlanData> {
    const rawDuration = Number(params.durationMinutes) || 45;
    const durationMinutes = [20, 30, 45, 60].includes(rawDuration) ? rawDuration : 45;

    const rawFreq = Number(params.weeklyFrequencyDays) || 4;
    const weeklyFrequencyDays = [3, 4, 5, 6].includes(rawFreq) ? rawFreq : 4;

    const goal = params.goal === 'weight_loss' ? 'fat_loss' : (params.goal || 'muscle_gain');
    const gender = params.gender === 'female' ? 'female' : 'male';
    const environment = params.environment === 'gym' ? 'gym' : 'home';

    const payload = {
      gender,
      environment,
      durationMinutes,
      weeklyFrequencyDays,
      experienceLevel: params.experienceLevel || 'intermediate',
      goal,
    };

    const res = await apiClient.post<{ success: boolean; data: WorkoutPlanData }>(
      '/api/workouts/generate',
      payload
    );
    return res.data;
  },
};

export default workoutService;
