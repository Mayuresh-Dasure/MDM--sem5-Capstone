import { api } from './api';
import { ApiResponse, SolarInstallation } from '../types';

export interface CreateInstallationData {
  name: string;
  latitude: number;
  longitude: number;
  locationName: string;
  capacityKw: number;
  panelCount: number;
  panelType?: string;
  tiltDegrees?: number;
  lastCleaningDate?: string;
}

export const installationService = {
  async list(): Promise<SolarInstallation[]> {
    const res = await api.get<ApiResponse<SolarInstallation[]>>('/installations');
    return res.data.data || [];
  },

  async getById(id: string): Promise<SolarInstallation> {
    const res = await api.get<ApiResponse<SolarInstallation>>(`/installations/${id}`);
    return res.data.data!;
  },

  async create(data: CreateInstallationData): Promise<SolarInstallation> {
    const res = await api.post<ApiResponse<SolarInstallation>>('/installations', data);
    return res.data.data!;
  },

  async update(id: string, data: Partial<CreateInstallationData>): Promise<SolarInstallation> {
    const res = await api.put<ApiResponse<SolarInstallation>>(`/installations/${id}`, data);
    return res.data.data!;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/installations/${id}`);
  },
};
