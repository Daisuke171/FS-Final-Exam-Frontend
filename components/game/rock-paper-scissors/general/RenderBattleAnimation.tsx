import { Easing, motion } from "motion/react";
import { Icon } from "@iconify-icon/react";
import FistIcon from "@iconify-icons/game-icons/fist";
import HandIcon from "@iconify-icons/game-icons/hand";
import ScissorsIcon from "@iconify-icons/game-icons/scissors";

interface Props {
  showBattleAnimation: boolean;
  playedMovements: { id: string; move: string }[];
  playerId: string | undefined;
  battleStage: string;
  winner: string | null | undefined;
}

export default function RenderBattleAnimation({
  showBattleAnimation,
  playedMovements,
  playerId,
  battleStage,
  winner,
}: Props) {
  if (!showBattleAnimation || playedMovements.length !== 2) return null;

  const playerMove = playedMovements.find((p) => p.id === playerId);
  const opponentMove = playedMovements.find((p) => p.id !== playerId);

  if (!playerMove || !opponentMove) return null;
  const getPlayerAnimation = () => {
    switch (battleStage) {
      case "moves":
        return {
          y: [40, 0, 0, 0],
          opacity: [0, 1, 1, 1],
          x: [2, 0, 2, 0],
          rotate: 0,
        };
      case "impact":
        return {
          x: [0, -8, -12, -15, -16, 180, -5, 0, -1, 0, -1, 0],
          y: [0, -40, -50, -55, -55, -50, 0],
          rotate:
            playerMove.move === "piedra"
              ? [0, 45, 48, 50, 0]
              : playerMove.move === "tijera"
              ? [0, -35, -40, -42, 0]
              : [0, 35, 40, 42, 0],
          scale: 1,
          opacity: 1,
        };
      case "damage":
        return {
          x: -30,
          rotate: 20,
          opacity: 0,
          scale: 0.9,
        };
      default:
        return { scale: 1, opacity: 1, x: 0, y: 0, rotate: 0 };
    }
  };

  const getOpponentAnimation = () => {
    switch (battleStage) {
      case "moves":
        return {
          y: [40, 0, 0, 0],
          opacity: [0, 1, 1, 1],
          x: [-2, 0, -2, 0],
          rotate: 0,
        };
      case "impact":
        return {
          x: [0, 8, 12, 15, 16, -180, 5, 0, 1, 0, 1, 0],
          y: [0, -40, -50, -55, -55, -50, 0],
          rotate:
            opponentMove.move === "piedra"
              ? [0, -45, -48, -50, 0]
              : opponentMove.move === "tijera"
              ? [0, 40, 45, 48, 0]
              : [0, -35, -40, -42, 0],
          scale: 1,
          opacity: 1,
        };
      case "damage":
        return {
          x: 30,
          rotate: -20,
          opacity: 0,
          scale: 0.9,
        };
      default:
        return { scale: 1, opacity: 1, x: 0, y: 0, rotate: 0 };
    }
  };

  const getTransition = () => {
    switch (battleStage) {
      case "moves":
        return { duration: 2.5, ease: "backInOut" as Easing };
      case "impact":
        return { duration: 2, ease: "backInOut" as Easing };
      case "damage":
        return { duration: 0.3, ease: "backInOut" as Easing, delay: 2 };
      default:
        return { duration: 0.5 };
    }
  };

  const getMoveIcon = (move: string) => {
    switch (move) {
      case "piedra":
        return FistIcon;
      case "papel":
        return HandIcon;
      case "tijera":
        return ScissorsIcon;
      default:
        return FistIcon;
    }
  };

  const getShadowAnimation = () => {
    switch (battleStage) {
      case "moves":
        return {
          y: [40, 0, 0, 0],
          opacity: [0, 0.3, 0.3, 0.3],
          x: [2, 0, 2, 0],
        };
      case "impact":
        return {
          scale: [1, 0.9, 0.9, 0.9, 0.9, 1],
          x: [0, -8, -12, -15, -16, 180, -5, 0, -1, 0, -1, 0],
          opacity: 0.3,
        };
      case "damage":
        return { x: -30, opacity: 0, scale: 0.9 };
      default:
        return { x: -30, opacity: 0, scale: 0.9 };
    }
  };
  const getOpponentShadowAnimation = () => {
    switch (battleStage) {
      case "moves":
        return {
          y: [-40, 0, 0, 0],
          opacity: [0, 0.3, 0.3, 0.3],
          x: [-2, 0, -2, 0],
        };
      case "impact":
        return {
          scale: [1, 0.9, 0.9, 0.9, 0.9, 1],
          x: [0, 8, 12, 15, 16, -180, 5, 0, 1, 0, 1, 0],
          opacity: 0.3,
        };
      case "damage":
        return { x: 30, opacity: 0, scale: 0.9 };
      default:
        return { x: 30, opacity: 0, scale: 0.9 };
    }
  };
  const getTextAnimation = () => {
    switch (battleStage) {
      case "moves":
        return { opacity: [0, 1], y: [20, 0] };
      case "impact":
        return { opacity: 1, y: 0 };
      case "damage":
        return { opacity: [1, 0], y: [0, 20] };
      default:
        return { opacity: 1 };
    }
  };

  const getTextTransition = () => {
    switch (battleStage) {
      case "moves":
        return { duration: 0.5, delay: 1, ease: "backInOut" as Easing };
      case "impact":
        return { duration: 0.5, ease: "backInOut" as Easing };
      case "damage":
        return { duration: 0.5, delay: 2, ease: "backInOut" as Easing };
      default:
        return { duration: 0.5 };
    }
  };

  return (
    <div className="w-full">
      <motion.div
        layoutId="battle-container"
        className="flex justify-center w-full items-center gap-25 absolute top-40 left-1/2 transform -translate-x-1/2"
      >
        <div className="text-center w-full">
          <motion.div
            layoutId="player-icon"
            initial={{ scale: 1, opacity: 1, x: 0, rotate: 0 }}
            animate={getPlayerAnimation()}
            transition={getTransition()}
            style={{ zIndex: 20 }}
            className="relative "
          >
            <Icon
              icon={getMoveIcon(playerMove.move)}
              width={80}
              className={`text-bright-purple ${
                playerMove.id !== winner && battleStage === "damage"
                  ? "animate-[blink-1_.5s_ease-in-out_.4s]"
                  : ""
              }`}
            />
          </motion.div>
          <motion.div
            initial={{ scale: 1, opacity: 0, x: 0 }}
            animate={getShadowAnimation()}
            transition={getTransition()}
            className="w-22 h-22 -bottom-4 left-9 rounded-full absolute mt-2
             bg-black [transform:rotateX(60deg)_rotateY(0deg)]"
            style={{
              filter: "blur(8px)",
              zIndex: 10,
              rotateX: "60deg",
              rotateY: "0deg",
            }}
          ></motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={getTextAnimation()}
            transition={getTextTransition()}
            className="text-lg font-semibold text-font mt-2 relative"
            style={{ zIndex: 20 }}
          >
            Tú: {playerMove.move}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={getTextAnimation()}
          transition={getTextTransition()}
          className="relative z-20"
        >
          <Icon
            icon="game-icons:crossed-swords"
            width={70}
            className="text-font"
          />
        </motion.div>

        <div className="text-center w-full">
          <motion.div
            initial={{ scale: 1, opacity: 1, x: 0, rotate: 0 }}
            layoutId="opponent-icon"
            animate={getOpponentAnimation()}
            transition={getTransition()}
            className="relative z-20"
          >
            <Icon
              icon={getMoveIcon(opponentMove.move)}
              width={80}
              className={`text-error transform scale-x-[-1] ${
                opponentMove.id !== winner && battleStage === "damage"
                  ? "animate-[blink-1_.5s_ease-in-out_.4s]"
                  : ""
              }`}
            />
          </motion.div>
          <motion.div
            initial={{ scale: 1, opacity: 0, x: 0 }}
            animate={getOpponentShadowAnimation()}
            transition={getTransition()}
            className="w-22 h-22 -bottom-4 right-9 rounded-full absolute mt-2
             bg-black [transform:rotateX(60deg)_rotateY(0deg)]"
            style={{
              filter: "blur(8px)",
              zIndex: 10,
              rotateX: "60deg",
              rotateY: "0deg",
            }}
          ></motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={getTextAnimation()}
            transition={getTextTransition()}
            className="text-lg font-semibold text-font mt-2 relative z-20"
          >
            Rival: {opponentMove.move}
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
