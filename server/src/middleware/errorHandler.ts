import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';
import { logger } from '../utils/logger.js';
import { ApiResponse } from '../types/index.js';

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = 500;
  let message = 'An unexpected internal server error occurred';
  let details: unknown[] = [];

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details || [];
  } else {
    logger.error('Unhandled Server Error:', err);
  }

  const response: ApiResponse = {
    success: false,
    error: {
      message,
      ...(details.length > 0 ? { details } : {}),
    },
    meta: {
      timestamp: new Date().toISOString(),
    },
  };

  res.status(statusCode).json(response);
};
