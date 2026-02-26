import { tokenStore } from "@/utils/token-store";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

//  request interceptor to add access token to headers
api.interceptors.request.use(async (config) => {
  const accessToken = tokenStore().getAccessToken();
  config.headers["Content-Type"] = "application/json";
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

//  response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message: string }>) => {
    const message =
      error.response?.data?.message ??
      "Something went wrong. Please try again.";
    if (!error.config?.skipErrorToast) {
      toast.error(message);
    }
    return Promise.reject(error);
  },
);
export default api;
