import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sun,
  CloudRain,
  Zap,
  ArrowRight,
  Sparkles,
  BarChart3,
  Layers,
  IndianRupee,
  MapPin,
  Droplets,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950 flex flex-col">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-400 to-orange-300 p-0.5 shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sun className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <span className="text-2xl font-black tracking-tight text-white font-['Outfit',sans-serif]">
              Sun<span className="text-amber-400">Track</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Log In
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="solar" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-6 overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[300px] bg-orange-500/8 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Solar Panel Cleaning &amp; Maintenance Scheduler</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight font-['Outfit',sans-serif] leading-tight">
            Know Exactly When To Clean Your{' '}
            <span className="bg-gradient-to-r from-amber-400 via-orange-300 to-amber-500 bg-clip-text text-transparent">
              Solar Panels
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            SunTrack analyzes local weather forecasts, rain probability, dust accumulation, and dry days to tell you whether to clean now or wait for rain. Maximize power generation and save on maintenance costs.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/login" className="w-full sm:w-auto">
              <Button variant="solar" size="lg" className="w-full sm:w-auto text-base">
                Try Live Demo →
              </Button>
            </Link>
            <Link to="/register" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto text-base">
                Create Free Account
              </Button>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
            <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
              <span className="block text-[10px] uppercase text-slate-400 font-semibold">Avg Efficiency Loss</span>
              <span className="text-xl font-bold text-amber-400 font-['Outfit',sans-serif]">15% – 25%</span>
            </div>
            <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
              <span className="block text-[10px] uppercase text-slate-400 font-semibold">Water Saved</span>
              <span className="text-xl font-bold text-sky-400 font-['Outfit',sans-serif]">~150 L / wash</span>
            </div>
            <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
              <span className="block text-[10px] uppercase text-slate-400 font-semibold">Decision Engine</span>
              <span className="text-xl font-bold text-emerald-400 font-['Outfit',sans-serif]">100% Explainable</span>
            </div>
            <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
              <span className="block text-[10px] uppercase text-slate-400 font-semibold">Live Forecast</span>
              <span className="text-xl font-bold text-slate-200 font-['Outfit',sans-serif]">5-Day Weather</span>
            </div>
          </div>
        </div>
      </section>

      {/* Solar Context Banner */}
      <section className="py-8 px-6 bg-gradient-to-r from-amber-950/30 via-slate-900/60 to-orange-950/30 border-t border-amber-500/10">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
            <MapPin className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-amber-300 font-['Outfit',sans-serif]">
              Optimized for High Solar Radiation Regions
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
              Specifically calibrated for high solar yield areas and seasonal dust cycles. Accounts for dust accumulation, tilt angle, and natural rain washing patterns.
            </p>
          </div>
          <div className="flex items-center gap-6 shrink-0 text-xs text-slate-400">
            <div className="text-center">
              <span className="block text-lg font-bold text-amber-400 font-['Outfit',sans-serif]">750+</span>
              <span>GW Target</span>
            </div>
            <div className="text-center">
              <span className="block text-lg font-bold text-emerald-400 font-['Outfit',sans-serif]">High ROI</span>
              <span>Per Unit Value</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 px-6 bg-slate-950/60 border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-['Outfit',sans-serif]">
              Built for Intelligent Solar Operations
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl mx-auto">
              Combining meteorological telemetry and solar engineering principles to protect your photovoltaic investment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 space-y-3 bg-slate-900/50 hover:border-sky-500/30 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
                <CloudRain className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white font-['Outfit',sans-serif]">
                72-Hour Rain Forecasting
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Prevents unnecessary washing. If &gt;60% probability of &gt;5mm rain in 72 hours, the engine flags <strong className="text-sky-300">WAIT_FOR_RAIN</strong>.
              </p>
            </Card>

            <Card className="p-6 space-y-3 bg-slate-900/50 hover:border-amber-500/30 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white font-['Outfit',sans-serif]">
                Mathematical Soiling Model
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tracks consecutive dry days, tilt angle, wind speed, and humidity with fully transparent, deterministic calculations.
              </p>
            </Card>

            <Card className="p-6 space-y-3 bg-slate-900/50 hover:border-emerald-500/30 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <IndianRupee className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white font-['Outfit',sans-serif]">
                ROI &amp; Savings Tracker
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Log every cleaning session, track labor and water costs, and monitor lifetime energy savings.
              </p>
            </Card>
          </div>

          {/* Secondary feature row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-3 bg-slate-900/50 hover:border-rose-500/20 transition-colors flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-white font-['Outfit',sans-serif]">
                  Efficiency History Charts
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Interactive Recharts curves showing 30-day degradation history and 7-day future projections side by side.
                </p>
              </div>
            </Card>

            <Card className="p-6 space-y-3 bg-slate-900/50 hover:border-purple-500/20 transition-colors flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center shrink-0 mt-0.5">
                <Droplets className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-white font-['Outfit',sans-serif]">
                  Rain &amp; Weather Smart Scheduling
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Track natural rainfall washing cycles to optimize cleaning frequency and save both water and labor.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Decision Tree Showcase */}
      <section className="py-16 px-6 bg-slate-900/30 border-t border-slate-800/80">
        <div className="max-w-4xl mx-auto p-8 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white font-['Outfit',sans-serif]">
                Deterministic Decision Logic
              </h3>
              <p className="text-xs text-slate-400">
                The SunTrack engine evaluates four transparent states for every installation:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/30 space-y-1.5 hover:border-rose-500/50 transition-colors">
              <div className="font-bold text-rose-400 uppercase text-[11px] tracking-wide">🔴 CLEAN_NOW</div>
              <p className="text-slate-300">Loss ≥ 15%, extended dry period. Clean today for immediate yield recovery.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-1.5 hover:border-amber-500/50 transition-colors">
              <div className="font-bold text-amber-400 uppercase text-[11px] tracking-wide">🟡 CLEAN_SOON</div>
              <p className="text-slate-300">Loss 8–15%, 3+ dry days ahead. Plan cleaning within the next weekend.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-sky-500/30 space-y-1.5 hover:border-sky-500/50 transition-colors">
              <div className="font-bold text-sky-400 uppercase text-[11px] tracking-wide">🔵 WAIT_FOR_RAIN</div>
              <p className="text-slate-300">≥60% rain probability in next 72 hours. Save water and labor, let nature clean the array.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-1.5 hover:border-emerald-500/50 transition-colors">
              <div className="font-bold text-emerald-400 uppercase text-[11px] tracking-wide">🟢 NO_ACTION</div>
              <p className="text-slate-300">Panels cleaned recently or operating at &gt;92% performance ratio.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 px-6 py-8 text-center text-xs text-slate-500 space-y-2">
        <p>© 2026 SunTrack — Solar Panel Cleaning &amp; Maintenance Scheduler</p>
        <p className="max-w-xl mx-auto text-[11px] text-slate-400">
          Disclaimer: Mathematical software estimation model based on meteorological telemetry. Developed for Capstone project research.
        </p>
      </footer>
    </div>
  );
};
