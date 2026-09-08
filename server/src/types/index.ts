import { Request } from 'express';

export interface UserPayload {
  id: string;
  email: string;
  name: string;
}

export interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code?: string;
    message: string;
    details?: unknown[];
  };
  meta?: {
    timestamp: string;
    cached?: boolean;
    scenario?: string;
  };
}
