import { Router } from 'express';
import {
  AuthController,
  loginSchema,
  registerSchema,
  preferencesSchema,
} from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validateRequest.js';

const router = Router();

router.post('/register', validateBody(registerSchema), AuthController.register);
router.post('/login', validateBody(loginSchema), AuthController.login);
router.post('/logout', requireAuth, AuthController.logout);
router.get('/me', requireAuth, AuthController.getMe);
router.put('/preferences', requireAuth, validateBody(preferencesSchema), AuthController.updatePreferences);

export default router;
