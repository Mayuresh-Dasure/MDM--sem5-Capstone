import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Card } from '../common/Card';
import { EfficiencyHistoryPoint } from '../../types';

export interface EfficiencyAreaChartProps {
  data: EfficiencyHistoryPoint[];
  currentLoss: number;
}

export const EfficiencyAreaChart: React.FC<EfficiencyAreaChartProps> = ({
  data,
  currentLoss,
}) => {
  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-100 font-['Outfit',sans-serif]">
            Estimated Efficiency & Soiling Accumulation Curve
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Empirical degradation over time based on dry days, wind transport, and particulate crusting.
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-amber-500/80" />
            <span className="text-slate-300">Operational Health (%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-rose-500/80" />
            <span className="text-slate-300">Soiling Loss (%)</span>
          </div>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorEfficiency" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />
            <YAxis
              domain={[60, 100]}
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '8px',
                color: '#f8fafc',
                fontSize: '12px',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)',
              }}
              formatter={(value: number) => [`${value}%`, 'Estimated Efficiency']}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <ReferenceLine
              y={85}
              stroke="#f43f5e"
              strokeDasharray="4 4"
              label={{
                value: 'Clean Threshold (85%)',
                fill: '#f43f5e',
                fontSize: 10,
                position: 'insideTopRight',
              }}
            />
            <Area
              type="monotone"
              dataKey="estimatedEfficiency"
              stroke="#f59e0b"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorEfficiency)"
              dot={{ r: 3, fill: '#f59e0b', strokeWidth: 1, stroke: '#0f172a' }}
              activeDot={{ r: 6, fill: '#fbbf24', stroke: '#0f172a', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400">
        <span>Current Soiling Attenuation: <strong className="text-rose-400">-{currentLoss}%</strong></span>
        <span>Peak Cleared Baseline: <strong className="text-emerald-400">100.0%</strong></span>
      </div>
    </Card>
  );
};
