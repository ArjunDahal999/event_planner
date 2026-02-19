import express from "express";

const router = express.Router();

/**
 * @swagger
 * /api/v1/me:
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
router.get("/me", (req, res) => {
  const userId = res.locals.user;
  console.log(userId);
  console.log("User profile endpoint hit");
  res.status(200).json({ message: "User profile endpoint" });
});

export default router;
