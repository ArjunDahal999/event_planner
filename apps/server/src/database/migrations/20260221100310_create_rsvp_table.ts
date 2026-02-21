import type { Knex } from "knex";
import { EVENT_TABLE, RSVP_TABLE, USER_TABLE } from "../constants.ts";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(RSVP_TABLE, (table) => {
    table.increments("id").primary();
    table.integer("user_id").unsigned().notNullable().unique();
    table.integer("event_id").unsigned().notNullable().unique().index();
    table.enum("response", ["YES", "NO", "MAY BE"]).index();
    table.foreign("event_id").references("id").inTable(EVENT_TABLE);
    table.foreign("user_id").references("id").inTable(USER_TABLE);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(RSVP_TABLE);
}
