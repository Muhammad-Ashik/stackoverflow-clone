import { DataSource } from 'typeorm';
import { envConfig } from './env.config';
import { DATABASE } from '../constants';

const isProduction = envConfig.NODE_ENV === 'production';
const poolConfig = isProduction
  ? DATABASE.CONNECTION_POOL.PRODUCTION
  : DATABASE.CONNECTION_POOL.DEVELOPMENT;

const AppDataSource = new DataSource({
  type: 'postgres',
  url: isProduction && envConfig.DB_URL ? envConfig.DB_URL : undefined,
  host: envConfig.DB_HOST,
  port: envConfig.DB_PORT,
  username: envConfig.DB_USER,
  password: envConfig.DB_PASSWORD,
  database: envConfig.DB,
  synchronize: false,
  logging: envConfig.NODE_ENV === 'development',
  entities: isProduction ? ['dist/entities/**/*.js'] : ['src/entities/**/*.ts'],
  migrations: isProduction
    ? ['dist/migrations/**/*.js']
    : ['src/migrations/**/*.ts'],
  ssl: isProduction
    ? {
        rejectUnauthorized: false, // Required for Render PostgreSQL
      }
    : false,
  extra: {
    max: poolConfig.MAX,
    min: poolConfig.MIN,
    idleTimeoutMillis: DATABASE.CONNECTION_POOL.IDLE_TIMEOUT,
    connectionTimeoutMillis: DATABASE.CONNECTION_POOL.CONNECTION_TIMEOUT,
    maxIdleTime: DATABASE.CONNECTION_POOL.MAX_IDLE_TIME,
    ...(isProduction && {
      ssl: {
        rejectUnauthorized: false, // Required for Render PostgreSQL
      },
    }),
  },
});

export default AppDataSource;
