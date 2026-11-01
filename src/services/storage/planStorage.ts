import AsyncStorage from '@react-native-async-storage/async-storage';
import { GeneratedPlan, OnboardingData } from '../../types';

const STORAGE_KEYS = {
  USER_PROFILE: '@fitshift_user_profile',
  ACTIVE_PLAN: '@fitshift_active_plan',
  API_BASE_URL: '@fitshift_api_base_url',
  LATE_TIRED_ACTIVE: '@fitshift_late_tired_active',
} as const;

export const planStorage = {
  /**
   * Persists the complete generated plan (profile, nutrition, diet, workout).
   */
  async savePlan(plan: GeneratedPlan): Promise<void> {
    try {
      const serialized = JSON.stringify(plan);
      await AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_PLAN, serialized);
    } catch (err) {
      console.error('[planStorage] Failed to save plan:', err);
      throw err;
    }
  },

  /**
   * Retrieves the persisted plan, or null if none exists.
   */
  async loadPlan(): Promise<GeneratedPlan | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_PLAN);
      if (!data) return null;
      return JSON.parse(data) as GeneratedPlan;
    } catch (err) {
      console.error('[planStorage] Failed to load plan:', err);
      return null;
    }
  },

  /**
   * Clears the saved plan from storage (used when restarting plan generation).
   */
  async clearPlan(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.ACTIVE_PLAN);
    } catch (err) {
      console.error('[planStorage] Failed to clear plan:', err);
    }
  },

  /**
   * Persists in-progress or completed user profile onboarding data.
   */
  async saveUserProfile(profile: OnboardingData): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch (err) {
      console.error('[planStorage] Failed to save profile:', err);
    }
  },

  /**
   * Loads saved user profile onboarding data.
   */
  async loadUserProfile(): Promise<OnboardingData | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (!data) return null;
      return JSON.parse(data) as OnboardingData;
    } catch (err) {
      console.error('[planStorage] Failed to load profile:', err);
      return null;
    }
  },

  /**
   * Persists a custom API Base URL (for switching between Emulator, LAN, and Production).
   */
  async saveCustomApiUrl(url: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.API_BASE_URL, url.trim());
    } catch (err) {
      console.error('[planStorage] Failed to save custom API URL:', err);
    }
  },

  /**
   * Loads custom API Base URL.
   */
  async loadCustomApiUrl(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.API_BASE_URL);
    } catch (err) {
      console.error('[planStorage] Failed to load custom API URL:', err);
      return null;
    }
  },
};

export default planStorage;
