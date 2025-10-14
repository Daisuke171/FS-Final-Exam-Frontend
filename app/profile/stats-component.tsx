import StatCard from "@/components/ui/cards/profile/StatCard";
import CircularProgress from "@/components/ui/general/profile/CircularProgress";
import { Icon } from "@iconify-icon/react";

const stats = {
  winRate: 75,
  totalTime: "5h 32m",
  highScore: 12800,
  bestStreak: 9,
  avgPerDay: 3.4,
};

const games = 10;

export default function StatsComponent() {
  return (
    <article className="w-full bg-white/7 p-8 rounded-2xl mt-5">
      <h2 className="text-2xl flex items-center gap-2 text-font font-medium">
        <Icon
          icon="gridicons:stats-up"
          width="30"
        />
        Estadísticas
      </h2>
      <div className="mt-10 flex items-start">
        {games > 0 ? (
          <>
            <div className="flex flex-col items-center">
              <h3 className="font-medium text-center text-font mb-3 max-w-[15ch]">
                Porcentaje de victorias
              </h3>
              <CircularProgress percentage={21} />
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
      </div>
    </article>
  );
}
