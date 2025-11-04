import {
  GET_ACHIEVEMENT_STATS,
  GET_MY_ACHIEVEMENTS,
  GET_UNSEEN_ACHIEVEMENTS,
  MARK_ACHIEVEMENTS_AS_SEEN,
} from "@/shared/graphql/queries/achievements.queries";
import {
  Achievement,
  AchievementCategory,
  AchievementRarity,
  AchievementStats,
  UnseenAchievement,
} from "@/types/achievements.types";
import { useMutation, useQuery } from "@apollo/client/react";
import { useMemo } from "react";

export const useAchievements = () => {
  const { data, loading, error, refetch } = useQuery<{
    myAchievements: Achievement[];
  }>(GET_MY_ACHIEVEMENTS, {
    fetchPolicy: "cache-and-network",
  });

  const { data: statsData, loading: statsLoading } = useQuery<{
    achievementStats: AchievementStats;
  }>(GET_ACHIEVEMENT_STATS, {
    fetchPolicy: "cache-and-network",
  });

  const { data: unseenData, refetch: refetchUnseen } = useQuery<{
    unseenAchievements: UnseenAchievement[];
  }>(GET_UNSEEN_ACHIEVEMENTS, {
    fetchPolicy: "network-only",
  });

  const [markAsSeen] = useMutation(MARK_ACHIEVEMENTS_AS_SEEN, {
    refetchQueries: [{ query: GET_UNSEEN_ACHIEVEMENTS }],
  });

  // Solo achievements desbloqueados (el backend ya filtra)
  const achievements: Achievement[] = data?.myAchievements || [];
  const unseenAchievements = unseenData?.unseenAchievements || [];
  const stats = statsData?.achievementStats || {
    total: 0,
    unlocked: 0,
    locked: 0,
    percentage: 0,
  };

  // Separar por rareza
  const achievementsByRarity = useMemo(() => {
    const byRarity: Record<AchievementRarity, Achievement[]> = {
      COMMON: [],
      UNCOMMON: [],
      RARE: [],
      EPIC: [],
      LEGENDARY: [],
    };

    achievements.forEach((achievement) => {
      byRarity[achievement.rarity].push(achievement);
    });

    return byRarity;
  }, [achievements]);

  // Separar por categoría
  const achievementsByCategory = useMemo(() => {
    const byCategory: Record<AchievementCategory, Achievement[]> = {
      GAMEPLAY: [],
      SOCIAL: [],
      PROGRESSION: [],
      COLLECTION: [],
      SPECIAL: [],
      COMPETITIVE: [],
    };

    achievements.forEach((achievement) => {
      byCategory[achievement.category].push(achievement);
    });

    return byCategory;
  }, [achievements]);

  // Marcar como vistos
  const handleMarkAsSeen = async (achievementIds: string[]) => {
    try {
      await markAsSeen({ variables: { achievementIds } });
      await refetchUnseen();
    } catch (error) {
      console.error("Error marking achievements as seen:", error);
    }
  };

  return {
    achievements,
    achievementsByRarity,
    achievementsByCategory,
    unseenAchievements,
    stats,
    loading,
    statsLoading,
    error,
    refetch,
    handleMarkAsSeen,
  };
};
