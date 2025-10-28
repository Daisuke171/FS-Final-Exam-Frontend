"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useLogout } from "@/hooks/useLogout";

export function AuthRefreshChecker() {
  const { data: session, status } = useSession();
  const { logout } = useLogout();
  const hasLoggedOut = useRef(false);

  useEffect(() => {
    if (
      session?.error === "RefreshAccessTokenError" &&
      status === "authenticated" &&
      !hasLoggedOut.current
    ) {
      hasLoggedOut.current = true;
      console.error("❌ Refresh token expirado. Cerrando sesión...");

      logout();
    }
  }, [session, status, logout]);

  return null;
}

export default AuthRefreshChecker;
