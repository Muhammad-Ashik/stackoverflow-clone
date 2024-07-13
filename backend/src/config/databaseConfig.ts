import { DataSource } from 'typeorm';
const AppDataSource = new DataSource({
  type: 'postgres',
  // add url prop if it is production
  ...(process.env.NODE_ENV === 'production' && {
    url: process.env.DB_URL,
  }),
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
