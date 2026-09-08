import React, { HTMLAttributes } from 'react';
import clsx from 'clsx';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: 'amber' | 'sky' | 'emerald' | 'rose' | 'none';
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  glow = 'none',
  interactive = false,
  ...props
}) => {
  const glowStyles = {
    none: '',
    amber: 'border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.08)]',
    sky: 'border-sky-500/30 shadow-[0_0_20px_rgba(14,165,233,0.08)]',
    emerald: 'border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.08)]',
    rose: 'border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.08)]',
  };

  return (
    <div
      className={clsx(
        'bg-slate-900/80 backdrop-blur-md border border-slate-800/80 rounded-xl p-5 transition-all duration-200',
        interactive && 'hover:border-slate-700 hover:bg-slate-900 cursor-pointer hover:translate-y-[-1px]',
        glowStyles[glow],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
