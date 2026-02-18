import type { NextFunction, Request, Response } from "express";
import userService from "../services/user.service.ts";
import { loginUserSchema, registerUserSchema } from "@event-planner/shared";
import logger from "../libs/winston.ts";
import { HttpError } from "../middleware/zod.middleware.ts";
import { hashPassword, isPasswordCorrect } from "../helper/bcrypt.ts";

const userController = {
  register: async (req: Request, res: Response, next: NextFunction) => {
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
        throw new HttpError(
          "Email is already registered. Please use a different email.",
          409,
        );
      }
      const createdUser = await userService.createUser({
        name: parsedData.name,
        email: parsedData.email,
        password: hashPassword(parsedData.password),
      });
      logger.info(
        `Account registered successfully for email: ${parsedData.email}`,
      );
      res.status(201).json({
        message: "Account registered successfully.",
        success: true,
        statusCode: 201,
        data: createdUser,
      });
    } catch (err) {
      next(err);
    }
  },
  login: async (req: Request, res: Response, next: NextFunction) => {
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
        throw new HttpError("Invalid email or password.", 401);
      }
      const isPasswordValid = await isPasswordCorrect({
        password: parsedData.password,
        hashedPassword: user.password,
      });

      if (!isPasswordValid) {
        logger.warn(`Invalid password attempt for email: ${parsedData.email}`);
        throw new HttpError("Invalid email or password.", 401);
      }
      logger.info(`User logged in successfully: ${parsedData.email}`);
      res.status(200).json({
        message: "Login successful.",
        success: true,
        statusCode: 200,
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        },
      });
    } catch (err) {
      next(err);
    }
  },
};

export default userController;
