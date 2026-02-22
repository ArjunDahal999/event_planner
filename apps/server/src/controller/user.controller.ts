import type { NextFunction, Request, Response } from "express";
import { userService } from "../services/user.service.ts";
import type {
  Generate2FADTO,
  IGenerate2FAResponse,
  ILoginResponse,
  IRefreshTokenResponse,
  IVerifyEmailResponse,
  LoginUserDTO,
  RefreshTokenDTO,
  RegisterUserDTO,
  VerifyEmailDTO,
} from "@event-planner/shared";
import logger from "../libs/winston.ts";
import { HttpError } from "../utils/http-error.ts";
import { compareHashWithString, hashString } from "../helper/bcrypt.helper.ts";
import { authService } from "../services/auth.service.ts";
import {
  generateSixDigitToken,
  generateToken,
} from "../helper/token.helper.ts";
import emailService from "../services/email.service.ts";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../helper/jwt.helper.ts";
import type { IApiResponse, IRegisterResponse } from "@event-planner/shared";
import { env } from "../libs/validate-env.ts";

class UserController {
  async register(
    req: Request<{}, {}, RegisterUserDTO>,
    res: Response<IApiResponse<IRegisterResponse>>,
    next: NextFunction,
  ) {
    const { email, name, password } = req.body;
    try {
      const doesUserExist = await userService().getUserByEmail(email);
      if (doesUserExist) {
        logger.warn(`Attempt to register with existing email: ${email}`);
        throw new HttpError({
          message: "Email is already registered.",
          statusCode: 400,
        });
      }
      const hashedPassword = await hashString(password);

      const createdUserId = await userService().createUser({
        name,
        email,
        password: hashedPassword,
      });
      logger.info(`Account registered successfully for email: ${email}`);
      const tokenPayload = generateToken({ timer: 24 * 60 * 60 * 1000 });
      await authService().createUserActivationToken({
        ...tokenPayload,
        userId: createdUserId,
      });

      await emailService.sendEmail({
        to: email,
        subject: "Activate Your Account",
        body: `Activation Token = ${tokenPayload.token}`,
      });

      res.status(201).json({
        message: "Account registered successfully.",
        success: true,
        statusCode: 201,
        data: {
          name,
          email,
          id: createdUserId,
          activationLink:
            env.APP_URL +
            `/activate?email=${encodeURIComponent(email)}&token=${tokenPayload.token}`,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async verifyEmail(
    req: Request<{}, {}, VerifyEmailDTO>,
    res: Response<IApiResponse<IVerifyEmailResponse>>,
    next: NextFunction,
  ) {
    const { token, email } = req.body;
    try {
      //  fetch user by email to get user ID for token verification
      const user = await userService().getUserByEmail(email);
      if (!user) {
        logger.warn(`Verification attempt with unregistered email: ${email}`);
        throw new HttpError({
          message: "Invalid token or email ID.",
          statusCode: 409,
        });
      }
      // fetch the token from the database and compare with the provided token
      const getToken = await authService().getUserActivationToken({
        userId: user.id,
      });
      // if token doesn't match or has expired, throw an error
      if (getToken !== token) {
        logger.warn(`Invalid or expired token : ${email}`);
        throw new HttpError({
          message: "Invalid or expired token.",
          statusCode: 409,
        });
      }

      await authService().verifyUserAccount({ userId: user.id });
      await authService().deleteUserActivationToken(user.id);

      logger.info(`Account verified successfully for email: ${email}`);
      res.status(200).json({
        data: {
          id: user.id,
        },
        message: "Email verified successfully.",
        success: true,
        statusCode: 200,
      });
    } catch (err) {
      next(err);
    }
  }

  async generate2FA(
    req: Request<{}, {}, Generate2FADTO>,
    res: Response<IApiResponse<IGenerate2FAResponse>>,
    next: NextFunction,
  ) {
    const { email, password } = req.body;
    try {
      const user = await userService().getUserByEmail(email);
      if (!user) {
        logger.warn(`Login attempt with unregistered email: ${email}`);
        throw new HttpError({
          message: "Invalid email or password.",
          statusCode: 401,
        });
      }
      const isPasswordValid = await compareHashWithString({
        string: password,
        hashedString: user.password,
      });

      if (!isPasswordValid) {
        logger.warn(`Invalid password attempt for email: ${email}`);
        throw new HttpError({
          message: "Invalid  password.",
          statusCode: 401,
        });
      }

      if (!user.is_email_verified) {
        logger.warn(`Login attempt with unverified email: ${email}`);
        throw new HttpError({
          message:
            "Email is not verified. Please verify your email before logging in.",
          statusCode: 401,
        });
      }

      const tokenPayload = generateSixDigitToken();
      await authService().revoke2FASecret({ email });
      await authService().create2FASecret({
        email,
        secret: tokenPayload,
        userId: user.id,
      });

      emailService.sendEmail({
        to: email,
        subject: "Your 2FA Code",
        body: `---SIX DIGIT CODE ----: ${tokenPayload}`,
      });

      logger.info(`User logged in successfully: ${email}`);
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

  async loginWith2FA(
    req: Request<{}, {}, LoginUserDTO>,
    res: Response<IApiResponse<ILoginResponse>>,
    next: NextFunction,
  ) {
    const { email, token } = req.body;
    try {
      const user = await userService().getUserByEmail(email);
      if (!user) {
        logger.warn(`2FA login attempt with unregistered email: ${email}`);
        throw new HttpError({
          message: "Invalid email .",
          statusCode: 401,
        });
      }
      const storedToken = await authService().get2FASecret({ email });

      if (storedToken !== token) {
        logger.warn(`Invalid 2FA token attempt for email: ${email}`);
        throw new HttpError({
          message: "Invalid token.",
          statusCode: 401,
        });
      }

      await authService().delete2FASecret({ email });
      const accessToken = generateAccessToken(user.id);
      await authService().revokeRefreshToken({ userId: user.id });
      const refreshToken = generateRefreshToken(user.id);

      const hashedRefreshToken = await hashString(refreshToken);
      await authService().createAccessToken({
        userId: user.id,
        refreshToken: hashedRefreshToken,
      });
      logger.info(`User logged in successfully with 2FA: ${email}`);
      res
        .cookie("refresh_token", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        })
        .status(200)
        .json({
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

  async refreshToken(
    req: Request,
    res: Response<IApiResponse<IRefreshTokenResponse>>,
    next: NextFunction,
  ) {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      throw new HttpError({
        message: "Refresh token missing.",
        statusCode: 401,
      });
    }
    try {
      const decoded = verifyRefreshToken(refreshToken);
      if (!decoded) {
        logger.warn(`Invalid refresh token attempt.`);
        throw new HttpError({
          message: "Invalid refresh token.",
          statusCode: 401,
        });
      }
      const storedTokenData = await authService().getRefreshToken({
        userId: decoded._id,
      });

      if (!storedTokenData) {
        logger.warn(`Refresh token not found in DB.`);
        throw new HttpError({
          message: " Refresh token not found in DB.",
          statusCode: 401,
        });
      }
      const isMatch = await compareHashWithString({
        string: refreshToken,
        hashedString: storedTokenData,
      });

      if (!isMatch) {
        logger.warn(`Refresh token mismatch.`);
        throw new HttpError({
          message: "Invalid refresh token.",
          statusCode: 401,
        });
      }

      const accessToken = generateAccessToken(decoded._id);
      const newRefreshToken = generateRefreshToken(decoded._id);

      const hashedNewRefreshToken = await hashString(newRefreshToken!);
      await authService().updateAccessToken({
        userId: decoded._id,
        refreshToken: hashedNewRefreshToken,
      });

      logger.info(
        `Access token refreshed successfully for user ID: ${decoded._id}`,
      );
      res
        .cookie("refresh_token", newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        })
        .status(200)
        .json({
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

  //TODO
  async logout(req: Request, res: Response, next: NextFunction) {}
}

const userController = new UserController();
export default userController;
