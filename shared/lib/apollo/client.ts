"use client";

import { ApolloClient, ApolloLink, from, split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { authHttpLink } from "./httpLink";
import { wsLink } from "./wsLink";
import { globalCache } from "./cache";
import { errorLink } from "./errorLink";

export function createApolloClient() {
  const link = wsLink
    ? split(
        ({ query }) => {
          const def = getMainDefinition(query);
          return (
            def.kind === "OperationDefinition" &&
            def.operation === "subscription"
          );
        },
        wsLink,
        authHttpLink
      )
    : authHttpLink;

  return new ApolloClient({
    link: ApolloLink.from([errorLink, link]),
    cache: globalCache,
  });
}
