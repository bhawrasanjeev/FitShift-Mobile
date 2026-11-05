import AsyncStorage from '@react-native-async-storage/async-storage';
import { GeneratedPlan, OnboardingData, ChatMessage } from '../../types';

const STORAGE_KEYS = {
  USER_PROFILE: '@fitshift_user_profile',
  ACTIVE_PLAN: '@fitshift_active_plan',
  API_BASE_URL: '@fitshift_api_base_url',
  LATE_TIRED_ACTIVE: '@fitshift_late_tired_active',
  CHAT_HISTORY: '@fitshift_ai_chat_history',
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

  /**
   * Persists AI Coach conversation messages.
   */
  async saveChatHistory(messages: ChatMessage[]): Promise<void> {
    try {
      // Keep only last 50 messages to prevent excessive storage growth
      const recent = messages.slice(-50);
      await AsyncStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(recent));
    } catch (err) {
      console.error('[planStorage] Failed to save chat history:', err);
    }
  },

  /**
   * Loads saved AI Coach conversation messages.
   */
  async loadChatHistory(): Promise<ChatMessage[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (err) {
      console.error('[planStorage] Failed to load chat history:', err);
      return [];
    }
  },

  /**
   * Clears saved AI Coach conversation messages.
   */
  async clearChatHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY);
    } catch (err) {
      console.error('[planStorage] Failed to clear chat history:', err);
    }
  },

  /**
   * Clears all local application data (plan, profile, chat history, late mode).
   */
  async clearAllData(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.ACTIVE_PLAN),
        AsyncStorage.removeItem(STORAGE_KEYS.USER_PROFILE),
        AsyncStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY),
        AsyncStorage.removeItem(STORAGE_KEYS.LATE_TIRED_ACTIVE),
      ]);
    } catch (err) {
      console.error('[planStorage] Failed to clear all data:', err);
    }
  },
};

export default planStorage;
