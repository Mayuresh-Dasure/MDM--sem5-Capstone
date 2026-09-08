import { Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma.js';
import { AppError } from '../utils/AppError.js';
import { AuthenticatedRequest } from '../types/index.js';

export const requireInstallationOwner = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    const rawId = req.params.installationId || req.params.id;
    const installationId = Array.isArray(rawId) ? rawId[0] : (rawId as string);
    const userId = req.user?.id;

    if (!userId) {
      return next(AppError.unauthorized('User not authenticated'));
    }

    if (!installationId) {
      return next(AppError.badRequest('Installation ID parameter is required'));
    }

    const installation = await prisma.solarInstallation.findUnique({
      where: { id: installationId },
      select: { id: true, userId: true },
    });

    if (!installation) {
      return next(AppError.notFound(`Solar installation not found`));
    }

    if (installation.userId !== userId) {
      return next(
        AppError.forbidden('Access denied: You do not have permission to access this installation')
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};
