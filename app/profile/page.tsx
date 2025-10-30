"use client";

import MatchHistory from "./match-history";
import ProfileHeader from "./profile-header";
import StatsComponent from "./stats-component";
import AchievementsComponent from "./achievements-component";
import useBreakpoint from "@/hooks/useBreakpoint";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import GlobalLoader from "@/components/ui/loaders/GlobalLoader";
import { motion } from "motion/react";
import Image from "next/image";

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
    <div className="flex relative flex-col gap-5 items-center pb-10 pt-[calc(75px+2.5rem)]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute top-0 left-0 w-full h-full"
      >
        <Image
          src="/backgrounds/sun-tornado.svg"
          fill
          alt="background"
          className="opacity-70"
        />
      </motion.div>
      <div className="flex flex-col w-full items-center">
        <div className="w-[95%] relative max-w-350 h-30 bg-dark-blue rounded-t-xl overflow-hidden inset-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
          <div className="absolute inset-0 z-20 bg-[url('/backgrounds/pattern.svg')] bg-repeat bg-center bg-auto opacity-70 pointer-events-none"></div>
        </div>
        <ProfileHeader />
      </div>
      <div className="flex flex-col z-30 w-[95%] lg:hidden">
        <AchievementsComponent />
        {breakpoint === "mobile" && <StatsComponent margin />}
      </div>
      <div className="flex w-[95%] z-30  gap-5 items-stretch max-w-350">
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
