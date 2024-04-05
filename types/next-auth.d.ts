import NextAuth from "next-auth";
import { Users } from "../models/users";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      email: string;
      lat: number;
      lng: number;
      is_enabled: boolean;
    };
    email?: string;
  }

  interface DefaultUser {
    id: number;
    is_enabled: boolean;
    email: string;
    password: string;
    reset_pwd_token: string;
    liveTime: Date;
  }
}
