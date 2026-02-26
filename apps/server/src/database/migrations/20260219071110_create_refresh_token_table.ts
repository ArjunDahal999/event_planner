import type { Knex } from "knex";

export const REFRESH_TOKEN_TABLE = "refresh_tokens";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(REFRESH_TOKEN_TABLE, (table) => {
    table.increments("id").primary();
    table
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table.string("token").notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("refresh_tokens");
}
