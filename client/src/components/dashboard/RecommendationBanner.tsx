import React from 'react';
import { RecommendationResult } from '../../types';
import {
  AlertTriangle,
  CloudRain,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Droplets,
} from 'lucide-react';
import { Button } from '../common/Button';
import clsx from 'clsx';

export interface RecommendationBannerProps {
  recommendation: RecommendationResult;
  onOpenCleanModal: () => void;
  isLoading?: boolean;
}

export const RecommendationBanner: React.FC<RecommendationBannerProps> = ({
  recommendation,
  onOpenCleanModal,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="w-full h-44 rounded-2xl bg-slate-900 border border-slate-800 animate-pulse flex items-center justify-center">
        <span className="text-sm text-slate-500">Calculating Live Recommendation...</span>
      </div>
    );
  }

  const { type, title, reason, efficiencyLoss, recommendedDate } = recommendation;

  const config = {
    CLEAN_NOW: {
      border: 'border-rose-500/40 bg-gradient-to-r from-rose-950/40 via-slate-900 to-rose-950/20',
      badge: 'bg-rose-500 text-white',
      badgeText: 'Action Required',
      icon: AlertTriangle,
      iconColor: 'text-rose-400',
      btnVariant: 'danger' as const,
      btnText: 'Record Cleaning Now',
    },
    CLEAN_SOON: {
      border: 'border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/20',
      badge: 'bg-amber-500 text-slate-950',
      badgeText: 'Plan Maintenance',
      icon: Clock,
      iconColor: 'text-amber-400',
      btnVariant: 'solar' as const,
      btnText: 'Log Completed Cleaning',
    },
    WAIT_FOR_RAIN: {
      border: 'border-sky-500/40 bg-gradient-to-r from-sky-950/40 via-slate-900 to-sky-950/20',
      badge: 'bg-sky-500 text-slate-950',
      badgeText: 'Rain Washing Expected',
      icon: CloudRain,
      iconColor: 'text-sky-400',
      btnVariant: 'secondary' as const,
      btnText: 'Manual Clean Anyway',
    },
    NO_ACTION: {
      border: 'border-emerald-500/40 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-emerald-950/20',
      badge: 'bg-emerald-500 text-slate-950',
      badgeText: 'Optimal Health',
      icon: CheckCircle2,
      iconColor: 'text-emerald-400',
      btnVariant: 'secondary' as const,
      btnText: 'Log Maintenance Event',
    },
  }[type] || {
    border: 'border-slate-800 bg-slate-900',
    badge: 'bg-slate-700 text-white',
    badgeText: 'Status',
    icon: Sparkles,
    iconColor: 'text-slate-400',
    btnVariant: 'secondary' as const,
    btnText: 'Record Cleaning',
  };

  const Icon = config.icon;
  const formattedDate = new Date(recommendedDate).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      className={clsx(
        'relative overflow-hidden rounded-2xl border p-6 sm:p-7 backdrop-blur-md shadow-xl transition-all duration-300',
        config.border
      )}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        {/* Left Status & Title */}
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-3">
            <span
              className={clsx(
                'text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm',
                config.badge
              )}
            >
              {config.badgeText}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>Target Window: <strong className="text-slate-200">{formattedDate}</strong></span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className={clsx('mt-1 p-2 rounded-xl bg-slate-950/60 border border-slate-800', config.iconColor)}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit',sans-serif] tracking-tight">
                {title}
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed mt-1">{reason}</p>
            </div>
          </div>
        </div>

        {/* Right CTA Button & Quick Stat */}
        <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-3 w-full md:w-auto shrink-0">
          <div className="flex items-center justify-between sm:justify-end gap-3 bg-slate-950/60 border border-slate-800/80 px-4 py-2 rounded-xl text-right">
            <div className="text-left">
              <span className="block text-[10px] font-semibold uppercase text-slate-400">
                Soiling Loss
              </span>
              <span className="text-lg font-black text-rose-400 font-['Outfit',sans-serif]">
                -{efficiencyLoss}%
              </span>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div className="text-right">
              <span className="block text-[10px] font-semibold uppercase text-slate-400">
                Expected Gain
              </span>
              <span className="text-lg font-black text-emerald-400 font-['Outfit',sans-serif]">
                +{(efficiencyLoss * 0.95).toFixed(1)}%
              </span>
            </div>
          </div>

          <Button
            variant={config.btnVariant}
            onClick={onOpenCleanModal}
            className="w-full md:w-auto text-sm"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            <Droplets className="w-4 h-4" />
            {config.btnText}
          </Button>
        </div>
      </div>
    </div>
  );
};
