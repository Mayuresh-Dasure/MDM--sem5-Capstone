import { Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analyticsService.js';
import { AuthenticatedRequest, ApiResponse } from '../types/index.js';

export class AnalyticsController {
  public static async getEfficiencyTimeline(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = req.params.id as string;
      const timeline = await AnalyticsService.getEfficiencyTimeline(id);
      const response: ApiResponse = {
        success: true,
        data: timeline,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  public static async getSummaryStatistics(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = req.params.id as string;
      const stats = await AnalyticsService.getSummaryStatistics(id);
      const response: ApiResponse = {
        success: true,
        data: stats,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
