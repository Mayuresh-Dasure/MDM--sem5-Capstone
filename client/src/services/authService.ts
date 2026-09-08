import { api } from './api';
import { ApiResponse, User } from '../types';

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  async register(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    state?: string;
  }): Promise<AuthResponse> {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return res.data.data!;
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return res.data.data!;
  },

  async getMe(): Promise<User> {
    const res = await api.get<ApiResponse<User>>('/auth/me');
    return res.data.data!;
  },

  async updatePreferences(preferences: {
    cleaningAlerts?: boolean;
    rainAlerts?: boolean;
    weeklySummary?: boolean;
    emailEnabled?: boolean;
  }) {
    const res = await api.put<ApiResponse>('/auth/preferences', preferences);
    return res.data.data;
  },

  logout() {
    localStorage.removeItem('suntrack_token');
    localStorage.removeItem('suntrack_user');
  },
};
