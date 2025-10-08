"use client";

import Card from "@/components/game/rock-paper-scissors/cards/Card";
import { IconifyIcon } from "@iconify/react";
import FistIcon from "@iconify-icons/game-icons/fist";
import HandIcon from "@iconify-icons/game-icons/hand";
import ScissorsIcon from "@iconify-icons/game-icons/scissors";
import { motion, AnimatePresence } from "motion/react";
import CustomButton from "@/components/game/rock-paper-scissors/buttons/CustomButtonTwo";
import { useGameSocket } from "@/hooks/rock-paper-scissors/useGameSocket";
import { useParams } from "next/navigation";
import CountdownCard from "@/components/game/rock-paper-scissors/cards/CountdownCard";
import { useEffect } from "react";
import { getSocket } from "@/app/socket";
import RenderBattleAnimation from "@/components/game/rock-paper-scissors/general/RenderBattleAnimation";
import GameOver from "@/components/game/rock-paper-scissors/general/GameOver";
import HealthBar from "@/components/game/rock-paper-scissors/general/HealthBar";

interface ButtonProps {
  title: string;
  img: IconifyIcon;
  move: string;
}

export default function GameComponent() {
  const params = useParams();
  const roomId = params.roomId || "";
  const socket = getSocket();
  const {
    showBattleAnimation,
    battleStage,
    playedMovements,
    playerHealth,
    healthDamage,
    winner,
    gameWinner,
    countDown,
    confirmedPlayers,
    confirmed,
    clicked,
    timeLeft,
    playerId,
    players,
    handlePlayAgain,
    handleConfirmMove,
    disableCards,
    handlePlayerMove,
    state,
    totalDuration,
    previousHealth,
  } = useGameSocket(roomId);

  useEffect(() => {
    socket.emit("requestGameState", { roomId });
    return () => {
      socket.off("requestGameState");
    };
  }, []);

  const Buttons: ButtonProps[] = [
    {
      title: "Piedra",
      img: FistIcon,
      move: "piedra",
    },
    {
      title: "Papel",
      img: HandIcon,
      move: "papel",
    },
    {
      title: "Tijera",
      img: ScissorsIcon,
      move: "tijera",
    },
  ];

  if (countDown !== null && countDown > 0) {
    return <CountdownCard countDown={countDown} />;
  }

  return (
    <AnimatePresence mode="popLayout">
      {state === "FinishedState" ? (
        <GameOver
          gameWinner={gameWinner}
          playerId={playerId}
          players={players}
          confirmedPlayers={confirmedPlayers}
          action={handlePlayAgain}
        />
      ) : state === "PlayingState" || state === "RevealingState" ? (
        <motion.div
          key="game"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="flex flex-col items-center  w-150 m-auto rounded-xl border-2 border-subtitle"
        >
          <div className="rounded-t-xl h-80 w-full flex flex-col">
            <div className="relative w-full">
              <div className="bg-white/5 backdrop-blur-md h-60 w-full rounded-t-xl"></div>
              <div className="bg-white/10 backdrop-blur-md h-20 w-full"></div>
              <div className="absolute top-5 flex justify-between w-full px-5">
                <HealthBar
                  players={players}
                  playerHealth={playerHealth}
                  previousHealth={previousHealth}
                  playerId={playerId}
                  battleStage={battleStage}
                  winner={winner}
                  healthDamage={healthDamage}
                />
                <div className="flex items-center">
                  {showBattleAnimation && (
                    <RenderBattleAnimation
                      showBattleAnimation={showBattleAnimation}
                      playedMovements={playedMovements}
                      playerId={playerId}
                      battleStage={battleStage}
                      winner={winner}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="p-8 bg-background z-8 w-full rounded-b-xl">
            <AnimatePresence mode="wait">
              {timeLeft !== null && timeLeft >= 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="w-full flex flex-col items-center "
                >
                  <p className="text-2xl mt-2 text-font">
                    Tiempo restante: {timeLeft}s
                  </p>
                  <div className="w-full h-2 rounded-full mt-2 bg-light-gray relative overflow-hidden">
                    <motion.div
                      animate={{ scaleX: timeLeft / totalDuration }}
                      transition={{ duration: 0.1, ease: "linear" }}
                      className="absolute top-0 left-0 h-2 bg-hover-purple rounded-full"
                      style={{ width: "100%", transformOrigin: "left" }}
                    ></motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex gap-5 w-full items-center justify-center z-10 my-10">
              {Buttons.map((b) => (
                <Card
                  key={b.title}
                  title={b.title}
                  img={b.img}
                  isClicked={clicked === b.move}
                  onClick={() => handlePlayerMove(b.move)}
                  disableCards={disableCards}
                />
              ))}
            </div>
            <CustomButton
              text="Confirmar"
              onClick={handleConfirmMove}
              clicked={clicked}
              confirmed={confirmed}
              icon="game-icons:confirmed"
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
