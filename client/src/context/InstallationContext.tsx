import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { SolarInstallation } from '../types';
import { installationService, CreateInstallationData } from '../services/installationService';
import { useAuth } from './AuthContext';

interface InstallationContextType {
  installations: SolarInstallation[];
  currentInstallation: SolarInstallation | null;
  isLoading: boolean;
  setCurrentInstallation: (inst: SolarInstallation) => void;
  refreshInstallations: () => Promise<void>;
  createInstallation: (data: CreateInstallationData) => Promise<SolarInstallation>;
  updateInstallation: (id: string, data: Partial<CreateInstallationData>) => Promise<SolarInstallation>;
  deleteInstallation: (id: string) => Promise<void>;
}

const InstallationContext = createContext<InstallationContextType | undefined>(undefined);

export const InstallationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [installations, setInstallations] = useState<SolarInstallation[]>([]);
  const [currentInstallation, setCurrentInstallation] = useState<SolarInstallation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshInstallations = useCallback(async () => {
    if (!user) {
      setInstallations([]);
      setCurrentInstallation(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const list = await installationService.list();
      setInstallations(list);

      if (list.length > 0) {
        // Keep current if still exists, otherwise choose first
        const savedId = localStorage.getItem('suntrack_active_installation_id');
        const match = list.find((i) => i.id === savedId) || list[0];
        setCurrentInstallation(match);
        localStorage.setItem('suntrack_active_installation_id', match.id);
      } else {
        setCurrentInstallation(null);
      }
    } catch (error) {
      console.error('Failed to load installations:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshInstallations();
  }, [refreshInstallations]);

  const handleSelectInstallation = (inst: SolarInstallation) => {
    setCurrentInstallation(inst);
    localStorage.setItem('suntrack_active_installation_id', inst.id);
  };

  const createInstallation = async (data: CreateInstallationData) => {
    const created = await installationService.create(data);
    await refreshInstallations();
    handleSelectInstallation(created);
    return created;
  };

  const updateInstallation = async (id: string, data: Partial<CreateInstallationData>) => {
    const updated = await installationService.update(id, data);
    await refreshInstallations();
    return updated;
  };

  const deleteInstallation = async (id: string) => {
    await installationService.delete(id);
    await refreshInstallations();
  };

  return (
    <InstallationContext.Provider
      value={{
        installations,
        currentInstallation,
        isLoading,
        setCurrentInstallation: handleSelectInstallation,
        refreshInstallations,
        createInstallation,
        updateInstallation,
        deleteInstallation,
      }}
    >
      {children}
    </InstallationContext.Provider>
  );
};

export const useInstallation = () => {
  const context = useContext(InstallationContext);
  if (!context) {
    throw new Error('useInstallation must be used within an InstallationProvider');
  }
  return context;
};
