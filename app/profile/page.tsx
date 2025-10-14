"use client";

import MatchHistory from "./match-history";
import ProfileHeader from "./profile-header";
import StatsComponent from "./stats-component";
import AchievementsComponent from "./achievements-component";

export default function Profile() {
  return (
    <div className="flex flex-col gap-5 items-center my-10">
      <div className="flex flex-col w-full items-center">
        <div className="w-[95%] max-w-350 h-30 bg-dark-blue rounded-t-xl border-b-2 border-dark-gray"></div>
        <ProfileHeader />
      </div>
      <div className="flex w-[95%] gap-5 items-stretch max-w-350">
        <MatchHistory />
        <section className="w-auto">
          <AchievementsComponent />
          <StatsComponent />
        </section>
      </div>
    </div>
  );
}
