export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details: unknown[];

  constructor(message: string, statusCode = 500, details: unknown[] = []) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, details: unknown[] = []) {
    return new AppError(message, 400, details);
  }

  static unauthorized(message = 'Unauthorized access') {
    return new AppError(message, 401);
  }

  static forbidden(message = 'Forbidden access') {
    return new AppError(message, 403);
  }

  static notFound(message = 'Resource not found') {
    return new AppError(message, 404);
  }

  static conflict(message: string) {
    return new AppError(message, 409);
  }

  static internal(message = 'Internal server error') {
    return new AppError(message, 500);
  }
}
