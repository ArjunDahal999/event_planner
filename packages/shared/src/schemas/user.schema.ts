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
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }),
});

export type LoginUserDTO = z.infer<typeof loginUserSchema>;
