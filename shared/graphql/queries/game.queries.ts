import { gql } from "@apollo/client";

export const GET_GAMES = gql`
  query GetGames {
    games {
      id
      name
      description
      gameLogo
      createdAt
      updatedAt
      minPlayers
      maxPlayers
      category
    }
  }
`;

export const GET_USER_GAMES = gql`
  query GetUserGames($gameId: ID) {
    userGames(gameId: $gameId) {
      id
      duration
      state
      score
      totalDamage
      createdAt
      game {
        id
        name
        gameLogo
      }
    }
  }
`;

export const GET_LEADERBOARD = gql`
  query GetLeaderboard($gameId: ID!) {
    leaderboard(gameId: $gameId) {
      gameId
      gameName
      entries {
        rank
        userId
        nickname
        name
        totalScore
        level
      }
      generatedAt
    }
  }
`;

export const GET_GLOBAL_LEADERBOARD = gql`
  query GetGlobalLeaderboard {
    globalLeaderboard {
      gameName
      entries {
        rank
        userId
        nickname
        name
        totalScore
        level
      }
      generatedAt
    }
  }
`;

export const GET_USER_STATS = gql`
  query GetUserStats($gameId: ID) {
    userStats(gameId: $gameId) {
      winRate
      totalTime
      highScore
      bestStreak
      avgPerDay
      totalGames
      totalWins
      totalLosses
      totalDraws
      averageScore
    }
  }
`;

export const GET_USER_BASIC_STATS = gql`
  query GetUserStats($gameId: ID) {
    userStats(gameId: $gameId) {
      totalGames
      totalWins
      totalLosses
      totalDraws
    }
  }
`;

export const GET_USER_FAVORITES = gql`
  query GetUserFavorites {
    userFavorites {
      id
      createdAt
      game {
        id
        name
        description
        gameLogo
        category
      }
    }
  }
`;
