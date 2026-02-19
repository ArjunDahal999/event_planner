import type { NextFunction, Request, Response } from "express";
import userService from "../services/user.service.ts";
import { loginUserSchema, registerUserSchema } from "@event-planner/shared";
import logger from "../libs/winston.ts";
import { HttpError } from "../utils/http-error.ts";
import { compareHashWithString, hashString } from "../helper/bcrypt.helper.ts";
import authService from "../services/auth.service.ts";
import { generateToken } from "../helper/token.helper.ts";
import emailService from "../services/email.service.ts";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../helper/jwt.helper.ts";

class UserController {
  async register(req: Request, res: Response, next: NextFunction) {
    const { name, email, password } = req.body;
    try {
      const parsedData = registerUserSchema.parse({
        name,
        email,
        password,
      });
      const doesUserExist = await userService.getUserByEmail(parsedData.email);
      if (doesUserExist) {
        logger.warn(
          `Attempt to register with existing email: ${parsedData.email}`,
        );
        throw new HttpError({
          message: "Email is already registered.",
          statusCode: 400,
        });
      }
      const hashedPassword = await hashString(parsedData.password);

      const createdUserId = await userService.createUser({
        name: parsedData.name,
        email: parsedData.email,
        password: hashedPassword,
      });
      logger.info(
        `Account registered successfully for email: ${parsedData.email}`,
      );
      const tokenPayload = generateToken({ timer: 24 * 60 * 60 * 1000 });
      await authService.createUserActivationToken({
        ...tokenPayload,
        userId: createdUserId,
      });

      await emailService.sendEmail({
        to: parsedData.email,
        subject: "Activate Your Account",
        body: `Activation Token = ${tokenPayload.token}`,
      });

      res.status(201).json({
        message: "Account registered successfully.",
        success: true,
        statusCode: 201,
        data: { ...parsedData, id: createdUserId },
      });
    } catch (err) {
      next(err);
    }
  }
  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    const { token, email } = req.body;
    try {
      //  fetch user by email to get user ID for token verification
      const user = await userService.getUserByEmail(email);
      if (!user) {
        logger.warn(`Verification attempt with unregistered email: ${email}`);
        throw new HttpError({
          message: "Invalid token or email ID.",
          statusCode: 409,
        });
      }
      // fetch the token from the database and compare with the provided token
      const getToken = await authService.getUserActivationToken({
        userId: user.id,
      });
      console.log("getToken", getToken);
      // if token doesn't match or has expired, throw an error
      if (getToken !== token) {
        logger.warn(`Invalid or expired token : ${email}`);
        throw new HttpError({
          message: "Invalid or expired token.",
          statusCode: 409,
        });
      }

      await authService.verifyUserAccount({ userId: user.id });
      await authService.deleteUserActivationToken(user.id);

      logger.info(`Account verified successfully for email: ${email}`);
      res.status(200).json({
        message: "Account verified successfully.",
        success: true,
        statusCode: 200,
      });
    } catch (err) {
      next(err);
    }
  }

  async generate2FA(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    try {
      const parsedData = loginUserSchema.parse({
        email,
        password,
      });
      const user = await userService.getUserByEmail(parsedData.email);
      if (!user) {
        logger.warn(
          `Login attempt with unregistered email: ${parsedData.email}`,
        );
        throw new HttpError({
          message: "Invalid email or password.",
          statusCode: 401,
        });
      }
      const isPasswordValid = await compareHashWithString({
        string: parsedData.password,
        hashedString: user.password,
      });

      if (!isPasswordValid) {
        logger.warn(`Invalid password attempt for email: ${parsedData.email}`);
        throw new HttpError({
          message: "Invalid  password.",
          statusCode: 401,
        });
      }

      if (!user.is_email_verified) {
        logger.warn(`Login attempt with unverified email: ${parsedData.email}`);
        throw new HttpError({
          message:
            "Email is not verified. Please verify your email before logging in.",
          statusCode: 401,
        });
      }

      const tokenPayload = generateToken({ timer: 10 * 60 * 60 * 1000 });
      await authService.revoke2FASecret({ email: parsedData.email });
      await authService.create2FASecret({
        email: parsedData.email,
        secret: tokenPayload.token,
        userId: user.id,
      });

      emailService.sendEmail({
        to: parsedData.email,
        subject: "Your 2FA Code",
        body: `Your 2FA code is: ${tokenPayload.token}`,
      });

      logger.info(`User logged in successfully: ${parsedData.email}`);
      res.status(200).json({
        message: " Please check your email for the 2FA code.",
        success: true,
        statusCode: 200,
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            is_email_verified: user.is_email_verified,
          },
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async loginWith2FA(req: Request, res: Response, next: NextFunction) {
    const { email, token } = req.body;
    try {
      const user = await userService.getUserByEmail(email);
      if (!user) {
        logger.warn(`2FA login attempt with unregistered email: ${email}`);
        throw new HttpError({
          message: "Invalid email .",
          statusCode: 401,
        });
      }
      const storedToken = await authService.get2FASecret({ email });

      if (storedToken !== token) {
        logger.warn(`Invalid 2FA token attempt for email: ${email}`);
        throw new HttpError({
          message: "Invalid token.",
          statusCode: 401,
        });
      }

      await authService.delete2FASecret({ email });
      const accessToken = generateAccessToken(user.id);
      const refreshToken = generateRefreshToken(user.id);

      const hashedRefreshToken = await hashString(refreshToken!);
      await authService.createAccessToken({
        userId: user.id,
        refreshToken: hashedRefreshToken,
      });
      logger.info(`User logged in successfully with 2FA: ${email}`);
      res.status(200).json({
        message: "Logged in successfully.",
        success: true,
        statusCode: 200,
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            is_email_verified: user.is_email_verified,
          },
          accessToken,
          refreshToken,
        },
      });
    } catch (err) {
      next(err);
    }
  }
  //TODO
  async logout(req: Request, res: Response, next: NextFunction) {}

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    const { refreshToken } = req.body;
    try {
      if (!refreshToken) {
        logger.warn(`Refresh token or user ID missing in request.`);
        throw new HttpError({
          message: "Refresh token and user ID are required.",
          statusCode: 400,
        });
      }

      const decoded = verifyRefreshToken(refreshToken);
      if (!decoded) {
        logger.warn(`Invalid refresh token attempt.`);
        throw new HttpError({
          message: "Invalid refresh token.",
          statusCode: 401,
        });
      }
      const storedTokenData = await authService.getRefreshToken({
        userId: decoded._id,
      });

      if (!storedTokenData) {
        logger.warn(`Invalid refresh token attempt.`);
        throw new HttpError({
          message: "Invalid refresh token.",
          statusCode: 401,
        });
      }

      const isTokenValid = await compareHashWithString({
        string: refreshToken,
        hashedString: storedTokenData,
      });
      console.log("isTokenValid", isTokenValid);

      if (!isTokenValid) {
        logger.warn(`Invalid refresh token attempt.`);
        throw new HttpError({
          message: "Invalid refresh token.",
          statusCode: 401,
        });
      }

      const accessToken = generateAccessToken(decoded._id);
      const newRefreshToken = generateRefreshToken(decoded._id);

      const hashedNewRefreshToken = await hashString(newRefreshToken!);
      await authService.updateAccessToken({
        userId: decoded._id,
        refreshToken: hashedNewRefreshToken,
      });

      logger.info(
        `Access token refreshed successfully for user ID: ${decoded._id}`,
      );
      res.status(200).json({
        message: "Access token refreshed successfully.",
        success: true,
        statusCode: 200,
        data: {
          accessToken,
          refreshToken: newRefreshToken,
        },
      });
    } catch (err) {
      next(err);
    }
  }
}

const userController = new UserController();
export default userController;
