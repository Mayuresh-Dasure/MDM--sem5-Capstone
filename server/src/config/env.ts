import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().default('file:./dev.db'),
  JWT_SECRET: z.string().default('suntrack_jwt_super_secret_production_key_2026'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  OPENWEATHERMAP_API_KEY: z.string().default('demo_key'),
  CLIENT_URL: z.string().default('http://localhost:5173'),
  SMTP_HOST: z.string().optional().default(''),
  SMTP_PORT: z.string().default('587'),
  SMTP_USER: z.string().optional().default(''),
  SMTP_PASS: z.string().optional().default(''),
  SMTP_FROM: z.string().default('SunTrack Solar <alerts@suntrack.app>'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:', parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;
