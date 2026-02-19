import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import { env } from "../libs/validate-env.ts";
import { HttpError } from "../utils/http-error.ts";

interface JwtPayload {
  _id: string;
  iat: number;
  exp: number;
}

export const isUserAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new HttpError({
        message: "Not logged in",
        statusCode: 401,
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(
      token,
      env.JWT_ACCESS_TOKEN_SECRET,
    ) as JwtPayload;
    req.userID = parseInt(decoded._id, 10);
    next();
  } catch (error) {
    next(error);
  }
};
