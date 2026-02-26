import type {
  CreateEventDTO,
  EventFilterDTO,
} from "../../../../packages/shared/src/schemas/event.schema";
import {
  EVENT_TABLE,
  EVENT_TAG_TABLE,
  TAG_TABLE,
  USER_TABLE,
} from "../database/constants";
import { getEventWithTagsQuery } from "../database/data-access/get-event-with.query";
import db from "../database/db";
import type { ITags, IEvent, IEventTag, IUser } from "../database/types";
import { generateRandomColor } from "../helper/random-color-generator";

export const eventService = () => {
  return Object.freeze({
    createEventWithTags,
    getAllUserEvents,
    getAllEvents,
    getEventById,
    deleteEvent,
    updateEvent,
  });
};

async function createEventWithTags({
  userId,
  eventData,
}: {
  userId: number;
  eventData: CreateEventDTO;
}) {
  try {
    const { tags, ...eventDetails } = eventData;

    await db.transaction(async (trx) => {
      const [eventId] = await trx<IEvent>(EVENT_TABLE).insert({
        ...eventDetails,
        user_id: userId,
      });

      if (tags.length <= 0) return;

      // payload for tags table
      const tagsPayload = tags.map((tag) => ({
        name: tag,
        color: generateRandomColor(),
      }));

      // if existing name is sent, ignore that row
      await trx<ITags>(TAG_TABLE)
        .insert(tagsPayload)
        .onConflict("name")
        .ignore();

      // we need to refetch all tags id that were recently created
      const createdTags = await trx<ITags>(TAG_TABLE)
        .select("id", "name")
        .whereIn("name", tags);

      // now we insert into event_tag table
      await trx<IEventTag>(EVENT_TAG_TABLE).insert(
        createdTags.map((t) => ({
          event_id: eventId,
          tag_id: t.id,
        })),
      );
    });
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to create event",
    );
  }
}

async function getAllUserEvents({ userId }: { userId: number }) {
  try {
    const events = await getEventWithTagsQuery({
      where: `${USER_TABLE}.id = ${userId} `,
    });
    return events;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to retrieve events",
    );
  }
}

async function getAllEvents({ filters }: { filters: EventFilterDTO }) {
  try {
    const whereBuilder = [];
    if (filters.eventType) {
      whereBuilder.push(`${EVENT_TABLE}.event_type = '${filters.eventType}'`);
    }
    if (filters.location) {
      whereBuilder.push(
        `${EVENT_TABLE}.location LIKE '%${filters.location}%' `,
      );
    }
    if (filters.title) {
      whereBuilder.push(`${EVENT_TABLE}.title LIKE '%${filters.title}%' `);
    }

    if (filters.description) {
      whereBuilder.push(
        `${EVENT_TABLE}.description LIKE '%${filters.description}%' `,
      );
    }
    if (filters.eventTimeLine) {
      const now = new Date();
      const formattedDate = now.toISOString().slice(0, 19).replace("T", " "); // YYYY-MM-DD HH:mm:ss
      if (filters.eventTimeLine === "upcoming") {
        whereBuilder.push(`${EVENT_TABLE}.event_date >= '${formattedDate}'`);
      } else {
        whereBuilder.push(`${EVENT_TABLE}.event_date < '${formattedDate}'`);
      }
    }

    const whereClause =
      whereBuilder.length > 0 ? whereBuilder.join(" AND ") : "1=1";

    const tags = filters.tags?.split(",");
    const tagsParameters = tags?.map(() => "?").join(",");

    const events = await getEventWithTagsQuery({
      where: whereClause,
      page: filters.page,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
      limit: filters.limit,
      having: `SUM(${TAG_TABLE}.name IN (${tagsParameters}))>0`,
      havingBindings: tags,
    });
    return events;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to retrieve events",
    );
  }
}

async function getEventById({ eventId }: { eventId: number }) {
  try {
    const event = await getEventWithTagsQuery({
      where: `${EVENT_TABLE}.id =${eventId}`,
    });
    return event;
  } catch (error: any) {
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      throw new Error("Event or user does not exist.");
    }
    throw new Error(
      error instanceof Error ? error.message : "Failed to retrieve event",
    );
  }
}

async function deleteEvent({
  eventId,
  userId,
}: {
  eventId: number;
  userId: number;
}) {
  try {
    const deletedCount = await db<IEvent>(EVENT_TABLE)
      .where({ id: eventId, user_id: userId })
      .del();
  } catch (error: any) {
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      throw new Error("Event or user does not exist.");
    }
    throw new Error(
      error instanceof Error ? error.message : "Failed to delete event",
    );
  }
}

async function updateEvent({
  eventId,
  userId,
  eventData,
}: {
  eventId: number;
  userId: number;
  eventData: CreateEventDTO;
}) {
  try {
    const { tags, ...rest } = eventData;

    await db.transaction(async (trx) => {
      const updatedCount = await trx<IEvent>(EVENT_TABLE)
        .where({ id: eventId, user_id: userId })
        .update(rest);

      if (updatedCount === 0) {
        throw new Error(
          "Event not found or you do not have permission to update it.",
        );
      }

      // remove all existing tag associations for this event
      await trx.raw(`DELETE FROM ${EVENT_TAG_TABLE} WHERE event_id = ?`, [
        eventId,
      ]);

      // create the tags if they are new
      const tagsPayload = tags.map((tag) => ({
        name: tag,
        color: generateRandomColor(),
      }));

      // if existing name is sent, ignore that row
      await trx<ITags>(TAG_TABLE)
        .insert(tagsPayload)
        .onConflict("name")
        .ignore();

      // refetch all tag IDs by name
      const createdTags = await trx<ITags>(TAG_TABLE)
        .select("id", "name")
        .whereIn("name", tags);

      // insert new event-tag associations
      await trx<IEventTag>(EVENT_TAG_TABLE).insert(
        createdTags.map((t) => ({
          event_id: eventId,
          tag_id: t.id,
        })),
      );
    });
  } catch (error: any) {
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      throw new Error("Event or user does not exist.");
    }
    throw new Error(
      error instanceof Error ? error.message : "Failed to update event",
    );
  }
}
