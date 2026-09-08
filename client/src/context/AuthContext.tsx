import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, NotificationPreference } from '../types';
import { authService, AuthResponse } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (data: { email: string; password: string }) => Promise<void>;
  register: (data: { name: string; email: string; password: string; phone?: string; state?: string }) => Promise<void>;
  logout: () => void;
  updatePreferences: (prefs: Partial<NotificationPreference>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('suntrack_token');
    const savedUser = localStorage.getItem('suntrack_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse cached user:', e);
        localStorage.removeItem('suntrack_token');
        localStorage.removeItem('suntrack_user');
      }
    }
    setIsLoading(false);
  }, []);

  const handleAuthSuccess = (data: AuthResponse) => {
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('suntrack_token', data.token);
    localStorage.setItem('suntrack_user', JSON.stringify(data.user));
  };

  const login = async (credentials: { email: string; password: string }) => {
    const res = await authService.login(credentials);
    handleAuthSuccess(res);
  };

  const register = async (userData: { name: string; email: string; password: string; phone?: string; state?: string }) => {
    const res = await authService.register(userData);
    handleAuthSuccess(res);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const updatePreferences = async (prefs: Partial<NotificationPreference>) => {
    await authService.updatePreferences(prefs);
    if (user) {
      const updatedUser: User = {
        ...user,
        notificationPreference: {
          ...(user.notificationPreference || {
            id: '',
            userId: user.id,
            cleaningAlerts: true,
            rainAlerts: true,
            weeklySummary: false,
            emailEnabled: true,
          }),
          ...prefs,
        },
      };
      setUser(updatedUser);
      localStorage.setItem('suntrack_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        updatePreferences,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
