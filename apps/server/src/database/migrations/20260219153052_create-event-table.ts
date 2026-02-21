import type { Knex } from "knex";
import { EVENT_TABLE, USER_TABLE } from "../constants.ts";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(EVENT_TABLE, (table) => {
    table.increments("id").primary();
    table.string("title").notNullable();
    table.string("description").notNullable();
    table.string("location").notNullable();
    table.timestamp("event_date").index();
    table
      .enum("event_type", ["public", "private"])
      .notNullable()
      .defaultTo("public")
      .index();
    table
      .integer("user_id")
      .notNullable()
      .unsigned()
      .references("id")
      .inTable(USER_TABLE)
      .index();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(EVENT_TABLE);
}
