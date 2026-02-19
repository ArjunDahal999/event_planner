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
});

export type CreateEvent = z.infer<typeof createEventSchema>;
