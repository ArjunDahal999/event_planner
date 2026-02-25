import z from "zod";
export declare const RSVP_RESPONSE_ENUM: readonly ["YES", "NO", "MAY BE"];
export declare const rsvpCreateSchema: z.ZodObject<{
    eventId: z.ZodCoercedNumber<unknown>;
    response: z.ZodEnum<{
        YES: "YES";
        NO: "NO";
        "MAY BE": "MAY BE";
    }>;
}, z.core.$strip>;
export type CreateRsvpDTO = z.infer<typeof rsvpCreateSchema>;
