import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useInstallation } from '../../context/InstallationContext';
import { Sun, LogOut, User as UserIcon, Plus, ChevronDown } from 'lucide-react';
import { Button } from '../common/Button';

export interface NavbarProps {
  onOpenCreateModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCreateModal }) => {
  const { user, logout } = useAuth();
  const { installations, currentInstallation, setCurrentInstallation } = useInstallation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 via-solar-400 to-amber-300 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sun className="w-5 h-5 text-amber-400 fill-amber-400/20" />
              </div>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white font-['Outfit',sans-serif]">
                Sun<span className="text-amber-400">Track</span>
              </span>
              <span className="hidden sm:inline-block ml-2 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded">
                v1.0 Viva
              </span>
            </div>
          </Link>

          {/* Installation Selector Dropdown */}
          {user && installations.length > 0 && (
            <div className="relative hidden md:flex items-center">
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200">
                <span className="text-slate-400">Site:</span>
                <select
                  aria-label="Select Solar Installation"
                  value={currentInstallation?.id || ''}
                  onChange={(e) => {
                    const inst = installations.find((i) => i.id === e.target.value);
                    if (inst) setCurrentInstallation(inst);
                  }}
                  className="bg-transparent text-slate-100 font-semibold focus:outline-none cursor-pointer pr-4"
                >
                  {installations.map((inst) => (
                    <option key={inst.id} value={inst.id} className="bg-slate-900 text-slate-100">
                      {inst.name} ({inst.capacityKw} kW)
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none -ml-3" />
              </div>

              {onOpenCreateModal && (
                <button
                  onClick={onOpenCreateModal}
                  title="Add another solar installation"
                  className="ml-2 p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800/80 rounded-lg border border-slate-800 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right: User profile / Action buttons */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 bg-slate-900/60 border border-slate-800/80 px-3 py-1.5 rounded-lg text-xs">
                <UserIcon className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-medium text-slate-200">{user.name}</span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-slate-400 hover:text-rose-400"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
