import Knex from "knex";
import config from "./knexfile.ts";

const environment = (process.env.NODE_ENV ||
  "development") as keyof typeof config;

const db = Knex(config[environment]);
export default db;
