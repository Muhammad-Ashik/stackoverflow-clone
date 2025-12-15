import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
const envFile =
  process.env.NODE_ENV === 'production'
    ? '.env'
    : process.env.NODE_ENV === 'staging'
      ? 'prod.env'
      : 'dev.env';

dotenv.config({ path: path.join(__dirname, '../../', envFile) });

interface EnvConfig {
  NODE_ENV: string;
  BACKEND_PORT: number;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB: string;
  DB_URL?: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN?: string;
  CORS_ORIGIN?: string;
}

const requiredEnvVars = [
  'DB_HOST',
  'DB_USER',
  'DB_PASSWORD',
  'DB',
  'JWT_SECRET',
];

function validateEnv(): EnvConfig {
  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName],
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`,
    );
  }

  return {
    NODE_ENV: process.env.NODE_ENV || 'development',
    BACKEND_PORT: Number(process.env.BACKEND_PORT) || 4000,
    DB_HOST: process.env.DB_HOST!,
    DB_PORT: Number(process.env.DB_PORT) || 5432,
    DB_USER: process.env.DB_USER!,
    DB_PASSWORD: process.env.DB_PASSWORD!,
    DB: process.env.DB!,
    DB_URL: process.env.DB_URL,
    JWT_SECRET: process.env.JWT_SECRET!,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    CORS_ORIGIN: process.env.CORS_ORIGIN,
  };
}

export const envConfig = validateEnv();
