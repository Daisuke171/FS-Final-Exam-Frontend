"use client";

import { ReactNode, useMemo } from "react";
import { ApolloProvider as Provider } from "@apollo/client/react";
import { useSession } from "next-auth/react";
import { createApolloClient } from "./client";

export function ApolloProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();

  const client = useMemo(() => {
    //const token = session?.accessToken;
    return createApolloClient();
  }, [session]);

  return <Provider client={client}>{children}</Provider>;
}
