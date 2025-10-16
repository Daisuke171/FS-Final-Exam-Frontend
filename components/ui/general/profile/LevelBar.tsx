import { User } from "@/types/game.types";
import LevelBarSkeleton from "../../skeletons/profile/LevelBarSkeleton";
import { Icon } from "@iconify/react";

export default function LevelBar({
  user,
  error,
  loading,
}: {
  user?: User;
  error: any;
  loading: boolean;
}) {
  if (loading) return <LevelBarSkeleton />;
  if (error)
    return (
      <article className="w-full flex-grow text-center max-w-105 px-3 items-center place-self-center xl:max-w-90 flex flex-col justify-center md:border-l border-dark-gray  md:pl-8 xl:pl-5">
        <Icon
          icon="mynaui:sad-ghost"
          width="50"
          className="text-font"
        />
        <h3 className="text-font text-lg font-medium">
          No se ha podido obeter tu experiencia
        </h3>
        <p className="text-subtitle ">{error.message}</p>
      </article>
    );
  return (
    <article className="w-full flex-grow max-w-105 px-3 place-self-center xl:max-w-90 flex flex-col justify-center gap-2 md:border-l border-dark-gray h-23 md:pl-8 xl:pl-5">
      <div className="flex justify-between items-center">
        <p className="text-font text-base font-medium">
          Level {user?.level.number}
        </p>
        <p className="text-font text-sm font-medium">
          {user?.experience}{" "}
          <span className="text-subtitle">/ ${user?.nextLevelExperience}</span>
        </p>
      </div>
      <div className="relative w-full h-3 overflow-hidden rounded-2xl bg-background">
        <div
          style={{ width: `${user?.levelProgress}%` }}
          className="h-3 absolute bg-gradient-to-r from-shadow-blue to-medium-blue rounded-2xl"
        ></div>
      </div>
      <div className="flex items-center mt-1 gap-1">
        <div className="h-7 w-7 flex items-center justify-center rounded-full border border-medium-blue">
          <p className="font-medium text-font">{user?.level.symbol}</p>
        </div>
        <p className="text-font text-sm font-medium">{user?.level.name}</p>
      </div>
    </article>
  );
}
