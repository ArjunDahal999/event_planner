import api from "@/config/axios.config";
import { IApiResponse, IRSPV } from "@event-planner/shared";

export const rsvpService = () =>
  Object.freeze({
    submitResponse,
    getRsvp,
  });

async function submitResponse({
  eventId,
  response,
}: {
  eventId: number;
  response: "YES" | "NO" | "MAY BE";
}) {
  try {
    const { data } = await api.post<IApiResponse<null>>(`rsvp`, {
      eventId,
      response,
    });
    return data;
  } catch (error) {
    console.error("Error submitting RSVP response:", error);
    throw error;
  }
}

async function getRsvp({ eventId }: { eventId: number }) {
  try {
    const { data } = await api.get<IApiResponse<IRSPV>>(
      `rsvp?eventId=${eventId}`,
    );
    return data;
  } catch (error) {
    console.error("Error fetching RSVP response:", error);
    throw error;
  }
}
