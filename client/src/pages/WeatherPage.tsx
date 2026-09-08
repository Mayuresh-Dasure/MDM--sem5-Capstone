import React, { useState, useEffect } from 'react';
import { useInstallation } from '../context/InstallationContext';
import { weatherService, WeatherResponse } from '../services/weatherService';
import { Card } from '../components/common/Card';
import { WeatherForecastRow } from '../components/dashboard/WeatherForecastRow';
import {
  Wind,
  Droplets,
  Thermometer,
  Cloud,
  RefreshCw,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const WeatherPage: React.FC = () => {
  const { currentInstallation } = useInstallation();
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchWeather = async (force = false) => {
    if (!currentInstallation) return;
    try {
      if (force) setIsRefreshing(true);
      else setIsLoading(true);
      const res = await weatherService.getWeather(currentInstallation.id, force);
      setWeather(res);
    } catch (e) {
      console.error('Weather fetch error:', e);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [currentInstallation]);

  if (isLoading || !weather) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { current, forecast, isCached } = weather;

  // Chart data for next 24-48 hours precipitation and temperature
  const hourlyData = forecast.slice(0, 16).map((pt) => ({
    time: new Date(pt.timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      hour12: true,
    }),
    rainProb: Math.round(pt.rainProbability * 100),
    rainMm: pt.rainfallMm || 0,
    temp: pt.temperature,
    wind: pt.windSpeed,
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit',sans-serif]">
            Meteorological Telemetry & Rain Radar
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time atmospheric measurements for <strong className="text-slate-200">{currentInstallation?.locationName}</strong> ({currentInstallation?.latitude.toFixed(3)}°, {currentInstallation?.longitude.toFixed(3)}°).
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => fetchWeather(true)}
          isLoading={isRefreshing}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          {isCached ? 'Cached (Refresh Live)' : 'Refresh Forecast'}
        </Button>
      </div>

      {/* Current Atmospheric Snapshot */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
            <Thermometer className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[11px] uppercase text-slate-400 font-semibold">Temperature</span>
            <span className="text-2xl font-black text-white font-['Outfit',sans-serif]">{current.temperature}°C</span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[11px] uppercase text-slate-400 font-semibold">Humidity (RH)</span>
            <span className="text-2xl font-black text-white font-['Outfit',sans-serif]">{current.humidity}%</span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Wind className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[11px] uppercase text-slate-400 font-semibold">Wind Velocity</span>
            <span className="text-2xl font-black text-white font-['Outfit',sans-serif]">{current.windSpeed} m/s</span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400">
            <Cloud className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[11px] uppercase text-slate-400 font-semibold">Cloud Cover</span>
            <span className="text-2xl font-black text-white font-['Outfit',sans-serif]">{current.cloudCoverage}%</span>
          </div>
        </Card>
      </div>

      {/* Hourly Rain Probability Bar Chart */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 font-['Outfit',sans-serif]">
              Precipitation Probability & Rain Volume (Next 48 Hours)
            </h3>
            <p className="text-xs text-slate-400">
              Evaluates if rain exceeds the &gt;5 mm threshold required for natural self-cleaning.
            </p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis
                domain={[0, 100]}
                stroke="#64748b"
                fontSize={10}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '8px',
                  color: '#f8fafc',
                  fontSize: '12px',
                }}
                formatter={(value: number) => [`${value}%`, 'Rain Probability']}
              />
              <Bar dataKey="rainProb" fill="#38bdf8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 5-Day Forecast Row */}
      <WeatherForecastRow
        forecast={forecast}
        locationName={currentInstallation?.locationName || 'Local Site'}
      />
    </div>
  );
};
