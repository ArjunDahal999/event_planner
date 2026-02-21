import jwt from "jsonwebtoken";
import { env } from "../libs/validate-env.ts";

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
    return null;
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
    return null;
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
    return null;
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
    throw new Error("Invalid refresh token");
  }
};
