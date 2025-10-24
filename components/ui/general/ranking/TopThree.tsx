"use client";

import { Icon } from "@iconify/react";
import LvlChip from "../../chips/ranking/LvlChip";
import { motion } from "motion/react";
import { LeaderboardEntry } from "@/types/game.types";

interface TopThreeProps {
  firstPlace: LeaderboardEntry;
  secondPlace: LeaderboardEntry;
  thirdPlace: LeaderboardEntry;
}

export default function TopThree({
  firstPlace,
  secondPlace,
  thirdPlace,
}: TopThreeProps) {
  return (
    /* Ranking component */
    <div className="flex items-end z-9 w-full justify-center">
      <motion.div
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: 1, scaleY: 1 }}
        exit={{ opacity: 0, scaleY: 0 }}
        transition={{ delay: 0.1 }}
        className="flex relative  flex-col origin-bottom gap-3 items-center w-[28%] md:w-50 py-6 inset-shadow-[-6px_0px_6px_rgba(0,0,0,0.25)] pt-14 sm:pt-17 bg-white/4 backdrop-blur-md rounded-t-4xl"
      >
        <div className="absolute -top-12 sm:-top-15 flex flex-col items-center">
          <div className="rounded-full flex items-center justify-center relative border-4 border-medium-blue bg-background w-21 h-21 sm:w-25 sm:h-25">
            <Icon
              icon="mdi:user"
              width="80"
              className="text-subtitle"
            />
            <div className="rounded-md rotate-45 absolute -bottom-3 left-1/2 -translate-x-1/2 bg-shadow-blue w-6 h-6">
              <p className="text-lg font-bold text-font -rotate-45 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                2
              </p>
            </div>
          </div>
        </div>
        <h3 className="text-sm sm:text-md font-medium text-font">
          {secondPlace.nickname}
        </h3>
        <LvlChip
          lvl={secondPlace.level}
          color="top-two"
          size="md"
        />
        <div className="flex gap-1 items-center text-light-blue">
          <Icon
            icon="ix:trophy-filled"
            width="21"
          />
          <p className="text-lg sm:text-xl font-bold ">
            {secondPlace.totalScore}
          </p>
        </div>
      </motion.div>
      {/* Ranking component */}
      <motion.div
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: 1, scaleY: 1 }}
        exit={{ opacity: 0, scaleY: 0 }}
        className="flex relative flex-col origin-bottom gap-6 min-h-50 items-center w-[35%] md:w-60 py-6 pt-18 sm:pt-20 bg-white/7 backdrop-blur-md rounded-t-4xl"
      >
        <div className="absolute -top-28 sm:-top-30 flex flex-col items-center">
          <Icon
            icon="material-symbols:crown"
            width="60"
            className="text-medium-ranking  drop-shadow-[0_0_8px_var(--color-medium-ranking)]"
          />
          <div className="rounded-full flex items-center justify-center relative border-4 border-medium-ranking bg-background w-24 h-24 sm:w-28 sm:h-28">
            <Icon
              icon="mdi:user"
              width="90"
              className="text-subtitle"
            />
            <div className="rounded-md rotate-45 absolute -bottom-3 left-1/2 -translate-x-1/2 bg-shadow-ranking w-6 h-6">
              <p className="text-lg font-bold text-font -rotate-45 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                1
              </p>
            </div>
          </div>
        </div>
        <h3 className="text-base sm:text-lg font-medium text-font">
          {firstPlace.nickname}
        </h3>
        <LvlChip
          lvl={firstPlace.level}
          color="top-one"
          size="lg"
        />
        <div className="flex gap-1 items-center text-medium-ranking">
          <Icon
            icon="ix:trophy-filled"
            width="26"
          />
          <p className="text-xl sm:text-2xl font-bold ">
            {firstPlace.totalScore}
          </p>
        </div>
      </motion.div>
      {/* Ranking component */}
      <motion.div
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: 1, scaleY: 1 }}
        exit={{ opacity: 0, scaleY: 0 }}
        transition={{ delay: 0.2 }}
        className="flex relative origin-bottom flex-col gap-3 items-center w-[28%] md:w-50 py-6 pt-14 sm:pt-17 inset-shadow-[6px_0px_6px_rgba(0,0,0,0.25)] bg-white/4 backdrop-blur-md rounded-t-4xl"
      >
        <div className="absolute -top-12 sm:-top-15 flex flex-col items-center">
          <div className="rounded-full flex items-center justify-center relative border-4 border-light-purple bg-background w-21 h-21 sm:w-25 sm:h-25">
            <Icon
              icon="mdi:user"
              width="80"
              className="text-subtitle"
            />
            <div className="rounded-md rotate-45 absolute -bottom-3 left-1/2 -translate-x-1/2 bg-shadow-purple w-6 h-6">
              <p className="text-lg font-bold text-font -rotate-45 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                3
              </p>
            </div>
          </div>
        </div>
        <h3 className="text-sm sm:text-md font-medium text-font">
          {thirdPlace.nickname}
        </h3>
        <LvlChip
          lvl={thirdPlace.level}
          color="top-three"
          size="md"
        />
        <div className="flex gap-1 items-center text-bright-purple">
          <Icon
            icon="ix:trophy-filled"
            width="21"
          />
          <p className="text-lg sm:text-xl font-bold ">
            {thirdPlace.totalScore}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
