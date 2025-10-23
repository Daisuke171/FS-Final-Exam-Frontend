"use client";

import { ApolloLink } from "@apollo/client";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import { ApolloProvider } from "@apollo/client/react";
import { getSession } from "next-auth/react";

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

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([
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
