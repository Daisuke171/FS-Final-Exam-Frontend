"use client";

import GameCard from "@/components/ui/cards/GameCard";
import { GameCardProps } from "@/components/ui/cards/GameCard";
import { motion } from "motion/react";

const games: GameCardProps[] = [
  {
    title: "Piedra, Papel o Tijera",
    description:
      "El clásico juego de manos reinventado. Desafía a tus amigos o enfrenta a la IA en partidas rápidas y emocionantes.",
    image: "/logos/rps-logo-lp.webp",
    players: "1-2",
    difficulty: "easy",
    xpReward: "+ 40",
    gameType: "Estrategia",
    isComingSoon: false,
    href: "/games/rock-paper-scissors",
  },
  {
    title: "Coding War",
    description:
      "Pon a prueba tus habilidades de programación en batallas épicas contra otros desarrolladores. Resuelve desafíos y escala rankings.",
    image: "/logos/cw-logo-lp.webp",
    players: "1-2",
    difficulty: "medium",
    xpReward: "+ 60",
    gameType: "Lógica",
    isComingSoon: false,
    href: "/games/coding-war",
  },
  {
    title: "Math Duel",
    description:
      "Desafíos matemáticos a contrarreloj. Suma, resta, multiplica y divide más rápido que tus oponentes.",
    image: "/logos/md-logo-lp.webp",
    players: "1-2",
    difficulty: "medium",
    xpReward: "+ 35",
    gameType: "Puzzle",
    isComingSoon: true,
  },
];

export default function GamesHub() {
  return (
    <>
      <div className="bg-gradient-to-b from-black-blue to-dark-blue/30 min-h-screen w-full pt-[calc(75px+2.5rem)] pb-16">
        <div className="flex flex-col items-center mx-auto px-4">
          <motion.header
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-10 text-center max-w-[90%]"
          >
            <h1 className="text-4xl font-bold text-font mb-2">
              Juegos multijugador
            </h1>
            <p className="text-subtitle">
              Descubre y prueba tus habilidades en juegos emocionantes, con chat
              integrado y grandes recompensas
            </p>
          </motion.header>

          <motion.section
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-6 w-full"
          >
            {games.map((g, i) => (
              <GameCard
                key={i}
                title={g.title}
                description={g.description}
                image={g.image}
                players={g.players}
                difficulty={g.difficulty}
                xpReward={g.xpReward}
                gameType={g.gameType}
                isComingSoon={g.isComingSoon}
                href={g.href}
              />
            ))}
          </motion.section>
        </div>
      </div>
    </>
  );
}
