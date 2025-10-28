import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { apolloClientServer } from "./lib/apollo-client-server";
import {
  GOOGLE_AUTH_MUTATION,
  LOGIN_MUTATION,
  REFRESH_TOKEN_MUTATION,
} from "@shared/graphql/queries/auth.mutations";
import {
  GoogleAuthResponse,
  LoginResponse,
  RefreshTokenResponse,
} from "./types/auth.types";

async function refreshAccessToken(token: any) {
  try {
    console.log("🔄 Refrescando access token...");

    const { data, error } =
      await apolloClientServer.mutate<RefreshTokenResponse>({
        mutation: REFRESH_TOKEN_MUTATION,
        variables: {
          refreshToken: token.refreshToken,
        },
        errorPolicy: "all",
      });

    if (error || !data?.refreshAccessToken) {
      console.error("❌ Error al refrescar token:", error);
      return {
        ...token,
        error: "RefreshAccessTokenError",
      };
    }

    const { accessToken, refreshToken } = data.refreshAccessToken;

    console.log("✅ Token refrescado exitosamente");

    return {
      ...token,
      accessToken,
      refreshToken,
      accessTokenExpires: Date.now() + 14 * 60 * 1000,
      error: undefined,
    };
  } catch (error) {
    console.error("❌ Error en refreshAccessToken:", error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET || "development-secret-change-in-production",
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
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

        const { accessToken, refreshToken, user } = data.login;

        return {
          id: user.id,
          name: user.name,
          nickname: user.nickname,
          username: user.username,
          email: user.email,
          avatar: user.skins?.[0]?.skin?.img,
          accessToken,
          refreshToken,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" && profile) {
        try {
          console.log("🔐 Autenticando con Google...");

          const { data, error } =
            await apolloClientServer.mutate<GoogleAuthResponse>({
              mutation: GOOGLE_AUTH_MUTATION,
              variables: {
                googleAuthInput: {
                  email: profile.email,
                  name:
                    profile.name || profile.email?.split("@")[0] || "Usuario",
                  googleId: account.providerAccountId,
                },
              },
              errorPolicy: "all",
            });

          if (error || !data?.googleAuth) {
            console.error("❌ Error al autenticar con Google:", error);
            return false;
          }

          const {
            accessToken,
            refreshToken,
            user: backendUser,
          } = data.googleAuth;

          user.id = backendUser.id;
          user.name = backendUser.name;
          user.nickname = backendUser.nickname;
          user.username = backendUser.username;
          user.email = backendUser.email;
          user.avatar = backendUser.skins?.[0]?.skin?.img || null;
          user.image = null;
          user.accessToken = accessToken;
          user.refreshToken = refreshToken;

          console.log("✅ Usuario autenticado con Google exitosamente");
          return true;
        } catch (error) {
          console.error("❌ Error en signIn callback:", error);
          return false;
        }
      }

      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.nickname = user.nickname;
        token.email = user.email;
        token.username = user.username;
        token.avatar = user.avatar;
        token.picture = user.avatar || null;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpires = Date.now() + 14 * 60 * 1000;

        return token;
      }
      if (trigger === "update" && session?.user) {
        if (session.user.avatar) {
          token.avatar = session.user.avatar;
        }
        return token;
      }

      const now = Date.now();
      const timeUntilExpiry = (token.accessTokenExpires as number) - now;

      if (timeUntilExpiry > 60 * 1000) {
        return token;
      }

      console.log("⏰ Access token expirado o por expirar, refrescando...");
      console.log("🕐 Tiempo restante:", timeUntilExpiry);
      console.log("Refresh token:", token.refreshToken);
      return refreshAccessToken(token);
    },

    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.name = token.name as string;
      session.user.nickname = token.nickname as string;
      session.user.email = token.email as string;
      session.user.username = token.username as string;
      session.user.avatar = token.avatar as string;
      session.user.image = (token.avatar as string) || null;
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.error = token.error as string | undefined;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
});
