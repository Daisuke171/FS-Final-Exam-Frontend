"use client";

import { ApolloLink } from "@apollo/client";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import { ApolloProvider } from "@apollo/client/react";
import { getSession } from "next-auth/react";
import config from "./config";
import { ErrorLink } from "@apollo/client/link/error";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
config.logConfig();

const authLink = new SetContextLink(async (headers) => {
  const session = await getSession();
  const token = session?.accessToken ?? null;

  console.log(
    "🔑 Token siendo enviado:",
    token ? "Token presente" : "No hay token"
  );

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const getGraphQLUri = () => {
  const uri = config.getGraphQLUrl();
  console.log("🔗 GraphQL URI:", uri);
  return uri;
};

const httpLink = new HttpLink({
  uri: getGraphQLUri(),
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
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
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all",
    },
    query: {
      errorPolicy: "all",
    },
  },
});

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}
