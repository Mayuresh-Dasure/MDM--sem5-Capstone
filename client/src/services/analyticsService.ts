import { api } from './api';
import { ApiResponse, EfficiencyTimelineResponse, SummaryStats } from '../types';

export const analyticsService = {
  async getEfficiencyTimeline(installationId: string): Promise<EfficiencyTimelineResponse> {
    const res = await api.get<ApiResponse<EfficiencyTimelineResponse>>(
      `/installations/${installationId}/analytics/efficiency`
    );
    return res.data.data!;
  },

  async getSummaryStatistics(installationId: string): Promise<SummaryStats> {
    const res = await api.get<ApiResponse<SummaryStats>>(
      `/installations/${installationId}/analytics/summary`
    );
    return res.data.data!;
  },
};
