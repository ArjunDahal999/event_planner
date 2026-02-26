import { RSVP_RESPONSE_ENUM } from "@event-planner/shared";
import db from "../database/db";
import type { IRSPV } from "../database/types";
import { RSVP_TABLE } from "../database/constants";
import logger from "../libs/winston";
export const rsvpService = () => {
  return Object.freeze({
    createRsvp,
    updateRsvp,
    deleteRsvp,
    getRsvp,
    rsvpStatsOfAnEvent,
  });
};

async function createRsvp({
  eventId,
  response,
  userId,
}: {
  eventId: number;
  response: (typeof RSVP_RESPONSE_ENUM)[number];
  userId: number;
}) {
  try {
    await db.table<IRSPV>(RSVP_TABLE).insert({
      event_id: eventId,
      user_id: userId,
      response,
    });
  } catch (error: any) {
    console.log(error);
    if (error.code === "ER_DUP_ENTRY") {
      throw new Error("You have already RSVP'd to this event.");
    }
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      throw new Error("Event or user does not exist.");
    }
    throw new Error("Failed to create RSVP.");
  }
}

async function updateRsvp({
  eventId,
  response,
  userId,
}: {
  eventId: number;
  response: (typeof RSVP_RESPONSE_ENUM)[number];
  userId: number;
}) {
  try {
    await db
      .table<IRSPV>(RSVP_TABLE)
      .update({
        response,
      })
      .where({
        event_id: eventId,
        user_id: userId,
      });
  } catch (error: any) {
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      throw new Error("Event or user does not exist.");
    }
    throw new Error("Failed to update RSVP");
  }
}

async function deleteRsvp({
  eventId,
  userId,
}: {
  eventId: number;
  userId: number;
}) {
  try {
    const deletedRow = await db.table<IRSPV>(RSVP_TABLE).delete().where({
      event_id: eventId,
      user_id: userId,
    });
    if (!deletedRow) {
      throw new Error("RSVP not found or user not authorized to delete");
    }
  } catch (error: any) {
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      throw new Error("Event or user does not exist.");
    }
    throw new Error("Failed to delete RSVP");
  }
}

async function getRsvp({
  eventId,
  userId,
}: {
  eventId: number;
  userId: number;
}) {
  try {
    const rsvp = await db
      .table<IRSPV>(RSVP_TABLE)
      .select("*")
      .where({
        event_id: eventId,
        user_id: userId,
      })
      .first();

    if (!rsvp) {
      return undefined;
    }
    return {
      createdAt: rsvp.created_at,
      eventId: rsvp.event_id,
      id: rsvp.id,
      response: rsvp.response,
      updatedAt: rsvp.updated_at,
      userId: rsvp.user_id,
    };
  } catch (error) {
    logger.error("Error retrieving RSVP:", error);
    throw new Error("Failed to retrieve RSVP");
  }
}

async function rsvpStatsOfAnEvent({ eventId }: { eventId: number }) {
  try {
    const res = await db
      .table<IRSPV>(RSVP_TABLE)
      .select("response")
      .count("response as count")
      .where({ event_id: eventId })
      .groupBy("response");

    return (res as any[]).map((row) => ({
      response: row.response,
      count: Number(row.count),
    }));
  } catch (error) {
    logger.error("Error retrieving RSVP stats:", error);
    throw new Error("Failed to retrieve RSVP stats");
  }
}
