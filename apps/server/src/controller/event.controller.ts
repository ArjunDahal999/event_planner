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
import type {
  IApiResponse,
  IEventByIdResponse,
  IEventResponse,
} from "@event-planner/shared";
import { rsvpService } from "../services/rsvp.service.ts";

class EventController {
  async createEvent(
    req: Request<{}, {}, CreateEventDTO>,
    res: Response<IApiResponse<[]>>,
    next: NextFunction,
  ) {
    try {
      const userId = req.userID!;
      const event = await eventService().createEventWithTags({
        userId,
        eventData: req.body,
      });
      res.status(201).json({
        message: "Event created successfully",
        data: [],
        statusCode: 201,
        success: true,
      });
    } catch (error) {
      logger.error("Error creating event:", error);
      next(error);
    }
  }

  async getAllEvents(
    req: Request<{}, {}, {}, EventFilterDTO>,
    res: Response<IApiResponse<IEventResponse>>,
    next: NextFunction,
  ) {
    try {
      const filters = req.query;
      const response = await eventService().getAllEvents({ filters });
      res.status(200).json({
        message: "Events retrieved successfully",
        statusCode: 200,
        success: true,
        data: response,
      });
    } catch (error) {
      logger.error("Error retrieving events:", error);
      next(error);
    }
  }

  async getEventById(
    req: Request,
    res: Response<IApiResponse<IEventByIdResponse>>,
    next: NextFunction,
  ) {
    try {
      const eventId = parseInt(req.params.id as string, 10);
      const eventResponse = await eventService().getEventById({ eventId });
      if (!eventResponse) {
        throw new HttpError({
          message: "Event not found",
          statusCode: 404,
        });
      }
      res.status(200).json({
        message: "Event retrieved successfully",
        statusCode: 200,
        success: true,
        data: eventResponse.events[0],
      });
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

  async deleteEvent(
    req: Request,
    res: Response<IApiResponse<[]>>,
    next: NextFunction,
  ) {
    try {
      const userId = req.userID!;
      const eventId = parseInt(req.params.id as string, 10);
      await eventService().deleteEvent({ eventId, userId });
      logger.info(`Event ${eventId} deleted successfully for user ${userId}`);
      res.status(200).json({
        message: "Event deleted successfully",
        data: [],
        statusCode: 200,
        success: true,
      });
    } catch (error) {
      logger.error("Error deleting event:", error);
      next(error);
    }
  }

  async updateEvent(
    req: Request<{ id: string }, {}, CreateEventDTO>,
    res: Response<IApiResponse<[]>>,
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
      res.status(200).json({
        message: "Event updated successfully",
        data: [],
        statusCode: 200,
        success: true,
      });
    } catch (error) {
      logger.error("Error updating event:", error);
      next(error);
    }
  }
}

const eventController = new EventController();

export default eventController;
