import { XpDataProps } from "./rock-paper-scissors/CardProps";
import { User } from "./user.types";

export enum MissionType {
  GENERAL = "GENERAL",
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
}

export enum MissionDifficulty {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
}

export interface UserMissionProgress {
  id: string;
  currentProgress: number;
  completed: boolean;
  claimedReward: boolean;
  resetAt: string | null;
  completedAt: string | null;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  type: MissionType;
  difficulty: MissionDifficulty;
  icon: string;
  targetType: string;
  targetValue: number;
  xpReward: number;
  coinsReward: number;
  order: number;
  userProgress: UserMissionProgress | null;
}

export interface MissionRewards {
  xp: number;
  coins: number;
}

export interface ClaimRewardProgress {
  id: string;
  completed: boolean;
  claimedReward: boolean;
}

// Response types
export interface GetMyMissionsResponse {
  myMissions: Mission[];
}

export interface ClaimMissionRewardResponse {
  claimMissionReward: {
    user: User;
    progress: ClaimRewardProgress;
    rewards: MissionRewards;
    levelData: XpDataProps;
  };
}

export interface InitializeMissionsResponse {
  initializeMissions: boolean;
}

// Hook return types
export interface UseMissionsReturn {
  missions: Mission[];
  generalMissions: Mission[];
  dailyMissions: Mission[];
  loading: boolean;
  claiming: boolean;
  error: Error | undefined;
  timeUntilReset: string | null;
  handleClaimReward: (missionId: string) => Promise<void>;
  refetch: () => Promise<any>;
  initializeMissions: () => Promise<any>;
}
