"use client";

import { AnimatePresence, motion } from "motion/react";
import NumbersAnimation from "./NumbersAnimation";

interface HealthBarProps {
  players: { id: string }[];
  playerHealth: { [id: string]: number };
  previousHealth: { [id: string]: number };
  playerId: string | undefined;
  battleStage: string;
  winner: string | null | undefined;
  healthDamage: { [id: string]: number };
}

export default function HealthBar({
  players,
  playerHealth,
  previousHealth,
  playerId,
  battleStage,
  winner,
  healthDamage,
}: HealthBarProps) {
  const getHealthColor = (health: number) => {
    if (health > 70) return "bg-success";
    if (health > 45) return "bg-ranking";
    if (health > 25) return "bg-orange-500";
    return "bg-error";
  };
  return (
    <div className="space-y-6 flex w-full justify-between">
      {players
        .map((p) => p.id)
        .sort((a, b) => (a === playerId ? -1 : b === playerId ? 1 : 0))
        .map((id) => {
          const oldHealth = previousHealth[id] || playerHealth[id] || 100;
          const newHealth = playerHealth[id];
          const isPlayer = id === playerId;

          return (
            <div
              key={id}
              className=""
            >
              <div
                key={id}
                className="space-y-2 w-38 sm:w-60"
              >
                <div className="flex flex-col items-start md:flex-row md:justify-between md:items-center px-1">
                  <span
                    className={`font-medium text-sm md:text-base ${
                      isPlayer ? "text-medium-blue" : "text-error"
                    }`}
                  >
                    {isPlayer ? "Tu Vida" : "Vida del Rival"}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs md:text-sm line-through text-light-gray">
                      100 HP
                    </span>
                    <span className="text-xs md:text-sm  font-bold text-error">
                      <NumbersAnimation value={newHealth} /> HP
                    </span>
                  </div>
                </div>
                <div
                  className={`relative w-full h-4 sm:h-6 mb-2 bg-slate-900 rounded-full overflow-hidden border-2 border-indigo-200 ${
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
                    className={`h-8 ${getHealthColor(newHealth)} relative z-10`}
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
                        className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-transparent-error text-light-error`}
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
  );
}
