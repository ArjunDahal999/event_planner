import { Router } from "express";
import rsvpController from "../controller/rsvp.controller.ts";
import { validateRequest } from "../middleware/validate-request.middleware.ts";
import { rsvpCreateSchema } from "@event-planner/shared/src/schemas/rsvp.schema.ts";

const rsvpRouter = Router();

/**
 * @swagger
 * /api/v1/rsvp:
 *   post:
 *     tags:
 *       - RSVP
 *     summary: Create a new RSVP for an event
 *     description: Create a new RSVP for a specific event with the user's response.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventId:
 *                 type: string
 *                 description: The ID of the event to RSVP to.
 *               response:
 *                 type: string
 *                 enum: [YES, NO, MAY BE]
 *                 description: The user's response to the event invitation.
 *             example:
 *               eventId: "12345"
 *               response: "YES"
 *     responses:
 *       201:
 *         description: RSVP created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: RSVP created successfully
 *       400:
 *         description: Bad request. Invalid input data.
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error.
 */
rsvpRouter.post(
  "/",
  validateRequest({
    schema: rsvpCreateSchema,
  }),
  rsvpController.createRsvp,
);

/**
 * @swagger
 * /api/v1/rsvp:
 *   put:
 *     tags:
 *       - RSVP
 *     summary: Update an existing RSVP for an event
 *     description: Update the user's RSVP response for a specific event.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventId:
 *                 type: string
 *                 description: The ID of the event to update the RSVP for.
 *               response:
 *                 type: string
 *                 enum: [YES, NO, MAY BE]
 *                 description: The updated user's response to the event invitation.
 *             example:
 *               eventId: "12345"
 *               response: "NO"
 *     responses:
 *       200:
 *         description: RSVP updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: RSVP updated successfully
 *       400:
 *         description: Bad request. Invalid input data.
 */
rsvpRouter.put(
  "/",
  validateRequest({
    schema: rsvpCreateSchema,
  }),
  rsvpController.updateRsvp,
);

/**
 * @swagger
 * /api/v1/rsvp:
 *   delete:
 *     tags:
 *       - RSVP
 *     summary: Delete an existing RSVP for an event
 *     description: Delete the user's RSVP for a specific event.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventId:
 *                 type: string
 *                 description: The ID of the event to delete the RSVP for.
 *             example:
 *               eventId: "12345"
 *     responses:
 *       200:
 *         description: RSVP deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: RSVP deleted successfully
 */
rsvpRouter.delete("/", rsvpController.deleteRsvp);

export default rsvpRouter;
