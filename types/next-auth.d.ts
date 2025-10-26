import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name: string;
      email: string;
      nickname: string;
      username: string;
      avatar?: string;
    } & DefaultSession["user"];
    accessToken: string;
    refreshToken: string;
    error?: string;
  }

  interface User extends DefaultUser {
    id: string;
    name: string;
    email: string;
    nickname: string;
    username: string;
    avatar?: string;
    accessToken: string;
    refreshToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    email: string;
    nickname: string;
    username: string;
    avatar?: string;
    accessToken: string;
    refreshToken: string;
    error?: string;
  }
}
