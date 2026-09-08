import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useInstallation } from '../../context/InstallationContext';
import { CreateInstallationData } from '../../services/installationService';

interface InstallationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallationModal: React.FC<InstallationModalProps> = ({ isOpen, onClose }) => {
  const { createInstallation } = useInstallation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateInstallationData>({
    name: 'छत सौर प्रणाली',
    locationName: 'Pune, Maharashtra',
    latitude: 18.5204,
    longitude: 73.8567,
    capacityKw: 5.0,
    panelCount: 15,
    panelType: 'MONOCRYSTALLINE',
    tiltDegrees: 18.5,
    lastCleaningDate: new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await createInstallation(formData);
      onClose();
    } catch (error) {
      console.error('Failed to create installation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Solar Panel Installation">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Installation Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          placeholder="e.g. West Wing Residential Array"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Location Name"
            value={formData.locationName}
            onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
            required
            placeholder="जैसे: Nagpur, Maharashtra"
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Panel Technology
            </label>
            <select
              value={formData.panelType}
              onChange={(e) => setFormData({ ...formData, panelType: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-lg px-3.5 py-2.5 text-sm focus:border-amber-500 focus:outline-none"
            >
              <option value="MONOCRYSTALLINE">Monocrystalline (High Efficiency)</option>
              <option value="POLYCRYSTALLINE">Polycrystalline</option>
              <option value="THIN_FILM">Thin Film</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Latitude"
            type="number"
            step="any"
            value={formData.latitude}
            onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
            required
          />
          <Input
            label="Longitude"
            type="number"
            step="any"
            value={formData.longitude}
            onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Capacity (kW)"
            type="number"
            step="0.1"
            min="0.1"
            value={formData.capacityKw}
            onChange={(e) => setFormData({ ...formData, capacityKw: parseFloat(e.target.value) })}
            required
          />
          <Input
            label="Total Panels"
            type="number"
            min="1"
            value={formData.panelCount}
            onChange={(e) => setFormData({ ...formData, panelCount: parseInt(e.target.value, 10) })}
            required
          />
          <Input
            label="Tilt Angle (°)"
            type="number"
            min="0"
            max="90"
            value={formData.tiltDegrees}
            onChange={(e) => setFormData({ ...formData, tiltDegrees: parseFloat(e.target.value) })}
          />
        </div>

        <Input
          label="Last Cleaning Date"
          type="date"
          value={
            typeof formData.lastCleaningDate === 'string'
              ? formData.lastCleaningDate
              : new Date().toISOString().split('T')[0]
          }
          onChange={(e) => setFormData({ ...formData, lastCleaningDate: e.target.value })}
          required
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="solar" type="submit" isLoading={isSubmitting}>
            Save Installation
          </Button>
        </div>
      </form>
    </Modal>
  );
};
