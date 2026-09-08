import React from 'react';
import clsx from 'clsx';

export interface StatDialProps {
  value: number; // e.g., 83.6
  maxValue?: number; // 100
  size?: number; // 140
  strokeWidth?: number; // 12
  label?: string;
  subLabel?: string;
  status?: 'CLEAN_NOW' | 'CLEAN_SOON' | 'WAIT_FOR_RAIN' | 'NO_ACTION';
}

export const StatDial: React.FC<StatDialProps> = ({
  value,
  maxValue = 100,
  size = 140,
  strokeWidth = 12,
  label = 'Current Health',
  subLabel,
  status = 'NO_ACTION',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const normalizedValue = Math.min(Math.max(value, 0), maxValue);
  const strokeDashoffset = circumference - (normalizedValue / maxValue) * circumference;

  const colorStyles = {
    NO_ACTION: 'text-emerald-500 stroke-emerald-500',
    WAIT_FOR_RAIN: 'text-sky-500 stroke-sky-500',
    CLEAN_SOON: 'text-amber-500 stroke-amber-500',
    CLEAN_NOW: 'text-rose-500 stroke-rose-500',
  };

  return (
    <div className="flex flex-col items-center justify-center relative">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-slate-800"
          />
          {/* Active Progress */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className={clsx('transition-all duration-700 ease-out', colorStyles[status])}
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-extrabold text-slate-100 font-['Outfit',sans-serif] tracking-tight">
            {value.toFixed(1)}%
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            {label}
          </span>
        </div>
      </div>
      {subLabel && <p className="text-xs text-slate-400 mt-2 text-center">{subLabel}</p>}
    </div>
  );
};
