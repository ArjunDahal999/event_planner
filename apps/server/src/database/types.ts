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

export interface IRefreshToken {
  id: number;
  user_id: number;
  token: string;
  created_at: Date;
}

export interface IEvent {
  id: number;
  title: string;
  user_id: number;
  description: string;
  event_date: Date;
  location: string;
  event_type: string;
  created_at: Date;
  updated_at: Date;
}

export interface ITags {
  id: number;
  name: string;
  color: string;
}

export interface IEventTag {
  id: number;
  event_id: number;
  tag_id: number;
}

export interface IRSPV {
  id: number;
  event_id: number;
  user_id: number;
  response: "YES" | "NO" | "MAY BE";
  created_at: Date;
  updated_at: Date;
}
