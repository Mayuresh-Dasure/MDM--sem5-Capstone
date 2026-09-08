import React from 'react';
import { RecommendationResult } from '../../types';
import { Card } from '../common/Card';
import { CheckCircle, Info, Sparkles } from 'lucide-react';

export interface ExplanationCardProps {
  recommendation: RecommendationResult;
}

export const ExplanationCard: React.FC<ExplanationCardProps> = ({ recommendation }) => {
  const { bulletPoints, factors } = recommendation;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-slate-100 font-['Outfit',sans-serif]">
            Why SunTrack Made This Recommendation
          </h3>
        </div>
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Explainable Logic
        </span>
      </div>

      <p className="text-xs text-slate-300 mb-4 leading-relaxed">
        The recommendation engine evaluated your installation parameters against empirical soiling curves and upcoming meteorology:
      </p>

      {/* Bullet Points */}
      <ul className="space-y-2.5">
        {bulletPoints.map((point, index) => (
          <li key={index} className="flex items-start gap-2.5 text-xs text-slate-200">
            <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{point}</span>
          </li>
        ))}
      </ul>

      {/* Parameter Table Summary */}
      <div className="mt-5 pt-4 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
        <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
          <span className="block text-[10px] text-slate-400 uppercase">Baseline Rate</span>
          <span className="font-bold text-slate-200">{factors.baseAccumulationRate}% / day</span>
        </div>
        <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
          <span className="block text-[10px] text-slate-400 uppercase">Effective Rate</span>
          <span className="font-bold text-amber-400">+{factors.effectiveAccumulationRate}% / day</span>
        </div>
        <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
          <span className="block text-[10px] text-slate-400 uppercase">Array Tilt</span>
          <span className="font-bold text-slate-200">{factors.tiltDegrees}°</span>
        </div>
        <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
          <span className="block text-[10px] text-slate-400 uppercase">Lookahead</span>
          <span className="font-bold text-sky-400">{factors.rainLookaheadHours} Hours</span>
        </div>
      </div>

      {/* Scientific Disclaimer Note */}
      <div className="mt-4 flex items-start gap-2 p-3 bg-slate-950/40 rounded-lg border border-slate-800/60 text-[11px] text-slate-400">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <span>
          <strong>Academic Model Note:</strong> Calculations utilize Kimber/NREL optical attenuation functions. Results represent software estimates to assist cleaning timing.
        </span>
      </div>
    </Card>
  );
};
