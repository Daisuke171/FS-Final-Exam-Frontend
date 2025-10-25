"use client";

import RankingList from "@/components/ui/general/ranking/RankingList";
import TopThree from "@/components/ui/general/ranking/TopThree";
import { useState } from "react";
import {
  GET_GLOBAL_LEADERBOARD,
  GET_LEADERBOARD,
} from "@shared/graphql/queries/game.queries";
import { useQuery } from "@apollo/client/react";
import { Leaderboard } from "@/types/game.types";
import GenericErrorCard from "@/components/ui/cards/GenericErrorCard";
import RankingHeader from "@/components/ui/general/ranking/RankingHeader";
import { Icon } from "@iconify/react";

const TWO_MINUTES = 2 * 60 * 1000;

export type GameFilter =
  | "general"
  | "rockPaperScissors"
  | "codeWar"
  | "ticTacToe";
export default function Ranking() {
  const [filter, setFilter] = useState<GameFilter>("general");

  const gameIds: Record<GameFilter, string | null> = {
    general: null,
    rockPaperScissors: "rps-game-id",
    codeWar: "codewar-game-id",
    ticTacToe: "tictactoe-game-id",
  };

  const {
    data: globalData,
    loading: globalLoading,
    error: globalError,
  } = useQuery<{ globalLeaderboard: Leaderboard }>(GET_GLOBAL_LEADERBOARD, {
    skip: filter !== "general",
    pollInterval: TWO_MINUTES,
  });

  const {
    data: gameData,
    loading: gameLoading,
    error: gameError,
  } = useQuery<{ leaderboard: Leaderboard }>(GET_LEADERBOARD, {
    skip: filter === "general",
    variables: { gameId: gameIds[filter]! },
    pollInterval: TWO_MINUTES,
  });

  const loading = filter === "general" ? globalLoading : gameLoading;
  const error = filter === "general" ? globalError : gameError;
  const leaderboard =
    filter === "general"
      ? globalData?.globalLeaderboard
      : gameData?.leaderboard;

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen items-center mb-[calc(57px+2.5rem)] md:mb-10 mt-[75px]">
        <RankingHeader
          filter={filter}
          setFilter={setFilter}
        />
        <div className="h-screen w-full flex justify-center items-center">
          <Icon
            icon="line-md:loading-twotone-loop"
            className="text-medium-blue text-6xl lg:text-[80px]"
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen items-center mb-[calc(57px+2.5rem)] md:mb-10 mt-[75px]">
        <RankingHeader
          filter={filter}
          setFilter={setFilter}
        />
        <div className="h-screen w-full flex justify-center items-center">
          <GenericErrorCard
            title="Error al cargar el ranking"
            message={error.message}
          />
        </div>
      </div>
    );
  }

  if (!leaderboard) return null;

  const entries = leaderboard.entries || [];

  if (entries.length < 3) {
    return (
      <div className="flex flex-col min-h-screen items-center mb-[calc(57px+2.5rem)] md:mb-10 mt-[75px]">
        <RankingHeader
          filter={filter}
          setFilter={setFilter}
        />
        <div className="h-screen w-full flex justify-center items-center max-w-[95%] -mt-12">
          <div className="flex flex-col items-center p-6 md:p-8 lg:p-10 bg-white/7  rounded-xl">
            <Icon
              icon="solar:ranking-line-duotone"
              className="text-8xl text-font mb-5"
            />
            <h3 className="text-font text-center text-xl font-medium">
              No hay suficientes jugadores para mostrar el ranking
            </h3>
            <p className="text-subtitle text-center text-base font-medium">
              Al menos 3 jugadores son necesarios
            </p>
          </div>
        </div>
      </div>
    );
  }

  const firstPlace = leaderboard.entries[0];
  const secondPlace = leaderboard.entries[1];
  const thirdPlace = leaderboard.entries[2];
  const restOfUsers = leaderboard.entries.slice(3);

  return (
    <div className="flex flex-col min-h-screen items-center mb-10 mt-[75px]">
      <RankingHeader
        filter={filter}
        setFilter={setFilter}
      />
      <div className="mt-55 w-full flex justify-center">
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
