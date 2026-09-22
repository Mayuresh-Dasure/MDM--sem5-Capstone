import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sun,
  Mail,
  Lock,
  User as UserIcon,
  ArrowRight,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Card } from '../components/common/Card';

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi (NCT)',
  'Jammu & Kashmir',
  'Ladakh',
  'Puducherry',
  'Chandigarh',
  'Dadra & Nagar Haveli',
  'Daman & Diu',
  'Lakshadweep',
  'Andaman & Nicobar Islands',
];

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Password strength checker
  const getPasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strengthScore = getPasswordStrength(password);
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strengthScore];
  const strengthColor = ['', 'bg-rose-500', 'bg-amber-400', 'bg-yellow-400', 'bg-emerald-500'][strengthScore];

  const validatePhone = (ph: string) => /^[6-9]\d{9}$/.test(ph);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please try again.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (phone && !validatePhone(phone)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsLoading(true);
    try {
      await register({ name, email, password, phone: phone || undefined, state: state || undefined });
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data
          ?.error?.message || 'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-10 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[400px] bg-amber-500/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[300px] bg-orange-500/6 rounded-full blur-[120px] pointer-events-none" />

      {/* Logo + Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center space-y-3 relative z-10 px-4">
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
          Create your SunTrack Account
        </h1>
        <p className="text-xs text-slate-400">
          Optimize solar panel cleaning — Registration is free.
        </p>
      </div>

      {/* Form Card */}
      <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-lg px-4 relative z-10">
        <Card className="p-7 space-y-5">
          {/* Trust badge */}
          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Your data is secure — Encrypted with bcrypt + JWT</span>
          </div>

          {/* Error box */}
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs text-rose-400 leading-relaxed">
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <Input
              id="register-name"
              label="Full Name"
              type="text"
              required
              placeholder="e.g. Alex Johnson"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<UserIcon className="w-4 h-4" />}
            />

            {/* Email */}
            <Input
              id="register-email"
              label="Email Address"
              type="email"
              required
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
            />

            {/* Phone + State — 2-col grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input
                  id="register-phone"
                  label="Mobile Number (Optional)"
                  type="tel"
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  leftIcon={<Phone className="w-4 h-4" />}
                />
                {phone && !validatePhone(phone) && (
                  <p className="text-[11px] text-rose-400 mt-1 pl-1">
                    Enter a valid 10-digit number
                  </p>
                )}
                {phone && validatePhone(phone) && (
                  <p className="text-[11px] text-emerald-400 mt-1 pl-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Valid number
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="register-state"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
                >
                  State
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <select
                    id="register-state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-lg pl-9 pr-3.5 py-2.5 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="">— Select State —</option>
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <Input
                  id="register-password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="At least 8 characters"
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

              {/* Password Strength Bar */}
              {password.length > 0 && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= strengthScore ? strengthColor : 'bg-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-[11px] font-semibold ${strengthScore <= 1 ? 'text-rose-400' : strengthScore === 2 ? 'text-amber-400' : strengthScore === 3 ? 'text-yellow-400' : 'text-emerald-400'}`}>
                    {strengthLabel && `Password strength: ${strengthLabel}`}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Input
                id="register-confirm-password"
                label="Confirm Password"
                type={showConfirm ? 'text' : 'password'}
                required
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-[34px] text-slate-400 hover:text-slate-200 transition-colors"
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              {confirmPassword.length > 0 && (
                <p
                  className={`text-[11px] mt-1 pl-1 flex items-center gap-1 ${
                    password === confirmPassword ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {password === confirmPassword ? (
                    <>
                      <CheckCircle2 className="w-3 h-3" /> Passwords match
                    </>
                  ) : (
                    '✗ Passwords do not match'
                  )}
                </p>
              )}
            </div>

            {/* Terms */}
            <p className="text-[11px] text-slate-500 leading-relaxed">
              By creating an account, you agree to our{' '}
              <span className="text-amber-400">Terms of Service</span> and{' '}
              <span className="text-amber-400">Privacy Policy</span>.
            </p>

            <Button
              variant="solar"
              type="submit"
              isLoading={isLoading}
              className="w-full mt-1"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Create Account
            </Button>
          </form>

          <div className="text-center pt-2 border-t border-slate-800 text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-amber-400 hover:underline font-semibold">
              Log in here
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
