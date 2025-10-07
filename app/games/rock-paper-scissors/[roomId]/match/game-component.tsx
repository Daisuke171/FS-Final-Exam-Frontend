"use client";

import Card from "@/components/game/rock-paper-scissors/cards/Card";
import { Icon, IconifyIcon } from "@iconify/react";
import FistIcon from "@iconify-icons/game-icons/fist";
import HandIcon from "@iconify-icons/game-icons/hand";
import ScissorsIcon from "@iconify-icons/game-icons/scissors";
import { motion, AnimatePresence, Easing } from "motion/react";
import CustomButton from "@/components/game/rock-paper-scissors/buttons/CustomButtonTwo";
import PlayersInRoom from "@/components/game/rock-paper-scissors/general/PlayersInRoom";
import NumbersAnimation from "@/components/game/rock-paper-scissors/general/NumbersAnimation";
import { useGameSocket } from "@/hooks/rock-paper-scissors/useGameSocket";
import { useParams } from "next/navigation";
import CountdownCard from "@/components/game/rock-paper-scissors/cards/CountdownCard";
import { useEffect } from "react";
import { getSocket } from "@/app/socket";
import RenderBattleAnimation from "@/components/game/rock-paper-scissors/general/RenderBattleAnimation";

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

  const getHealthColor = (health: number) => {
    if (health > 70) return "bg-success";
    if (health > 45) return "bg-ranking";
    if (health > 25) return "bg-orange-500";
    return "bg-error";
  };

  const gameResult: GameResult[] = [
    gameWinner === playerId
      ? {
          text: "¡Has ganado!",
          icon: {
            img: "game-icons:laurel-crown",
            styles: "text-ranking drop-shadow-[0_0_14px_var(--color-ranking)]",
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

  if (countDown !== null && countDown > 0) {
    return <CountdownCard countDown={countDown} />;
  }

  return (
    <AnimatePresence mode="popLayout">
      {state === "FinishedState" ? (
        <motion.div
          key="game-over"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="flex flex-col h-full items-center glass-box-one m-auto w-100"
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
          <CustomButton
            text="Volver a jugar"
            icon="game-icons:rapidshare-arrow"
            onClick={handlePlayAgain}
          />
        </motion.div>
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
                <div className="space-y-6 flex w-full justify-between">
                  {players
                    .map((p) => p.id)
                    .sort((a, b) =>
                      a === playerId ? -1 : b === playerId ? 1 : 0
                    )
                    .map((id) => {
                      const oldHealth =
                        previousHealth[id] || playerHealth[id] || 100;
                      const newHealth = playerHealth[id];
                      const isPlayer = id === playerId;

                      return (
                        <div
                          key={id}
                          className=""
                        >
                          <div
                            key={id}
                            className="space-y-2 w-60"
                          >
                            <div className="flex justify-between items-center px-1">
                              <span
                                className={`font-medium ${
                                  isPlayer ? "text-medium-blue" : "text-error"
                                }`}
                              >
                                {isPlayer ? "Tu Vida" : "Vida del Rival"}
                              </span>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm line-through text-light-gray">
                                  100 HP
                                </span>
                                <span className="text-sm font-bold text-error">
                                  <NumbersAnimation value={newHealth} /> HP
                                </span>
                              </div>
                            </div>
                            <div
                              className={`relative w-full h-6 mb-2 bg-slate-900 rounded-full overflow-hidden border-2 border-indigo-200 ${
                                newHealth > 20 && newHealth <= 40
                                  ? "animate-[vibrate-2_linear_0.4s_infinite]"
                                  : newHealth <= 20
                                  ? "animate-[vibrate-1_linear_0.3s_infinite]"
                                  : ""
                              }`}
                            >
                              <motion.div
                                initial={{ width: `${oldHealth}%` }}
                                animate={{ width: `${newHealth}%` }}
                                transition={{
                                  duration: 1.5,
                                  ease: "easeOut",
                                  delay: 0.7,
                                }}
                                className={`absolute h-8 ${getHealthColor(
                                  newHealth
                                )} opacity-50`}
                              />
                              <motion.div
                                initial={{ width: `${oldHealth}%` }}
                                animate={{ width: `${newHealth}%` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className={`h-8 ${getHealthColor(
                                  newHealth
                                )} relative z-10`}
                              />
                            </div>
                          </div>

                          <AnimatePresence mode="popLayout">
                            {battleStage === "damage" && (
                              <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.5 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.5 }}
                                transition={{ delay: 0.5, duration: 0.2 }}
                                className="text-center "
                              >
                                {winner !== id && (
                                  <span
                                    className={`inline-block px-3 py-1 rounded-full text-sm font-bold bg-rose-300 text-rose-800`}
                                  >
                                    -{healthDamage[id] || 0} HP
                                  </span>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                </div>
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
