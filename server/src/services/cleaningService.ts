import { prisma } from '../utils/prisma.js';
import { AppError } from '../utils/AppError.js';

export interface CreateCleaningRecordDTO {
  cleanedAt: Date | string;
  efficiencyBefore?: number;
  efficiencyAfter?: number;
  cost?: number;
  notes?: string;
}

export interface UpdateCleaningRecordDTO {
  cleanedAt?: Date | string;
  efficiencyBefore?: number;
  efficiencyAfter?: number;
  cost?: number;
  notes?: string;
}

export class CleaningService {
  public static async listByInstallation(installationId: string) {
    return prisma.cleaningRecord.findMany({
      where: { installationId },
      orderBy: { cleanedAt: 'desc' },
    });
  }

  public static async create(installationId: string, data: CreateCleaningRecordDTO) {
    const cleanedDate = new Date(data.cleanedAt || new Date());

    // Prevent future dates
    if (cleanedDate.getTime() > Date.now() + 60000) {
      throw AppError.badRequest('Cleaning date cannot be set in the future');
    }

    // 1. Create cleaning record
    const record = await prisma.cleaningRecord.create({
      data: {
        installationId,
        cleanedAt: cleanedDate,
        efficiencyBefore: data.efficiencyBefore,
        efficiencyAfter: data.efficiencyAfter ?? 100.0,
        cost: data.cost,
        notes: data.notes?.trim(),
      },
    });

    // 2. Reset baseline: update installation lastCleaningDate
    const installation = await prisma.solarInstallation.findUnique({
      where: { id: installationId },
    });

    if (installation && cleanedDate.getTime() > new Date(installation.lastCleaningDate).getTime()) {
      await prisma.solarInstallation.update({
        where: { id: installationId },
        data: { lastCleaningDate: cleanedDate },
      });
    }

    return record;
  }

  public static async update(recordId: string, data: UpdateCleaningRecordDTO) {
    const record = await prisma.cleaningRecord.findUnique({
      where: { id: recordId },
    });

    if (!record) {
      throw AppError.notFound('Cleaning record not found');
    }

    const updated = await prisma.cleaningRecord.update({
      where: { id: recordId },
      data: {
        cleanedAt: data.cleanedAt ? new Date(data.cleanedAt) : undefined,
        efficiencyBefore: data.efficiencyBefore,
        efficiencyAfter: data.efficiencyAfter,
        cost: data.cost,
        notes: data.notes?.trim(),
      },
    });

    return updated;
  }

  public static async delete(recordId: string) {
    const record = await prisma.cleaningRecord.findUnique({
      where: { id: recordId },
    });

    if (!record) {
      throw AppError.notFound('Cleaning record not found');
    }

    await prisma.cleaningRecord.delete({
      where: { id: recordId },
    });

    // Recalculate latest cleaning date for installation
    const latest = await prisma.cleaningRecord.findFirst({
      where: { installationId: record.installationId },
      orderBy: { cleanedAt: 'desc' },
    });

    if (latest) {
      await prisma.solarInstallation.update({
        where: { id: record.installationId },
        data: { lastCleaningDate: latest.cleanedAt },
      });
    }

    return { message: 'Cleaning record deleted' };
  }
}
