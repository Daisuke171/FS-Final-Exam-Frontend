"use client";

import { AnimatePresence, motion } from "motion/react";
import PlayersInRoom from "./PlayersInRoom";
import CustomButtonTwo from "../buttons/CustomButtonTwo";
import NumbersAnimation from "./NumbersAnimation";
import { Icon, IconifyIcon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { XpDataMap } from "@/types/rock-paper-scissors/CardProps";
import XpBarAnimation from "./LevelUpModal";

interface GameResult {
  text: string;
  icon: {
    img: IconifyIcon | string;
    styles: string;
  };
  points: {
    symbol: string;
    styles: string;
  };
}

interface GameOverProps {
  gameWinner: string | null | undefined;
  playerId: string | undefined;
  players: { id: string }[];
  confirmedPlayers: string[];
  action: () => void;
  scores: { [id: string]: number };
  xpData: XpDataMap | null;
  showXp: boolean;
  setShowXp: (value: boolean) => void;
}

export default function GameOver({
  gameWinner,
  playerId,
  players,
  confirmedPlayers,
  action,
  scores,
  xpData,
  showXp,
  setShowXp,
}: GameOverProps) {
  if (!playerId || !xpData) return null;
  const myXp = xpData[playerId];
  const router = useRouter();
  const gameResult: GameResult[] = [
    gameWinner === playerId
      ? {
          text: "¡Has ganado!",
          icon: {
            img: "game-icons:laurel-crown",
            styles: "text-ranking animate-[glow_1.5s_ease-in-out_infinite]",
          },
          points: {
            symbol: "+",
            styles: "text-ranking",
          },
        }
      : gameWinner === "tie"
      ? {
          text: "Empate",
          icon: {
            img: "game-icons:crossed-swords",
            styles: "text-light-gray",
          },
          points: {
            symbol: "+",
            styles: "text-slate-500",
          },
        }
      : {
          text: "Has perdido",
          icon: {
            img: "game-icons:dead-head",
            styles: "text-error",
          },
          points: {
            symbol: "",
            styles: "text-error",
          },
        },
  ].filter(Boolean);

  const playerScore = playerId ? scores[playerId] ?? 0 : 0;

  return (
    <>
      <motion.div
        key="game-over"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        className="flex flex-col relative items-center glass-box-one m-auto w-100"
      >
        <button
          className="absolute hover:text-font transition-all top-5 cursor-pointer left-4 flex items-center gap-2 text-subtitle text-sm font-medium"
          onClick={() => router.push("/games/rock-paper-scissors")}
          type="button"
        >
          <Icon
            icon="material-symbols:arrow-left-alt"
            width="20"
          />
          Volver al inicio
        </button>
        {gameResult.map((r, idx) => (
          <div
            className={"flex flex-col items-center gap-2 px-4 pt-6 text-font"}
            key={idx}
          >
            <Icon
              icon={r.icon.img}
              width={100}
              className={r.icon.styles}
            />
            <p className="text-4xl font-bold">{r.text}</p>
            <div className="flex gap-5 my-5">
              <motion.p
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1, transition: { delay: 0.5 } }}
                className={`text-2xl font-bold flex items-center gap-1 ${r.points.styles}`}
              >
                {r.points.symbol}
                <NumbersAnimation
                  value={playerScore}
                  delay={1}
                />{" "}
                <Icon
                  icon="ix:trophy-filled"
                  className="text-xl lg:text-2xl"
                />
              </motion.p>
              <motion.p
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1, transition: { delay: 1.5 } }}
                className={`text-2xl font-bold text-light-blue flex gap-1 items-center`}
              >
                +
                <NumbersAnimation
                  value={myXp.xpGained}
                  delay={1.8}
                />{" "}
                <div className="text-sm text-center h-7 w-7 rounded-full border-2 border-medium-blue flex items-center justify-center">
                  <p>XP</p>
                </div>
              </motion.p>
            </div>
          </div>
        ))}

        <div className="mb-6">
          <PlayersInRoom
            players={players}
            confirmedPlayers={confirmedPlayers}
            playerId={playerId}
            label
          />
        </div>
        <div className="flex gap-2 mt-5">
          <CustomButtonTwo
            text="Volver a jugar"
            icon="game-icons:rapidshare-arrow"
            onClick={action}
          />
        </div>
      </motion.div>
      <AnimatePresence>
        {showXp && xpData && myXp.leveledUp && (
          <XpBarAnimation
            xpGained={myXp.xpGained}
            leveledUp={myXp.leveledUp}
            oldLevel={myXp.oldLevel}
            newLevel={myXp.newLevel}
            unlockedSkins={myXp.unlockedSkins}
            xpInCurrentLevelBefore={myXp.xpInCurrentLevelBefore}
            xpNeededForLevelBefore={myXp.xpNeededForLevelBefore}
            progressBefore={myXp.progressBefore}
            xpInCurrentLevelAfter={myXp.xpInCurrentLevelAfter}
            xpNeededForLevelAfter={myXp.xpNeededForLevelAfter}
            progressAfter={myXp.progressAfter}
            oldLevelName={myXp.oldLevelName}
            oldLevelSymbol={myXp.oldLevelSymbol}
            oldLevelColor={myXp.oldLevelColor}
            newLevelName={myXp.newLevelName}
            newLevelSymbol={myXp.newLevelSymbol}
            newLevelColor={myXp.newLevelColor}
            onComplete={() => {
              setShowXp(false);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
