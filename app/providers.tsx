"use client";

import { ReactNode, useMemo } from "react";
import { ApolloProvider } from "@apollo/client/react";
import { SessionProvider, useSession } from "next-auth/react";
import type { Session } from "next-auth";
import { createApolloClient } from "@/shared/lib/apollo/client";
import { GlobalChatProvider } from "@/modules/chat/provider/GlobalChatProvider";
import AuthRefreshChecker from "@/components/auth/AuthRefreshChecker";

function ApolloAuthBoundary({ children }: { children: ReactNode }) {
  const { data: session } = useSession();

  const client = useMemo(() => createApolloClient(), [session?.accessToken]);

  return (
    <ApolloProvider client={client}>
      <AuthRefreshChecker />
      <GlobalChatProvider>{children}</GlobalChatProvider>
    </ApolloProvider>
  );
}

export function Providers({
  children,
  session,
}: {
  children: ReactNode;
  session?: Session | null;
}) {
  return (
    <SessionProvider session={session}>
      <ApolloAuthBoundary>{children}</ApolloAuthBoundary>
    </SessionProvider>
  );
}
