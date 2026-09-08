import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { RecommendationResult } from '../engine/types.js';
import { generateRecommendationEmailHtml } from '../templates/emailTemplates.js';
import { prisma } from '../utils/prisma.js';
import { logger } from '../utils/logger.js';
import { SOILING_CONFIG } from '../config/constants.js';

export class EmailService {
  private static transporter: nodemailer.Transporter | null = null;

  private static async getTransporter(): Promise<nodemailer.Transporter> {
    if (this.transporter) return this.transporter;

    if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS) {
      this.transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: parseInt(env.SMTP_PORT, 10),
        secure: parseInt(env.SMTP_PORT, 10) === 465,
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        },
      });
    } else {
      // In development / demo mode, create an Ethereal test transport
      const testAccount = await nodemailer.createTestAccount();
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      logger.info(`Initialized Ethereal dev email transport for testing (${testAccount.user})`);
    }

    return this.transporter;
  }

  public static async evaluateAndSendAlert(
    userEmail: string,
    userName: string,
    installationName: string,
    recommendation: RecommendationResult,
    preference: {
      id: string;
      cleaningAlerts: boolean;
      rainAlerts: boolean;
      lastNotifiedAt: Date | null;
    }
  ): Promise<boolean> {
    // 1. Check if recommendation triggers an alert
    const isCleaningTrigger =
      preference.cleaningAlerts &&
      (recommendation.type === 'CLEAN_NOW' || recommendation.type === 'CLEAN_SOON');
    const isRainTrigger = preference.rainAlerts && recommendation.type === 'WAIT_FOR_RAIN';

    if (!isCleaningTrigger && !isRainTrigger) {
      return false;
    }

    // 2. Throttle check (at most 1 email every 48 hours unless urgent)
    if (preference.lastNotifiedAt && recommendation.type !== 'CLEAN_NOW') {
      const hoursSinceLast =
        (Date.now() - new Date(preference.lastNotifiedAt).getTime()) / (1000 * 60 * 60);
      if (hoursSinceLast < SOILING_CONFIG.EMAIL_THROTTLE_HOURS) {
        logger.info(
          `Skipping email to ${userEmail} (throttled, last sent ${hoursSinceLast.toFixed(1)}h ago)`
        );
        return false;
      }
    }

    // 3. Dispatch Email
    try {
      const transporter = await this.getTransporter();
      const htmlContent = generateRecommendationEmailHtml(
        userName,
        installationName,
        recommendation
      );

      const info = await transporter.sendMail({
        from: env.SMTP_FROM,
        to: userEmail,
        subject: `☀ SunTrack: ${recommendation.title}`,
        html: htmlContent,
      });

      // Update lastNotifiedAt
      await prisma.notificationPreference.update({
        where: { id: preference.id },
        data: { lastNotifiedAt: new Date() },
      });

      logger.info(`Alert email successfully sent to ${userEmail}: ${info.messageId}`);
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        logger.info(`Email preview URL: ${previewUrl}`);
      }

      return true;
    } catch (error) {
      logger.error('Failed to send notification email:', error);
      return false;
    }
  }
}
