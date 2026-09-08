import { Router } from 'express';
import { RecommendationController } from '../controllers/recommendationController.js';

const router = Router();

router.get('/scenarios', RecommendationController.listDemoScenarios);
router.get('/evaluate/:id', RecommendationController.getRecommendation);

export default router;
