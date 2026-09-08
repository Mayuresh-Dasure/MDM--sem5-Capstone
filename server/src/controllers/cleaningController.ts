import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { CleaningService } from '../services/cleaningService.js';
import { AuthenticatedRequest, ApiResponse } from '../types/index.js';

export const createCleaningSchema = z.object({
  cleanedAt: z.string().or(z.date()),
  efficiencyBefore: z.number().min(0).max(100).optional(),
  efficiencyAfter: z.number().min(0).max(100).optional(),
  cost: z.number().min(0).optional(),
  notes: z.string().max(500).optional(),
});

export const updateCleaningSchema = createCleaningSchema.partial();

export class CleaningController {
  public static async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const records = await CleaningService.listByInstallation(id);
      const response: ApiResponse = {
        success: true,
        data: records,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  public static async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const record = await CleaningService.create(id, req.body);
      const response: ApiResponse = {
        success: true,
        data: record,
        message: 'Cleaning recorded successfully. Baseline soiling reset to 0%.',
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  public static async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const recordId = req.params.recordId as string;
      const record = await CleaningService.update(recordId, req.body);
      const response: ApiResponse = {
        success: true,
        data: record,
        message: 'Cleaning record updated',
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  public static async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const recordId = req.params.recordId as string;
      const result = await CleaningService.delete(recordId);
      const response: ApiResponse = {
        success: true,
        message: result.message,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
