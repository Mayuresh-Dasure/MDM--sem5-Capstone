import React from 'react';
import { WeatherDataPoint } from '../../types';
import { Card } from '../common/Card';
import { CloudRain, Sun, Cloud, Wind, Droplets } from 'lucide-react';
import clsx from 'clsx';

export interface WeatherForecastRowProps {
  forecast: WeatherDataPoint[];
  locationName: string;
}

export const WeatherForecastRow: React.FC<WeatherForecastRowProps> = ({
  forecast,
  locationName,
}) => {
  // Aggregate 3-hour points into daily summary cards (up to 5 days)
  const dailyMap = new Map<string, { points: WeatherDataPoint[]; date: Date }>();

  forecast.forEach((pt) => {
    const d = new Date(pt.timestamp);
    const key = d.toISOString().split('T')[0];
    if (!dailyMap.has(key)) {
      dailyMap.set(key, { points: [], date: d });
    }
    dailyMap.get(key)!.points.push(pt);
  });

  const dailySummaries = Array.from(dailyMap.values()).slice(0, 5);

  const getWeatherIcon = (condition: string, rainProb: number) => {
    if (rainProb > 0.5 || condition.toLowerCase().includes('rain')) {
      return <CloudRain className="w-6 h-6 text-sky-400" />;
    }
    if (condition.toLowerCase().includes('cloud')) {
      return <Cloud className="w-6 h-6 text-slate-300" />;
    }
    return <Sun className="w-6 h-6 text-amber-400" />;
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-100 font-['Outfit',sans-serif]">
            5-Day Meteorological Forecast
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Local precipitation probability and rainfall volume telemetry for <strong className="text-slate-300">{locationName}</strong>.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {dailySummaries.map(({ points, date }) => {
          const maxTemp = Math.max(...points.map((p) => p.temperature));
          const minTemp = Math.min(...points.map((p) => p.temperature));
          const maxRainProb = Math.max(...points.map((p) => p.rainProbability));
          const totalRainMm = points.reduce((acc, p) => acc + (p.rainfallMm || 0), 0);
          const avgWind = points.reduce((acc, p) => acc + p.windSpeed, 0) / points.length;
          const dominantCondition = points[0]?.condition || 'Clear';

          const rainPercent = Math.round(maxRainProb * 100);
          const hasSignificantRain = rainPercent >= 60 && totalRainMm >= 3;

          const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });
          const dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

          return (
            <div
              key={date.toISOString()}
              className={clsx(
                'p-4 rounded-xl border flex flex-col items-center text-center justify-between gap-3 transition-all',
                hasSignificantRain
                  ? 'bg-sky-950/30 border-sky-500/40 shadow-sm'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
              )}
            >
              {/* Day Header */}
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-200">
                  {dayLabel}
                </span>
                <span className="block text-[11px] text-slate-400">{dateLabel}</span>
              </div>

              {/* Weather Icon */}
              <div className="my-1">{getWeatherIcon(dominantCondition, maxRainProb)}</div>

              {/* Temperatures */}
              <div className="flex items-baseline gap-1.5 text-sm font-semibold">
                <span className="text-slate-100">{maxTemp}°</span>
                <span className="text-xs text-slate-400">{minTemp}°</span>
              </div>

              {/* Rain Probability Badge */}
              <div className="w-full pt-2 border-t border-slate-800/80 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Droplets className="w-3 h-3 text-sky-400" />
                    Rain
                  </span>
                  <span
                    className={clsx(
                      'font-bold',
                      rainPercent > 50 ? 'text-sky-300' : 'text-slate-400'
                    )}
                  >
                    {rainPercent}%
                  </span>
                </div>

                {totalRainMm > 0 ? (
                  <span className="block text-[10px] text-sky-300 font-medium">
                    ~{totalRainMm.toFixed(1)} mm
                  </span>
                ) : (
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-0.5">
                      <Wind className="w-3 h-3" />
                      {avgWind.toFixed(1)} m/s
                    </span>
                    <span>Dry</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
