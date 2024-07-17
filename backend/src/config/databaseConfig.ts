import { DataSource } from 'typeorm';

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB, DB_URL, NODE_ENV } =
  process.env;

const AppDataSource = new DataSource({
  type: 'postgres',
  url: NODE_ENV === 'production' ? DB_URL : undefined,
  host: DB_HOST,
  port: Number(DB_PORT) || 5432,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB,
  synchronize: false,
  // synchronize: process.env.NODE_ENV === 'development',
  logging: true,
  migrations: ['./src/migrations/**/*.ts'],
  entities: ['./src/entities/**/*.ts'],
});

export default AppDataSource;
