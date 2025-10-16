import { gql } from "@apollo/client";

export const GET_USER_GAMES = gql`
  query GetUserGames($userId: ID!, $gameId: ID) {
    userGames(userId: $userId, gameId: $gameId) {
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
  query GetLeaderboard($gameId: ID!, $limit: Int) {
    leaderboard(gameId: $gameId, limit: $limit) {
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
  query GetGlobalLeaderboard($limit: Int) {
    globalLeaderboard(limit: $limit) {
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
  query GetUserStats($userId: ID!, $gameId: ID) {
    userStats(userId: $userId, gameId: $gameId) {
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
  query GetUserStats($userId: ID!, $gameId: ID) {
    userStats(userId: $userId, gameId: $gameId) {
      totalGames
      totalWins
      totalLosses
      totalDraws
    }
  }
`;

export const GET_USER_FAVORITES = gql`
  query GetUserFavorites($userId: ID!) {
    userFavorites(userId: $userId) {
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
