import { DataSource } from 'typeorm';
const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DB_URL,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB,
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  migrations: ['./src/migrations/**/*.ts'],
  entities: ['./src/entities/**/*.ts'],
});

export default AppDataSource;
