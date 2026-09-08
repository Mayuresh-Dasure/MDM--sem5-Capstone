import { api } from './api';
import { ApiResponse, WeatherDataPoint } from '../types';

export interface WeatherResponse {
  current: WeatherDataPoint;
  forecast: WeatherDataPoint[];
  isCached: boolean;
}

export const weatherService = {
  async getWeather(installationId: string, forceRefresh = false): Promise<WeatherResponse> {
    const res = await api.get<ApiResponse<WeatherResponse>>(
      `/installations/${installationId}/weather`,
      {
        params: { refresh: forceRefresh },
      }
    );
    return res.data.data!;
  },
};
