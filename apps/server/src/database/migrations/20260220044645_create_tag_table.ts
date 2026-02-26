import type { Knex } from "knex";

export const TAG_TABLE = "tag";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TAG_TABLE, (table) => {
    table.increments("id").primary();
    table.string("name").notNullable().unique();
    table.string("color").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TAG_TABLE);
}
