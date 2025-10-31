"use client";

import { ApolloLink } from "@apollo/client";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import { ApolloProvider } from "@apollo/client/react";
import { getSession } from "next-auth/react";
import { ErrorLink } from "@apollo/client/link/error";
import { CombinedGraphQLErrors } from "@apollo/client/errors";

const authLink = new SetContextLink(async (headers) => {
  const session = await getSession();
  const token = session?.accessToken ?? null;

  console.log(
    "🔑 Token siendo enviado:",
    token ? "Token presente" : "No hay token"
  ); // ← Debug
  console.log("📤 Headers:", {
    ...headers,
    authorization: token ? `Bearer ${token}` : "",
  });

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const errorLink = new ErrorLink(({ error, operation, forward }) => {
  if (CombinedGraphQLErrors.is(error)) {
    error.errors.forEach(({ message, extensions }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Operation: ${operation.operationName}`
      );

      if (
        extensions?.code === "UNAUTHENTICATED" ||
        message.toLowerCase().includes("unauthorized") ||
        message.toLowerCase().includes("unauthenticated") ||
        message.toLowerCase().includes("authentication required") ||
        message.toLowerCase().includes("refresh token")
      ) {
        console.error("❌ Error de autenticación detectado en GraphQL");
        if (
          typeof window !== "undefined" &&
          !window.location.pathname.includes("/login")
        ) {
          console.log("🔄 Redirigiendo al login por sesión inválida...");
          window.location.href = "/login?error=SessionExpired";
        }
      }
    });
  } else {
    console.error(`[Network error]: ${error}`);
    if (error && "statusCode" in error) {
      const statusCode = (error as any).statusCode;
      if (statusCode === 401 || statusCode === 403) {
        console.error("❌ Error 401/403 detectado");
        if (
          typeof window !== "undefined" &&
          !window.location.pathname.includes("/login")
        ) {
          window.location.href = "/login?error=SessionExpired";
        }
      }
    }
  }
});

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([
    errorLink,
    authLink,
    new HttpLink({
      uri: (() => {
        const explicit = process.env.NEXT_PUBLIC_GRAPHQL_URL;
        if (explicit) return explicit;
        const base = process.env.NEXT_PUBLIC_API_URL;
        if (base) return `${base.replace(/\/$/, "")}/graphql`;
        return "http://localhost:3010/graphql";
      })(),
    }),
  ]),
  cache: new InMemoryCache(),
});

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}
