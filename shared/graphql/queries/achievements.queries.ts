import { gql } from "@apollo/client";

export const GET_MY_ACHIEVEMENTS = gql`
  query GetMyAchievements {
    myAchievements {
      id
      title
      description
      rarity
      category
      targetType
      targetValue
      order
      userAchievement {
        id
        currentProgress
        unlockedAt
        seen
      }
    }
  }
`;

export const GET_ACHIEVEMENT_STATS = gql`
  query GetAchievementStats {
    achievementStats {
      total
      unlocked
      locked
      percentage
    }
  }
`;

export const GET_UNSEEN_ACHIEVEMENTS = gql`
  query GetUnseenAchievements {
    unseenAchievements {
      achievement {
        id
        title
        description
        rarity
      }
      userAchievement {
        unlockedAt
      }
    }
  }
`;

export const MARK_ACHIEVEMENTS_AS_SEEN = gql`
  mutation MarkAchievementsAsSeen($achievementIds: [ID!]!) {
    markAchievementsAsSeen(achievementIds: $achievementIds)
  }
`;

const ACHIEVEMENT_UNLOCKED_SUB = gql`
  subscription OnAchievementUnlocked {
    newAchievement {
      id
      title
      description
      rarity
    }
  }
`;
