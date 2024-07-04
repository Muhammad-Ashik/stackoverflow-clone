import { DataSource } from "typeorm";
const AppDataSource = new DataSource({
  type: "postgres",
  host: "stackoverflow-db",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "stackoverflow-db",
  synchronize: false,
  logging: false,
  migrations: ["./src/migrations/**/*.ts"],
  entities: ["./src/entities/**/*.ts"],
});

export default AppDataSource;
