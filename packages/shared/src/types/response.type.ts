export interface IApiResponse<T> {
  message: string;
  success: boolean;
  statusCode: number;
  data: T;
}

export interface IRegisterResponse {
  id: number;
  name: string;
  email: string;
  activationLink: string;
}

export interface IVerifyEmailResponse {
  id: number;
}

export interface ILoginResponse {
  user: {
    id: number;
    name: string;
    email: string;
    is_email_verified: boolean;
  };
  accessToken: string;
  refreshToken: string;
}

export interface IGenerate2FAResponse {
  user: {
    id: number;
    name: string;
    email: string;
    is_email_verified: boolean;
  };
}

export interface IRefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}
