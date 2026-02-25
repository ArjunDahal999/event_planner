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

export interface IEventResponse {
  events: IEvent[];
  meta: IMeta;
}

export interface IEventByIdResponse extends IEvent {}

export interface IEvent {
  id: number;
  title: string;
  description: string;
  eventDate: string;
  location: string;
  eventType: "public" | "private";
  createdAt: string;
  userId: number;
  userName: string;
  tags: ITags[];
  rsvpSummary: { response: "YES" | "NO" | "MAY BE" | string; count: number }[];
}

export interface IRSPV {
  id: number;
  userId: number;
  eventId: number;
  response: "YES" | "NO" | "MAY BE" | string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITags {
  tagName: string;
  tagColor: string;
}

export interface IMeta {
  totalCount: number;
  currentPage: number;
  limit: number;
  totalPage: number;
}
