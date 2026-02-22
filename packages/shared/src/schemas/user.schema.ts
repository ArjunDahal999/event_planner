import { z } from "zod";

export const registerUserSchema = z.object({
  name: z
    .string()
    .min(3)
    .transform((name) => name.toLowerCase()),
  email: z.email().transform((email) => email.toLowerCase()),
  password: z.string().min(8),
});

export type RegisterUserDTO = z.infer<typeof registerUserSchema>;

export const loginUserSchema = z.object({
  email: z
    .email({ message: "Please provide a valid email address." })
    .transform((email) => email.toLowerCase()),
  token: z
    .string()
    .min(6, { message: "Token must be at least 6 characters long." }),
});

export type LoginUserDTO = z.infer<typeof loginUserSchema>;

export const generate2FASchema = z.object({
  email: z
    .email({ message: "Please provide a valid email address." })
    .transform((email) => email.toLowerCase()),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }),
});

export type Generate2FADTO = z.infer<typeof generate2FASchema>;

export const verifyEmailSchema = z.object({
  email: z
    .email({ message: "Please provide a valid email address." })
    .transform((email) => email.toLowerCase()),
  token: z
    .string()
    .min(6, { message: "Token must be at least 6 characters long." }),
});

export type VerifyEmailDTO = z.infer<typeof verifyEmailSchema>;

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(10, { message: "Refresh token is required." }),
});

export type RefreshTokenDTO = z.infer<typeof refreshTokenSchema>;
