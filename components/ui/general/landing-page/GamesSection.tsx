"use client";

import Image from "next/image";
import HomeGameCard from "./HomeGameCard";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

const games = [
  {
    title: "Piedra, Papel o Tijera",
    description:
      "Desafía a tus amigos en el clásico juego de manos con un toque moderno",
    image: "/logos/rps-logo-lp.webp",
    isComingSoon: false,
    href: "/games/rock-paper-scissors",
  },
  {
    title: "Coding War",
    description:
      "Pon a prueba tus habilidades de programación en batallas épicas de código",
    image: "/logos/cw-logo-lp.webp",
    isComingSoon: false,
    href: "/games/coding-war",
  },
  {
    title: "Math Duel",
    description: "Desafíos matemáticos a contrarreloj contra otros jugadores",
    image: "/logos/md-logo-lp.webp",
    isComingSoon: true,
    href: "#",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function GamesSection() {
  const router = useRouter();
  return (
    <section className="relative w-full flex flex-col items-center justify-center min-h-screen py-15">
      <Image
        src="/images/games-section-bg.webp"
        alt="hero"
        width={2000}
        height={1800}
        className="w-full h-full object-cover absolute top-0 left-0"
      />
      <div className="absolute top-0 left-0 w-full h-full bg-black/80"></div>
      <div className="z-10 flex flex-col items-center justify-center max-w-[90%] ">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-font mb-2 text-center">
            Explora nuestros juegos
          </h2>
          <p className="text-subtitle mb-10 text-center">
            Desafía a tus amigos y sube de nivel en cada partida
          </p>
        </motion.div>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap justify-center gap-5"
        >
          {games.map((game, index) => (
            <motion.div
              key={index}
              viewport={{ once: true, amount: 1 }}
              transition={{ duration: 0.6 }}
              variants={item}
            >
              <HomeGameCard
                title={game.title}
                description={game.description}
                image={game.image}
                isComingSoon={game.isComingSoon}
                action={() => router.push(game.href)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
