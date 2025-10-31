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
const errorLink = onError((errorHandler) => {
  console.error('Apollo Error Handler called:', errorHandler);
  
  // Check what's available in the error handler with proper type casting
  const anyErrorHandler = errorHandler as {
    graphQLErrors?: Array<{
      message: string;
      locations?: unknown;
      path?: unknown;
    }>;
    networkError?: {
      name: string;
      message: string;
      stack?: string;
    };
  };
  
  if (anyErrorHandler.graphQLErrors) {
    anyErrorHandler.graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(
        `🔴 GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );
  }

  if (anyErrorHandler.networkError) {
    console.error(`🌐 Network error: ${anyErrorHandler.networkError}`);
    console.error('Network error details:', {
      name: anyErrorHandler.networkError.name,
      message: anyErrorHandler.networkError.message,
      stack: anyErrorHandler.networkError.stack,
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
