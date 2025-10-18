"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";

export interface MatchHistoryComponentProps {
  logo: string;
  result: "won" | "lost" | "draw";
  points: number;
  date: string;
  duration: number;
  game?: string;
}

const gameResult = {
  won: "Victoria",
  lost: "Derrota",
  draw: "Empate",
};

const textColor = {
  won: "text-light-success",
  lost: "text-light-error",
  draw: "text-subtitle",
};

const symbol = {
  won: "+",
  lost: "-",
  draw: "+",
};

const detailsColor = {
  won: "after:bg-success",
  lost: "after:bg-light-error",
  draw: "after:bg-light-gray",
};

const background = {
  won: "bg-[linear-gradient(to_right,_var(--color-dark-success)_10%,_var(--color-dark-success)_10%,_var(--color-transparent-success)_100%)]",
  lost: "bg-[linear-gradient(to_right,_var(--color-dark-error)_10%,_var(--color-dark-error)_10%,_var(--color-transparent-error)_100%)]",
  draw: "bg-[linear-gradient(to_right,_var(--color-shadow-gray)_10%,_var(--color-shadow-gray)_10%,_var(--color-transparent-gray)_100%)]",
};

export default function MatchHistoryComponent({
  logo,
  result,
  points,
  date,
  duration,
  game = "Piedra, papel o tijera",
}: MatchHistoryComponentProps) {
  const formatGameTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };
  return (
    <div
      className={`w-full flex items-center justify-between px-3 xl:px-5 
      ${background[result]} backdrop-blur-md rounded-xl gap-2
    `}
    >
      <div className="gap-3 sm:gap-4 md:gap-5 flex items-center">
        <div className="h-25 rounded-l-xl w-20 sm:w-24 xl:w-28 px-1 xl:px-2">
          <Image
            src={logo}
            alt="game"
            width={100}
            height={100}
            className="w-full h-full object-contain"
          />
        </div>
        <div>
          <h3
            className={`text-font textl-base xl:text-lg pb-2 after:rounded-full font-medium after:mt-4 relative after:h-1 after:left-0 after:bottom-0 after:absolute after:w-1/3 ${detailsColor[result]}`}
          >
            {game}
          </h3>
          <p
            className={`text-xl w-fit xl:text-2xl ${textColor[result]} font-medium`}
          >
            {gameResult[result]}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1 lg:gap-3">
        <div
          className={`flex text-xl xl:text-2xl ${textColor[result]} font-medium items-center gap-1`}
        >
          <span className="">{symbol[result]}</span>
          <p className="">{points}</p>
          <Icon
            icon="ix:trophy-filled"
            className="text-xl lg:text-2xl"
          />
        </div>
        <div className="flex flex-col text-xs xl:text-sm  items-center gap-1 lg:flex-row lg:gap-2 xl:gap-3">
          <p className="text-subtitle  font-medium">
            {formatGameTime(duration)}
          </p>
          <div className="w-5 h-0.5 bg-light-gray lg:w-1 lg:h-1  lg:bg-dark-gray lg:rounded-full"></div>
          <p className="text-subtitle font-medium">{date}</p>
        </div>
      </div>
    </div>
  );
}
