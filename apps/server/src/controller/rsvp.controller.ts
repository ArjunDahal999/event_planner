declare global {
  namespace Express {
    interface Request {
      userID?: number;
    }
  }
}
import type { Request, Response, NextFunction } from "express";
import { rsvpService } from "../services/rsvp.service.ts";
import type { CreateRsvpDTO } from "@event-planner/shared/src/schemas/rsvp.schema.ts";
import type { IApiResponse, IRSPV } from "@event-planner/shared";
class RsvpController {
  async createRsvp(
    req: Request<{}, {}, CreateRsvpDTO>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { eventId, response } = req.body;
      const userId = req.userID!;
      await rsvpService().createRsvp({
        eventId,
        response,
        userId,
      });
      res.status(201).json({ message: "RSVP created successfully" });
    } catch (error) {
      next(error);
    }
  }

  async updateRsvp(
    req: Request<{}, {}, CreateRsvpDTO>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { eventId, response } = req.body;
      const userId = req.userID!;
      await rsvpService().updateRsvp({
        eventId,
        response,
        userId,
      });
      res.status(200).json({ message: "RSVP updated successfully" });
    } catch (error) {
      next(error);
    }
  }

  async deleteRsvp(req: Request, res: Response, next: NextFunction) {
    try {
      const { eventId } = req.body;
      const userId = req.userID!;
      await rsvpService().deleteRsvp({
        eventId,
        userId,
      });
      res.status(200).json({ message: "RSVP deleted successfully" });
    } catch (error) {
      next(error);
    }
  }

  async getRsvp(
    req: Request,
    res: Response<IApiResponse<IRSPV | undefined>>,
    next: NextFunction,
  ) {
    try {
      const { eventId } = req.query;
      const userId = req.userID!;
      const rsvp = await rsvpService().getRsvp({
        eventId: Number(eventId),
        userId,
      });
      res.status(200).json({
        message: "RSVP retrieved successfully",
        statusCode: 200,
        success: true,
        data: rsvp,
      });
    } catch (error) {
      next(error);
    }
  }
}

const rsvpController = new RsvpController();
export default rsvpController;
