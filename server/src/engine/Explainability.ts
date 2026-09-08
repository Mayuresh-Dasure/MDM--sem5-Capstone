import { RecommendationType, SoilingCalculationFactors } from './types.js';

export class ExplainabilityEngine {
  /**
   * Generates clear, human-readable justification and bullet points for the recommendation.
   */
  public static generateExplanation(
    type: RecommendationType,
    efficiencyLoss: number,
    factors: SoilingCalculationFactors,
    installationName: string
  ): { title: string; reason: string; bulletPoints: string[] } {
    const bulletPoints: string[] = [];

    // 1. Dry days context
    if (factors.consecutiveDryDays > 0) {
      bulletPoints.push(
        `${factors.consecutiveDryDays} consecutive dry days recorded since last cleaning/rain.`
      );
    } else {
      bulletPoints.push(`Panels were recently cleaned (0 dry days).`);
    }

    // 2. Efficiency loss impact
    bulletPoints.push(
      `Estimated efficiency loss is ${efficiencyLoss}% (Current operational health: ${(100 - efficiencyLoss).toFixed(1)}%).`
    );

    // 3. Weather lookahead
    const rainProbPercent = Math.round(factors.upcomingRainProbability * 100);
    if (rainProbPercent >= 50 && factors.upcomingRainVolumeMm >= 3.0) {
      bulletPoints.push(
        `Natural rain washing expected: ${rainProbPercent}% precipitation probability with ~${factors.upcomingRainVolumeMm} mm rain within ${factors.rainLookaheadHours} hours.`
      );
    } else {
      bulletPoints.push(
        `Dry forecast ahead: Only ${rainProbPercent}% rain probability (${factors.upcomingRainVolumeMm} mm) over the next ${factors.rainLookaheadHours} hours.`
      );
    }

    // 4. Environmental conditions
    if (factors.averageWindSpeed > 7.0) {
      bulletPoints.push(`High wind speeds (${factors.averageWindSpeed} m/s) accelerating airborne dust deposition.`);
    } else if (factors.averageHumidity > 80) {
      bulletPoints.push(`High morning humidity (${factors.averageHumidity}%) increasing particulate adhesion.`);
    }

    let title = '';
    let reason = '';

    switch (type) {
      case 'CLEAN_NOW':
        title = `Urgent Cleaning Recommended for ${installationName}`;
        reason = `Significant soiling accumulation is causing an estimated ${efficiencyLoss}% efficiency loss with no meaningful rain forecasted for the next 3 days. Cleaning today will immediately restore peak generation capacity.`;
        break;

      case 'CLEAN_SOON':
        title = `Schedule Cleaning for ${installationName}`;
        reason = `Moderate soiling (${efficiencyLoss}% loss) has accumulated over ${factors.consecutiveDryDays} dry days. Weather conditions remain dry. Plan a cleaning within the next 2-4 days to prevent further yield degradation.`;
        break;

      case 'WAIT_FOR_RAIN':
        title = `Wait for Upcoming Rain`;
        reason = `Rain is forecasted within ${factors.rainLookaheadHours} hours (${rainProbPercent}% probability, ~${factors.upcomingRainVolumeMm} mm). Natural precipitation will wash accumulated dust off the panels, saving you water and labor costs.`;
        break;

      case 'NO_ACTION':
        title = `Optimal Condition — No Cleaning Needed`;
        reason = `Panels are operating near peak capacity with minimal soiling (${efficiencyLoss}% loss). No maintenance action is necessary at this time.`;
        break;
    }

    return { title, reason, bulletPoints };
  }
}
