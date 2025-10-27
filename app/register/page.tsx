"use client";

import RegisterApp from "@/components/register/RegisterApp";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function RegisterPage() {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  if (isAuthenticated) {
    redirect("/profile");
  }
  return (
    <div className="flex flex-col min-h-screen w-full items-center justify-center mt-[calc(75.5px+2.5rem)] mb-[calc(57px+2.5rem)] md:mb-10">
      <RegisterApp />
    </div>
  );
}
