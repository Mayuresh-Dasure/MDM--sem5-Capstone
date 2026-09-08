import React, { useState, useEffect, useCallback } from 'react';
import { useInstallation } from '../context/InstallationContext';
import { useDemoMode } from '../context/DemoModeContext';
import { recommendationService } from '../services/recommendationService';
import { weatherService, WeatherResponse } from '../services/weatherService';
import { analyticsService } from '../services/analyticsService';
import {
  RecommendationResult,
  EfficiencyTimelineResponse,
} from '../types';
import { RecommendationBanner } from '../components/dashboard/RecommendationBanner';
import { MetricGrid } from '../components/dashboard/MetricGrid';
import { EfficiencyAreaChart } from '../components/dashboard/EfficiencyAreaChart';
import { WeatherForecastRow } from '../components/dashboard/WeatherForecastRow';
import { ExplanationCard } from '../components/dashboard/ExplanationCard';
import { RecordCleaningModal } from '../components/dashboard/RecordCleaningModal';
import { Button } from '../components/common/Button';
import { Plus, RefreshCw, AlertCircle } from 'lucide-react';
import { InstallationModal } from '../components/installations/InstallationModal';

export const DashboardPage: React.FC = () => {
  const { currentInstallation, installations, isLoading: isInstLoading } = useInstallation();
  const { isDemoMode, activeScenarioId } = useDemoMode();

  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [timelineData, setTimelineData] = useState<EfficiencyTimelineResponse | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isCleaningModalOpen, setIsCleaningModalOpen] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  const loadDashboardData = useCallback(
    async (forceRefresh = false) => {
      if (!currentInstallation && !isDemoMode) {
        setIsLoading(false);
        return;
      }

      try {
        if (forceRefresh) setIsRefreshing(true);
        else setIsLoading(true);

        const instId = currentInstallation?.id || 'demo_inst_1';
        const scenarioParam = isDemoMode ? activeScenarioId : undefined;

        // Fetch recommendation, weather forecast, and timeline concurrently
        const [recRes, weatherRes, timelineRes] = await Promise.all([
          recommendationService.getRecommendation(instId, forceRefresh, scenarioParam),
          weatherService.getWeather(instId, forceRefresh),
          analyticsService.getEfficiencyTimeline(instId),
        ]);

        setRecommendation(recRes);
        setWeatherData(weatherRes);
        setTimelineData(timelineRes);
      } catch (error) {
        console.error('Failed to load dashboard telemetry:', error);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [currentInstallation, isDemoMode, activeScenarioId]
  );

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // If user has zero installations
  if (!isInstLoading && installations.length === 0 && !isDemoMode) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-1 max-w-md">
          <h2 className="text-2xl font-bold text-white font-['Outfit',sans-serif]">
            No Solar Arrays Configured
          </h2>
          <p className="text-sm text-slate-400">
            Add your rooftop solar installation with coordinates and capacity to begin receiving intelligent cleaning recommendations.
          </p>
        </div>
        <Button
          variant="solar"
          onClick={() => setIsCreateModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add First Solar Installation
        </Button>
        <InstallationModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit',sans-serif] tracking-tight">
            {currentInstallation ? currentInstallation.name : 'Solar Installation Overview'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Location:{' '}
            <strong className="text-slate-300">
              {currentInstallation?.locationName || 'Live Telemetry Site'}
            </strong>{' '}
            • Capacity:{' '}
            <strong className="text-slate-300">
              {currentInstallation?.capacityKw || 8.5} kW
            </strong>{' '}
            • Tilt:{' '}
            <strong className="text-slate-300">
              {currentInstallation?.tiltDegrees || 22.5}°
            </strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => loadDashboardData(true)}
            isLoading={isRefreshing}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh Telemetry
          </Button>
        </div>
      </div>

      {/* 1. Main Recommendation Action Banner */}
      {recommendation && (
        <RecommendationBanner
          recommendation={recommendation}
          onOpenCleanModal={() => setIsCleaningModalOpen(true)}
          isLoading={isLoading}
        />
      )}

      {/* 2. Key Metrics Grid */}
      {recommendation && <MetricGrid recommendation={recommendation} />}

      {/* 3. Efficiency Degradation Chart */}
      {timelineData && (
        <EfficiencyAreaChart
          data={timelineData.history}
          currentLoss={recommendation?.efficiencyLoss || 0}
        />
      )}

      {/* 4. 5-Day Weather Forecast */}
      {weatherData && (
        <WeatherForecastRow
          forecast={weatherData.forecast}
          locationName={currentInstallation?.locationName || 'Local Site'}
        />
      )}

      {/* 5. Explainable Reasoning Card */}
      {recommendation && <ExplanationCard recommendation={recommendation} />}

      {/* Record Cleaning Modal */}
      {recommendation && currentInstallation && (
        <RecordCleaningModal
          isOpen={isCleaningModalOpen}
          onClose={() => setIsCleaningModalOpen(false)}
          installationId={currentInstallation.id}
          installationName={currentInstallation.name}
          currentEfficiencyLoss={recommendation.efficiencyLoss}
          onCleaningRecorded={() => loadDashboardData(true)}
        />
      )}
    </div>
  );
};
