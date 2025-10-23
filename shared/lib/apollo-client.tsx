"use client";

import { ReactNode } from "react";
import {
  ApolloClient,
  InMemoryCache,
  HttpLink  
} from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";

const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:3010/graphql";

export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: GRAPHQL_URL,
  }),
  cache: new InMemoryCache(),
});

interface ApolloWrapperProps {
  children: ReactNode;
}

export function ApolloWrapper({ children }: ApolloWrapperProps) {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}
