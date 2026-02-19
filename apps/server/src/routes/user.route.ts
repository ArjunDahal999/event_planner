import express from "express";
import userController from "../controller/user.controller.ts";

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
router.post("/registerAccount", userController.register);

/**
 * @swagger
 * /api/v1/loginToAccount:
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
router.post("/loginToAccount", userController.login);

/**
 * @swagger
 * /api/v1/verifyAccount:
 *   post:
 *     tags:
 *       - UserAuth
 *     summary: Verify account.
 *     description: Verify a user account using the activation token received via email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Account activated successfully.
 *       401:
 *         description: Unauthorized - Invalid token or token expired.
 *       409:
 *         description: Conflict - Invalid token or email ID.
 *       500:
 *         description: Internal server error.
 */
router.post("/verifyAccount", userController.verifyEmail);

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
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful.
 *       401:
 *         description: Unauthorized - Invalid email or token.
 *       500:
 *         description: Internal server error.
 */
router.post("/loginWith2FA", userController.loginWith2FA);
/**
 * @swagger
 * /api/v1/forgotPassword:
 *   post:
 *     tags:
 *       - UserAuth
 *     summary: Request password reset.
 *     description: Request to reset password. An email with reset instructions will be sent to the registered email address.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset request successful. A reset link has been sent to your email.
 *       401:
 *         description: Unauthorized - Email address not registered.
 *       500:
 *         description: Internal server error.
 */

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
 *     responses:
 *       200:
 *         description: Token refreshed successfully.
 *       401:
 *         description: Unauthorized - Invalid refresh token.
 *       500:
 *         description: Internal server error.
 */
router.post("/refresh", () => {});
export default router;
