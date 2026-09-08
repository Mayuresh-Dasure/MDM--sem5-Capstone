import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthService } from '../services/authService.js';
import { AuthenticatedRequest, ApiResponse } from '../types/index.js';

export const registerSchema = z.object({
  name: z.string().min(2, 'नाम कम से कम 2 अक्षर का होना चाहिए'),
  email: z.string().email('कृपया एक वैध ईमेल पता दर्ज करें'),
  password: z.string().min(8, 'पासवर्ड कम से कम 8 अक्षर का होना चाहिए'),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'कृपया 10 अंकों का वैध भारतीय मोबाइल नंबर दर्ज करें')
    .optional()
    .or(z.literal('')),
  state: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(1, 'Password is required'),
});

export const preferencesSchema = z.object({
  cleaningAlerts: z.boolean().optional(),
  rainAlerts: z.boolean().optional(),
  weeklySummary: z.boolean().optional(),
  emailEnabled: z.boolean().optional(),
});


export class AuthController {
  public static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.register(req.body);
      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Account successfully registered',
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  public static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.login(req.body);
      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Login successful',
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  public static async logout(_req: Request, res: Response) {
    const response: ApiResponse = {
      success: true,
      message: 'Logged out successfully',
    };
    res.status(200).json(response);
  }

  public static async getMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = await AuthService.getProfile(req.user!.id);
      const response: ApiResponse = {
        success: true,
        data: user,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  public static async updatePreferences(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const updated = await AuthService.updateNotificationPreferences(req.user!.id, req.body);
      const response: ApiResponse = {
        success: true,
        data: updated,
        message: 'Notification preferences updated',
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
