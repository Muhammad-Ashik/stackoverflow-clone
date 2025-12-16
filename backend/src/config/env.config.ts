import dotenv from 'dotenv';
import path from 'path';

if (process.env.NODE_ENV !== 'production') {
  const envFile = process.env.NODE_ENV === 'staging' ? 'prod.env' : 'dev.env';
  const result = dotenv.config({
    path: path.join(__dirname, '../../', envFile),
  });

  if (result.error) {
    console.warn('⚠️  Warning: Could not load env file:', envFile);
  } else {
    console.log('✅ Loaded environment from:', envFile);
  }
}

interface EnvConfig {
  NODE_ENV: string;
  PORT: number;
  DATABASE_URL?: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  CORS_ORIGIN?: string;
}

function validateEnv(): EnvConfig {
  const requiredVars = ['JWT_SECRET', 'DATABASE_URL'];
  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`,
    );
  }

  console.log('🔧 Environment Configuration:');
  console.log('  NODE_ENV:', process.env.NODE_ENV || 'development');
  console.log('  PORT:', process.env.PORT || 4000);
  console.log(
    '  DATABASE_URL:',
    process.env.DATABASE_URL ? '✅ Set' : '❌ Not set',
  );

  if (process.env.DATABASE_URL) {
    const urlMatch = process.env.DATABASE_URL.match(/@([^/]+)\//);
    console.log('  DB Host:', urlMatch ? urlMatch[1] : 'Could not parse');
  }

  console.log(
    '  JWT_SECRET:',
    process.env.JWT_SECRET ? '✅ Set' : '❌ Not set',
  );

  return {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: Number(process.env.PORT) || 4000,
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET!,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    CORS_ORIGIN: process.env.CORS_ORIGIN,
  };
}

export const envConfig = validateEnv();
