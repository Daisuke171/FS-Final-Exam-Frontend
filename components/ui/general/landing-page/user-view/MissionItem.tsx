import LandingChip from "@/components/ui/chips/LandingChip";
import { Icon, IconifyIcon } from "@iconify/react";

export interface MissionItemProps {
  icon: IconifyIcon | string;
  title: string;
  desc: string;
  reward: number;
  progress: number;
  total: number;
  difficulty?: "easy" | "medium" | "hard";
}

type Color = "yellow" | "green" | "red";

const bgColor = {
  easy: "from-light-success to-success",
  medium: "from-shadow-ranking to-medium-ranking",
  hard: "from-error to-light-error",
};

const textColor = {
  easy: "text-light-success",
  medium: "text-ranking",
  hard: "text-light-error",
};

const chipColor: { [key: string]: Color } = {
  easy: "green",
  medium: "yellow",
  hard: "red",
};

const difficultyText = {
  easy: "Fácil",
  medium: "Medio",
  hard: "Difícil",
};

export default function MissionItem({
  icon,
  title,
  desc,
  reward,
  progress,
  total,
  difficulty = "easy",
}: MissionItemProps) {
  return (
    <div className="flex flex-col bg-white/4 p-4 md:p-6 rounded-xl">
      <div className="flex items-start gap-3 md:gap-5 justify-between">
        <div className="flex flex-col gap-8 md:gap-5 items-center min-w-[57.73px]">
          <Icon
            icon={icon}
            className={`${textColor[difficulty]} text-4xl md:text-5xl`}
          />
          <LandingChip
            color={chipColor[difficulty]}
            text={difficultyText[difficulty]}
            marging={false}
            size="sm"
          />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-start w-full justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-lg md:text-xl text-font font-medium">
                {title}
              </h3>
              <p className="text-subtitle text-xs md:text-sm">{desc}</p>
            </div>
            <div className="flex items-center gap-1 text-sm font-bold text-ranking md:text-base">
              <Icon
                icon="mdi:thunder"
                className=""
              />
              <p>+{reward} XP</p>
            </div>
          </div>
          <div className="flex flex-col mt-3 gap-1">
            <div className="flex items-center justify-between">
              <p className="text-xs md:text-sm text-subtitle">Progreso</p>
              <p
                className={`${textColor[difficulty]} text-xs md:text-sm font-medium`}
              >
                {progress}/{total}
              </p>
            </div>
            <div className="w-full h-2.5 rounded-full relative bg-dark-gray overflow-hidden">
              <div
                className={`absolute left-0 h-full bg-gradient-to-r ${bgColor[difficulty]}`}
                style={{ width: `${(progress / total) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
