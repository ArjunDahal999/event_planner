"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenSchema = exports.verifyEmailSchema = exports.generate2FASchema = exports.loginUserSchema = exports.registerUserSchema = void 0;
const zod_1 = require("zod");
exports.registerUserSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(3)
        .transform((name) => name.toLowerCase()),
    email: zod_1.z.email().transform((email) => email.toLowerCase()),
    password: zod_1.z.string().min(8),
});
exports.loginUserSchema = zod_1.z.object({
    email: zod_1.z
        .email({ message: "Please provide a valid email address." })
        .transform((email) => email.toLowerCase()),
    token: zod_1.z
        .string()
        .min(6, { message: "Token must be at least 6 characters long." }),
});
exports.generate2FASchema = zod_1.z.object({
    email: zod_1.z
        .email({ message: "Please provide a valid email address." })
        .transform((email) => email.toLowerCase()),
    password: zod_1.z
        .string()
        .min(8, { message: "Password must be at least 8 characters long." }),
});
exports.verifyEmailSchema = zod_1.z.object({
    email: zod_1.z
        .email({ message: "Please provide a valid email address." })
        .transform((email) => email.toLowerCase()),
    token: zod_1.z
        .string()
        .min(6, { message: "Token must be at least 6 characters long." }),
});
exports.refreshTokenSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(10, { message: "Refresh token is required." }),
});
//# sourceMappingURL=user.schema.js.map