import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { prisma } from './utils/prisma.js';

const app = createApp();
const PORT = parseInt(env.PORT, 10) || 5000;

async function startServer() {
  try {
    // Verify database connectivity
    await prisma.$connect();
    logger.info('Connected to database successfully.');

    app.listen(PORT, () => {
      logger.info(`☀ SunTrack Backend API running on http://localhost:${PORT}`);
      logger.info(`Environment: ${env.NODE_ENV}`);
      logger.info(`Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    logger.error('Failed to start SunTrack backend server:', error);
    process.exit(1);
  }
}

startServer();
