"use client";

import { Icon } from "@iconify-icon/react";
import LvlChip from "../../chips/ranking/LvlChip";

interface RankingListProps {
  users: {
    username: string;
    score: number;
    lvl: number;
  }[];
}

export default function RankingList({ users }: RankingListProps) {
  return (
    <div
      className="bg-white/7 max-h-[600px] [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-background
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-light-gray overflow-y-auto px-8 py-6 z-10 backdrop-blur-md w-[95%] md:w-[80%] max-w-[800px] shadow-[0_-4px_6px_rgba(0,0,0,0.35)] rounded-2xl"
    >
      {users.map((user, index) => (
        <div
          key={user.username}
          className="flex justify-between py-5 items-center border-b border-dark-gray"
        >
          <div className="flex items-center gap-3">
            <div className="h-17 w-17 rounded-full flex items-center justify-center bg-background border border-dark-gray">
              <Icon
                icon="mdi:user"
                width="47"
                className="text-subtitle"
              />
            </div>
            <div className="flex flex-col items-start gap-2">
              <p className="text-sm text-font font-medium">{user.username}</p>
              <LvlChip
                lvl={user.lvl}
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
              <p className="text-lg font-medium">{user.score}</p>
            </div>
            <p className="text-subtitle font-medium text-base">
              Rank: #{index + 4}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
