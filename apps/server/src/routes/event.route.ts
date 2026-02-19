import express from "express";
import eventController from "../controller/event.controller.ts";

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
  console.log(userId);
  console.log("User profile endpoint hit");
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
 *           example: "Team Meeting"
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
 *           default: public
 *     Event:
 *       allOf:
 *         - $ref: '#/components/schemas/EventCreate'
 *         - type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *             user_id:
 *               type: integer
 *               example: 42
 *             created_at:
 *               type: string
 *               format: date-time
 *               example: "2026-02-01T12:00:00Z"
 *             updated_at:
 *               type: string
 *               format: date-time
 *               example: "2026-02-01T12:00:00Z"
 */
router.post("/", eventController.createEvent);

/**
 * @swagger
 * /api/v1/event/all:
 *   get:
 *     tags:
 *       - Event
 *     summary: Get all events
 *     description: Retrieve a list of all events.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of events retrieved successfully.
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
router.get("/all", eventController.getAllEvents);

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
router.put("/:id", eventController.updateEvent);

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
