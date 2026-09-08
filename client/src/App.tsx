import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { InstallationProvider } from './context/InstallationContext';
import { DemoModeProvider } from './context/DemoModeContext';
import { DashboardLayout } from './components/layout/DashboardLayout';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { WeatherPage } from './pages/WeatherPage';
import { EfficiencyPage } from './pages/EfficiencyPage';
import { CleaningHistoryPage } from './pages/CleaningHistoryPage';
import { InstallationsPage } from './pages/InstallationsPage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <InstallationProvider>
          <DemoModeProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected Dashboard Routes */}
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="weather" element={<WeatherPage />} />
                <Route path="efficiency" element={<EfficiencyPage />} />
                <Route path="cleaning-history" element={<CleaningHistoryPage />} />
                <Route path="installations" element={<InstallationsPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </DemoModeProvider>
        </InstallationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
