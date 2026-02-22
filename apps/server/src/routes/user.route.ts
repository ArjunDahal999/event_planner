import express from "express";
import userController from "../controller/user.controller.ts";
import { validateRequest } from "../middleware/validate-request.middleware.ts";
import {
  generate2FASchema,
  loginUserSchema,
  refreshTokenSchema,
  registerUserSchema,
  verifyEmailSchema,
} from "@event-planner/shared";

const router = express.Router();

/**
 * @swagger
 * /api/v1/registerAccount:
 *   post:
 *     tags:
 *       - UserAuth
 *     summary: Register a new account.
 *     description: Register a new user account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 default: Arjun Dahal
 *               email:
 *                 type: string
 *                 default: dahalarjun404@gmail.com
 *               password:
 *                 type: string
 *                 default: 11111111
 *     responses:
 *       200:
 *         description: Account registered successfully.
 *       500:
 *         description: Internal server error.
 */
router.post(
  "/registerAccount",
  validateRequest({ schema: registerUserSchema, scope: "body" }),
  userController.register,
);

/**
 * @swagger
 * /api/v1/verifyEmail:
 *   post:
 *     tags:
 *       - UserAuth
 *     summary: Verify email.
 *     description: Verify a user email using the activation token received via email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 default: dahalarjun404@gmail.com
 *               token:
 *                 type: string
 *                 default: 1234567890abcdef
 *     responses:
 *       200:
 *         description: Email verified successfully.
 *       401:
 *         description: Unauthorized - Invalid token or token expired.
 *       409:
 *         description: Conflict - Invalid token or email ID.
 *       500:
 *         description: Internal server error.
 */
router.post(
  "/verifyEmail",
  validateRequest({ schema: verifyEmailSchema, scope: "body" }),
  userController.verifyEmail,
);

/**
 * @swagger
 * /api/v1/generate2FA:
 *   post:
 *     tags:
 *       - UserAuth
 *     summary: Login to an account.
 *     description: Log in to an existing user account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 default: dahalarjun404@gmail.com
 *               password:
 *                 type: string
 *                 default: 11111111
 *     responses:
 *       200:
 *         description: Login successful.
 *       401:
 *         description: Unauthorized - Invalid credentials.
 *       500:
 *         description: Internal server error.
 */
router.post(
  "/generate2FA",
  validateRequest({ schema: generate2FASchema, scope: "body" }),
  userController.generate2FA,
);

/**
 * @swagger
 * /api/v1/loginWith2FA:
 *   post:
 *     tags:
 *       - UserAuth
 *     summary: Login with 2FA.
 *     description: Log in to an account using two-factor authentication (2FA) token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 default: dahalarjun404@gmail.com
 *               token:
 *                 type: string
 *                 default: 1234567890abcdef
 *     responses:
 *       200:
 *         description: Login successful.
 *       401:
 *         description: Unauthorized - Invalid email or token.
 *       500:
 *         description: Internal server error.
 */
router.post(
  "/loginWith2FA",
  validateRequest({ schema: loginUserSchema, scope: "body" }),
  userController.loginWith2FA,
);

/**
 * @swagger
 * /api/v1/logout:
 *   get:
 *     tags:
 *       - UserAuth
 *     summary: Logout.
 *     description: Log out of the current session.
 *     responses:
 *       200:
 *         description: Logout successful.
 *       500:
 *         description: Internal server error.
 *
 */
router.get("/logout", () => {});

/**
 * @swagger
 * /api/v1/refresh:
 *   post:
 *     tags:
 *       - UserAuth
 *     summary: Refresh.
 *     description: Refresh .
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 default: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjIsImlhdCI6MTc3MTQ5Mjk5NiwiZXhwIjoxNzcyMDk3Nzk2fQ.fY5yy1A9k7I_ThXmYY2Wt0kZVsQ9cX9HYOoxv1nu6PY
 *               userId:
 *                 type: integer
 *                 default: 1
 *     responses:
 *       200:
 *         description: Token refreshed successfully.
 *       401:
 *         description: Unauthorized - Invalid refresh token.
 *       500:
 *         description: Internal server error.
 */
router.post(
  "/refresh",
  validateRequest({ schema: refreshTokenSchema, scope: "body" }),
  userController.refreshToken,
);
export default router;
