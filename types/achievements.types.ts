export type AchievementRarity =
  | "COMMON"
  | "UNCOMMON"
  | "RARE"
  | "EPIC"
  | "LEGENDARY";
export type AchievementCategory =
  | "GAMEPLAY"
  | "SOCIAL"
  | "PROGRESSION"
  | "COLLECTION"
  | "SPECIAL"
  | "COMPETITIVE";

export interface UserAchievement {
  id: string;
  currentProgress: number;
  unlockedAt: string | null;
  seen: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  rarity: AchievementRarity;
  category: AchievementCategory;
  icon: string;
  targetType: string;
  targetValue: number;
  order: number;
  userAchievement: UserAchievement | null;
}

export interface AchievementStats {
  total: number;
  unlocked: number;
  locked: number;
  percentage: number;
}

export interface UnseenAchievement {
  achievement: {
    id: string;
    title: string;
    description: string;
    rarity: AchievementRarity;
  };
  userAchievement: {
    unlockedAt: string;
  };
}
