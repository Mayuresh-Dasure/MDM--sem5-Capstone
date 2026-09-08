import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import {
  Bell,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, updatePreferences } = useAuth();

  const [emailEnabled, setEmailEnabled] = useState(
    user?.notificationPreference?.emailEnabled ?? true
  );
  const [cleaningAlerts, setCleaningAlerts] = useState(
    user?.notificationPreference?.cleaningAlerts ?? true
  );
  const [rainAlerts, setRainAlerts] = useState(
    user?.notificationPreference?.rainAlerts ?? true
  );
  const [weeklySummary, setWeeklySummary] = useState(
    user?.notificationPreference?.weeklySummary ?? false
  );
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await updatePreferences({
        emailEnabled,
        cleaningAlerts,
        rainAlerts,
        weeklySummary,
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.error('Failed to update preferences:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit',sans-serif]">
          Settings & Alert Preferences
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure automated email digests, alert thresholds, and system preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Email Notification Toggles */}
        <Card className="p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 font-['Outfit',sans-serif]">
                Email Notification Dispatcher
              </h3>
              <p className="text-xs text-slate-400">
                Alerts dispatched via Nodemailer with 48h deduplication throttling.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 cursor-pointer hover:border-slate-700">
              <div className="space-y-0.5">
                <span className="block text-sm font-semibold text-slate-200">
                  Global Email Notifications
                </span>
                <span className="block text-xs text-slate-400">
                  Receive email alerts for recommendation updates and severe weather.
                </span>
              </div>
              <input
                type="checkbox"
                checked={emailEnabled}
                onChange={(e) => setEmailEnabled(e.target.checked)}
                className="w-4 h-4 text-amber-500 rounded border-slate-700 focus:ring-amber-500 bg-slate-900 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 cursor-pointer hover:border-slate-700">
              <div className="space-y-0.5">
                <span className="block text-sm font-semibold text-slate-200">
                  Cleaning Recommendation Trigger (CLEAN_NOW)
                </span>
                <span className="block text-xs text-slate-400">
                  Notify when soiling loss exceeds 15% with dry weather forecast ahead.
                </span>
              </div>
              <input
                type="checkbox"
                checked={cleaningAlerts}
                disabled={!emailEnabled}
                onChange={(e) => setCleaningAlerts(e.target.checked)}
                className="w-4 h-4 text-amber-500 rounded border-slate-700 focus:ring-amber-500 bg-slate-900 cursor-pointer disabled:opacity-50"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 cursor-pointer hover:border-slate-700">
              <div className="space-y-0.5">
                <span className="block text-sm font-semibold text-slate-200">
                  Natural Rain Alerts (WAIT_FOR_RAIN)
                </span>
                <span className="block text-xs text-slate-400">
                  Notify when heavy precipitation is arriving soon to prevent manual washing.
                </span>
              </div>
              <input
                type="checkbox"
                checked={rainAlerts}
                disabled={!emailEnabled}
                onChange={(e) => setRainAlerts(e.target.checked)}
                className="w-4 h-4 text-amber-500 rounded border-slate-700 focus:ring-amber-500 bg-slate-900 cursor-pointer disabled:opacity-50"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 cursor-pointer hover:border-slate-700">
              <div className="space-y-0.5">
                <span className="block text-sm font-semibold text-slate-200">
                  Weekly System Digest
                </span>
                <span className="block text-xs text-slate-400">
                  Receive a weekly email summarizing power recovered and upcoming weather outlook.
                </span>
              </div>
              <input
                type="checkbox"
                checked={weeklySummary}
                disabled={!emailEnabled}
                onChange={(e) => setWeeklySummary(e.target.checked)}
                className="w-4 h-4 text-amber-500 rounded border-slate-700 focus:ring-amber-500 bg-slate-900 cursor-pointer disabled:opacity-50"
              />
            </label>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            {isSaved ? (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Preferences updated successfully!
              </span>
            ) : (
              <span className="text-xs text-slate-400">
                Registered email: <strong className="text-slate-200">{user?.email}</strong>
              </span>
            )}

            <Button variant="solar" type="submit" isLoading={isSaving} size="sm">
              Save Preferences
            </Button>
          </div>
        </Card>

        {/* Model Thresholds Reference (Read Only) */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 font-['Outfit',sans-serif]">
                Engine Constant Thresholds
              </h3>
              <p className="text-xs text-slate-400">
                Current active thresholds loaded from <code className="text-amber-400">SOILING_CONFIG</code>.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
              <span className="block text-slate-400 text-[10px] uppercase">Base Daily Rate</span>
              <span className="font-bold text-slate-200">0.60% / day</span>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
              <span className="block text-slate-400 text-[10px] uppercase">Clean Now Trigger</span>
              <span className="font-bold text-rose-400">&ge; 15.0% Loss</span>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
              <span className="block text-slate-400 text-[10px] uppercase">Rain Min Wash</span>
              <span className="font-bold text-sky-400">&ge; 5.0 mm</span>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
              <span className="block text-slate-400 text-[10px] uppercase">Rain Probability</span>
              <span className="font-bold text-sky-400">&ge; 60%</span>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
              <span className="block text-slate-400 text-[10px] uppercase">Weather Cache TTL</span>
              <span className="font-bold text-slate-200">3 Hours</span>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
              <span className="block text-slate-400 text-[10px] uppercase">Optical Loss Cap</span>
              <span className="font-bold text-amber-400">35.0% Max</span>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
};
