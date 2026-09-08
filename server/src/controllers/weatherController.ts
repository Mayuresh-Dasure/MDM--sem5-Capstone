import { Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma.js';
import { WeatherService } from '../services/weatherService.js';
import { AuthenticatedRequest, ApiResponse } from '../types/index.js';
import { AppError } from '../utils/AppError.js';

export class WeatherController {
  public static async getWeather(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const installationId = req.params.id as string;
      const forceRefresh = req.query.refresh === 'true';

      const installation = await prisma.solarInstallation.findUnique({
        where: { id: installationId },
      });

      if (!installation) {
        throw AppError.notFound('Installation not found');
      }

      const weather = await WeatherService.getForecastForInstallation(
        installation.id,
        installation.latitude,
        installation.longitude,
        forceRefresh
      );

      const response: ApiResponse = {
        success: true,
        data: weather,
        meta: {
          timestamp: new Date().toISOString(),
          cached: weather.isCached,
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
