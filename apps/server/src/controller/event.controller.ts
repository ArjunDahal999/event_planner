declare global {
  namespace Express {
    interface Request {
      userID?: number;
    }
  }
}
import { HttpError } from "../utils/http-error.ts";
import type { NextFunction, Request, Response } from "express";
import {
  type EventFilterDTO,
  type CreateEventDTO,
} from "../../../../packages/shared/src/schemas/event.schema.ts";
import { eventService } from "../services/event.service.ts";
import logger from "../libs/winston.ts";

class EventController {
  async createEvent(
    req: Request<{}, {}, CreateEventDTO>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = req.userID!;
      const event = await eventService().createEventWithTags({
        userId,
        eventData: req.body,
      });
      res
        .status(201)
        .json({ message: "Event created successfully", data: event });
    } catch (error) {
      logger.error("Error creating event:", error);
      next(error);
    }
  }

  async getAllEvents(
    req: Request<{}, {}, {}, EventFilterDTO>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const filters = req.query;
      const events = await eventService().getAllEvents({ filters });
      res.status(200).json(events);
    } catch (error) {
      logger.error("Error retrieving events:", error);
      next(error);
    }
  }

  async getEventById(req: Request, res: Response, next: NextFunction) {
    try {
      const eventId = parseInt(req.params.id as string, 10);
      const event = await eventService().getEventById({ eventId });
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.status(200).json(event);
    } catch (error) {
      logger.error("Error retrieving event:", error);
      next(error);
    }
  }

  async getAllUserEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userID!;
      const events = await eventService().getAllUserEvents({ userId });
      res.status(200).json(events);
    } catch (error) {
      logger.error("Error retrieving user events:", error);
      next(error);
    }
  }

  async deleteEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userID!;
      const eventId = parseInt(req.params.id as string, 10);
      await eventService().deleteEvent({ eventId, userId });
      logger.info(`Event ${eventId} deleted successfully for user ${userId}`);
      res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
      logger.error("Error deleting event:", error);
      next(error);
    }
  }

  async updateEvent(
    req: Request<{ id: string }, {}, CreateEventDTO>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = req.userID!;
      const eventId = parseInt(req.params.id as string, 10);
      if (!eventId)
        throw new HttpError({
          message: "Invalid EVENT ID",
          statusCode: 403,
        });
      await eventService().updateEvent({
        eventId,
        userId,
        eventData: req.body,
      });
      logger.info(`Event ${eventId} updated successfully for user ${userId}`);
      res.status(200).json({ message: "Event updated successfully" });
    } catch (error) {
      logger.error("Error updating event:", error);
      next(error);
    }
  }
}

const eventController = new EventController();

export default eventController;
