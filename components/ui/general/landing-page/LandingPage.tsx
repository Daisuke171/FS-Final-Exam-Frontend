"use client";

import Hero from "./Hero";
import AboutUs from "./AboutUs";
import ProgressSection from "./ProgressSection";
import GamesSection from "./GamesSection";
import CtaSection from "./CtaSection";
import { useSession } from "next-auth/react";
import UserContent from "./UserContent";

export default function LandingPage() {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  return (
    <div>
      {isAuthenticated ? (
        <UserContent />
      ) : (
        <>
          <Hero />
          <AboutUs />
          <main className="flex flex-col items-center w-full">
            <ProgressSection />
            <GamesSection />
          </main>
          <CtaSection />
        </>
      )}
    </div>
  );
}
