import type { Knex } from "knex";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

const config: Knex.Config = {
  client: "mysql2",
  connection: {
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT) || 3306,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  },
  migrations: {
    directory: "./migrations",
    extension: "ts",
    loadExtensions: [".ts"],
  },
  seeds: {
    directory: "./seeds",
    extension: "ts",
    loadExtensions: [".ts"],
  },
};

export default config;
