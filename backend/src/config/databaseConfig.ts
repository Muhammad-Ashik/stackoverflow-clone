import { DataSource } from "typeorm";
const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB,
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB,
  synchronize: true,
  logging: false,
  migrations: ["./src/migrations/**/*.ts"],
  entities: ["./src/entities/**/*.ts"],
});

export default AppDataSource;
