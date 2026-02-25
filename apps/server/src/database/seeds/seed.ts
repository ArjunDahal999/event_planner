import type { Knex } from "knex";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import { TAG_CONSTANT } from "../../constant/tag.ts";
import { EVENTS_CONSTANT } from "../../constant/event.ts";

const NUM_USERS = 1000;
const NUM_EVENTS = EVENTS_CONSTANT.length;
const NUM_TAGS = TAG_CONSTANT.length;
const USER_TABLE = "users";
const EVENT_TABLE = "event";
const TAG_TABLE = "tag";
const EVENT_TAG_TABLE = "event_tag";
const RSVP_TABLE = "rsvp";

export async function seed(knex: Knex): Promise<void> {
  // ── Cleanup (reverse FK order) ──────────────────────────────────────────────
  await knex(RSVP_TABLE).del();
  await knex(EVENT_TAG_TABLE).del();
  await knex(TAG_TABLE).del();
  await knex(EVENT_TABLE).del();
  await knex(USER_TABLE).del();

  // ── Users ───────────────────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash("11111111", 10);

  const usersData = Array.from({ length: NUM_USERS }, () => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: hashedPassword,
    is_email_verified: faker.datatype.boolean(),
  }));

  await knex(USER_TABLE).insert(usersData).onConflict("email").ignore();

  // Fetch inserted user IDs
  const users = await knex(USER_TABLE).select("id");
  const userIdList: number[] = users.map((u) => u.id);

  const tagsData = TAG_CONSTANT.slice(0, NUM_TAGS).map((name) => ({
    name,
    color: faker.color.rgb({ format: "hex" }),
  }));

  await knex(TAG_TABLE).insert(tagsData);

  // Fetch inserted tag IDs
  const tags = await knex(TAG_TABLE).select("id");
  const tagIdList: number[] = tags.map((t) => t.id);

  // ── Events ──────────────────────────────────────────────────────────────────
  const eventsData = Array.from({ length: NUM_EVENTS }, () => ({
    title: faker.helpers.arrayElement(EVENTS_CONSTANT),
    description: faker.lorem.paragraph(),
    location: `${faker.location.city()}, ${faker.location.country()}`,
    event_date: faker.date.between({
      from: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365), // last year
      to: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), // next year
    }),
    event_type: faker.helpers.arrayElement(["public", "private"]),
    user_id: faker.helpers.arrayElement(userIdList),
  }));

  await knex(EVENT_TABLE).insert(eventsData);

  // Fetch inserted event IDs
  const events = await knex(EVENT_TABLE).select("id");
  const eventIdList: number[] = events.map((e) => e.id);

  // ── Event Tags ───────────────────────────────────────────────────────────────
  const eventTagSet = new Set<string>();
  const eventTagsData: { event_id: number; tag_id: number }[] = [];

  for (const eventId of eventIdList) {
    // Assign 1-3 unique tags per event
    const numTags = faker.number.int({ min: 1, max: 3 });
    const shuffledTags = faker.helpers
      .shuffle([...tagIdList])
      .slice(0, numTags);

    for (const tagId of shuffledTags) {
      const key = `${eventId}-${tagId}`;
      if (!eventTagSet.has(key)) {
        eventTagSet.add(key);
        eventTagsData.push({ event_id: eventId, tag_id: tagId });
      }
    }
  }

  await knex(EVENT_TAG_TABLE).insert(eventTagsData);

  // ── RSVPs ────────────────────────────────────────────────────────────────────
  const rsvpSet = new Set<string>();
  const rsvpsData: {
    user_id: number;
    event_id: number;
    response: string;
  }[] = [];

  // Each user RSVPs to a random subset of events
  for (const userId of userIdList) {
    for (const eventId of eventIdList) {
      const key = `${userId}-${eventId}`;
      if (!rsvpSet.has(key)) {
        rsvpSet.add(key);
        rsvpsData.push({
          user_id: userId,
          event_id: eventId,
          response: faker.helpers.arrayElement([
            "YES",
            "YES",
            "YES",
            "YES",
            "NO",
            "MAY BE",
          ]),
        });
      }
    }
  }

  await knex(RSVP_TABLE).insert(rsvpsData);

  console.log(`✅ Seeded:`);
  console.log(`   ${userIdList.length} users`);
  console.log(`   ${tagIdList.length} tags`);
  console.log(`   ${eventIdList.length} events`);
  console.log(`   ${eventTagsData.length} event-tag relations`);
  console.log(`   ${rsvpsData.length} RSVPs`);
}
