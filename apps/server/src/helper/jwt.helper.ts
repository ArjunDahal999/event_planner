import jwt from "jsonwebtoken";
import { env } from "../libs/validate-env.ts";
import logger from "../libs/winston.ts";

export const generateAccessToken = (user_id: number) => {
  try {
    const accessToken = jwt.sign(
      { _id: user_id },
      env.JWT_ACCESS_TOKEN_SECRET,
      {
        expiresIn: "10d",
      },
    );
    return accessToken;
  } catch (error) {
    throw new Error("Failed to generate access token");
  }
};

export const generateRefreshToken = (user_id: number) => {
  try {
    const refreshToken = jwt.sign(
      { _id: user_id },
      env.JWT_REFRESH_TOKEN_SECRET,
      {
        expiresIn: "27d",
      },
    );
    return refreshToken;
  } catch (error) {
    throw new Error("Failed to generate refresh token");
  }
};

export const verifyAccessToken = (
  token: string,
): { _id: number; iat: number; exp: number } | null => {
  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_TOKEN_SECRET) as {
      _id: number;
      iat: number;
      exp: number;
    };
    return decoded;
  } catch (error) {
    throw new Error("Invalid access token");
  }
};

export const verifyRefreshToken = (
  token: string,
): { _id: number; iat: number; exp: number } | null => {
  try {
    const decoded = jwt.verify(token, env.JWT_REFRESH_TOKEN_SECRET) as {
      _id: number;
      iat: number;
      exp: number;
    };
    return decoded;
  } catch (error) {
    logger.error(error);
    throw new Error("Invalid refresh token");
  }
};
