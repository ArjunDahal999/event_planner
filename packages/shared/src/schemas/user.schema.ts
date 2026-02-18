import { z } from "zod";

export const registerUserSchema = z.object({
  name: z
    .string()
    .min(3)
    .transform((name) => name.toLowerCase()),
  email: z.email().transform((email) => email.toLowerCase()),
  password: z.string().min(8),
});

export const loginUserSchema = z.object({
  email: z.email().transform((email) => email.toLowerCase()),
  password: z.string().min(8),
});
