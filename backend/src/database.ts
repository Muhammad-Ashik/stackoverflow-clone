import { DataSource } from "typeorm";
const AppDataSource = new DataSource({
  type: "postgres",
  host: "db",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "stackoverflow_clone_dev",
  synchronize: true,
  logging: false,
  migrations: ["./src/migrations/**/*.ts"],
  entities: ["./src/entities/**/*.ts"],
});

export default AppDataSource;
