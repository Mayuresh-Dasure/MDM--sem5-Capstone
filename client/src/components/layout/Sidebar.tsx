import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CloudSun,
  LineChart,
  History,
  Settings,
  SunMedium,
  ShieldCheck,
} from 'lucide-react';
import clsx from 'clsx';

export const Sidebar: React.FC = () => {
  const navItems = [
    {
      label: 'Overview',
      path: '/dashboard',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: 'Weather & Rain',
      path: '/dashboard/weather',
      icon: CloudSun,
    },
    {
      label: 'Soiling Math & Model',
      path: '/dashboard/efficiency',
      icon: LineChart,
    },
    {
      label: 'Cleaning Log & ROI',
      path: '/dashboard/cleaning-history',
      icon: History,
    },
    {
      label: 'Solar Arrays',
      path: '/dashboard/installations',
      icon: SunMedium,
    },
    {
      label: 'Settings & Alerts',
      path: '/dashboard/settings',
      icon: Settings,
    },
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:block border-r border-slate-800/80 bg-slate-950/40 p-4 space-y-6 min-h-[calc(100vh-110px)]">
      <nav className="space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                )
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Viva / Academic Banner */}
      <div className="p-3.5 rounded-xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 text-xs text-slate-400 space-y-2">
        <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px] uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Capstone Viva System</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-400">
          Explainable empirical rule-based decision support system. Tested against Kimber/NREL soiling standards.
        </p>
      </div>
    </aside>
  );
};
