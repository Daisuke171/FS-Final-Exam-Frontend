"use client";

import MatchHistoryComponent from "@/components/ui/general/profile/MatchHistoryComponent";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { motion } from "motion/react";
import { GameHistory } from "@/types/game.types";
import { GET_USER_GAMES } from "@/graphql/queries/game.queries";
import { useQuery } from "@apollo/client/react";
import MatchHistoryLayout from "@/components/layout/profile/match-history-layout";
import MatchSkeleton from "@/components/ui/skeletons/profile/MatchSkeleton";

type FilterType = "all" | "won" | "lost" | "draw";

export default function MatchHistory() {
  const [filter, setFilter] = useState<FilterType>("all");
  const { data, loading, error } = useQuery<{ userGames: GameHistory[] }>(
    GET_USER_GAMES
  );

  const matches = data?.userGames || [];

  const handleFilterGames = (value: FilterType) => {
    setFilter(value);
  };

  const games = 8;

  const filteredMatches =
    filter === "all"
      ? matches
      : matches.filter((match) => match.state === filter);

  if (loading)
    return (
      <MatchHistoryLayout
        action={(value) => handleFilterGames(value as FilterType)}
      >
        {Array.from({ length: games }).map((_, index) => (
          <MatchSkeleton key={index} />
        ))}
      </MatchHistoryLayout>
    );
  if (error)
    return (
      <MatchHistoryLayout
        action={(value) => handleFilterGames(value as FilterType)}
      >
        <div className="flex flex-col flex-1 h-full items-center justify-center">
          <Icon
            icon="fluent-emoji-high-contrast:sad-but-relieved-face"
            className="text-font text-6xl lg:text-8xl"
          />
          <h2 className="text-xl font-medium text-font mt-5 text-center">
            Se ha producido un error al tratar de obtener tu Historial
          </h2>
          <p className="text-subtitle">{error.message}</p>
        </div>
      </MatchHistoryLayout>
    );

  return (
    <MatchHistoryLayout
      action={(value) => handleFilterGames(value as FilterType)}
    >
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
              logo={match.game.gameLogo}
              result={match.state}
              points={match.score}
              date={new Date(match.createdAt).toLocaleDateString()}
              duration={match.duration}
              game={match.game.name}
            />
          </motion.div>
        ))
      )}
    </MatchHistoryLayout>
  );
}
