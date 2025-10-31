"use client";

import { redirect, useSearchParams } from "next/navigation";
import LoginCard from "./login-card";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useToast } from "@/context/ToastContext";

export default function LogIn() {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const { show } = useToast();

  useEffect(() => {
    if (error === "SessionExpired") {
      show("Tu sesión expiró. Iniciá sesión nuevamente.", {
        title: "Sesión expirada",
        type: "error",
      });
    }
  }, [error, show]);

  if (isAuthenticated) {
    redirect("/profile");
  }
  return (
    <div className="flex pt-[calc(75px+2.5rem)] mb-[calc(57px+2.5rem)] md:mb-10 h-screen items-center justify-center">
      <LoginCard />
    </div>
  );
}
