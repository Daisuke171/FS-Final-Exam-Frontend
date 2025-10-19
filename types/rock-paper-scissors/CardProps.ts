import { IconifyIcon } from "@iconify/react";
import { Skin } from "../user.types";

export interface CardProps {
  title: string;
  img: IconifyIcon | string;
  onClick?: () => void;
  isClicked?: boolean;
  disableCards?: boolean;
}

export interface XpDataProps {
  xpGained: number;
  leveledUp: boolean;
  oldLevel: number;
  newLevel: number;
  unlockedSkins: Skin[];

  xpInCurrentLevelBefore: number;
  xpNeededForLevelBefore: number;
  progressBefore: number;
  xpInCurrentLevelAfter: number;
  xpNeededForLevelAfter: number;
  progressAfter: number;

  oldLevelName: string;
  oldLevelSymbol: string;
  oldLevelColor: string;

  newLevelName: string;
  newLevelSymbol: string;
  newLevelColor: string;
}

export type XpDataMap = Record<string, XpDataProps>;
