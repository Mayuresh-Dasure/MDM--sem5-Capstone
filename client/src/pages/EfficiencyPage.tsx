import React from 'react';
import { Card } from '../components/common/Card';
import { BookOpen, Layers, Zap, ShieldCheck } from 'lucide-react';

export const EfficiencyPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit',sans-serif]">
          Soiling Physics & Mathematical Model
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Detailed mathematical formulation of empirical dust accumulation, environmental multipliers, and optical attenuation.
        </p>
      </div>

      {/* Core Equation Banner */}
      <Card className="p-6 bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-950 border-amber-500/30 space-y-4">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>Core Empirical Soiling Equation</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-sm sm:text-base text-amber-200 overflow-x-auto">
          {'ΔS_t = S_base × M_dry(t) × M_wind(t) × M_humidity(t) × M_tilt'}
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Where <code className="text-amber-300">S_base = 0.60% / day</code> is the baseline linear degradation rate in clean atmospheric conditions, amplified by environmental modifiers and naturally restored by precipitation.
        </p>
      </Card>

      {/* Factor Multipliers Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-slate-100 font-bold text-sm">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>1. Environmental Modifier Breakdown</span>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 space-y-1">
              <span className="font-bold text-amber-300">Consecutive Dry Days (M_dry)</span>
              <p className="text-slate-400">
                Formula: <code className="text-slate-200">1.0 + min(0.5, dryDays × 0.025)</code>. Models particulate compaction and crusting over extended dry periods.
              </p>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 space-y-1">
              <span className="font-bold text-indigo-300">Wind Velocity (M_wind)</span>
              <p className="text-slate-400">
                Low (&lt;2 m/s): 1.1x (stagnant settling). High (&gt;7 m/s): 1.3x (heavy airborne transport). Normal: 1.0x.
              </p>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 space-y-1">
              <span className="font-bold text-sky-300">Dew & Humidity (M_humidity)</span>
              <p className="text-slate-400">
                Relative humidity &gt;80%: 1.2x. High moisture binds loose dust to glass surfaces.
              </p>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 space-y-1">
              <span className="font-bold text-emerald-300">Array Tilt Angle (M_tilt)</span>
              <p className="text-slate-400">
                Formula: <code className="text-slate-200">1.0 + max(0, (30 - tilt) / 50)</code>. Flatter arrays accumulate dust significantly faster than steep arrays.
              </p>
            </div>
          </div>
        </Card>

        {/* Precipitation Function & Saturation Cap */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-slate-100 font-bold text-sm">
            <Zap className="w-4 h-4 text-sky-400" />
            <span>2. Natural Rain Washing Function (W_rain)</span>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 space-y-1">
              <span className="font-bold text-rose-300">Drizzle Mud Effect (&lt;1.0 mm)</span>
              <p className="text-slate-400">
                Washing Factor: <strong className="text-rose-400">0.0%</strong>. Light drizzle does not rinse particles; it turns dust into mud.
              </p>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 space-y-1">
              <span className="font-bold text-sky-300">Partial Natural Wash (1.0 to 5.0 mm)</span>
              <p className="text-slate-400">
                Washing Factor: <strong className="text-sky-300">0.50 × (Rain / 5.0)</strong>. Partial restoration of array transparency.
              </p>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 space-y-1">
              <span className="font-bold text-emerald-300">Heavy Rainstorm Wash (&gt;5.0 mm)</span>
              <p className="text-slate-400">
                Washing Factor: <strong className="text-emerald-300">85% to 95%</strong>. Restores array close to fresh cleaning baseline.
              </p>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 space-y-1">
              <span className="font-bold text-amber-300">Optical Saturation Ceiling (35.0%)</span>
              <p className="text-slate-400">
                Cumulative soiling is capped at 35% to prevent infinite non-physical degradation during prolonged multi-month droughts.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Viva Academic Defense Section */}
      <Card className="p-6 border-amber-500/20 bg-slate-900/60 space-y-3">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
          <ShieldCheck className="w-5 h-5" />
          <span>Academic & Viva Defense Alignment</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          SunTrack implements an <strong>explainable rule-based expert system</strong> rather than a generic machine learning model. This ensures deterministic outputs where every recommendation can be audited back to explicit meteorological inputs and engineering constants.
        </p>
      </Card>
    </div>
  );
};
