import api from "@/config/axios.config";
import {
  IApiResponse,
  IGenerate2FAResponse,
  RegisterUserDTO,
  Generate2FADTO,
  IRegisterResponse,
  LoginUserDTO,
  ILoginResponse,
  VerifyEmailDTO,
  IVerifyEmailResponse,
} from "@event-planner/shared";

export const authService = () =>
  Object.freeze({
    loginWith2FA,
    generate2FA,
    register,
    verifyEmail,
  });

async function generate2FA(payload: Generate2FADTO) {
  try {
    const { data } = await api.post<IApiResponse<IGenerate2FAResponse>>(
      "generate2FA",
      payload,
    );
    return data;
  } catch (error: unknown) {
    throw error;
  }
}

async function loginWith2FA(payload: LoginUserDTO) {
  try {
    const { data } = await api.post<IApiResponse<ILoginResponse>>(
      "loginWith2FA",
      payload,
    );
    return data;
  } catch (error: unknown) {
    throw error;
  }
}

async function register(payload: RegisterUserDTO) {
  try {
    const { data } = await api.post<IApiResponse<IRegisterResponse>>(
      "registerAccount",
      payload,
    );
    return data;
  } catch (error) {
    throw error;
  }
}

async function verifyEmail(payload: VerifyEmailDTO) {
  try {
    const { data } = await api.post<IApiResponse<IVerifyEmailResponse>>(
      "verifyEmail",
      payload,
    );
    return data;
  } catch (error) {
    throw error;
  }
}
