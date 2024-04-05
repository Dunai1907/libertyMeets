import NextAuth, { DefaultUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { findUser, getUserByCredentials } from "../../../services/users";
import { DEFAULT_LAT, DEFAULT_LNG } from "../../../constants/constants";
import { NextApiRequest, NextApiResponse } from "next";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import config from "config";

const secret = process.env.NEXTAUTH_SECRET! as string;

const decodeV4 = (v4String: string): string => {
  const uuid = v4String.slice(0, 36);
  const hexEncodedPart = v4String.slice(36);
  return Buffer.from(hexEncodedPart, "hex").toString();
};

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const cookies = parseCookies({ req });
  let maxAge = config.get<number>("token.sessionLifetimeSec");

  if (cookies["remember-me"] && cookies["remember-me"] === "true") {
    maxAge = config.get<number>("token.sessionExtendedLifetimeSec");
  } else if (req.body.rememberMe) {
    maxAge =
      req.body.rememberMe === "true"
        ? config.get<number>("token.sessionExtendedLifetimeSec")
        : config.get<number>("token.sessionLifetimeSec");

    setCookie({ res }, "remember-me", req.body.rememberMe, {
      maxAge,
      path: "/",
    });
  }

  const options = {
    providers: [
      CredentialsProvider({
        id: "credentials",
        name: "credentials",
        credentials: {
          email: { label: "Email", type: "text", placeholder: "email" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          if (!credentials) {
            return null;
          }

          const user = await getUserByCredentials(credentials);

          if (!user) {
            return null;
          }

          return user as unknown as DefaultUser | null;
        },
      }),
      CredentialsProvider({
        id: "autoCredentials",
        name: "autoCredentials",
        credentials: {
          token: { label: "Token", type: "text", placeholder: "token" },
        },
        async authorize(credentials) {
          if (!credentials) {
            return null;
          }

          const { token } = credentials;
          const decodedEmail = decodeV4(token);
          const user = await findUser(decodedEmail);

          return user as unknown as DefaultUser | null;
        },
      }),
    ],
    callbacks: {
      jwt: async (params: any) => {
        const { token, user } = params;
        if (user && !user.is_enabled) {
          token.email = user.email;
          token.is_blocked = true;
          return token;
        }
        if (user) {
          if (user.lat && user.lng) {
            token.lat = +user.lat;
            token.lng = +user.lng;
          } else {
            token.lat = DEFAULT_LAT;
            token.lng = DEFAULT_LNG;
          }
          token.id = user.id;
          token.email = user.email;
        }

        return token;
      },
      session: ({ session, token }: { session: any; token: any }) => {
        if (token.is_blocked) {
          session.user = null;
          session.email = token.email;
          return session;
        }

        if (token) {
          session.user!.id = token.id as number;
          session.user!.email = token.email as string;
          session.user!.lat = token.lat as number;
          session.user!.lng = token.lng as number;
        }

        return session;
      },
    },
    events: {
      async signOut() {
        destroyCookie({ res }, "remember-me", {
          path: "/",
        });
      },
    },
    secret,
    session: {
      maxAge,
    },
    jwt: {
      maxAge,
    },
    pages: {
      signIn: "/signin",
    },
  };

  return NextAuth(req, res, options);
}
