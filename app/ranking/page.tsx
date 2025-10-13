"use client";

import RankingList from "@/components/ui/general/ranking/RankingList";
import TopThree from "@/components/ui/general/ranking/TopThree";
import CustomSelect from "@/components/ui/inputs/CustomSelect";
import data from "@/users.json";
import { useState } from "react";
import { motion } from "motion/react";

type GameFilter = "general" | "rockPaperScissors" | "codeWar" | "ticTacToe";
export default function Ranking() {
  const [filter, setFilter] = useState<GameFilter>("general");

  const filterOptions: { label: string; value: GameFilter }[] = [
    { label: "General", value: "general" },
    { label: "Rock Paper Scissors", value: "rockPaperScissors" },
    { label: "Code War", value: "codeWar" },
    { label: "Tic Tac Toe", value: "ticTacToe" },
  ];

  const usersWithScore = data.users.map((user) => {
    let score = 0;
    if (filter === "general") {
      score =
        user.scores.rockPaperScissors +
        user.scores.codeWar +
        user.scores.ticTacToe;
    } else {
      score = user.scores[filter];
    }
    return { ...user, score };
  });
  const sortedUsers = [...usersWithScore].sort((a, b) => b.score - a.score);

  const firstPlace = sortedUsers[0];
  const secondPlace = sortedUsers[1];
  const thirdPlace = sortedUsers[2];
  const restOfUsers = sortedUsers.slice(3);

  return (
    <div className="flex flex-col min-h-screen items-center mb-10">
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
      <div className="mt-45 w-full flex justify-center">
        <TopThree
          key={filter}
          firstPlace={firstPlace}
          secondPlace={secondPlace}
          thirdPlace={thirdPlace}
        />
      </div>
      <RankingList
        users={restOfUsers}
        key={filter}
      />
    </div>
  );
}
