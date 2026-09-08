import React from 'react';
import { useDemoMode, DEMO_SCENARIO_PRESETS } from '../../context/DemoModeContext';
import { Sparkles, Power, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

export const DemoScenarioBar: React.FC = () => {
  const { isDemoMode, activeScenarioId, toggleDemoMode, setScenario } = useDemoMode();

  return (
    <div
      className={clsx(
        'w-full border-b transition-all duration-300 px-4 py-2.5 z-40',
        isDemoMode
          ? 'bg-amber-950/40 border-amber-500/30 text-amber-200'
          : 'bg-slate-900/60 border-slate-800/80 text-slate-300'
      )}
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Title / Indicator */}
        <div className="flex items-center gap-2">
          <span
            className={clsx(
              'flex items-center gap-1.5 font-bold uppercase tracking-wider px-2.5 py-1 rounded-md text-[11px]',
              isDemoMode
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-800 text-slate-300 border border-slate-700'
            )}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isDemoMode ? 'Viva Demo Mode Active' : 'Live Data Mode'}
          </span>
          <span className="hidden sm:inline text-slate-400">
            {isDemoMode
              ? 'Evaluating pre-canned meteorological scenarios for viva presentation'
              : 'Connected to local database and OpenWeatherMap telemetry'}
          </span>
        </div>

        {/* Preset Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {Object.entries(DEMO_SCENARIO_PRESETS).map(([id, scenario]) => {
            const isSelected = isDemoMode && activeScenarioId === id;
            return (
              <button
                key={id}
                onClick={() => setScenario(id)}
                className={clsx(
                  'px-2.5 py-1 rounded-md font-medium transition-all duration-150 flex items-center gap-1 text-[11px]',
                  isSelected
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60'
                )}
                title={scenario.description}
              >
                {isSelected && <CheckCircle2 className="w-3 h-3 text-slate-950" />}
                {scenario.name.split(' (')[0]}
              </button>
            );
          })}

          {/* Toggle Button */}
          <button
            onClick={toggleDemoMode}
            className={clsx(
              'px-2.5 py-1 rounded-md font-semibold transition-all duration-150 flex items-center gap-1 text-[11px] ml-1',
              isDemoMode
                ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40'
                : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
            )}
          >
            <Power className="w-3 h-3" />
            {isDemoMode ? 'Exit Demo' : 'Enable Demo Mode'}
          </button>
        </div>
      </div>
    </div>
  );
};
