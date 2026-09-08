import { Router } from 'express';
import {
  CleaningController,
  updateCleaningSchema,
} from '../controllers/cleaningController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validateRequest.js';

const router = Router();

router.use(requireAuth);

router.put('/:recordId', validateBody(updateCleaningSchema), CleaningController.update);
router.delete('/:recordId', CleaningController.delete);

export default router;
