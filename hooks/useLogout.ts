"use client";

import { useMutation } from "@apollo/client/react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { LOGOUT_MUTATION } from "@shared/graphql/queries/auth.mutations";
import { useRouter } from "next/navigation";

export function useLogout() {
  const router = useRouter();
  const [logout] = useMutation(LOGOUT_MUTATION);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async (redirectTo?: string) => {
    setIsLoading(true);
    try {
      await logout().catch((err) => {
        console.warn("⚠️ Error al cerrar sesión en backend:", err);
      });

      await signOut({ redirect: false });
      if (redirectTo) router.push(redirectTo);
      else window.location.href = "/";
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      await signOut({ redirect: false });
      window.location.href = "/";
    } finally {
      setIsLoading(false);
    }
  };

  return {
    logout: handleLogout,
    isLoading,
  };
}
