"use client";

import MatchHistoryComponent, {
  MatchHistoryComponentProps,
} from "@/components/ui/general/profile/MatchHistoryComponent";
import CustomSelect from "@/components/ui/inputs/CustomSelect";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { motion } from "motion/react";

type FilterType = "all" | "win" | "lose" | "draw";

export const matches: MatchHistoryComponentProps[] = [
  {
    logo: "/games/rock-paper-scissors/rps-logo-white.png",
    result: "win",
    points: 150,
    date: "12 Oct 2025",
    duration: "2m 15s",
    game: "Piedra, papel o tijera",
  },
  {
    logo: "/games/rock-paper-scissors/rps-logo-white.png",
    result: "lose",
    points: 75,
    date: "10 Oct 2025",
    duration: "1m 42s",
    game: "Adivina el número",
  },
  {
    logo: "/games/rock-paper-scissors/rps-logo-white.png",
    result: "draw",
    points: 20,
    date: "9 Oct 2025",
    duration: "3m 05s",
    game: "Trivia Express",
  },
  {
    logo: "/games/rock-paper-scissors/rps-logo-white.png",
    result: "win",
    points: 200,
    date: "7 Oct 2025",
    duration: "1m 30s",
    game: "Piedra, papel o tijera",
  },
  {
    logo: "/games/rock-paper-scissors/rps-logo-white.png",
    result: "lose",
    points: 50,
    date: "6 Oct 2025",
    duration: "4m 10s",
    game: "Memory Challenge",
  },
  {
    logo: "/games/rock-paper-scissors/rps-logo-white.png",
    result: "lose",
    points: 75,
    date: "10 Oct 2025",
    duration: "1m 42s",
    game: "Adivina el número",
  },
  {
    logo: "/games/rock-paper-scissors/rps-logo-white.png",
    result: "draw",
    points: 20,
    date: "9 Oct 2025",
    duration: "3m 05s",
    game: "Trivia Express",
  },
  {
    logo: "/games/rock-paper-scissors/rps-logo-white.png",
    result: "win",
    points: 200,
    date: "7 Oct 2025",
    duration: "1m 30s",
    game: "Piedra, papel o tijera",
  },
  {
    logo: "/games/rock-paper-scissors/rps-logo-white.png",
    result: "lose",
    points: 50,
    date: "6 Oct 2025",
    duration: "4m 10s",
    game: "Memory Challenge",
  },
];

export default function MatchHistory() {
  const [filter, setFilter] = useState<FilterType>("all");

  const handleFilterGames = (value: FilterType) => {
    setFilter(value);
  };

  const filteredMatches =
    filter === "all"
      ? matches
      : matches.filter((match) => match.result === filter);
  return (
    <section className="bg-white/7 p-4 py-6 md:p-6 lg:p-8 w-[52%] rounded-2xl flex-1 flex flex-col ">
      <div className="flex items-center gap-3 md:gap-0 flex-col md:flex-row justify-between">
        <h2 className="text-xl lg:text-2xl font-medium text-font flex  items-center gap-2 ">
          <Icon
            icon="solar:book-bold"
            className="text-2xl md:text-3xl"
          />
          Historial <span className="text-subtitle">(últimas 10 partidas)</span>
        </h2>
        <CustomSelect
          options={[
            { value: "all", label: "Todos" },
            { value: "win", label: "Victorias" },
            { value: "lose", label: "Derrotas" },
            { value: "draw", label: "Empates" },
          ]}
          onChange={(value) => handleFilterGames(value as FilterType)}
          placeholder="Todos"
          defaultValue="all"
        />
      </div>
      <div className="flex flex-col mt-5 md:mt-10 gap-3 flex-grow pr-1 lg:pr-2 w-full min-h-[200px] max-h-150 md:max-h-181 [@media(min-width:913px)_and_(max-width:1024px)]:max-h-111 lg:max-h-250 xl:max-h-186 overflow-y-auto custom-scrollbar">
        {matches.length == 0 ? (
          <div className="flex flex-col flex-1 h-full items-center justify-center">
            <Icon
              icon="solar:gamepad-no-charge-broken"
              width="100"
              className="text-font"
            />
            <h2 className="text-xl font-medium text-font mt-5">
              No has jugado ninguna partida aún
            </h2>
          </div>
        ) : (
          filteredMatches.map((match, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (index + 2) * 0.1 }}
              className="w-full"
            >
              <MatchHistoryComponent
                logo={match.logo}
                result={match.result}
                points={match.points}
                date={match.date}
                duration={match.duration}
                game={match.game}
              />
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
}
