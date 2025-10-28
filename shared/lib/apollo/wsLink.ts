import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getSession } from "next-auth/react";

const WS_URI = process.env.NEXT_PUBLIC_GRAPHQL_WS ?? "ws://localhost:3011/graphql";

export const wsLink =
  typeof window !== "undefined"
    ? new GraphQLWsLink(
        createClient({
          url: WS_URI,
          connectionParams: async () => {
            const token = (await getSession())?.accessToken;
            return token ? { authorization: `Bearer ${token}` } : {};
          },
        })
      )
    : null;
