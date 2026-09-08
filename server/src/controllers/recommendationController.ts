import { Response, NextFunction } from 'express';
import { RecommendationService } from '../services/recommendationService.js';
import { AuthenticatedRequest, ApiResponse } from '../types/index.js';
import { DEMO_SCENARIOS, getDemoRecommendation } from '../engine/DemoScenarios.js';

export class RecommendationController {
  public static async getRecommendation(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const scenarioId =
        (req.query.scenario as string) || (req.headers['x-demo-scenario'] as string);

      // Check if viva demo scenario requested
      if (scenarioId && DEMO_SCENARIOS[scenarioId]) {
        const demoResult = getDemoRecommendation(scenarioId);
        const scenarioMeta = DEMO_SCENARIOS[scenarioId];

        const response: ApiResponse = {
          success: true,
          data: demoResult,
          message: `Viva Demo Mode Active: ${scenarioMeta.name}`,
          meta: {
            timestamp: new Date().toISOString(),
            scenario: scenarioId,
          },
        };
        return res.status(200).json(response);
      }

      const installationId = req.params.id as string;
      const forceRefresh = req.query.refresh === 'true';

      const recommendation = await RecommendationService.getRecommendation(
        installationId,
        forceRefresh
      );

      const response: ApiResponse = {
        success: true,
        data: recommendation,
        meta: {
          timestamp: new Date().toISOString(),
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  public static async listDemoScenarios(_req: AuthenticatedRequest, res: Response) {
    const list = Object.values(DEMO_SCENARIOS).map((s) => ({
      id: s.id,
      name: s.name,
      shortDesc: s.shortDesc,
      description: s.description,
    }));

    const response: ApiResponse = {
      success: true,
      data: list,
    };
    res.status(200).json(response);
  }
}
