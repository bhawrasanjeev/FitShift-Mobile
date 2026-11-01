import { apiClient } from './apiClient';

export interface HealthResponse {
  success: boolean;
  message: string;
}

export interface DatasetStatusResponse {
  status: string;
  timestamp: string;
  datasets: {
    cleanStaples: { loaded: boolean; recordCount: number; valid: boolean };
    foodPrices: { loaded: boolean; recordCount: number; valid: boolean };
    exercises: { loaded: boolean; recordCount: number; valid: boolean };
    nutrition: { loaded: boolean; recordCount: number; valid: boolean };
  };
}

export const healthService = {
  async checkHealth(): Promise<HealthResponse> {
    return apiClient.get<HealthResponse>('/api/health');
  },

  async getDatasetStatus(): Promise<DatasetStatusResponse> {
    const res = await apiClient.get<{ success?: boolean; data?: DatasetStatusResponse } | DatasetStatusResponse>('/api/data/status');
    if ('data' in res && res.data) {
      return res.data;
    }
    return res as DatasetStatusResponse;
  },
};

export default healthService;
