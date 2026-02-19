import type { NextFunction, Request, Response } from "express";
import { createEventSchema } from "../../../../packages/shared/src/schemas/event.schema.ts";
import eventService from "../services/event.service.ts";
import logger from "../libs/winston.ts";
class EventController {
  async createEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userID!;
      const { title, description, date, event_date, location, event_type } =
        req.body;
      const parseData = createEventSchema.parse({
        title,
        description,
        date,
        event_date,
        location,
        event_type,
      });
      await eventService.createEvent({ userId, eventData: parseData });
      logger.info(`Event created successfully for user ${userId}`);
      res.status(201).json({ message: "Event created successfully" });
    } catch (error) {
      logger.error("Error creating event:", error);
      next(error);
    }
  }

  async getAllEvents(_: Request, res: Response, next: NextFunction) {
    try {
      const events = await eventService.getAllEvents();
      res.status(200).json(events);
    } catch (error) {
      logger.error("Error retrieving events:", error);
      next(error);
    }
  }

  async getEventById(req: Request, res: Response, next: NextFunction) {
    try {
      const eventId = parseInt(req.params.id as string, 10);
      const event = await eventService.getEventById({ eventId });
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
      const events = await eventService.getAllUserEvents({ userId });
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
      await eventService.deleteEvent({ eventId, userId });
      logger.info(`Event ${eventId} deleted successfully for user ${userId}`);
      res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
      logger.error("Error deleting event:", error);
      next(error);
    }
  }

  async updateEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userID!;
      const eventId = parseInt(req.params.id as string, 10);
      const { title, description, date, event_date, location, event_type } =
        req.body;
      const parseData = createEventSchema.parse({
        title,
        description,
        date,
        event_date,
        location,
        event_type,
      });
      await eventService.updateEvent({ eventId, userId, eventData: parseData });
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
