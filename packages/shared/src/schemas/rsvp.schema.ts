import z from "zod";

export const RSVP_RESPONSE_ENUM = ["YES", "NO", "MAY BE"] as const;

export const rsvpCreateSchema = z.object({
  eventId: z.coerce.number().positive().min(1),
  response: z.enum(RSVP_RESPONSE_ENUM),
});

export type CreateRsvpDTO = z.infer<typeof rsvpCreateSchema>;
