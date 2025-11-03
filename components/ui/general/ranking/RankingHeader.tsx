"use client";

import { GameFilter } from "@/app/ranking/ranking-component";
import CustomSelect from "../../inputs/CustomSelect";
import { motion } from "motion/react";
import { useScrollDirection } from "@/hooks/useScrollDirection";

export default function RankingHeader({
  filter,
  setFilter,
}: {
  filter: GameFilter;
  setFilter: (filter: GameFilter) => void;
}) {
  const { isVisible } = useScrollDirection({ threshold: 80, topOffset: 10 });
  const filterOptions: {
    label: string;
    value: GameFilter;
    disabled?: boolean;
  }[] = [
    { label: "General", value: "general" },
    { label: "Rock Paper Scissors", value: "rockPaperScissors" },
    { label: "Coding War", value: "codeWar" },
    { label: "Math War", value: "ticTacToe", disabled: true },
  ];
  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -130 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-white/3 shadow-lg fixed z-50 sm:p-0 sm:backdrop-blur-md px-8 flex justify-center w-full"
    >
      <div className="hidden sm:flex gap-3">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={
              option.disabled ? undefined : () => setFilter(option.value)
            }
            className={`p-5 py-3 relative cursor-pointer ${
              option.disabled
                ? "pointer-events-none line-through decoration-2"
                : ""
            } font-medium whitespace-nowrap  transition-colors ${
              filter === option.value && !option.disabled
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
      <div className="flex py-1 sm:hidden w-[70%]">
        <CustomSelect
          full
          options={filterOptions}
          onChange={(value) => setFilter(value as GameFilter)}
          defaultValue={filter}
        />
      </div>
    </motion.header>
  );
}
