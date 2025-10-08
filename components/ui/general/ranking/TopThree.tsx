"use client";

import { Icon } from "@iconify/react";
import LvlChip from "../../chips/ranking/LvlChip";

interface RankingListProps {
  firstPlace: {
    username: string;
    score: number;
    lvl: number;
  };
  secondPlace: {
    username: string;
    score: number;
    lvl: number;
  };
  thirdPlace: {
    username: string;
    score: number;
    lvl: number;
  };
}

export default function TopThree({
  firstPlace,
  secondPlace,
  thirdPlace,
}: RankingListProps) {
  return (
    /* Ranking component */
    <div className="flex items-end z-9">
      <div className="flex relative flex-col gap-3 items-center px-12 py-6 inset-shadow-[-6px_0px_6px_rgba(0,0,0,0.25)] pt-17 bg-white/4 backdrop-blur-md rounded-t-4xl">
        <div className="absolute -top-15 flex flex-col items-center">
          <div className="rounded-full flex items-center justify-center relative border-4 border-medium-blue bg-background w-25 h-25">
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
        <h3 className="text-md font-medium text-font">
          {secondPlace.username}
        </h3>
        <LvlChip
          lvl={secondPlace.lvl}
          color="top-two"
          size="md"
        />
        <div className="flex gap-1 items-center text-light-blue">
          <Icon
            icon="ix:trophy-filled"
            width="21"
          />
          <p className="text-xl font-bold ">{secondPlace.score}</p>
        </div>
      </div>
      {/* Ranking component */}
      <div className="flex relative flex-col gap-6 min-h-50 items-center px-12 py-6 pt-20 bg-white/7 backdrop-blur-md rounded-t-4xl">
        <div className="absolute -top-30 flex flex-col items-center">
          <Icon
            icon="material-symbols:crown"
            width="60"
            className="text-medium-ranking drop-shadow-[0_0_8px_var(--color-medium-ranking)]"
          />
          <div className="rounded-full flex items-center justify-center relative border-4 border-medium-ranking bg-background w-28 h-28">
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
        <h3 className="text-lg font-medium text-font">{firstPlace.username}</h3>
        <LvlChip
          lvl={firstPlace.lvl}
          color="top-one"
          size="lg"
        />
        <div className="flex gap-1 items-center text-medium-ranking">
          <Icon
            icon="ix:trophy-filled"
            width="26"
          />
          <p className="text-2xl font-bold ">{firstPlace.score}</p>
        </div>
      </div>
      {/* Ranking component */}
      <div className="flex relative flex-col gap-3 items-center px-12 py-6 pt-17 inset-shadow-[6px_0px_6px_rgba(0,0,0,0.25)] bg-white/4 backdrop-blur-md rounded-t-4xl">
        <div className="absolute -top-15 flex flex-col items-center">
          <div className="rounded-full flex items-center justify-center relative border-4 border-light-purple bg-background w-25 h-25">
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
        <h3 className="text-md font-medium text-font">{thirdPlace.username}</h3>
        <LvlChip
          lvl={thirdPlace.lvl}
          color="top-three"
          size="md"
        />
        <div className="flex gap-1 items-center text-bright-purple">
          <Icon
            icon="ix:trophy-filled"
            width="21"
          />
          <p className="text-xl font-bold ">{thirdPlace.score}</p>
        </div>
      </div>
    </div>
  );
}
