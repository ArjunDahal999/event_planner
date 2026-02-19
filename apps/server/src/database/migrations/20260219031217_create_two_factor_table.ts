import type { Knex } from "knex";
import { TWO_FACTOR_AUTHENTICATION_TABLE } from "../constants.ts";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TWO_FACTOR_AUTHENTICATION_TABLE, (table) => {
    table.increments("id").primary();
    table
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.string("email").notNullable();
    table.string("secret").notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TWO_FACTOR_AUTHENTICATION_TABLE);
}
