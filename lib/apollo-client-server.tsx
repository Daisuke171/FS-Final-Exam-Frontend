import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

export function createServerApolloClient(token?: string) {
  return new ApolloClient({
    ssrMode: true,
    link: new HttpLink({
      uri:
        process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:3011/graphql",
      headers: token ? { authorization: `Bearer ${token}` } : {},
    }),
    cache: new InMemoryCache(),
  });
}

export const apolloClientServer = createServerApolloClient();
