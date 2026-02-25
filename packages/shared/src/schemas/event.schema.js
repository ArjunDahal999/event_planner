"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventFilterSchema = exports.createEventSchema = exports.eventTypeEnum = void 0;
const zod_1 = __importDefault(require("zod"));
exports.eventTypeEnum = zod_1.default.enum(["public", "private"]);
const datePreprocess = zod_1.default.preprocess((arg) => {
    if (typeof arg === "string" || typeof arg === "number")
        return new Date(arg);
    if (arg instanceof Date)
        return arg;
    return undefined;
}, zod_1.default.date().optional());
exports.createEventSchema = zod_1.default.object({
    title: zod_1.default.string().min(1),
    location: zod_1.default.string().min(1),
    description: zod_1.default.string().min(1),
    event_date: datePreprocess,
    event_type: exports.eventTypeEnum.default("public"),
    tags: zod_1.default.preprocess((val) => typeof val === "string"
        ? val
            .split(",")
            .map((t) => t.trim().toLowerCase())
            .filter(Boolean)
        : val, zod_1.default
        .array(zod_1.default.string())
        .default([])
        .transform((tags) => [...new Set(tags)])),
});
exports.eventFilterSchema = zod_1.default.object({
    tags: zod_1.default
        .string()
        .transform((str) => str
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .join(","))
        .default(""),
    eventType: exports.eventTypeEnum.optional(),
    location: zod_1.default.string().optional(),
    title: zod_1.default.string().optional(),
    description: zod_1.default.string().optional(),
    sortBy: zod_1.default.enum(["event_date", "created_at"]).optional().default("event_date"),
    sortOrder: zod_1.default.enum(["asc", "desc"]).optional().default("asc"),
    page: zod_1.default.coerce.number().int().positive().default(1),
    limit: zod_1.default.coerce.number().int().positive().default(5),
});
//# sourceMappingURL=event.schema.js.map