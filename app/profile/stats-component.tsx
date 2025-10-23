"use client";

import StatCard from "@/components/ui/cards/profile/StatCard";
import CircularProgress from "@/components/ui/general/profile/CircularProgress";
import { Icon } from "@iconify/react";
import { useQuery } from "@apollo/client/react";
import { UserStats } from "@/types/game.types";
import { GET_USER_STATS } from "@/graphql/queries/game.queries";
import StatsLayout from "@/components/layout/profile/stats-layout";

export default function StatsComponent({ margin }: { margin?: boolean }) {
  const { loading, error, data } = useQuery<{ userStats: UserStats }>(
    GET_USER_STATS,
    {}
  );

  if (loading)
    return (
      <StatsLayout margin={margin}>
        <div className="h-38 flex flex-col items-center justify-center">
          <Icon
            icon="line-md:loading-twotone-loop"
            width="50"
            className="text-font"
          />
        </div>
      </StatsLayout>
    );

  if (error)
    return (
      <StatsLayout margin={margin}>
        <div className="h-38 flex flex-col items-center justify-center">
          <Icon
            icon="fluent-emoji-high-contrast:sad-but-relieved-face"
            className="text-font text-6xl lg:text-7xl mb-3"
          />
          <h3 className="text-xl font-medium text-font">
            No se han podido cargar tus estadísticas
          </h3>
          <p className="text-base text-medium text-subtitle">{error.message}</p>
        </div>
      </StatsLayout>
    );

  const stats = data?.userStats;
  if (!stats) {
    return null;
  }
  return (
    <StatsLayout margin={margin}>
      {stats.totalGames > 0 ? (
        <>
          <div className="flex flex-col items-center">
            <h3 className="font-medium text-sm md:text-base text-center text-font mb-3 max-w-[15ch]">
              Porcentaje de victorias
            </h3>
            <CircularProgress percentage={stats.winRate} />
          </div>
          <StatCard
            icon="famicons:game-controller"
            title="Tiepo total jugado"
            number={stats.totalTime}
          />
          <StatCard
            color="victory"
            icon="mdi:crown"
            title="Mejor puntaje"
            number={stats.highScore}
          />
          <StatCard
            color="victory"
            icon="mdi:fire"
            title="Racha de victorias más larga"
            number={stats.bestStreak}
          />
          <StatCard
            color="purple"
            icon="uis:schedule"
            title="Promedio de partidas por día"
            number={stats.avgPerDay}
          />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-50">
          <Icon
            icon="ph:empty"
            width="100"
            className="mb-5"
          />
          <h3 className="font-medium text-xl text-center text-font">
            No tienes estadísticas para mostrar
          </h3>
          <p className="text-sm text-subtitle font-medium">
            (Debes jugar al menos una partida para ver tus estadísticas)
          </p>
        </div>
      )}
    </StatsLayout>
  );
}
