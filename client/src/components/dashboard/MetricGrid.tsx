import React from 'react';
import { RecommendationResult } from '../../types';
import { Card } from '../common/Card';
import { StatDial } from '../common/StatDial';
import {
  Calendar,
  CloudRain,
  Zap,
  Wind,
  Droplet,
  Compass,
} from 'lucide-react';

export interface MetricGridProps {
  recommendation: RecommendationResult;
}

export const MetricGrid: React.FC<MetricGridProps> = ({ recommendation }) => {
  const { factors, efficiencyLoss, estimatedEfficiency, type, estimatedEnergyLostKwhDaily } =
    recommendation;

  const rainProbPercent = Math.round(factors.upcomingRainProbability * 100);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Efficiency Dial Card */}
      <Card className="flex flex-col justify-between items-center text-center p-5 bg-gradient-to-b from-slate-900/90 to-slate-950">
        <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="font-semibold uppercase tracking-wider">Health Index</span>
          <span className="text-amber-400 font-bold">Estimated</span>
        </div>
        <StatDial
          value={estimatedEfficiency}
          status={type}
          label="Est. Yield"
          subLabel={`-${efficiencyLoss}% soiling loss`}
        />
      </Card>

      {/* 2. Dry Days Counter */}
      <Card className="flex flex-col justify-between p-5">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold uppercase tracking-wider">Dry Period</span>
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
            <Calendar className="w-4 h-4" />
          </div>
        </div>
        <div className="my-2">
          <div className="text-3xl font-black text-slate-100 font-['Outfit',sans-serif]">
            {factors.consecutiveDryDays} <span className="text-sm font-semibold text-slate-400">Days</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {factors.daysSinceCleaning} total days since last physical cleaning.
          </p>
        </div>
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Accumulation Rate</span>
          <span className="font-bold text-slate-200">+{factors.effectiveAccumulationRate}%/day</span>
        </div>
      </Card>

      {/* 3. Rain Forecast */}
      <Card className="flex flex-col justify-between p-5">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold uppercase tracking-wider">72h Rain Window</span>
          <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
            <CloudRain className="w-4 h-4" />
          </div>
        </div>
        <div className="my-2">
          <div className="text-3xl font-black text-slate-100 font-['Outfit',sans-serif]">
            {rainProbPercent}% <span className="text-sm font-semibold text-slate-400">Prob</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Expected volume: <strong className="text-sky-300">{factors.upcomingRainVolumeMm} mm</strong>
          </p>
        </div>
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Natural Wash Factor</span>
          <span className="font-bold text-slate-200">
            {factors.upcomingRainVolumeMm >= 5 ? 'High (85%)' : factors.upcomingRainVolumeMm >= 1 ? 'Partial' : 'None'}
          </span>
        </div>
      </Card>

      {/* 4. Energy & Generation Impact */}
      <Card className="flex flex-col justify-between p-5">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold uppercase tracking-wider">Daily Power Lost</span>
          <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
            <Zap className="w-4 h-4" />
          </div>
        </div>
        <div className="my-2">
          <div className="text-3xl font-black text-rose-400 font-['Outfit',sans-serif]">
            ~{estimatedEnergyLostKwhDaily} <span className="text-sm font-semibold text-slate-400">kWh/day</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Est. financial drag: ~₹{(estimatedEnergyLostKwhDaily * 8.0 * 30).toFixed(0)}/mo
          </p>
        </div>
        <div className="pt-2 border-t border-slate-800 flex items-center gap-3 text-[11px] text-slate-400">
          <div className="flex items-center gap-1">
            <Wind className="w-3 h-3 text-slate-400" />
            <span>{factors.averageWindSpeed}m/s</span>
          </div>
          <div className="flex items-center gap-1">
            <Droplet className="w-3 h-3 text-slate-400" />
            <span>{factors.averageHumidity}% RH</span>
          </div>
          <div className="flex items-center gap-1">
            <Compass className="w-3 h-3 text-slate-400" />
            <span>{factors.tiltDegrees}°</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
