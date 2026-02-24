import { EventFilters } from "@/components/event/use-filter.hook";
import api from "@/config/axios.config";
import {
  CreateEventDTO,
  IApiResponse,
  IEventResponse,
} from "@event-planner/shared";

export const eventService = () =>
  Object.freeze({
    createEvent,
    getEvents,
  });

async function createEvent({ payload }: { payload: CreateEventDTO }) {
  try {
    const { data } = await api.post<IApiResponse<[]>>("event", payload);
    return data;
  } catch (error) {
    throw error;
  }
}

async function getEvents({ filters }: { filters: EventFilters }) {
  const createQueryString = (filters: EventFilters) => {
    const params = new URLSearchParams();
    if (filters.tags) params.append("tags", filters.tags);
    if (filters.location) params.append("location", filters.location);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.eventType) params.append("eventType", filters.eventType);
    if (filters.title) params.append("title", filters.title);
    if (filters.description) params.append("description", filters.description);
    if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);
    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    return params.toString();
  };
  const queryString = createQueryString(filters);

  try {
    const { data } = await api.get<IApiResponse<IEventResponse>>(
      `event/all?${queryString}`,
    );
    return data;
  } catch (error) {
    throw error;
  }
}
