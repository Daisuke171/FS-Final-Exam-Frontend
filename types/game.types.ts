export interface UserStats {
  winRate: number;
  totalTime: string;
  highScore: number;
  bestStreak: number;
  avgPerDay: number;
  totalGames: number;
  totalWins: number;
  totalLosses: number;
  totalDraws: number;
  averageScore: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  nickname: string;
  name: string;
  totalScore: number;
  bestScore: number;
  wins: number;
  totalGames: number;
  level: number;
}

export interface Leaderboard {
  gameId: string;
  gameName: string;
  entries: LeaderboardEntry[];
  generatedAt: string;
}

export interface GameHistory {
  id: string;
  duration: number;
  state: "won" | "lost" | "draw";
  score: number;
  totalDamage: number;
  createdAt: string;
  game: {
    id: string;
    name: string;
    gameLogo: string;
  };
}

export interface Game {
  id: string;
  name: string;
  description?: string;
  gameLogo?: string;
}

export interface GameFavorite {
  id: string;
  gameId: string;
  game: Game;
  totalGames: number;
  winRate: number;
  lastPlayed: string;
}

export interface GetUserFavoritesData {
  userFavorites: GameFavorite[];
}
