import { User } from "@/types/user.types";
import LevelBarSkeleton from "../../skeletons/profile/LevelBarSkeleton";
import { Icon } from "@iconify/react";

export default function LevelBar({
  user,
  error,
  loading,
}: {
  user?: User;
  error: Error | undefined;
  loading: boolean;
}) {
  console.log(user?.levelProgress);
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
          No se ha podido obtener tu experiencia
        </h3>
        <p className="text-subtitle ">
          {typeof error === "string"
            ? error
            : (error as { message?: string })?.message ?? "Error desconocido"}
        </p>
      </article>
    );
  const currentLevelXp = user?.level?.experienceRequired || 0;
  const nextLevelXp = user?.nextLevelExperience || 0;
  const xpInCurrentLevel = (user?.experience || 0) - currentLevelXp;
  const xpNeededForLevel = nextLevelXp - currentLevelXp;
  return (
    <article className="w-full flex-grow max-w-105 px-3 place-self-center xl:max-w-105 flex flex-col justify-center gap-2 md:border-l border-dark-gray h-23 md:pl-8 xl:pl-5">
      <div className="flex justify-between items-center">
        <p className="text-font text-base font-medium">
          Level {user?.level.atomicNumber}
        </p>
        <p className="text-font text-sm font-medium">
          {xpInCurrentLevel}{" "}
          <span className="text-subtitle">/ {xpNeededForLevel}</span>
        </p>
      </div>
      <div className="relative w-full h-3 overflow-hidden rounded-2xl bg-background">
        <div
          style={{ width: `${user?.levelProgress}%` }}
          className="h-3 absolute bg-gradient-to-r from-light-purple to-light-blue rounded-2xl animate-[shine_1.5s_ease-in-out_infinite]"
        ></div>
      </div>
      <div className="flex justify-between items-center mt-1">
        <div className="flex items-center gap-1">
          <div
            style={{ borderColor: `${user?.level.color}` }}
            className="h-7.5 w-7.5 flex items-center justify-center rounded-full border-2"
          >
            <p className="font-medium text-font text-sm">
              {user?.level.chemicalSymbol}
            </p>
          </div>
          <p className="text-font font-medium">{user?.level.name}</p>
        </div>
        <p className="text-subtitle text-sm font-medium">
          {user?.levelProgress}%
        </p>
        <div className="w-20"></div>
      </div>
    </article>
  );
}
