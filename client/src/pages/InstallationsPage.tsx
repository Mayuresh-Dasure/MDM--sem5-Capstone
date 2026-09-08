import React, { useState } from 'react';
import { useInstallation } from '../context/InstallationContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { InstallationModal } from '../components/installations/InstallationModal';
import {
  SunMedium,
  Plus,
  MapPin,
  Calendar,
  CheckCircle,
  Trash2,
} from 'lucide-react';
import clsx from 'clsx';

export const InstallationsPage: React.FC = () => {
  const {
    installations,
    currentInstallation,
    setCurrentInstallation,
    deleteInstallation,
  } = useInstallation();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the installation "${name}"?`)) {
      try {
        await deleteInstallation(id);
      } catch (e) {
        console.error('Failed to delete installation:', e);
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit',sans-serif]">
            Solar Installations & Arrays
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage multiple residential rooftops, commercial canopies, or ground-mounted arrays.
          </p>
        </div>

        <Button
          variant="solar"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add New Installation
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {installations.map((inst) => {
          const isActive = currentInstallation?.id === inst.id;
          const lastCleanedDate = new Date(inst.lastCleaningDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });

          return (
            <Card
              key={inst.id}
              className={clsx(
                'p-6 space-y-4 transition-all',
                isActive
                  ? 'border-amber-500/50 bg-slate-900/90 shadow-lg shadow-amber-500/5'
                  : 'bg-slate-900/50 hover:border-slate-700'
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                    <SunMedium className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-['Outfit',sans-serif]">
                      {inst.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{inst.locationName}</span>
                    </div>
                  </div>
                </div>

                {isActive ? (
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-amber-400" />
                    Active Site
                  </span>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentInstallation(inst)}
                  >
                    Select
                  </Button>
                )}
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="block text-[10px] text-slate-400 uppercase">Capacity</span>
                  <span className="font-bold text-slate-200">{inst.capacityKw} kW</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="block text-[10px] text-slate-400 uppercase">Panels</span>
                  <span className="font-bold text-slate-200">{inst.panelCount} units</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="block text-[10px] text-slate-400 uppercase">Tilt Angle</span>
                  <span className="font-bold text-slate-200">{inst.tiltDegrees}°</span>
                </div>
              </div>

              {/* Last Cleaned & Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Last Cleaned: <strong className="text-slate-200">{lastCleanedDate}</strong></span>
                </div>

                {installations.length > 1 && (
                  <button
                    onClick={() => handleDelete(inst.id, inst.name)}
                    className="text-slate-400 hover:text-rose-400 p-1 rounded transition-colors"
                    title="Delete installation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <InstallationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
