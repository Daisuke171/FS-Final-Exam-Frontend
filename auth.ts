import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { apolloClientServer } from "./lib/apollo-client-server";
import { LOGIN_MUTATION } from "@shared/graphql/queries/auth.mutations";
import { LoginResponse } from "./types/auth.types";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET || "development-secret-change-in-production",
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        usernameOrEmail: {
          label: "Usuario o Email",
          type: "text",
          placeholder: "usuario o email",
        },
        password: {
          label: "Contraseña",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (!credentials?.usernameOrEmail || !credentials?.password) {
          return null;
        }

        const { data, error } = await apolloClientServer.mutate<LoginResponse>({
          mutation: LOGIN_MUTATION,
          variables: {
            loginInput: {
              usernameOrEmail: credentials.usernameOrEmail,
              password: credentials.password,
            },
          },
          errorPolicy: "all",
        });

        if (error || !data?.login) {
          const message = error?.message || "XDD";
          throw new Error(message);
        }

        const { accessToken, user } = data.login;

        return {
          id: user.id,
          name: user.name,
          nickname: user.nickname,
          username: user.username,
          email: user.email,
          avatar: user.skins?.[0]?.skin?.img,
          accessToken,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.nickname = user.nickname;
        token.email = user.email;
        token.username = user.username;
        token.avatar = user.avatar;
        token.accessToken = user.accessToken;
        console.log("💾 Token guardado:", token.accessToken);
      }
      if (trigger === "update" && session?.user) {
        if (session.user.avatar) {
          token.avatar = session.user.avatar;
        }
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.name = token.name as string;
      session.user.nickname = token.nickname as string;
      session.user.email = token.email as string;
      session.user.username = token.username as string;
      session.user.avatar = token.avatar as string;
      session.accessToken = token.accessToken as string;
      console.log("📦 Session creada:", session);

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },
});
