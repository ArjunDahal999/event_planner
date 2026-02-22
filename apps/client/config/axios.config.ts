import { tokenStore } from "@/utils/token-store";
import axios, { AxiosError } from "axios";
// import { toast } from "sonner";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

//  request interceptor to add access token to headers
api.interceptors.request.use(async (config) => {
  const token = tokenStore().getAccessToken();
  console.log("Token from store:", token);
  const accessToken =
    tokenStore().getAccessToken() ??
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjIsImlhdCI6MTc3MTc3NDIxMSwiZXhwIjoxNzcyNjM4MjExfQ.cAGWHP5ZhgCpJinvGCqWjRf6P-AveA86oHYG5X8v09s";
  config.headers["Content-Type"] = "application/json";
  console.log("Access Token:", accessToken);
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
      // toast.error(message);
    }
    return Promise.reject(error);
  },
);
export default api;
