"use client";

import { Icon } from "@iconify-icon/react";
import { motion } from "motion/react";
import LvlChip from "../../chips/ranking/LvlChip";
import { LeaderboardEntry } from "@/types/game.types";

interface RankingListProps {
  users: LeaderboardEntry[];
}

export default function RankingList({ users }: RankingListProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white/7  px-2 sm:px-3 py-2 z-10 backdrop-blur-md w-[95%] md:w-[90%] max-w-[800px] shadow-[0_-4px_6px_rgba(0,0,0,0.35)] rounded-2xl"
    >
      <div className="max-h-[600px] custom-scrollbar overflow-y-auto px-4">
        {users.map((user, index) => (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: (index + 2) * 0.1 }}
            key={user.nickname}
            className="flex justify-between py-3 sm:py-5 items-center border-b border-dark-gray last:border-none"
          >
            <div className="flex items-center gap-3">
              <div className="h-17 w-17 rounded-full flex items-center justify-center bg-background border border-dark-gray ">
                <Icon
                  icon="mdi:user"
                  width="47"
                  className="text-subtitle"
                />
              </div>
              <div className="flex flex-col items-start gap-2">
                <p className="text-sm text-font font-medium">{user.nickname}</p>
                <LvlChip
                  lvl={user.level}
                  color="top-list"
                  size="sm"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1 text-font">
                <Icon
                  icon="ix:trophy-filled"
                  width="21"
                />
                <p className="text-base sm:text-lg font-medium">
                  {user.totalScore}
                </p>
              </div>
              <p className="text-subtitle font-medium text-sm sm:text-base">
                Rank: #{user.rank}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
