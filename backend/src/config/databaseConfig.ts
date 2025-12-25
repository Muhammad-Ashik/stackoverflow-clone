import { DataSource } from 'typeorm'
import { DATABASE } from '../constants'
import { isDevelopment, isProduction } from '../utils'

const poolConfig = isProduction()
  ? DATABASE.CONNECTION_POOL.PRODUCTION
  : DATABASE.CONNECTION_POOL.DEVELOPMENT

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: isDevelopment(),
  entities: isProduction()
    ? ['dist/entities/**/*.js']
    : ['src/entities/**/*.ts'],
  migrations: isProduction()
    ? ['dist/migrations/**/*.js']
    : ['src/migrations/**/*.ts'],
  ssl: isProduction() ? { rejectUnauthorized: false } : false,
  extra: {
    max: poolConfig.MAX,
    min: poolConfig.MIN,
    idleTimeoutMillis: DATABASE.CONNECTION_POOL.IDLE_TIMEOUT,
    connectionTimeoutMillis: DATABASE.CONNECTION_POOL.CONNECTION_TIMEOUT,
    maxIdleTime: DATABASE.CONNECTION_POOL.MAX_IDLE_TIME,
  },
})

export default AppDataSource
