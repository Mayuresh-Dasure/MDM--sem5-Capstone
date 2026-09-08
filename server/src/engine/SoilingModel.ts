import { SOILING_CONFIG } from '../config/constants.js';
import {
  InstallationProfile,
  SoilingCalculationFactors,
  SoilingCalculationResult,
  WeatherDataPoint,
} from './types.js';

export class SoilingModel {
  /**
   * Calculate cumulative soiling and efficiency loss based on environmental data and cleaning history.
   */
  public static calculateSoiling(
    installation: InstallationProfile,
    currentWeather: WeatherDataPoint | null,
    forecast: WeatherDataPoint[],
    historicalRainDays: number = 0
  ): SoilingCalculationResult {
    const now = new Date();
    const lastCleaning = new Date(installation.lastCleaningDate);
    
    // Calculate raw days since last cleaning
    const msDiff = Math.max(0, now.getTime() - lastCleaning.getTime());
    const daysSinceCleaning = Math.max(0, Math.floor(msDiff / (1000 * 60 * 60 * 24)));

    // Environmental parameters from forecast / current weather
    const avgWind = currentWeather?.windSpeed ?? 3.5;
    const avgHumidity = currentWeather?.humidity ?? 55;
    const tilt = installation.tiltDegrees ?? 25;

    // Evaluate upcoming rain in the lookahead window (next 72 hours)
    const lookaheadHours = SOILING_CONFIG.RAIN_LOOKAHEAD_HOURS;
    const upcomingPoints = forecast.slice(0, Math.min(forecast.length, Math.ceil(lookaheadHours / 3)));
    
    let upcomingRainVolumeMm = 0;
    let maxUpcomingRainProb = 0;

    for (const point of upcomingPoints) {
      upcomingRainVolumeMm += point.rainfallMm || 0;
      if (point.rainProbability > maxUpcomingRainProb) {
        maxUpcomingRainProb = point.rainProbability;
      }
    }

    // Consecutive dry days calculation: based on days since cleaning minus any historical rain days
    const consecutiveDryDays = Math.max(0, daysSinceCleaning - historicalRainDays);

    // 1. Dry Day Multiplier: M_dry = 1.0 + min(0.5, dryDays * 0.025)
    const dryMultiplier = 1.0 + Math.min(0.5, consecutiveDryDays * SOILING_CONFIG.DRY_DAY_ESCALATION_FACTOR);

    // 2. Wind Multiplier: M_wind
    let windMultiplier = 1.0;
    if (avgWind > SOILING_CONFIG.WIND_HIGH_THRESHOLD_MS) {
      windMultiplier = 1.3; // High dust transport
    } else if (avgWind < SOILING_CONFIG.WIND_LOW_THRESHOLD_MS) {
      windMultiplier = 1.1; // Stagnant particle settling
    }

    // 3. Humidity / Dew Multiplier: M_humidity
    const humidityMultiplier = avgHumidity > SOILING_CONFIG.HUMIDITY_DEW_THRESHOLD_PERCENT ? 1.2 : 1.0;

    // 4. Tilt Multiplier: M_tilt (flatter panels accumulate more dust)
    const tiltMultiplier = 1.0 + Math.max(0, (30 - tilt) / 50);

    // Effective daily accumulation rate
    const baseRate = SOILING_CONFIG.BASE_DAILY_SOILING_RATE;
    const effectiveDailyRate = baseRate * dryMultiplier * windMultiplier * humidityMultiplier * tiltMultiplier;

    // Cumulative raw soiling loss over elapsed dry days
    let cumulativeLoss = daysSinceCleaning * effectiveDailyRate;

    // Natural rain washing reduction if historical rainfall occurred
    if (historicalRainDays > 0) {
      const rainWashCredit = historicalRainDays * 2.5; // Estimated credit per significant rain day
      cumulativeLoss = Math.max(0, cumulativeLoss - rainWashCredit);
    }

    // Optical saturation cap (panels don't lose more than 35% purely to uniform soiling)
    const finalEfficiencyLoss = Math.min(
      SOILING_CONFIG.MAX_SOILING_CAP,
      Math.max(0, Number(cumulativeLoss.toFixed(1)))
    );

    const estimatedEfficiency = Number((100 - finalEfficiencyLoss).toFixed(1));

    const factors: SoilingCalculationFactors = {
      daysSinceCleaning,
      consecutiveDryDays,
      averageWindSpeed: Number(avgWind.toFixed(1)),
      averageHumidity: Math.round(avgHumidity),
      upcomingRainProbability: Number(maxUpcomingRainProb.toFixed(2)),
      upcomingRainVolumeMm: Number(upcomingRainVolumeMm.toFixed(1)),
      rainLookaheadHours: lookaheadHours,
      tiltDegrees: tilt,
      baseAccumulationRate: baseRate,
      effectiveAccumulationRate: Number(effectiveDailyRate.toFixed(2)),
    };

    return {
      efficiencyLoss: finalEfficiencyLoss,
      estimatedEfficiency,
      factors,
    };
  }

  /**
   * Evaluates rainfall natural washing effectiveness factor (0.0 to 0.95).
   */
  public static evaluateRainWash(rainfallMm: number): number {
    if (rainfallMm < SOILING_CONFIG.RAIN_MIN_WASH_THRESHOLD_MM) {
      return 0.0; // Ineffective / mudding
    }
    if (rainfallMm < SOILING_CONFIG.RAIN_PARTIAL_WASH_THRESHOLD_MM) {
      return 0.5 * (rainfallMm / SOILING_CONFIG.RAIN_PARTIAL_WASH_THRESHOLD_MM);
    }
    if (rainfallMm < SOILING_CONFIG.RAIN_FULL_WASH_THRESHOLD_MM) {
      return 0.85;
    }
    return 0.95; // Heavy storm wash
  }
}
