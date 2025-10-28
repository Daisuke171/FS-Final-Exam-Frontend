import ArchievementCard, {
  ArchievementCardProps,
} from "@/components/ui/cards/profile/ArchievementCard";
import { Icon } from "@iconify/react";

export const achievements: ArchievementCardProps[] = [
  // // 🧠 Code War
  {
    title: "Primer reto",
    desc: "Completá tu primer Code War.",
    type: "common",
  },
  {
    title: "Lógica en acción",
    desc: "Ganaste 3 Code Wars seguidas.",
    type: "uncommon",
  },
  {
    title: "Velocidad de código",
    desc: "Resolvés un reto en menos de 1 min.",
    type: "rare",
  },
  {
    title: "Maestro del código",
    desc: "Ganaste 25 Code Wars.",
    type: "epic",
  },
  {
    title: "Leyenda del teclado",
    desc: "Alcanzaste 100 victorias en Code War.",
    type: "legendary",
  },
  // ✊🖐✌ Piedra, Papel o Tijera
  {
    title: "Primera partida",
    desc: "Jugá tu primer RPS.",
    type: "common",
  },
  {
    title: "Tres seguidas",
    desc: "Ganaste 3 partidas seguidas.",
    type: "uncommon",
  },
  {
    title: "Mano maestra",
    desc: "Ganaste 10 partidas en total.",
    type: "rare",
  },
  {
    title: "Invicto",
    desc: "Ganá 10 seguidas sin perder.",
    type: "epic",
  },
  {
    title: "Rey del RPS",
    desc: "100 victorias totales en RPS.",
    type: "legendary",
  },
  // ❌⭕ Tic Tac Toe
  {
    title: "Primera cruz",
    desc: "Jugá tu primer Tic Tac Toe.",
    type: "common",
  },
  {
    title: "Estratega",
    desc: "Ganá 5 partidas de Tic Tac Toe.",
    type: "uncommon",
  },
  {
    title: "Tres en línea",
    desc: "Ganaste 10 partidas seguidas.",
    type: "rare",
  },
  {
    title: "Genio del tablero",
    desc: "50 victorias totales en Tic Tac Toe.",
    type: "epic",
  },
  {
    title: "Mente imparable",
    desc: "100 victorias sin derrota.",
    type: "legendary",
  },
];

export default function AchievementsComponent() {
  return (
    <article className="w-full bg-white/7 p-4 py-6 md:p-6 lg:p-8 rounded-2xl">
      <div className="flex items-center justify-between">
        <h2 className="text-xl lg:text-2xl text-font flex items-center gap-2 font-medium">
          <Icon
            icon="ri:medal-fill"
            className="text-2xl lg:text-3xl"
          />
          Últimos logros
        </h2>
        {achievements.length > 8 && (
          <button className="group font-medium hover:text-light-blue transition-all flex items-center gap-2 px-2 py-1 cursor-pointer">
            <Icon
              icon="material-symbols:arrow-right-alt-rounded"
              width="25"
              className="transform group-hover:translate-x-1 transition-all duration-500"
            />
            Ver todos
          </button>
        )}
      </div>
      <div className="custom-grid mt-10">
        {achievements.length == 0 ? (
          <div className="col-span-4 h-60 flex flex-col items-center justify-center">
            <Icon
              icon="fluent:trophy-off-28-filled"
              width="100"
              className="text-font"
            />
            <h2 className="text-xl text-font font-medium mt-5">
              No tienes logros actualmente
            </h2>
            <p className="text-subtitle text-base">
              Comienza a jugar para ganarlos!
            </p>
          </div>
        ) : (
          achievements.slice(0, 8).map((achievement) => (
            <ArchievementCard
              key={achievement.title}
              title={achievement.title}
              desc={achievement.desc}
              type={achievement.type}
            />
          ))
        )}
      </div>
    </article>
  );
}
