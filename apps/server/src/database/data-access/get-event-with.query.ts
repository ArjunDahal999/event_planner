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
  take = 10,
  skip = 10,
}: {
  having?: string;
  havingBindings?: any;
  where?: string;
  take?: number;
  skip?: number;
}) => {
  let query = db<IEvent>(EVENT_TABLE)
    .leftJoin<IEventTag>(
      EVENT_TAG_TABLE,
      `${EVENT_TABLE}.id`,
      `${EVENT_TAG_TABLE}.event_id`,
    )
    .leftJoin<ITags>(TAG_TABLE, `${EVENT_TAG_TABLE}.tag_id`, `${TAG_TABLE}.id`)
    .leftJoin<IUser>(USER_TABLE, `${USER_TABLE}.id`, `${EVENT_TABLE}.user_id`);

  if (where) query = query.whereRaw(where);
  if (having && havingBindings) query = query.havingRaw(having, havingBindings);

  const events = await query
    .groupBy(
      `${EVENT_TABLE}.id`,
      `${EVENT_TABLE}.title`,
      `${EVENT_TABLE}.description`,
      `${EVENT_TABLE}.event_date`,
      `${EVENT_TABLE}.location`,
      `${EVENT_TABLE}.event_type`,
      `${EVENT_TABLE}.user_id`,
      `${USER_TABLE}.name`,
    )
    .select(
      `${EVENT_TABLE}.id`,
      `${EVENT_TABLE}.title`,
      `${EVENT_TABLE}.description`,
      `${EVENT_TABLE}.event_date as eventDate`,
      `${EVENT_TABLE}.location`,
      `${EVENT_TABLE}.event_type as eventType`,
      `${EVENT_TABLE}.user_id as userId`,
      `${USER_TABLE}.name as userName`,
      db.raw(
        ` IF(COUNT(${TAG_TABLE}.id) = 0,
                JSON_ARRAY(),
                JSON_ARRAYAGG(JSON_OBJECT('tagName', ${TAG_TABLE}.name,'tagColor', ${TAG_TABLE}.color))) as tags`,
      ),
    );
  return events;
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
