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
  duration: string;
  state: "win" | "lose" | "draw";
  score: number;
  totalDamage: number;
  createdAt: string;
  game: {
    id: string;
    name: string;
    gameLogo: string;
  };
}

export interface User {
  id: string;
  name: string;
  nickname: string;
  email: string;
  coins: number;
  experience: number;
  totalScore: number;
  skins: string[];
  level: {
    id: string;
    atomicNumber: number;
    name: string;
    chemicalSymbol: string;
    experienceRequired: number;
  };
  nextLevelExperience: number;
  levelProgress: number;
  experienceToNextLevel: number;
}
