import { Router } from 'express';
import {
  InstallationController,
  createInstallationSchema,
  updateInstallationSchema,
} from '../controllers/installationController.js';
import { WeatherController } from '../controllers/weatherController.js';
import { RecommendationController } from '../controllers/recommendationController.js';
import {
  CleaningController,
  createCleaningSchema,
} from '../controllers/cleaningController.js';
import { AnalyticsController } from '../controllers/analyticsController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireInstallationOwner } from '../middleware/ownershipMiddleware.js';
import { validateBody } from '../middleware/validateRequest.js';

const router = Router();

// Apply global auth requirement
router.use(requireAuth);

// Top level installation CRUD
router.get('/', InstallationController.list);
router.post('/', validateBody(createInstallationSchema), InstallationController.create);

// Nested routes with ownership validation
router.get('/:id', requireInstallationOwner, InstallationController.getById);
router.put('/:id', requireInstallationOwner, validateBody(updateInstallationSchema), InstallationController.update);
router.delete('/:id', requireInstallationOwner, InstallationController.delete);

// Weather & Forecast
router.get('/:id/weather', requireInstallationOwner, WeatherController.getWeather);

// Live Recommendation
router.get('/:id/recommendation', requireInstallationOwner, RecommendationController.getRecommendation);

// Cleaning History
router.get('/:id/cleanings', requireInstallationOwner, CleaningController.list);
router.post('/:id/cleanings', requireInstallationOwner, validateBody(createCleaningSchema), CleaningController.create);

// Analytics
router.get('/:id/analytics/efficiency', requireInstallationOwner, AnalyticsController.getEfficiencyTimeline);
router.get('/:id/analytics/summary', requireInstallationOwner, AnalyticsController.getSummaryStatistics);

export default router;
