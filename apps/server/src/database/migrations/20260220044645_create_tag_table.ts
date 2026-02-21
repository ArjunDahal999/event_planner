import type { Knex } from "knex";
import { TAG_TABLE } from "../constants.ts";

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
