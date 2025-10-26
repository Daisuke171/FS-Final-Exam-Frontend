"use client";

import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useEffect } from "react";

export function useAuthRefresh() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      console.error("❌ Refresh token inválido o expirado. Cerrando sesión...");
      signOut({
        callbackUrl: "/login",
        redirect: true,
      });
    }
  }, [session]);

  return { session, status };
}
