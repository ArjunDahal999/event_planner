import type { Knex } from "knex";
import { USER_ACTIVATION_TABLE } from "../constants.ts";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(USER_ACTIVATION_TABLE, (table) => {
    table.increments("id").primary();
    table
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.string("activation_token").notNullable().unique();
    table.timestamp("expires_at").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(USER_ACTIVATION_TABLE);
}
