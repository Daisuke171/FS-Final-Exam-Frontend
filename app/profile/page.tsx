"use client";

import MatchHistory from "./match-history";
import ProfileHeader from "./profile-header";
import StatsComponent from "./stats-component";
import AchievementsComponent from "./achievements-component";

const userId = "3a6d2a20-ab14-46fb-b7fc-13ee32760dc9";

export default function Profile() {
  return (
    <div className="flex flex-col gap-5 items-center my-10">
      <div className="flex flex-col w-full items-center">
        <div className="w-[95%] max-w-350 h-30 bg-dark-blue rounded-t-xl border-b-2 border-dark-gray"></div>
        <ProfileHeader userId={userId} />
      </div>
      <div className="flex flex-col w-[95%] lg:hidden">
        <AchievementsComponent />
        <div className="block md:hidden">
          <StatsComponent
            margin
            userId={userId}
          />
        </div>
      </div>
      <div className="flex w-[95%]  gap-5 items-stretch max-w-350">
        <MatchHistory userId={userId} />
        <div className="hidden md:block lg:hidden w-[30%]">
          <StatsComponent userId={userId} />
        </div>
        <section className="w-[48%] hidden lg:block">
          <AchievementsComponent />
          <StatsComponent
            margin
            userId={userId}
          />
        </section>
      </div>
    </div>
  );
}
