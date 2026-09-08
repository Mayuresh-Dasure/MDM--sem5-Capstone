import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from '../utils/AppError.js';

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        next(AppError.badRequest('Validation failed for request parameters', errorMessages));
      } else {
        next(error);
      }
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        next(AppError.badRequest('Validation failed for query parameters', errorMessages));
      } else {
        next(error);
      }
    }
  };
};
