"use client";

import { ReactNode, useMemo } from "react";
import { ApolloProvider } from "@apollo/client/react";
import { ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient as createWsClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

const HTTP_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL! || "http://localhost:3010/graphql";        // ej: https://api.tuapp.com/graphql
const WS_URL = process.env.NEXT_PUBLIC_GRAPHQL_WS_URL! || "ws://localhost:3010/graphql";       // ej: wss://api.tuapp.com/graphql

export function Providers({ children }: { children: ReactNode }) {
  const client = useMemo(() => {
    const httpLink = new HttpLink({ uri: HTTP_URL, fetch });

    // WS sólo en el navegador
    const wsLink = typeof window !== "undefined"
      ? new GraphQLWsLink(createWsClient({ url: WS_URL }))
      : null;

    const link = wsLink
      ? split(
          ({ query }) => {
            const def = getMainDefinition(query);
            return def.kind === "OperationDefinition" && def.operation === "subscription";
          },
          wsLink,
          httpLink
        )
      : httpLink;

    return new ApolloClient({
      link,
      cache: new InMemoryCache(),
    });
  }, []);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
