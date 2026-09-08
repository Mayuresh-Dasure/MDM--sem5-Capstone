import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { InstallationService } from '../services/installationService.js';
import { AuthenticatedRequest, ApiResponse } from '../types/index.js';

export const createInstallationSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  latitude: z.number().min(-90).max(90, 'Valid latitude between -90 and 90 required'),
  longitude: z.number().min(-180).max(180, 'Valid longitude between -180 and 180 required'),
  locationName: z.string().min(2, 'Location name is required'),
  capacityKw: z.number().positive('Capacity must be greater than 0 kW'),
  panelCount: z.number().int().positive('Panel count must be a positive integer'),
  panelType: z.enum(['MONOCRYSTALLINE', 'POLYCRYSTALLINE', 'THIN_FILM']).optional(),
  tiltDegrees: z.number().min(0).max(90).optional(),
  lastCleaningDate: z.string().or(z.date()).optional(),
});

export const updateInstallationSchema = createInstallationSchema.partial();

export class InstallationController {
  public static async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const installations = await InstallationService.listByUser(req.user!.id);
      const response: ApiResponse = {
        success: true,
        data: installations,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  public static async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const installation = await InstallationService.getById(id);
      const response: ApiResponse = {
        success: true,
        data: installation,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  public static async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const created = await InstallationService.create(req.user!.id, req.body);
      const response: ApiResponse = {
        success: true,
        data: created,
        message: 'Solar installation created successfully',
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  public static async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const updated = await InstallationService.update(id, req.body);
      const response: ApiResponse = {
        success: true,
        data: updated,
        message: 'Solar installation updated successfully',
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  public static async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await InstallationService.delete(id);
      const response: ApiResponse = {
        success: true,
        message: 'Solar installation removed successfully',
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
