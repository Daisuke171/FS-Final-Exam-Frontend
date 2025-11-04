import XpBarAnimation from "@/components/game/rock-paper-scissors/general/LevelUpModal";
import { useToast } from "@/context/ToastContext";
import {
  CLAIM_MISSION_REWARD,
  GET_MY_MISSIONS,
  INITIALIZE_MISSIONS,
} from "@/shared/graphql/queries/missions.queries";
import {
  ClaimMissionRewardResponse,
  Mission,
  MissionType,
  UseMissionsReturn,
} from "@/types/missions.types";
import { useMutation, useQuery } from "@apollo/client/react";
import { useMemo, useState } from "react";

// Define un tipo para almacenar la data que necesitas
interface AnimationData {
  rewards: { xp: number; coins: number };
  levelData: ClaimMissionRewardResponse["claimMissionReward"]["levelData"];
}
export type MissionFilter = "all" | "general" | "daily";

export const useMissions = () => {
  const [showXp, setShowXp] = useState(false);
  const [animationData, setAnimationData] = useState<AnimationData | null>(
    null
  );
  const [filter, setFilter] = useState<MissionFilter>("all");
  const { show } = useToast();
  const { data, loading, error, refetch } = useQuery<{ myMissions: Mission[] }>(
    GET_MY_MISSIONS,
    {
      fetchPolicy: "cache-and-network",
    }
  );

  const [claimReward, { loading: claiming }] =
    useMutation<ClaimMissionRewardResponse>(CLAIM_MISSION_REWARD, {
      onCompleted: (data) => {
        const { rewards, levelData } = data.claimMissionReward;
        const leveledUp = data.claimMissionReward.levelData.leveledUp;
        if (!leveledUp) {
          show(`Has ganado ${rewards.xp} XP y ${rewards.coins} monedas`, {
            title: "Recompensa reclamada",
            type: "success",
          });
        } else {
          setAnimationData({ rewards, levelData });
          setShowXp(true);
        }

        refetch();
      },
      onError: () => {
        show("No se pudo reclamar la recompensa", {
          title: "Error",
          type: "error",
        });
      },
      refetchQueries: [{ query: GET_MY_MISSIONS }],
    });

  const [initializeMissions] = useMutation(INITIALIZE_MISSIONS, {
    onCompleted: () => {
      refetch();
    },
  });

  const missions: Mission[] = data?.myMissions || [];

  // Separar misiones por tipo
  const generalMissions = missions.filter(
    (m) => m.type === ("GENERAL" as MissionType)
  );
  const dailyMissions = missions.filter(
    (m) => m.type === ("DAILY" as MissionType)
  );

  const filteredMissions = useMemo(() => {
    switch (filter) {
      case "general":
        return generalMissions;
      case "daily":
        return dailyMissions;
      case "all":
      default:
        return missions;
    }
  }, [filter, missions, generalMissions, dailyMissions]);

  const handleClaimReward = async (missionId: string) => {
    try {
      await claimReward({ variables: { missionId } });
    } catch (error) {
      console.error("Error claiming reward:", error);
    }
  };

  return {
    missions,
    generalMissions,
    dailyMissions,
    filteredMissions,
    loading,
    claiming,
    error,
    filter,
    setFilter,
    handleClaimReward,
    refetch,
    initializeMissions,
    showXp,
    animationData,
    closeXpAnimation: () => {
      setShowXp(false);
      setAnimationData(null);
    },
  };
};
