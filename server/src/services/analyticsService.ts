import { prisma } from '../utils/prisma.js';
import { AppError } from '../utils/AppError.js';
import { RecommendationService } from './recommendationService.js';

export class AnalyticsService {
  /**
   * Generates efficiency timeline points for Recharts visualization.
   */
  public static async getEfficiencyTimeline(installationId: string) {
    const installation = await prisma.solarInstallation.findUnique({
      where: { id: installationId },
      include: {
        cleaningRecords: {
          orderBy: { cleanedAt: 'asc' },
        },
      },
    });

    if (!installation) {
      throw AppError.notFound('Installation not found');
    }

    const rec = await RecommendationService.getRecommendation(installationId);
    const lastCleaning = new Date(installation.lastCleaningDate);
    const now = new Date();
    const daysElapsed = Math.max(0, Math.floor((now.getTime() - lastCleaning.getTime()) / (86400000)));

    const historyPoints: Array<{
      date: string;
      dayIndex: number;
      estimatedEfficiency: number;
      soilingLoss: number;
      event?: string;
    }> = [];

    // Historical accumulation progression
    const steps = Math.min(daysElapsed, 30);
    for (let i = 0; i <= steps; i++) {
      const pointDate = new Date(lastCleaning.getTime() + i * 86400000);
      const ratio = steps > 0 ? i / steps : 1;
      const currentLoss = Number((rec.efficiencyLoss * ratio).toFixed(1));
      const currentEff = Number((100 - currentLoss).toFixed(1));

      historyPoints.push({
        date: pointDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        dayIndex: i,
        estimatedEfficiency: currentEff,
        soilingLoss: currentLoss,
        ...(i === 0 ? { event: 'Cleaned' } : {}),
      });
    }

    // 7-day future projection
    const projectionPoints: Array<{
      date: string;
      dayIndex: number;
      projectedEfficiency: number;
      projectedLoss: number;
    }> = [];

    for (let j = 1; j <= 7; j++) {
      const projDate = new Date(now.getTime() + j * 86400000);
      const projectedLoss = Math.min(35.0, Number((rec.efficiencyLoss + j * 0.6).toFixed(1)));
      projectionPoints.push({
        date: projDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        dayIndex: daysElapsed + j,
        projectedEfficiency: Number((100 - projectedLoss).toFixed(1)),
        projectedLoss,
      });
    }

    return {
      history: historyPoints,
      projection: projectionPoints,
      currentLoss: rec.efficiencyLoss,
      currentEfficiency: rec.estimatedEfficiency,
      type: rec.type,
    };
  }

  /**
   * Compute aggregate ROI & lifetime statistics.
   */
  public static async getSummaryStatistics(installationId: string) {
    const installation = await prisma.solarInstallation.findUnique({
      where: { id: installationId },
      include: {
        cleaningRecords: {
          orderBy: { cleanedAt: 'asc' },
        },
      },
    });

    if (!installation) {
      throw AppError.notFound('Installation not found');
    }

    const cleanings = installation.cleaningRecords;
    const totalCleanings = cleanings.length;
    const totalSpent = cleanings.reduce((sum, c) => sum + (c.cost || 0), 0);

    // Calculate average days between cleanings
    let avgDaysBetweenCleanings = 30; // default benchmark
    if (cleanings.length >= 2) {
      const intervals: number[] = [];
      for (let i = 1; i < cleanings.length; i++) {
        const diff =
          (new Date(cleanings[i].cleanedAt).getTime() -
            new Date(cleanings[i - 1].cleanedAt).getTime()) /
          86400000;
        intervals.push(diff);
      }
      avgDaysBetweenCleanings = Math.round(
        intervals.reduce((a, b) => a + b, 0) / intervals.length
      );
    }

    // Estimated energy recovered (assuming each cleaning recovers ~12% generation over 30 days)
    const nominalDailyKwh = (installation.capacityKw || 5) * 4.5;
    const estRecoveredKwhPerWash = nominalDailyKwh * 0.12 * 30;
    const totalRecoveredKwh = Number((totalCleanings * estRecoveredKwhPerWash).toFixed(1));

    // Financial value recovered (avg $0.15 / kWh electricity tariff)
    const avgTariff = 0.15;
    const estimatedValueRecovered = Number((totalRecoveredKwh * avgTariff).toFixed(2));
    const netRoi = Number((estimatedValueRecovered - totalSpent).toFixed(2));

    return {
      totalCleanings,
      totalSpent: Number(totalSpent.toFixed(2)),
      avgDaysBetweenCleanings,
      totalRecoveredKwh,
      estimatedValueRecovered,
      netRoi,
      installationCapacityKw: installation.capacityKw,
    };
  }
}
