"use client";

import MatchHistory from "./match-history";
import ProfileHeader from "./profile-header";
import StatsComponent from "./stats-component";
import AchievementsComponent from "./achievements-component";
import useBreakpoint from "@/hooks/useBreakpoint";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import GlobalLoader from "@/components/ui/loaders/GlobalLoader";

export default function Profile() {
  const breakpoint = useBreakpoint();
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  if (isLoading) return <GlobalLoader />;
  if (!isAuthenticated) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col gap-5 items-center mb-10 mt-[calc(75px+2.5rem)]">
      <div className="flex flex-col w-full items-center">
        <div className="w-[95%] max-w-350 h-30 bg-dark-blue rounded-t-xl border-b-2 border-dark-gray"></div>
        <ProfileHeader />
      </div>
      <div className="flex flex-col w-[95%] lg:hidden">
        <AchievementsComponent />
        {breakpoint === "mobile" && <StatsComponent margin />}
      </div>
      <div className="flex w-[95%]  gap-5 items-stretch max-w-350">
        <MatchHistory />
        <div className="hidden md:block lg:hidden w-[30%]">
          {breakpoint === "tablet" && <StatsComponent margin />}
        </div>
        <section className="w-[48%] hidden lg:block">
          {breakpoint === "desktop" && <AchievementsComponent />}
          {breakpoint === "desktop" && <StatsComponent margin />}
        </section>
      </div>
    </div>
  );
}
