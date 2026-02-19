export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  is_email_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface IUserActivation {
  id: number;
  user_id: number;
  activation_token: string;
  expires_at: Date;
  created_at: Date;
}

export interface ITwoFactorAuthentication {
  id: number;
  user_id: number;
  email: string;
  secret: string;
  created_at: Date;
}
