import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { DemoScenarioBar } from '../demo/DemoScenarioBar';
import { InstallationModal } from '../installations/InstallationModal';

export const DashboardLayout: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-400">Loading SunTrack Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <DemoScenarioBar />
      <Navbar onOpenCreateModal={() => setIsCreateModalOpen(true)} />
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-full">
          <Outlet />
        </main>
      </div>

      <InstallationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};
