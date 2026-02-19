import type { CreateEvent } from "../../../../packages/shared/src/schemas/event.schema.ts";
import { EVENT_TABLE } from "../database/constants.ts";
import db from "../database/db.ts";
import type { IEvent } from "../database/types.ts";

class EventService {
  async createEvent({
    userId,
    eventData,
  }: {
    userId: number;
    eventData: CreateEvent;
  }) {
    try {
      await db<IEvent>(EVENT_TABLE).insert({ ...eventData, user_id: userId });
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to create event",
      );
    }
  }

  async getAllUserEvents({ userId }: { userId: number }) {
    try {
      const events = await db<IEvent>(EVENT_TABLE)
        .select("*")
        .where({ user_id: userId });
      return events;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to retrieve events",
      );
    }
  }

  async getAllEvents() {
    try {
      const events = await db<IEvent>(EVENT_TABLE).select("*");
      return events;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to retrieve events",
      );
    }
  }

  async getEventById({ eventId }: { eventId: number }) {
    try {
      const event = await db<IEvent>(EVENT_TABLE)
        .select("*")
        .where({ id: eventId })
        .first();
      return event;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to retrieve event",
      );
    }
  }

  async deleteEvent({ eventId, userId }: { eventId: number; userId: number }) {
    try {
      const deletedCount = await db<IEvent>(EVENT_TABLE)
        .where({ id: eventId, user_id: userId })
        .del();
      if (deletedCount === 0) {
        throw new Error("Event not found or user not authorized to delete");
      }
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to delete event",
      );
    }
  }

  async updateEvent({
    eventId,
    userId,
    eventData,
  }: {
    eventId: number;
    userId: number;
    eventData: Partial<CreateEvent>;
  }) {
    try {
      const updatedCount = await db<IEvent>(EVENT_TABLE)
        .where({ id: eventId, user_id: userId })
        .update(eventData);
      if (updatedCount === 0) {
        throw new Error("Event not found or user not authorized to update");
      }
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to update event",
      );
    }
  }
}

const eventService = new EventService();

export default eventService;
