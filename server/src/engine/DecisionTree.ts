import { SOILING_CONFIG } from '../config/constants.js';
import { ExplainabilityEngine } from './Explainability.js';
import { SoilingModel } from './SoilingModel.js';
import {
  InstallationProfile,
  RecommendationResult,
  RecommendationType,
  WeatherDataPoint,
} from './types.js';

export class RecommendationEngine {
  /**
   * Main deterministic decision engine evaluating weather forecasts, soiling calculations, and operational thresholds.
   */
  public static evaluate(
    installation: InstallationProfile,
    currentWeather: WeatherDataPoint | null,
    forecast: WeatherDataPoint[],
    historicalRainDays = 0
  ): RecommendationResult {
    // 1. Calculate soiling loss and factors
    const soilingResult = SoilingModel.calculateSoiling(
      installation,
      currentWeather,
      forecast,
      historicalRainDays
    );

    const { efficiencyLoss, estimatedEfficiency, factors } = soilingResult;

    // 2. Evaluate rain forecast in lookahead window
    const hasSignificantRainSoon =
      factors.upcomingRainProbability >= SOILING_CONFIG.SIGNIFICANT_RAIN_PROBABILITY &&
      factors.upcomingRainVolumeMm >= SOILING_CONFIG.SIGNIFICANT_RAIN_VOLUME_MM;

    // 3. Branching Decision Tree
    let type: RecommendationType;
    let urgency: 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';

    if (hasSignificantRainSoon) {
      if (efficiencyLoss >= SOILING_CONFIG.URGENT_LOSS_THRESHOLD_DESPITE_RAIN) {
        // Loss is so high that waiting for rain might lose too much peak generation
        type = 'CLEAN_SOON';
        urgency = 'MEDIUM';
      } else {
        // Nature will wash panels soon — advise user to wait and save cost/water
        type = 'WAIT_FOR_RAIN';
        urgency = 'LOW';
      }
    } else {
      if (efficiencyLoss >= SOILING_CONFIG.CLEAN_NOW_LOSS_THRESHOLD) {
        type = 'CLEAN_NOW';
        urgency = 'HIGH';
      } else if (efficiencyLoss >= SOILING_CONFIG.CLEAN_SOON_LOSS_THRESHOLD) {
        type = 'CLEAN_SOON';
        urgency = 'MEDIUM';
      } else {
        type = 'NO_ACTION';
        urgency = 'NONE';
      }
    }

    // 4. Generate structured explanation
    const explanation = ExplainabilityEngine.generateExplanation(
      type,
      efficiencyLoss,
      factors,
      installation.name
    );

    // 5. Calculate estimated daily energy lost in kWh (assuming ~4.5 peak sun hours per day)
    const peakSunHours = 4.5;
    const nominalDailyKwh = (installation.capacityKw || 5) * peakSunHours;
    const estimatedEnergyLostKwhDaily = Number(
      (nominalDailyKwh * (efficiencyLoss / 100)).toFixed(2)
    );

    // Determine recommended target date
    const now = new Date();
    const recommendedDate = new Date(now);
    if (type === 'CLEAN_NOW') {
      recommendedDate.setDate(now.getDate()); // Today
    } else if (type === 'CLEAN_SOON') {
      recommendedDate.setDate(now.getDate() + 3); // In 3 days
    } else if (type === 'WAIT_FOR_RAIN') {
      recommendedDate.setDate(now.getDate() + 2); // When rain arrives
    } else {
      recommendedDate.setDate(now.getDate() + 14); // 2 weeks check
    }

    return {
      type,
      efficiencyLoss,
      estimatedEfficiency,
      recommendedDate,
      urgency,
      title: explanation.title,
      reason: explanation.reason,
      bulletPoints: explanation.bulletPoints,
      factors,
      estimatedEnergyLostKwhDaily,
    };
  }
}
