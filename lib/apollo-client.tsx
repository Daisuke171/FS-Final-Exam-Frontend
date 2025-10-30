"use client";

import { ApolloLink } from "@apollo/client";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { ApolloProvider } from "@apollo/client/react";
import { getSession } from "next-auth/react";
import config from "./config";

// Log configuration in development
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

// Error link for better debugging
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(
        `🔴 GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );
  }

  if (networkError) {
    console.error(`🌐 Network error: ${networkError}`);
    console.error('Network error details:', {
      name: networkError.name,
      message: networkError.message,
      stack: networkError.stack,
    });
  }
});

// Determine GraphQL endpoint
const getGraphQLUri = () => {
  const uri = config.getGraphQLUrl();
  console.log('🔗 GraphQL URI:', uri);
  return uri;
};

const httpLink = new HttpLink({
  uri: getGraphQLUri(),
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([
    errorLink,
    authLink,
    httpLink,
  ]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}
