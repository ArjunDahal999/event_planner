import z from "zod";

export const eventTypeEnum = z.enum(["public", "private"]);

const datePreprocess = z.preprocess((arg) => {
  if (typeof arg === "string" || typeof arg === "number") return new Date(arg);
  if (arg instanceof Date) return arg;
  return undefined;
}, z.date().optional());

export const createEventSchema = z.object({
  title: z.string().min(1),
  location: z.string().min(1),
  description: z.string().min(1),
  event_date: datePreprocess,
  event_type: eventTypeEnum.optional().default("public"),
  tags: z
    .array(z.string())
    .default([])
    .transform((tags) => [...new Set(tags.map((t) => t.trim().toLowerCase()))]),
});

export type CreateEventDTO = z.infer<typeof createEventSchema>;

export const eventFilterSchema = z.object({
  tags: z
    .string()
    .transform((str) =>
      str
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .join(","),
    )
    .default(""),
  eventType: eventTypeEnum.optional(),
  location: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  sortBy: z.enum(["event_date", "created_at"]).optional().default("event_date"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(5),
});

export type EventFilterDTO = z.infer<typeof eventFilterSchema>;
