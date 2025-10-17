"use client";

import { useQuery } from "@apollo/client/react";
import { UserStats } from "@/types/game.types";
import { GET_USER_BASIC_STATS } from "@/graphql/queries/game.queries";
import StatCard, { StatCardProps } from "../../cards/profile/StatCard";
import { Icon } from "@iconify/react";

export default function ProfileHeaderStats({
  userId,
  responsive,
}: {
  userId: string;
  responsive?: boolean;
}) {
  const { loading, error, data } = useQuery<{ userStats: UserStats }>(
    GET_USER_BASIC_STATS,
    {
      variables: {
        userId,
      },
    }
  );

  const setClasses = responsive
    ? "mt-5 lg:hidden"
    : "hidden lg:w-auto lg:flex lg:place-self-auto`";

  const items = 4;

  if (loading)
    return (
      <article className={`place-self-center w-full ${setClasses}`}>
        <div className="text-center flex items-center gap-1 justify-center">
          {Array(items)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="w-[94px] h-[132px] flex flex-col items-center gap-3"
              >
                <div className="w-12 h-12 bg-white/10 rounded-lg animate-pulse"></div>
                <div className="w-8 h-7 bg-white/10 rounded-lg animate-pulse"></div>
                <div className="flex flex-col gap-2">
                  <div className="w-16 h-3 bg-white/10 rounded-lg animate-pulse"></div>
                  <div className="w-16 h-3 bg-white/10 rounded-lg animate-pulse"></div>
                </div>
              </div>
            ))}
        </div>
      </article>
    );
  if (error)
    return (
      <article className={`place-self-center min-w-70 w-full ${setClasses}`}>
        <div className="text-center flex flex-col items-center justify-center">
          <Icon
            icon="mynaui:sad-ghost"
            width="50"
            className="text-font"
          />
          <p className="text-font text-lg font-medium">
            Ocurrió un error, vuelve a intentarlo
          </p>
          <p className="text-subtitle">{error.message}</p>
        </div>
      </article>
    );

  const stats = data?.userStats;

  if (!stats) return null;

  const cards: StatCardProps[] = [
    {
      title: "Partidas jugadas",
      number: stats?.totalGames,
      color: "neutral",
      icon: "famicons:game-controller",
    },
    {
      title: "Partidas ganadas",
      number: stats?.totalWins,
      color: "victory",
      icon: "mdi:crown",
    },
    {
      title: "Partidas perdidas",
      number: stats?.totalLosses,
      color: "defeat",
      icon: "game-icons:dead-head",
    },
    {
      title: "Partidas empatadas",
      number: stats?.totalDraws,
      color: "draw",
      icon: "material-symbols-light:swords-rounded",
    },
  ];

  return (
    <article className={`place-self-center w-full ${setClasses}`}>
      <div className="text-center flex items-center justify-center">
        {cards.map((card) => (
          <StatCard
            key={card.title}
            icon={card.icon}
            title={card.title}
            number={card.number}
            color={card.color}
          />
        ))}
      </div>
    </article>
  );
}
