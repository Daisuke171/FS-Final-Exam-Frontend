import { Icon } from "@iconify/react";
import MissionItem, { MissionItemProps } from "./MissionItem";

const missions: MissionItemProps[] = [
  {
    title: "Victoria Perfecta",
    desc: "Gana sin recibir daño",
    progress: 2,
    total: 3,
    reward: 150,
    difficulty: "hard",
    icon: "mdi:trophy",
  },
  {
    title: "Racha de Victorias",
    desc: "Gana 5 partidas seguidas",
    progress: 3,
    total: 5,
    reward: 100,
    difficulty: "medium",
    icon: "mingcute:fire-fill",
  },
  {
    title: "Jugador Dedicado",
    desc: "Juega 10 partidas hoy",
    progress: 7,
    total: 10,
    reward: 50,
    difficulty: "easy",
    icon: "game-icons:burning-skull",
  },
  {
    title: "Maestro de Juegos",
    desc: "Juega 3 juegos diferentes",
    progress: 2,
    total: 3,
    reward: 75,
    difficulty: "easy",
    icon: "game-icons:archery-target",
  },
];

export default function MissionsSection() {
  return (
    <section className="w-full md:w-[60%]">
      <h2
        className="text-xl md:text-2xl mb-5 text-font pb-3 font-medium flex items-center relative gap-2 after:h-0.5
              after:absolute after:w-2/3 after:bg-gradient-to-r after:from-hover-purple after:to-light-purple
              after:-bottom-1 after:left-0 after:rounded-full"
      >
        <Icon
          icon={"lets-icons:paper-fill"}
          className="text-bright-purple text-2xl md:text-3xl"
        />
        Misiones
      </h2>
      <div className="flex flex-col gap-3 max-h-155 overflow-y-auto custom-scrollbar">
        {missions.map((mission, index) => (
          <MissionItem
            key={index}
            {...mission}
          />
        ))}
      </div>
    </section>
  );
}
