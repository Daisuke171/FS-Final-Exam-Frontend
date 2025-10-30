export interface SkinWithStatus {
  id: string;
  name: string;
  img: string;
  level: number;
  category: string;
  isUnlocked: boolean;
  isOwned: boolean;
  isActive: boolean;
}

export interface Skin {
  id: string;
  name: string;
  img: string;
  level: number;
}

export interface UserSkin {
  id: string;
  active: boolean;
  skinId: string;
  skin: Skin;
}

export interface User {
  id: string;
  name: string;
  nickname: string;
  email: string;
  coins: number;
  experience: number;
  totalScore: number;
  skins: UserSkin[];
  level: {
    id: string;
    atomicNumber: number;
    name: string;
    chemicalSymbol: string;
    experienceRequired: number;
    color: string;
  };
  nextLevelExperience: number;
  levelProgress: number;
  experienceToNextLevel: number;
}
