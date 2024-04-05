import { Posts } from "../models/posts";

export type ErrorApiResponsePayload = {
  message: string;
};

export type CommonApiResponse<T> =
  | { status: "ok"; data: T }
  | { status: "error"; data: ErrorApiResponsePayload };

export type UserType = {
  email: string;
  password: string;
};

export type PostType = {
  id: number;
  author_id: number;
  title: string;
  category: string;
  description: string;
  is_public: boolean;
  location_name: string;
  street: string;
  state: string;
  city: string;
  zip: string;
  geo: unknown;
  created_at: Date;
  is_favorite?: boolean;
  favoriteUsers: { id: number }[];
  lat: number;
  lng: number;
  is_blocked: boolean;
};

export type ExchangePostType = Posts & {
  is_favorite?: boolean;
  favoriteUsers: { id: number }[];
};
