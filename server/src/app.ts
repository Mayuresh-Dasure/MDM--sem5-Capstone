import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import apiRouter from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { SOILING_CONFIG } from './config/constants.js';

export const createApp = () => {
  const app = express();

  // Security headers
  app.use(helmet());

  // CORS configuration
  app.use(
    cors({
      origin: true, // Allow frontend dev server and production origins
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Demo-Scenario'],
    })
  );

  // Request logger
  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }

  // Body parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // General Rate Limiting
  const generalLimiter = rateLimit({
    windowMs: SOILING_CONFIG.API_RATE_LIMIT_WINDOW_MS,
    max: SOILING_CONFIG.API_RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      error: { message: 'Too many requests. Please slow down.' },
    },
  });

  // Auth Rate Limiting
  const authLimiter = rateLimit({
    windowMs: SOILING_CONFIG.AUTH_RATE_LIMIT_WINDOW_MS,
    max: SOILING_CONFIG.AUTH_RATE_LIMIT_MAX,
    message: {
      success: false,
      error: { message: 'Too many authentication attempts. Please try again later.' },
    },
  });

  app.use('/api/', generalLimiter);
  app.use('/api/auth/', authLimiter);

  // Mount API Router
  app.use('/api', apiRouter);

  // 404 Catch-all
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      error: { message: `Endpoint ${req.originalUrl} does not exist on this server.` },
    });
  });

  // Centralized Error Handler
  app.use(errorHandler);

  return app;
};
