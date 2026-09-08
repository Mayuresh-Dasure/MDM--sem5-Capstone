import { api } from './api';
import { ApiResponse, CleaningRecord } from '../types';

export interface CreateCleaningData {
  cleanedAt: string;
  efficiencyBefore?: number;
  efficiencyAfter?: number;
  cost?: number;
  notes?: string;
}

export const cleaningService = {
  async list(installationId: string): Promise<CleaningRecord[]> {
    const res = await api.get<ApiResponse<CleaningRecord[]>>(`/installations/${installationId}/cleanings`);
    return res.data.data || [];
  },

  async create(installationId: string, data: CreateCleaningData): Promise<CleaningRecord> {
    const res = await api.post<ApiResponse<CleaningRecord>>(`/installations/${installationId}/cleanings`, data);
    return res.data.data!;
  },

  async update(recordId: string, data: Partial<CreateCleaningData>): Promise<CleaningRecord> {
    const res = await api.put<ApiResponse<CleaningRecord>>(`/cleanings/${recordId}`, data);
    return res.data.data!;
  },

  async delete(recordId: string): Promise<void> {
    await api.delete(`/cleanings/${recordId}`);
  },
};
