import React, { useState, useEffect, useCallback } from 'react';
import { useInstallation } from '../context/InstallationContext';
import { cleaningService } from '../services/cleaningService';
import { analyticsService } from '../services/analyticsService';
import { CleaningRecord, SummaryStats } from '../types';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { RecordCleaningModal } from '../components/dashboard/RecordCleaningModal';
import {
  Droplets,
  Plus,
  DollarSign,
  Zap,
  Trash2,
  TrendingUp,
} from 'lucide-react';

export const CleaningHistoryPage: React.FC = () => {
  const { currentInstallation } = useInstallation();

  const [records, setRecords] = useState<CleaningRecord[]>([]);
  const [stats, setStats] = useState<SummaryStats | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = useCallback(async () => {
    if (!currentInstallation) return;
    try {
      const [recordsRes, statsRes] = await Promise.all([
        cleaningService.list(currentInstallation.id),
        analyticsService.getSummaryStatistics(currentInstallation.id),
      ]);
      setRecords(recordsRes);
      setStats(statsRes);
    } catch (e) {
      console.error('Failed to load cleaning history:', e);
    }
  }, [currentInstallation]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = async (recordId: string) => {
    if (window.confirm('Are you sure you want to delete this cleaning record?')) {
      try {
        await cleaningService.delete(recordId);
        loadData();
      } catch (e) {
        console.error('Failed to delete record:', e);
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit',sans-serif]">
            Maintenance Log & Cost ROI
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Historical cleaning events, water/labor expenditures, and energy recovered for <strong className="text-slate-200">{currentInstallation?.name}</strong>.
          </p>
        </div>

        <Button
          variant="solar"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Record Cleaning Event
        </Button>
      </div>

      {/* Aggregate ROI Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="uppercase font-semibold">Total Washes</span>
              <Droplets className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl font-black text-white font-['Outfit',sans-serif] mt-2">
              {stats.totalCleanings}
            </div>
            <span className="text-[11px] text-slate-400">
              Avg interval: {stats.avgDaysBetweenCleanings} days
            </span>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="uppercase font-semibold">Total Spent</span>
              <DollarSign className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400 font-['Outfit',sans-serif] mt-2">
              ${stats.totalSpent.toFixed(2)}
            </div>
            <span className="text-[11px] text-slate-400">Water & labor costs</span>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="uppercase font-semibold">Energy Recovered</span>
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400 font-['Outfit',sans-serif] mt-2">
              {stats.totalRecoveredKwh} <span className="text-xs">kWh</span>
            </div>
            <span className="text-[11px] text-slate-400">
              Value: ~${stats.estimatedValueRecovered.toFixed(2)}
            </span>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="uppercase font-semibold">Net Cleaning ROI</span>
              <TrendingUp className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-2xl font-black text-teal-400 font-['Outfit',sans-serif] mt-2">
              +${stats.netRoi.toFixed(2)}
            </div>
            <span className="text-[11px] text-slate-400">Yield revenue vs expense</span>
          </Card>
        </div>
      )}

      {/* Cleaning History Table */}
      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100 font-['Outfit',sans-serif]">
            Recorded Maintenance History
          </h3>
          <span className="text-xs text-slate-400">{records.length} records logged</span>
        </div>

        {records.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No cleaning events recorded yet. Click "Record Cleaning Event" to log your first wash.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Date Cleaned</th>
                  <th className="py-3 px-4">Pre-Clean Health</th>
                  <th className="py-3 px-4">Post-Clean Health</th>
                  <th className="py-3 px-4">Cost</th>
                  <th className="py-3 px-4">Maintenance Notes</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {records.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4 font-semibold">
                      {new Date(r.cleanedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-4 text-rose-400 font-semibold">
                      {r.efficiencyBefore ? `${r.efficiencyBefore}%` : 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-emerald-400 font-semibold">
                      {r.efficiencyAfter ? `${r.efficiencyAfter}%` : '100%'}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {r.cost ? `$${r.cost.toFixed(2)}` : 'Free ($0.00)'}
                    </td>
                    <td className="py-3 px-4 text-slate-400 max-w-xs truncate">
                      {r.notes || '—'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                        title="Delete cleaning record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {currentInstallation && (
        <RecordCleaningModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          installationId={currentInstallation.id}
          installationName={currentInstallation.name}
          currentEfficiencyLoss={15}
          onCleaningRecorded={loadData}
        />
      )}
    </div>
  );
};
