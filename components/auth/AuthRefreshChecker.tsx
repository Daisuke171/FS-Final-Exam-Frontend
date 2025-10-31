"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useLogout } from "@/hooks/useLogout";

export function AuthRefreshChecker() {
  const { data: session, status, update } = useSession();
  const { logout } = useLogout();
  const hasLoggedOut = useRef(false);
  const hasChecked = useRef(false);

  useEffect(() => {
    if (status === "authenticated" && !hasChecked.current) {
      hasChecked.current = true;
      console.log("🔍 Validando sesión al cargar la página...");

      update().catch((error) => {
        console.error("❌ Error al validar sesión:", error);
      });
    }
    if (
      session?.error === "RefreshAccessTokenError" &&
      status === "authenticated" &&
      !hasLoggedOut.current
    ) {
      hasLoggedOut.current = true;
      console.error("❌ Refresh token expirado. Cerrando sesión...");
      logout("/login?error=SessionExpired");
    }
  }, [session, status, logout, update]);

  return null;
}

export default AuthRefreshChecker;
