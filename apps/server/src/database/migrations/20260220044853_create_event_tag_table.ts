import type { Knex } from "knex";
import { EVENT_TAG_TABLE } from "../constants";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(EVENT_TAG_TABLE, (table) => {
    table.increments("id").primary();
    table.integer("event_id").unsigned().notNullable();
    table.integer("tag_id").unsigned().notNullable();

    table
      .foreign("event_id")
      .references("id")
      .inTable("event")
      .onDelete("CASCADE");
    table.foreign("tag_id").references("id").inTable("tag").onDelete("CASCADE");

    table.unique(["event_id", "tag_id"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(EVENT_TAG_TABLE);
}
