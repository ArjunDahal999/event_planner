import { RSVP_RESPONSE_ENUM } from "@event-planner/shared/src/schemas/rsvp.schema.ts";
import db from "../database/db.ts";
import type { IRSPV } from "../database/types.ts";
import { RSVP_TABLE } from "../database/constants.ts";
import logger from "../libs/winston.ts";
export const rsvpService = () => {
  return Object.freeze({
    createRsvp,
    updateRsvp,
    deleteRsvp,
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
