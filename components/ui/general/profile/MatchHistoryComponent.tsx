"use client";

import { Icon, IconifyIcon } from "@iconify-icon/react";
import Image from "next/image";

export interface MatchHistoryComponentProps {
  logo: string;
  result: "win" | "lose" | "draw";
  points: number;
  date: string;
  duration: string;
  game?: string;
}

const gameResult = {
  win: "Victoria",
  lose: "Derrota",
  draw: "Empate",
};

const textColor = {
  win: "text-light-success",
  lose: "text-light-error",
  draw: "text-subtitle",
};

const symbol = {
  win: "+",
  lose: "-",
  draw: "+",
};

const detailsColor = {
  win: "after:bg-success",
  lose: "after:bg-light-error",
  draw: "after:bg-light-gray",
};

const background = {
  win: "bg-[linear-gradient(to_right,_var(--color-dark-success)_10%,_var(--color-dark-success)_10%,_var(--color-transparent-success)_100%)]",
  lose: "bg-[linear-gradient(to_right,_var(--color-dark-error)_10%,_var(--color-dark-error)_10%,_var(--color-transparent-error)_100%)]",
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
  return (
    <div
      className={`w-full flex items-center justify-between px-5 
      ${background[result]} backdrop-blur-md rounded-xl
    `}
    >
      <div className="gap-5 flex items-center">
        <div className="h-25 rounded-l-xl w-28 px-2">
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
            className={`text-font text-lg pb-2 after:rounded-full font-medium after:mt-4 relative after:h-1 after:left-0 after:bottom-0 after:absolute after:w-1/3 ${detailsColor[result]}`}
          >
            {game}
          </h3>
          <p className={`text-2xl ${textColor[result]} font-medium`}>
            {gameResult[result]}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-3">
        <div
          className={`flex text-2xl ${textColor[result]} font-medium items-center gap-1`}
        >
          <span className="">{symbol[result]}</span>
          <p className="">{points}</p>
          <Icon
            icon="ix:trophy-filled"
            width="23"
          />
        </div>
        <div className="flex items-center gap-3">
          <p className="text-subtitle text-sm font-medium">{duration}</p>
          <div className="w-1 h-1 bg-dark-gray rounded-full"></div>
          <p className="text-subtitle text-sm font-medium">{date}</p>
        </div>
      </div>
    </div>
  );
}
