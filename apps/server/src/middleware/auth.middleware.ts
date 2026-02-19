import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import { env } from "../libs/validate-env.ts";
import { HttpError } from "../utils/http-error.ts";

export const isUserAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let token;
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers?.authorization?.split(" ")[1];
    }
    if (!token)
      return res.status(400).json({ success: false, message: "Not logged In" });
    const decodedToken: any = jwt.verify(
      token,
      env.JWT_ACCESS_TOKEN_SECRET,
      (err: any, decoded: any) => {
        if (err) {
          throw new HttpError({
            message: "Token Expired",
            statusCode: 403,
          });
        }
        return decoded;
      },
    );
    const userId: string = decodedToken._id;
    res.locals.user = userId;
  } catch (error) {
    next(error);
  }
  next();
};
