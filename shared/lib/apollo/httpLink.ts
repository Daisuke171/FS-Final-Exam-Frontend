import { HttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getSession } from "next-auth/react";

const HTTP_URI = process.env.NEXT_PUBLIC_GRAPHQL_HTTP ?? "http://localhost:3011/graphql";

const baseHttpLink = new HttpLink({ uri: HTTP_URI });

export const authHttpLink = setContext(async (_, { headers }) => {
  const session = await getSession();
  const token = session?.accessToken;
  return {
    headers: {
      ...headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  };
}).concat(baseHttpLink);
