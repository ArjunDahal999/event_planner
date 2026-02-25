import {
  EVENT_TABLE,
  EVENT_TAG_TABLE,
  RSVP_TABLE,
  TAG_TABLE,
  USER_TABLE,
} from "../constants";
import db from "../db";
import type { IEvent, IEventTag, IRSPV, ITags, IUser } from "../types";

export const getEventWithTagsQuery = async ({
  where = "",
  having = "",
  havingBindings = "",
  limit = 10,
  page = 1,
  sortBy,
  sortOrder,
}: {
  having?: string;
  havingBindings?: any;
  where?: string;
  limit?: number;
  page?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
  let baseQuery = db<IEvent>(EVENT_TABLE)
    .leftJoin(
      EVENT_TAG_TABLE,
      `${EVENT_TABLE}.id`,
      `${EVENT_TAG_TABLE}.event_id`,
    )
    .leftJoin(TAG_TABLE, `${EVENT_TAG_TABLE}.tag_id`, `${TAG_TABLE}.id`)
    .leftJoin(USER_TABLE, `${USER_TABLE}.id`, `${EVENT_TABLE}.user_id`);

  if (where) baseQuery = baseQuery.whereRaw(where);
  if (having && havingBindings)
    baseQuery = baseQuery.havingRaw(having, havingBindings);

  baseQuery.orderBy(sortBy ?? `${EVENT_TABLE}.created_at`, sortOrder ?? "desc");

  const [count] = await db
    .count("* as total")
    .from(
      baseQuery
        .clone()
        .groupBy(`${EVENT_TABLE}.id`)
        .select(`${EVENT_TABLE}.id`)
        .as("sub"),
    );

  const events = await baseQuery
    .groupBy(
      `${EVENT_TABLE}.id`,
      `${EVENT_TABLE}.title`,
      `${EVENT_TABLE}.description`,
      `${EVENT_TABLE}.event_date`,
      `${EVENT_TABLE}.location`,
      `${EVENT_TABLE}.event_type`,
      `${EVENT_TABLE}.user_id`,
      `${EVENT_TABLE}.created_at`,
      `${USER_TABLE}.name`,
    )
    .select(
      `${EVENT_TABLE}.id`,
      `${EVENT_TABLE}.title`,
      `${EVENT_TABLE}.description`,
      `${EVENT_TABLE}.event_date as eventDate`,
      `${EVENT_TABLE}.location`,
      `${EVENT_TABLE}.event_type as eventType`,
      `${EVENT_TABLE}.created_at as createdAt`,
      `${EVENT_TABLE}.user_id as userId`,
      `${USER_TABLE}.name as userName`,
      db.raw(`
  IF(COUNT(${TAG_TABLE}.id) = 0,
    JSON_ARRAY(),
    JSON_ARRAYAGG(
      JSON_OBJECT(
        'tagName', ${TAG_TABLE}.name,
        'tagColor', ${TAG_TABLE}.color
      )
    )
  ) as tags
`),
    )
    .limit(limit)
    .offset((page - 1) * limit);

  const eventIds = events.map((e) => e.id);

  let rsvpSummaryMap: Record<number, { response: string; count: number }[]> =
    {};

  if (eventIds.length) {
    const rsvpSummary = await db<IRSPV>(RSVP_TABLE)
      .select("event_id", "response")
      .count("response as count")
      .whereIn("event_id", eventIds)
      .groupBy("event_id", "response");

    rsvpSummaryMap = rsvpSummary.reduce(
      (acc, row: any) => {
        if (!acc[row.event_id]) acc[row.event_id] = [];

        acc[row.event_id].push({
          response: row.response,
          count: Number(row.count),
        });

        return acc;
      },
      {} as Record<number, { response: string; count: number }[]>,
    );
  }

  const eventsWithRsvp = events.map((event) => ({
    ...event,
    tags: typeof event.tags === "string" ? JSON.parse(event.tags) : event.tags,
    rsvpSummary: rsvpSummaryMap[event.id] || [],
  }));

  return {
    events: eventsWithRsvp,
    meta: {
      totalCount: parseInt(count.total as string, 10),
      currentPage: page,
      limit: +limit,
      totalPage: Math.ceil(parseInt(count.total as string, 10) / +limit),
    },
  };
};
