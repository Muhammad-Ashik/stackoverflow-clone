import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  "stackoverflow_clone_dev",
  "postgres",
  "postgres",
  {
    host: "postgres-db",
    dialect: "postgres",
  }
);

export { sequelize };
