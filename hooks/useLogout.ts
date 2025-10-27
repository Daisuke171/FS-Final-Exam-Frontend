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
      await logout();
      await signOut({
        redirect: false,
      });

      if (redirectTo) {
        router.push(redirectTo);
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      setIsLoading(false);
    }
  };

  return {
    logout: handleLogout,
    isLoading,
  };
}
