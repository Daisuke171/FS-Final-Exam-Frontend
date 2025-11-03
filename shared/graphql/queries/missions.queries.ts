import { gql } from "@apollo/client";

export const GET_MY_MISSIONS = gql`
  query GetMyMissions {
    myMissions {
      id
      title
      description
      type
      difficulty
      icon
      targetType
      targetValue
      xpReward
      coinsReward
      order
      userProgress {
        id
        currentProgress
        completed
        claimedReward
        resetAt
        completedAt
      }
    }
  }
`;

// Mutation para reclamar recompensa
export const CLAIM_MISSION_REWARD = gql`
  mutation ClaimMissionReward($missionId: ID!) {
    claimMissionReward(missionId: $missionId) {
      user {
        id
        experience
        coins
        level {
          atomicNumber
          name
        }
      }
      progress {
        id
        completed
        claimedReward
      }
      rewards {
        xp
        coins
      }
      levelData {
        xpGained
        leveledUp
        oldLevel
        newLevel
        unlockedSkins {
          id
          name
          img
        }
        progressBefore
        progressAfter
        oldLevelName
        oldLevelSymbol
        oldLevelColor
        newLevelName
        newLevelSymbol
        newLevelColor
        xpInCurrentLevelBefore
        xpNeededForLevelBefore
        xpInCurrentLevelAfter
        xpNeededForLevelAfter
      }
    }
  }
`;

// Mutation para inicializar misiones (primera vez)
export const INITIALIZE_MISSIONS = gql`
  mutation InitializeMissions {
    initializeMissions
  }
`;
