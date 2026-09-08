import { Router } from 'express';
import authRoutes from './authRoutes.js';
import installationRoutes from './installationRoutes.js';
import cleaningRoutes from './cleaningRoutes.js';
import demoRoutes from './demoRoutes.js';

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/installations', installationRoutes);
apiRouter.use('/cleanings', cleaningRoutes);
apiRouter.use('/demo', demoRoutes);

apiRouter.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'SunTrack API is healthy and operational',
    timestamp: new Date().toISOString(),
  });
});

export default apiRouter;
