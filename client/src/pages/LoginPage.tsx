import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sun, Mail, Lock, Sparkles, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Card } from '../components/common/Card';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data
          ?.error?.message || 'Invalid email or password. Please try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('demo@suntrack.app');
    setPassword('password123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[300px] h-[200px] bg-orange-500/6 rounded-full blur-[100px] pointer-events-none" />

      {/* Logo + tagline */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3 relative z-10 px-4">
        <Link to="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-400 to-orange-300 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sun className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <span className="text-2xl font-black text-white font-['Outfit',sans-serif]">
            Sun<span className="text-amber-400">Track</span>
          </span>
        </Link>
        <h1 className="text-xl font-extrabold text-slate-100 font-['Outfit',sans-serif]">
          Sign in to your Solar Dashboard
        </h1>
        <p className="text-xs text-slate-400">
          Access real-time weather analytics and intelligent cleaning schedules.
        </p>
      </div>

      {/* Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 relative z-10">
        <Card className="p-8 space-y-6">

          {/* Viva Demo Fast-Fill */}
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-amber-300">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="font-bold block">Viva Demo Account</span>
                <span className="text-amber-200/70 text-[11px]">demo@suntrack.app</span>
              </div>
            </div>
            <button
              type="button"
              id="demo-fill-btn"
              onClick={handleFillDemo}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold rounded-lg text-[11px] transition-all"
            >
              Fill Credentials
            </button>
          </div>

          {/* Security badge */}
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/50 border border-slate-800 rounded-lg px-3 py-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>JWT + bcrypt 12-round encryption — your data is safe.</span>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs text-rose-400 leading-relaxed">
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="login-email"
              label="Email Address"
              type="email"
              required
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <div className="relative">
              <Input
                id="login-password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-[34px] text-slate-400 hover:text-slate-200 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Button
              id="login-submit-btn"
              variant="solar"
              type="submit"
              isLoading={isLoading}
              className="w-full mt-2"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In
            </Button>
          </form>

          <div className="text-center pt-2 border-t border-slate-800 text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-amber-400 hover:underline font-semibold">
              Register now
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
