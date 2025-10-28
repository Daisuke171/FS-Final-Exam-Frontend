import { gql } from "@apollo/client";

export const GET_ME = gql`
  query GetMe {
    me {
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
  query GetUserSkinsWithStatus {
    userSkinsWithStatus {
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
  mutation ActivateSkin($skinId: ID!) {
    activateSkin(skinId: $skinId) {
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

export const GET_USER_FAVORITES = gql`
  query GetUserFavorites {
    userFavorites {
      id
      gameId
      userId
      game {
        id
        name
        description
        gameLogo
      }
      totalGames
      winRate
      lastPlayed
      createdAt
    }
  }
`;

export const TOGGLE_FAVORITE = gql`
  mutation ToggleFavorite($gameId: ID!) {
    toggleFavorite(gameId: $gameId)
  }
`;
