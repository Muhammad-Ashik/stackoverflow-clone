import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from file only in development
// In production (Render), environment variables are set directly
if (process.env.NODE_ENV !== 'production') {
  const envFile = process.env.NODE_ENV === 'staging' ? 'prod.env' : 'dev.env';
  dotenv.config({ path: path.join(__dirname, '../../', envFile) });
}

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

const requiredEnvVars = ['JWT_SECRET'];

// In production, we need either DB_URL or individual DB credentials
const requiredDBVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB'];

function validateEnv(): EnvConfig {
  const isProduction = process.env.NODE_ENV === 'production';

  // Check required vars
  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName],
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`,
    );
  }

  // Check DB configuration
  const hasDbUrl = !!process.env.DB_URL;
  const hasIndividualDbConfig = requiredDBVars.every(
    (varName) => !!process.env[varName],
  );

  if (!hasDbUrl && !hasIndividualDbConfig) {
    const missingDbVars = requiredDBVars.filter(
      (varName) => !process.env[varName],
    );
    throw new Error(
      `Missing database configuration. Either provide DB_URL or all of: ${missingDbVars.join(', ')}`,
    );
  }

  // Log configuration (without sensitive data) in production for debugging
  if (isProduction) {
    console.log('Environment Configuration:');
    console.log('- NODE_ENV:', process.env.NODE_ENV);
    console.log('- Using DB_URL:', hasDbUrl ? '✓ Yes' : '✗ No');
    console.log(
      '- Using individual DB config:',
      hasIndividualDbConfig ? '✓ Yes' : '✗ No',
    );
    console.log(
      '- JWT_SECRET:',
      process.env.JWT_SECRET ? '✓ Set' : '✗ Not set',
    );
  }

  return {
    NODE_ENV: process.env.NODE_ENV || 'development',
    BACKEND_PORT: Number(process.env.BACKEND_PORT) || 4000,
    DB_HOST: process.env.DB_HOST || '',
    DB_PORT: Number(process.env.DB_PORT) || 5432,
    DB_USER: process.env.DB_USER || '',
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB: process.env.DB || '',
    DB_URL: process.env.DB_URL || process.env.DATABASE_URL, // Support both DB_URL and DATABASE_URL
    JWT_SECRET: process.env.JWT_SECRET!,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    CORS_ORIGIN: process.env.CORS_ORIGIN,
  };
}

export const envConfig = validateEnv();
