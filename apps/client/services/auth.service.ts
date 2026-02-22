import api from "@/config/axios.config";
import {
  IApiResponse,
  IGenerate2FAResponse,
  RegisterUserDTO,
  Generate2FADTO,
  IRegisterResponse,
} from "@event-planner/shared";

export const authService = () =>
  Object.freeze({
    loginWith2FA,
    generate2FA,
    register,
  });

async function generate2FA(
  payload: Generate2FADTO,
): Promise<IApiResponse<IGenerate2FAResponse>> {
  try {
    const { data } = await api.post("generate2FA", payload);
    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

async function loginWith2FA(payload: { userId: string }) {
  try {
    const { data } = await api.post("loginWith2FA", payload);
    return data;
  } catch (error) {
    console.error("2FA generation error:", error);
    throw error;
  }
}

async function register(
  payload: RegisterUserDTO,
): Promise<IApiResponse<IRegisterResponse>> {
  try {
    const { data } = await api.post("registerAccount", payload);
    return data;
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
}
