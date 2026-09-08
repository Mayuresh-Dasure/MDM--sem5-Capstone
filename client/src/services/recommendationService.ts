import { api } from './api';
import { ApiResponse, RecommendationResult } from '../types';

export const recommendationService = {
  async getRecommendation(
    installationId: string,
    forceRefresh = false,
    scenario?: string
  ): Promise<RecommendationResult> {
    const res = await api.get<ApiResponse<RecommendationResult>>(
      `/installations/${installationId}/recommendation`,
      {
        params: { refresh: forceRefresh, scenario },
      }
    );
    return res.data.data!;
  },
};
