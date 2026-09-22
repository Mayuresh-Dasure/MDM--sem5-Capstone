import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import { UserPayload } from '../types/index.js';

export class AuthService {
  public static async register(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    state?: string;
  }) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existing) {
      throw AppError.conflict('An account with this email address already exists');
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        phone: data.phone?.trim() || null,
        state: data.state?.trim() || null,
        passwordHash,
        notificationPreference: {
          create: {
            cleaningAlerts: true,
            rainAlerts: true,
            weeklySummary: false,
            emailEnabled: true,
          },
        },
      },
      include: {
        notificationPreference: true,
      },
    });

    const token = this.generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        state: user.state,
        notificationPreference: user.notificationPreference,
      },
      token,
    };
  }

  public static async login(data: { email: string; password: string }) {
    const user = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
      include: {
        notificationPreference: true,
      },
    });

    if (!user) {
      throw AppError.unauthorized('Invalid email or password');
    }

    const isValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isValid) {
      throw AppError.unauthorized('Invalid email or password');
    }

    const token = this.generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        state: user.state,
        notificationPreference: user.notificationPreference,
      },
      token,
    };
  }

  public static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        state: true,
        createdAt: true,
        notificationPreference: true,
        installations: {
          select: {
            id: true,
            name: true,
            locationName: true,
            capacityKw: true,
          },
        },
      },
    });

    if (!user) {
      throw AppError.notFound('User profile not found');
    }

    return user;
  }

  public static async updateNotificationPreferences(
    userId: string,
    preferences: {
      cleaningAlerts?: boolean;
      rainAlerts?: boolean;
      weeklySummary?: boolean;
      emailEnabled?: boolean;
    }
  ) {
    return prisma.notificationPreference.upsert({
      where: { userId },
      update: preferences,
      create: {
        userId,
        cleaningAlerts: preferences.cleaningAlerts ?? true,
        rainAlerts: preferences.rainAlerts ?? true,
        weeklySummary: preferences.weeklySummary ?? false,
        emailEnabled: preferences.emailEnabled ?? true,
      },
    });
  }

  private static generateToken(payload: UserPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    });
  }
}
