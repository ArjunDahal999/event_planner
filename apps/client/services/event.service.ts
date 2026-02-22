import api from "@/config/axios.config";
import { IApiResponse } from "@event-planner/shared";

export const eventService = () =>
  Object.freeze({
    createEvent,
    getEvents,
  });

async function createEvent() {
  try {
    // const { data } = await api.post<IApiResponse<IRegisterResponse>>(
    //   "registerAccount",
    //   payload,
    // );
    // return data;
  } catch (error) {
    throw error;
  }
}

async function getEvents() {
  try {
    const { data } = await api.get<IApiResponse<null>>("event/all");
    return data;
  } catch (error) {
    throw error;
  }
}
