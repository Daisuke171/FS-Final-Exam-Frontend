"use client";

import { GameFilter } from "@/app/ranking/page";
import CustomSelect from "../../inputs/CustomSelect";
import { motion } from "motion/react";

export default function RankingHeader({
  filter,
  setFilter,
}: {
  filter: GameFilter;
  setFilter: (filter: GameFilter) => void;
}) {
  const filterOptions: { label: string; value: GameFilter }[] = [
    { label: "General", value: "general" },
    { label: "Rock Paper Scissors", value: "rockPaperScissors" },
    { label: "Code War", value: "codeWar" },
    { label: "Tic Tac Toe", value: "ticTacToe" },
  ];
  return (
    <header className="bg-white/3 shadow-lg py-3 z-10 sm:p-0 sm:backdrop-blur-md px-8 flex justify-center w-full">
      <div className="hidden sm:flex gap-3">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value)}
            className={`p-5 relative cursor-pointer font-medium whitespace-nowrap  transition-colors ${
              filter === option.value
                ? "text-font"
                : "text-light-gray hover:bg-white/10"
            }`}
          >
            {option.label}
            {filter === option.value && (
              <motion.div
                className="w-full h-1 bg-shadow-blue absolute bottom-0 left-0 shadow-[0px_0px_12px_var(--color-shadow-blue)]"
                layoutId="underline"
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
              ></motion.div>
            )}
          </button>
        ))}
      </div>
      <div className="flex sm:hidden w-[70%]">
        <CustomSelect
          full
          options={filterOptions}
          onChange={(value) => setFilter(value as GameFilter)}
          defaultValue={filter}
        />
      </div>
    </header>
  );
}
