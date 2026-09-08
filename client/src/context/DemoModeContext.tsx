import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface DemoScenarioInfo {
  id: string;
  name: string;
  shortDesc: string;
  description: string;
  badgeColor: string;
}

export const DEMO_SCENARIO_PRESETS: Record<string, DemoScenarioInfo> = {
  scenario_1: {
    id: 'scenario_1',
    name: '1. Arid Drought (Clean Now)',
    shortDesc: '18 dry days, 0% rain forecast, 19.4% soiling loss',
    description: 'Simulates extended drought with dust accumulation triggering urgent manual wash.',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
  },
  scenario_2: {
    id: 'scenario_2',
    name: '2. Rain Approaching (Wait for Rain)',
    shortDesc: '12 days dry, 85% rain (~14mm) in 36h',
    description: 'Simulates approaching storm front advising user to wait and save cleaning expense.',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
  },
  scenario_3: {
    id: 'scenario_3',
    name: '3. Freshly Cleaned (No Action)',
    shortDesc: 'Cleaned yesterday, 100% efficiency baseline',
    description: 'Simulates pristine solar array with negligible optical degradation.',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  },
  scenario_4: {
    id: 'scenario_4',
    name: '4. Moderate Soiling (Clean Soon)',
    shortDesc: '9 dry days, 10.8% loss, no rain ahead',
    description: 'Simulates medium build-up advising proactive cleaning schedule.',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  },
};

interface DemoModeContextType {
  isDemoMode: boolean;
  activeScenarioId: string;
  toggleDemoMode: () => void;
  setScenario: (scenarioId: string) => void;
  currentScenario: DemoScenarioInfo;
}

const DemoModeContext = createContext<DemoModeContextType | undefined>(undefined);

export const DemoModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    return localStorage.getItem('suntrack_demo_active') === 'true';
  });

  const [activeScenarioId, setActiveScenarioId] = useState<string>(() => {
    return localStorage.getItem('suntrack_demo_scenario') || 'scenario_1';
  });

  useEffect(() => {
    localStorage.setItem('suntrack_demo_active', isDemoMode ? 'true' : 'false');
    if (isDemoMode) {
      localStorage.setItem('suntrack_demo_scenario', activeScenarioId);
    } else {
      localStorage.removeItem('suntrack_demo_scenario');
    }
  }, [isDemoMode, activeScenarioId]);

  const toggleDemoMode = () => {
    setIsDemoMode((prev) => !prev);
  };

  const setScenario = (scenarioId: string) => {
    setActiveScenarioId(scenarioId);
    setIsDemoMode(true);
  };

  const currentScenario = DEMO_SCENARIO_PRESETS[activeScenarioId] || DEMO_SCENARIO_PRESETS.scenario_1;

  return (
    <DemoModeContext.Provider
      value={{
        isDemoMode,
        activeScenarioId,
        toggleDemoMode,
        setScenario,
        currentScenario,
      }}
    >
      {children}
    </DemoModeContext.Provider>
  );
};

export const useDemoMode = () => {
  const context = useContext(DemoModeContext);
  if (!context) {
    throw new Error('useDemoMode must be used within a DemoModeProvider');
  }
  return context;
};
