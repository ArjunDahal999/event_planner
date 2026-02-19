import type { Knex } from "knex";
import { env } from "../libs/validate-env.ts";

const defaultConnection = {
  host: env.MYSQL_HOST,
  port: env.MYSQL_PORT,
  user: env.MYSQL_USER,
  password: env.MYSQL_PASSWORD,
  database: env.MYSQL_DATABASE,
};

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "mysql2",
    connection: defaultConnection,
    migrations: { directory: "./migrations" },
    seeds: { directory: "./seeds" },
    debug: false,
  },
};

export default config;
