import { th } from "zod/locales";
import {
  EVENT_TABLE,
  EVENT_TAG_TABLE,
  TAG_TABLE,
  USER_TABLE,
} from "../constants.ts";
import db from "../db.ts";
import type { IEvent, IEventTag, ITags, IUser } from "../types.ts";

export const getEventWithTagsQuery = async ({
  where = "",
  having = "",
  havingBindings = "",
  limit = 1,
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
    .leftJoin<IEventTag>(
      EVENT_TAG_TABLE,
      `${EVENT_TABLE}.id`,
      `${EVENT_TAG_TABLE}.event_id`,
    )
    .leftJoin<ITags>(TAG_TABLE, `${EVENT_TAG_TABLE}.tag_id`, `${TAG_TABLE}.id`)
    .leftJoin<IUser>(USER_TABLE, `${USER_TABLE}.id`, `${EVENT_TABLE}.user_id`);

  if (where) baseQuery = baseQuery.whereRaw(where);
  if (having && havingBindings)
    baseQuery = baseQuery.havingRaw(having, havingBindings);
  if (sortBy && sortOrder) baseQuery.orderBy(sortBy, sortOrder);

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
      db.raw(
        ` IF(COUNT(${TAG_TABLE}.id) = 0,
                JSON_ARRAY(),
                JSON_ARRAYAGG(JSON_OBJECT('tagName', ${TAG_TABLE}.name,'tagColor', ${TAG_TABLE}.color))) as tags`,
      ),
    )
    .limit(limit)
    .offset((page - 1) * limit);
  return {
    data: events,
    meta: {
      totalCount: count.total,
      currentPage: +page,
      limit: +limit,
      totalPage: Math.ceil((count.total as number) / +limit),
    },
  };
};

/*
      const events = await db(EVENT_TABLE)
        .leftJoin(
          EVENT_TAG_TABLE,
          `${EVENT_TABLE}.id`,
          `${EVENT_TAG_TABLE}.event_id`,
        )
        .leftJoin(TAG_TABLE, `${EVENT_TAG_TABLE}.tag_id`, `${TAG_TABLE}.id`)
        .leftJoin(USER_TABLE, `${USER_TABLE}.id`, `${EVENT_TABLE}.user_id`)
        .where({ user_id: userId })
        .select(
          `${EVENT_TABLE}.id`,
          `${EVENT_TABLE}.title`,
          `${EVENT_TABLE}.description`,
          `${EVENT_TABLE}.event_date as eventDate`,
          `${EVENT_TABLE}.location`,
          `${EVENT_TABLE}.event_type as eventType`,
          `${EVENT_TABLE}.user_id as userId`,
          `${USER_TABLE}.name  as userName`,
          `${TAG_TABLE}.name as tagName`,
          `${TAG_TABLE}.color as tagColor`,
        );

      const map = new Map();
      events.forEach(({ id, tagName, tagColor, ...rest }) => {
        if (!map.has(id)) {
          map.set(id, {
            id,
            ...rest,
            tags: [tagName && { tagName, tagColor }],
          });
        } else {
          map.get(id).tags.push(tagName && { tagName, tagColor });
        }
      });
      const data = [...map.values()];

*/
