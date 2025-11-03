import CustomButtonOne from "@/components/game/rock-paper-scissors/buttons/CustomButtonOne";
import LandingChip from "@/components/ui/chips/LandingChip";
import { Mission } from "@/types/missions.types";
import { Icon } from "@iconify/react";
import useBreakpoint from "@/hooks/useBreakpoint";

type Color = "yellow" | "green" | "red";

const bgColor = {
  EASY: "from-light-success to-success",
  MEDIUM: "from-shadow-ranking to-medium-ranking",
  HARD: "from-error to-light-error",
};

const textColor = {
  EASY: "text-light-success",
  MEDIUM: "text-ranking",
  HARD: "text-light-error",
};

const iconBg = {
  EASY: "bg-light-success/10",
  MEDIUM: "bg-medium-ranking/10",
  HARD: "bg-error/10",
};

const chipColor: { [key: string]: Color } = {
  EASY: "green",
  MEDIUM: "yellow",
  HARD: "red",
};

const difficultyText = {
  EASY: "Fácil",
  MEDIUM: "Medio",
  HARD: "Difícil",
};

export default function MissionItem({
  mission,
  handleClaimReward,
  claiming,
}: {
  mission: Mission;
  handleClaimReward: (missionId: string) => Promise<void>;
  claiming: boolean;
}) {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "mobile";

  const progress = mission.userProgress?.currentProgress || 0;
  const target = mission.targetValue;
  const percentage = Math.min((progress / target) * 100, 100);
  const completed = mission.userProgress?.completed || false;
  const isClaimed = mission.userProgress?.claimedReward || false;
  const isDaily = mission.type === "DAILY";
  let missionTimeUntilReset: string | null = null;
  if (isDaily && isClaimed && mission.userProgress?.resetAt) {
    const resetTime = new Date(mission.userProgress.resetAt);
    const now = new Date();
    const diff = resetTime.getTime() - now.getTime();

    if (diff > 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      missionTimeUntilReset = `${hours}h ${minutes}m`;
    }
  }
  return (
    <div className="flex flex-col bg-white/4 backdrop-blur-sm  p-4 md:p-6 rounded-xl">
      <div className="flex items-start gap-3 md:gap-5 justify-between">
        <div className="flex flex-col gap-8 md:gap-5 items-center min-w-[57.73px]">
          <div className={`p-2 rounded-lg ${iconBg[mission.difficulty]}`}>
            <Icon
              icon={`mdi:${mission.icon}`}
              className={`${
                textColor[mission.difficulty]
              } text-3xl md:text-4xl lg:text-5xl`}
            />
          </div>
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-start w-full justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-base md:text-lg lg:text-xl text-font font-medium">
                {mission.title}
              </h3>
              <p className="text-subtitle text-xs md:text-sm">
                {mission.description}
              </p>
            </div>
            <LandingChip
              color={chipColor[mission.difficulty]}
              text={difficultyText[mission.difficulty]}
              marging={false}
              size="sm"
            />
          </div>
          <div className="flex flex-col mt-3 gap-1">
            <div className="flex items-center justify-between">
              <p className="text-xs md:text-sm text-subtitle">
                {completed ? "Completada" : "Progreso"}
              </p>
              <p
                className={`${
                  textColor[mission.difficulty]
                } text-xs md:text-sm font-medium`}
              >
                {progress}/{target}
              </p>
            </div>
            <div className="w-full h-2.5 rounded-full relative bg-dark-gray overflow-hidden">
              <div
                className={`absolute left-0 h-full bg-gradient-to-r ${
                  bgColor[mission.difficulty]
                }`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center mt-2 ">
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-1 text-xs md:text-sm font-bold text-ranking lg:text-base">
                  <Icon
                    icon="mdi:thunder"
                    className=""
                  />
                  <p>+{mission.xpReward} XP</p>
                </div>
                <div className="flex items-center gap-1 text-xs md:text-sm font-bold text-light-blue lg:text-base">
                  <Icon
                    icon="ix:coins-filled"
                    className=""
                  />
                  <p>+{mission.coinsReward} Coins</p>
                </div>
              </div>
              {isDaily && isClaimed && missionTimeUntilReset && (
                <div className="flex items-center gap-1 font-medium text-xs md:text-sm text-subtitle lg:text-base">
                  <p className="hidden lg:block">Disponible en:</p>
                  <p className="flex items-center gap-1">
                    {missionTimeUntilReset}
                    <Icon
                      icon="mdi:clock"
                      className=""
                    />
                  </p>
                </div>
              )}
              {completed && !isClaimed && (
                <CustomButtonOne
                  text={claiming ? "Reclamando..." : "Reclamar"}
                  action={() => handleClaimReward(mission.id)}
                  loading={claiming}
                  icon={"streamline-ultimate:reward-stars-4-bold"}
                  color="success"
                  size={isMobile ? "xs" : "sm"}
                />
              )}
              {isClaimed && !isDaily && (
                <div className="flex items-center gap-1 text-xs md:text-sm font-bold text-light-success lg:text-base">
                  <Icon
                    icon="line-md:check-all"
                    className="text-sm md:text-base lg:text-lg"
                  />
                  <p>Reclamado</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
