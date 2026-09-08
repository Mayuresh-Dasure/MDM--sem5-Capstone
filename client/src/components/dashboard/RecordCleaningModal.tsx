import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { cleaningService } from '../../services/cleaningService';
import { Droplets } from 'lucide-react';

export interface RecordCleaningModalProps {
  isOpen: boolean;
  onClose: () => void;
  installationId: string;
  installationName: string;
  currentEfficiencyLoss: number;
  onCleaningRecorded: () => void;
}

export const RecordCleaningModal: React.FC<RecordCleaningModalProps> = ({
  isOpen,
  onClose,
  installationId,
  installationName,
  currentEfficiencyLoss,
  onCleaningRecorded,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cleanedAt, setCleanedAt] = useState(new Date().toISOString().split('T')[0]);
  const [cost, setCost] = useState<string>('35.00');
  const [notes, setNotes] = useState('Manual pressure wash and squeegee wipe.');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await cleaningService.create(installationId, {
        cleanedAt: new Date(cleanedAt).toISOString(),
        efficiencyBefore: Number((100 - currentEfficiencyLoss).toFixed(1)),
        efficiencyAfter: 100.0,
        cost: cost ? parseFloat(cost) : undefined,
        notes,
      });

      onCleaningRecorded();
      onClose();
    } catch (error) {
      console.error('Failed to log cleaning record:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Cleaning Event">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-200 flex items-start gap-2.5">
          <Droplets className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            Recording this cleaning for <strong>{installationName}</strong> will reset the estimated soiling baseline to <strong>0% loss (100% health)</strong> starting from the selected date.
          </span>
        </div>

        <Input
          label="Cleaning Date"
          type="date"
          value={cleanedAt}
          max={new Date().toISOString().split('T')[0]}
          onChange={(e) => setCleanedAt(e.target.value)}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Service / Water Cost ($)"
            type="number"
            step="0.01"
            min="0"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            placeholder="0.00"
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Efficiency Restored
            </label>
            <div className="bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-emerald-400 font-bold">
              100.0% (+{currentEfficiencyLoss}% Gain)
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
            Maintenance Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-lg px-3.5 py-2.5 text-sm focus:border-amber-500 focus:outline-none placeholder:text-slate-500"
            placeholder="e.g. Cleared heavy bird droppings and desert dust..."
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="solar" type="submit" isLoading={isSubmitting}>
            Confirm & Reset Soiling Baseline
          </Button>
        </div>
      </form>
    </Modal>
  );
};
