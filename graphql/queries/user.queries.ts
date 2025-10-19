import { gql } from "@apollo/client";

export const GET_ME = gql`
  query GetMe($userId: ID!) {
    me(userId: $userId) {
      id
      name
      nickname
      email
      coins
      experience
      skins {
        id
        active
        skin {
          id
          name
          img
        }
      }
      level {
        id
        atomicNumber
        name
        chemicalSymbol
        experienceRequired
        color
      }
      nextLevelExperience
      levelProgress
      experienceToNextLevel
      totalScore
    }
  }
`;

export const GET_USER_SKINS_WITH_STATUS = gql`
  query GetUserSkinsWithStatus($userId: ID!) {
    userSkinsWithStatus(userId: $userId) {
      id
      name
      img
      level
      isUnlocked
      isOwned
      isActive
      userSkinId
    }
  }
`;

export const ACTIVATE_SKIN = gql`
  mutation ActivateSkin($skinId: ID!, $userId: ID!) {
    activateSkin(skinId: $skinId, userId: $userId) {
      id
      active
      skin {
        id
        name
        img
      }
    }
  }
`;
