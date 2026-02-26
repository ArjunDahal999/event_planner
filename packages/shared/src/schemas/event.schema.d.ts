import z from "zod";
export declare const eventTypeEnum: z.ZodEnum<{
    public: "public";
    private: "private";
}>;
export declare const createEventSchema: z.ZodObject<{
    title: z.ZodString;
    location: z.ZodString;
    description: z.ZodString;
    event_date: z.ZodPipe<z.ZodTransform<Date | undefined, unknown>, z.ZodOptional<z.ZodDate>>;
    event_type: z.ZodDefault<z.ZodEnum<{
        public: "public";
        private: "private";
    }>>;
    tags: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodPipe<z.ZodDefault<z.ZodArray<z.ZodString>>, z.ZodTransform<string[], string[]>>>;
}, z.core.$strip>;
export type CreateEventDTO = z.infer<typeof createEventSchema>;
export declare const eventFilterSchema: z.ZodObject<{
    tags: z.ZodDefault<z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>>;
    eventType: z.ZodOptional<z.ZodEnum<{
        public: "public";
        private: "private";
    }>>;
    location: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    sortBy: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        created_at: "created_at";
        event_date: "event_date";
    }>>>;
    sortOrder: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        desc: "desc";
        asc: "asc";
    }>>>;
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export type EventFilterDTO = z.infer<typeof eventFilterSchema>;
