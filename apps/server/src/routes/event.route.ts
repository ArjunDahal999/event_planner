import express from "express";
import eventController from "../controller/event.controller.ts";
import {
  createEventSchema,
  eventFilterSchema,
} from "../../../../packages/shared/src/schemas/event.schema.ts";
import { validateRequest } from "../middleware/validate-request.middleware.ts";

const router = express.Router();

/**
 * @swagger
 * /api/v1/event:
 *   get:
 *     tags:
 *       - Event
 *     summary: Get current user's profile
 *     description: Retrieve the profile of the currently authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: User profile endpoint
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error.
 */
router.get("/", (req, res) => {
  const userId = res.locals.user;
  res.status(200).json({ message: "User profile endpoint" });
});

/**
 * @swagger
 * /api/v1/event:
 *   post:
 *     tags:
 *       - Event
 *     summary: Create a new event
 *     description: Create an event for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EventCreate'
 *     responses:
 *       201:
 *         description: Event created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Bad request (validation failed).
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *
 * components:
 *   schemas:
 *     EventCreate:
 *       type: object
 *       required:
 *         - title
 *         - location
 *         - event_date
 *       properties:
 *         title:
 *           type: string
 *           example: "Team Meeting 2026"
 *         description:
 *           type: string
 *           example: "Discuss Q2 roadmap"
 *         location:
 *           type: string
 *           example: "Conference Room A"
 *         event_date:
 *           type: string
 *           format: date-time
 *           example: "2026-03-10T14:00:00Z"
 *         event_type:
 *           type: string
 *           enum:
 *             - public
 *             - private
 *           default: "public"
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["team", "meeting"]
 *
 *     Event:
 *       type: object
 *       required:
 *         - id
 *         - title
 *         - location
 *         - event_date
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: "Team Meeting 2026"
 *         description:
 *           type: string
 *           example: "Discuss Q2 roadmap"
 *         location:
 *           type: string
 *           example: "Conference Room A"
 *         event_date:
 *           type: string
 *           format: date-time
 *           example: "2026-03-10T14:00:00Z"
 *         event_type:
 *           type: string
 *           enum:
 *             - public
 *             - private
 *           default: "public"
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["team", "meeting"]
 *         created_by:
 *           type: integer
 *           description: ID of the user who created the event
 *           example: 42
 *       example:
 *         id: 1
 *         title: "Team Meeting 2026"
 *         description: "Discuss Q2 roadmap"
 *         location: "Conference Room A"
 *         event_date: "2026-03-10T14:00:00Z"
 *         event_type: "private"
 *         tags:
 *           - "team"
 *           - "meeting"
 *         created_by: 42
 */
router.post(
  "/",
  validateRequest({ schema: createEventSchema, scope: "body" }),
  eventController.createEvent,
);

/**
 * @swagger
 * /api/v1/event/all:
 *   get:
 *     summary: Get all events
 *     description: Retrieve a list of all events. Supports filtering and sorting via query parameters.
 *     tags:
 *       - Event
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: tags
 *         required: false
 *         schema:
 *           type: string
 *         description: Comma-separated list of tags to filter by (e.g. "team,meeting")
 *       - in: query
 *         name: eventType
 *         required: false
 *         schema:
 *           type: string
 *           enum: [public, private]
 *         description: Filter by event type
 *       - in: query
 *         name: location
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter by event location
 *       - in: query
 *         name: title
 *         required: false
 *         schema:
 *           type: string
 *         description: Partial match on event title
 *       - in: query
 *         name: description
 *         required: false
 *         schema:
 *           type: string
 *         description: Partial match on event description
 *       - in: query
 *         name: sortOrder
 *         required: false
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sort direction
 *       - in: query
 *         name: sortBy
 *         required: false
 *         schema:
 *           type: string
 *           enum: [event_date, created_at]
 *           default: event_date
 *         description: Field to sort by
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: number
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: number
 *           default: 5
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of events retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       400:
 *         description: Invalid query parameters
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get(
  "/all",
  validateRequest({ schema: eventFilterSchema, scope: "query" }),
  //@ts-expect-error
  // we have already ensured that the validated req query  is wbe received
  eventController.getAllEvents,
);
/**
 * @swagger
 * /api/v1/event/user:
 *   get:
 *     tags:
 *       - Event
 *     summary: Get all events for the authenticated user
 *     description: Retrieve a list of all events created by the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's events retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/user", eventController.getAllUserEvents);

/**
 * @swagger
 * /api/v1/event/{id}:
 *   get:
 *     tags:
 *       - Event
 *     summary: Get event by ID
 *     description: Retrieve the details of a specific event by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the event to retrieve.
 *     responses:
 *       200:
 *         description: Event retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", eventController.getEventById);

/** * @swagger
 * /api/v1/event/{id}:
 *   put:
 *     tags:
 *       - Event
 *     summary: Update an event
 *     description: Update the details of a specific event by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the event to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EventCreate'
 *     responses:
 *       200:
 *         description: Event updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Bad request (validation failed).
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */
router.put(
  "/:id",
  validateRequest({ schema: createEventSchema, scope: "body" }),
  eventController.updateEvent,
);

/** * @swagger
 * /api/v1/event/{id}:
 *   delete:
 *     tags:
 *       - Event
 *     summary: Delete an event
 *     description: Delete a specific event by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the event to delete.
 *     responses:
 *       200:
 *         description: Event deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: Event deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", eventController.deleteEvent);

export default router;
