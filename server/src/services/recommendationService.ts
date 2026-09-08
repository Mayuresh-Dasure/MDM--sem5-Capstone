import { prisma } from '../utils/prisma.js';
import { RecommendationEngine } from '../engine/DecisionTree.js';
import { WeatherService } from './weatherService.js';
import { AppError } from '../utils/AppError.js';
import { InstallationProfile, RecommendationResult } from '../engine/types.js';
import { logger } from '../utils/logger.js';
import { EmailService } from './emailService.js';

export class RecommendationService {
  /**
   * Compute live explainable recommendation for a solar installation.
   */
  public static async getRecommendation(
    installationId: string,
    forceRefresh = false
  ): Promise<RecommendationResult> {
    const installation = await prisma.solarInstallation.findUnique({
      where: { id: installationId },
      include: {
        user: {
          include: {
            notificationPreference: true,
          },
        },
      },
    });

    if (!installation) {
      throw AppError.notFound('Installation not found');
    }

    // Fetch forecast (cached or live)
    const { current, forecast } = await WeatherService.getForecastForInstallation(
      installation.id,
      installation.latitude,
      installation.longitude,
      forceRefresh
    );

    const profile: InstallationProfile = {
      id: installation.id,
      name: installation.name,
      capacityKw: installation.capacityKw,
      panelCount: installation.panelCount,
      panelType: installation.panelType,
      tiltDegrees: installation.tiltDegrees,
      lastCleaningDate: installation.lastCleaningDate,
      locationName: installation.locationName,
      latitude: installation.latitude,
      longitude: installation.longitude,
    };

    // Evaluate recommendation
    const result = RecommendationEngine.evaluate(profile, current, forecast);

    // Save recommendation record to DB asynchronously
    prisma.recommendation
      .create({
        data: {
          installationId: installation.id,
          type: result.type,
          efficiencyLoss: result.efficiencyLoss,
          estimatedEfficiency: result.estimatedEfficiency,
          recommendedDate: result.recommendedDate,
          reason: result.reason,
          factors: JSON.stringify(result.factors),
        },
      })
      .catch((err) => logger.error('Failed to record recommendation history:', err));

    // Evaluate if notification should be dispatched
    if (installation.user?.notificationPreference?.emailEnabled) {
      EmailService.evaluateAndSendAlert(
        installation.user.email,
        installation.user.name,
        installation.name,
        result,
        installation.user.notificationPreference
      ).catch((err) => logger.error('Email alert dispatch error:', err));
    }

    return result;
  }
}
