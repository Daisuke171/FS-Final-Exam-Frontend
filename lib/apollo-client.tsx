"use client";

import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";

export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: process.env.GRAPHQL_URL,
  }),
  cache: new InMemoryCache(),
});

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}
