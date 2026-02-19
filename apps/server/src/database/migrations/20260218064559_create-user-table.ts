import type { Knex } from "knex";
import { USER_TABLE } from "../constants.ts";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(USER_TABLE, (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("email").notNullable().unique();
    table.string("password").notNullable();
    table.boolean("is_email_verified").defaultTo(false);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(USER_TABLE);
}
