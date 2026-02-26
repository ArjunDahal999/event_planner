import { z } from "zod";
export declare const registerUserSchema: z.ZodObject<{
    name: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
    email: z.ZodPipe<z.ZodEmail, z.ZodTransform<string, string>>;
    password: z.ZodString;
}, z.core.$strip>;
export type RegisterUserDTO = z.infer<typeof registerUserSchema>;
export declare const loginUserSchema: z.ZodObject<{
    email: z.ZodPipe<z.ZodEmail, z.ZodTransform<string, string>>;
    token: z.ZodString;
}, z.core.$strip>;
export type LoginUserDTO = z.infer<typeof loginUserSchema>;
export declare const generate2FASchema: z.ZodObject<{
    email: z.ZodPipe<z.ZodEmail, z.ZodTransform<string, string>>;
    password: z.ZodString;
}, z.core.$strip>;
export type Generate2FADTO = z.infer<typeof generate2FASchema>;
export declare const verifyEmailSchema: z.ZodObject<{
    email: z.ZodPipe<z.ZodEmail, z.ZodTransform<string, string>>;
    token: z.ZodString;
}, z.core.$strip>;
export type VerifyEmailDTO = z.infer<typeof verifyEmailSchema>;
export declare const refreshTokenSchema: z.ZodObject<{
    refreshToken: z.ZodString;
}, z.core.$strip>;
export type RefreshTokenDTO = z.infer<typeof refreshTokenSchema>;
