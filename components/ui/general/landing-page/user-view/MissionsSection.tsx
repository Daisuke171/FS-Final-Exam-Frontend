"use client";

import { Icon } from "@iconify/react";
import MissionItem from "./MissionItem";
import { MissionFilter, useMissions } from "@/hooks/useMissions";
import XpBarAnimation from "@/components/game/rock-paper-scissors/general/LevelUpModal";
import MissionItemSkeleton from "@/components/ui/skeletons/landing-page/user-view/MissionitemSkeleton";
import { AnimatePresence, motion } from "motion/react";

export default function MissionsSection() {
  const {
    claiming,
    handleClaimReward,
    showXp,
    animationData,
    closeXpAnimation,
    loading,
    filter,
    setFilter,
    filteredMissions,
  } = useMissions();

  const getButtonClass = (filterType: MissionFilter) => {
    const baseClass =
      "py-2 px-4 rounded-lg font-medium transition-all duration-300 relative cursor-pointer";
    const isActive = filter === filterType;

    return `${baseClass} ${
      isActive
        ? "bg-shadow-blue text-font"
        : "bg-white/4 hover:bg-white/6 text-subtitle"
    }`;
  };

  const skeletons = 3;
  return (
    <section className="w-full md:w-[60%]">
      <div className="flex sm:flex-row flex-col items-start mb-5 sm:mb-0 gap-5 sm:gap-10">
        <h2
          className="text-xl md:text-2xl sm:mb-5 text-font pb-3 font-medium flex items-center relative gap-2 after:h-0.5
                after:absolute after:w-2/3 after:bg-gradient-to-r after:from-hover-purple after:to-light-purple
                after:-bottom-1 after:left-0 after:rounded-full"
        >
          <Icon
            icon={"lets-icons:paper-fill"}
            className="text-bright-purple text-2xl md:text-3xl"
          />
          Misiones
        </h2>
        <div className="flex items-center gap-2">
          <button
            className={getButtonClass("all")}
            onClick={() => setFilter("all")}
            disabled={loading}
          >
            Todas
          </button>
          <button
            className={getButtonClass("general")}
            onClick={() => setFilter("general")}
            disabled={loading}
          >
            Generales
          </button>
          <button
            className={getButtonClass("daily")}
            onClick={() => setFilter("daily")}
            disabled={loading}
          >
            Diarias
          </button>
        </div>
      </div>
      <div className="flex flex-col pr-2 gap-3 max-h-155 overflow-y-auto custom-scrollbar">
        {loading &&
          Array.from({ length: skeletons }, (_, index) => (
            <MissionItemSkeleton key={index} />
          ))}
        {loading &&
          Array.from({ length: skeletons }, (_, index) => (
            <MissionItemSkeleton key={index} />
          ))}

        {!loading && (
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              className="flex flex-col gap-3"
            >
              {filteredMissions.map((mission, index) => (
                <motion.div
                  key={mission.id}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: index * 0.05,
                  }}
                >
                  <MissionItem
                    handleClaimReward={handleClaimReward}
                    claiming={claiming}
                    mission={mission}
                  />
                </motion.div>
              ))}

              {filteredMissions.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16 text-subtitle"
                >
                  <Icon
                    icon="mdi:clipboard-text-off-outline"
                    className="text-6xl mx-auto mb-3 opacity-60"
                  />
                  <p className="text-lg font-medium">
                    {filter === "all" && "No hay misiones disponibles"}
                    {filter === "general" && "No hay misiones generales"}
                    {filter === "daily" && "No hay misiones diarias"}
                  </p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
      {showXp && animationData && (
        <XpBarAnimation
          xpGained={animationData.rewards.xp}
          leveledUp={animationData.levelData.leveledUp}
          oldLevel={animationData.levelData.oldLevel}
          newLevel={animationData.levelData.newLevel}
          unlockedSkins={animationData.levelData.unlockedSkins}
          xpInCurrentLevelBefore={
            animationData.levelData.xpInCurrentLevelBefore
          }
          xpNeededForLevelBefore={
            animationData.levelData.xpNeededForLevelBefore
          }
          progressBefore={animationData.levelData.progressBefore}
          xpInCurrentLevelAfter={animationData.levelData.xpInCurrentLevelAfter}
          xpNeededForLevelAfter={animationData.levelData.xpNeededForLevelAfter}
          progressAfter={animationData.levelData.progressAfter}
          oldLevelName={animationData.levelData.oldLevelName}
          oldLevelSymbol={animationData.levelData.oldLevelSymbol}
          oldLevelColor={animationData.levelData.oldLevelColor}
          newLevelName={animationData.levelData.newLevelName}
          newLevelSymbol={animationData.levelData.newLevelSymbol}
          newLevelColor={animationData.levelData.newLevelColor}
          onComplete={closeXpAnimation}
        />
      )}
    </section>
  );
}
