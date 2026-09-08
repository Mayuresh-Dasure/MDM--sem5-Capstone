import { prisma } from '../utils/prisma.js';
import { AppError } from '../utils/AppError.js';

export interface CreateInstallationDTO {
  name: string;
  latitude: number;
  longitude: number;
  locationName: string;
  capacityKw: number;
  panelCount: number;
  panelType?: string;
  tiltDegrees?: number;
  lastCleaningDate?: Date | string;
}

export interface UpdateInstallationDTO {
  name?: string;
  latitude?: number;
  longitude?: number;
  locationName?: string;
  capacityKw?: number;
  panelCount?: number;
  panelType?: string;
  tiltDegrees?: number;
  lastCleaningDate?: Date | string;
}

export class InstallationService {
  public static async listByUser(userId: string) {
    return prisma.solarInstallation.findMany({
      where: { userId },
      include: {
        _count: {
          select: { cleaningRecords: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  public static async getById(id: string) {
    const installation = await prisma.solarInstallation.findUnique({
      where: { id },
      include: {
        cleaningRecords: {
          orderBy: { cleanedAt: 'desc' },
          take: 5,
        },
        recommendations: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!installation) {
      throw AppError.notFound('Installation not found');
    }

    return installation;
  }

  public static async create(userId: string, data: CreateInstallationDTO) {
    return prisma.solarInstallation.create({
      data: {
        userId,
        name: data.name.trim(),
        latitude: data.latitude,
        longitude: data.longitude,
        locationName: data.locationName.trim(),
        capacityKw: data.capacityKw,
        panelCount: data.panelCount,
        panelType: data.panelType || 'MONOCRYSTALLINE',
        tiltDegrees: data.tiltDegrees ?? 25.0,
        lastCleaningDate: data.lastCleaningDate ? new Date(data.lastCleaningDate) : new Date(),
      },
    });
  }

  public static async update(id: string, data: UpdateInstallationDTO) {
    const updatePayload: Record<string, unknown> = { ...data };
    if (data.lastCleaningDate) {
      updatePayload.lastCleaningDate = new Date(data.lastCleaningDate);
    }

    return prisma.solarInstallation.update({
      where: { id },
      data: updatePayload,
    });
  }

  public static async delete(id: string) {
    return prisma.solarInstallation.delete({
      where: { id },
    });
  }
}
