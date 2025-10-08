"use client";

import { motion } from "motion/react";
import PlayersInRoom from "./PlayersInRoom";
import CustomButtonTwo from "../buttons/CustomButtonTwo";
import NumbersAnimation from "./NumbersAnimation";
import { Icon, IconifyIcon } from "@iconify/react";
import { useRouter } from "next/navigation";

interface GameResult {
  text: string;
  icon: {
    img: IconifyIcon | string;
    styles: string;
  };
  points: {
    number: number;
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
}

export default function GameOver({
  gameWinner,
  playerId,
  players,
  confirmedPlayers,
  action,
}: GameOverProps) {
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
            number: 20,
            symbol: "+",
            styles: "text-success",
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
            number: 5,
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
            number: 20,
            symbol: "-",
            styles: "text-error",
          },
        },
  ].filter(Boolean);

  return (
    <motion.div
      key="game-over"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      className="flex flex-col items-center glass-box-one m-auto w-100"
    >
      {gameResult.map((r, idx) => (
        <div
          className={"flex flex-col items-center gap-2 mb-5 px-4 text-font"}
          key={idx}
        >
          <Icon
            icon={r.icon.img}
            width={100}
            className={r.icon.styles}
          />
          <p className="text-4xl font-bold">{r.text}</p>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { delay: 0.5 } }}
            className={`text-2xl font-bold ${r.points.styles}`}
          >
            {r.points.symbol}
            <NumbersAnimation
              value={r.points.number}
              delay={1}
            />{" "}
            puntos
          </motion.p>
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
        <CustomButtonTwo
          icon="material-symbols:arrow-back-rounded"
          text="Salir"
          variant="outlined"
          color="secondary"
          onClick={() => {
            router.push("/games/rock-paper-scissors");
          }}
        />
      </div>
    </motion.div>
  );
}
