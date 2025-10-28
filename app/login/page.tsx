"use client";

import { redirect } from "next/navigation";
import LoginCard from "./login-card";
import { useSession } from "next-auth/react";

export default function LogIn() {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  if (isAuthenticated) {
    redirect("/profile");
  }
  return (
    <div className="flex pt-[calc(75px+2.5rem)] mb-[calc(57px+2.5rem)] md:mb-10 h-screen items-center justify-center">
      <LoginCard />
    </div>
  );
}
