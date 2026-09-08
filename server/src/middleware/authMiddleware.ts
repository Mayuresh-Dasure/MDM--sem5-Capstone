import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import { AuthenticatedRequest, UserPayload } from '../types/index.js';

export const requireAuth = (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw AppError.unauthorized('No authentication token provided');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw AppError.unauthorized('Authentication token format is invalid');
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as UserPayload;
    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
    };

    next();
  } catch (err: unknown) {
    if (err instanceof jwt.JsonWebTokenError || err instanceof jwt.TokenExpiredError) {
      next(AppError.unauthorized('Authentication token is invalid or expired'));
    } else {
      next(err);
    }
  }
};
