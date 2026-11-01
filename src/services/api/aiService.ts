import { apiClient } from './apiClient';
import { AIStatusResponse, AIChatResponse } from '../../types';

export interface AIChatContext {
  goal?: string;
  environment?: string;
  diet?: string;
  dailyBudget?: number;
  durationMinutes?: number;
}

export const aiService = {
  async getStatus(): Promise<AIStatusResponse> {
    const res = await apiClient.get<{ success: boolean; data: AIStatusResponse }>(
      '/api/ai/status'
    );
    return res.data;
  },

  async sendChat(query: string, context?: AIChatContext): Promise<AIChatResponse> {
    const res = await apiClient.post<{ success: boolean; data: AIChatResponse }>(
      '/api/ai/chat',
      { query, context },
      { timeoutMs: 30000 } // Extended timeout for LLM inferences
    );
    return res.data;
  },
};

export default aiService;
