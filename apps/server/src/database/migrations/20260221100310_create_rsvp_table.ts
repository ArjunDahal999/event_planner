import type { Knex } from "knex";

const USER_TABLE = "users";
const RSVP_TABLE = "rsvp";
const EVENT_TABLE = "event";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(RSVP_TABLE, (table) => {
    table.increments("id").primary();
    table.integer("user_id").unsigned().notNullable();
    table.integer("event_id").unsigned().notNullable();
    table.enum("response", ["YES", "NO", "MAY BE"]).index();
    table
      .foreign("event_id")
      .references("id")
      .inTable(EVENT_TABLE)
      .onDelete("CASCADE");
    table
      .foreign("user_id")
      .references("id")
      .inTable(USER_TABLE)
      .onDelete("CASCADE");
    table.unique(["user_id", "event_id"]);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(RSVP_TABLE);
}
