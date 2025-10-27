"use client";

import AboutCard, { AboutCardProps } from "./AboutCard";
import { motion } from "motion/react";
import useBreakpoint from "@/hooks/useBreakpoint";

const cards: AboutCardProps[] = [
  {
    icon: "game-icons:game-console",
    color: "primary",
    title: "Juega y compite en minijuegos",
    desc: (
      <>
        Elige entre{" "}
        <span className="font-semibold text-bright-blue">
          Piedra, Papel o Tijera
        </span>
        , <span className="font-semibold text-bright-blue">Coding War</span> y
        más juegos que vienen en camino
      </>
    ),
  },
  {
    icon: "game-icons:deadly-strike",
    color: "secondary",
    title: "Gana experiencia y sube de nivel",
    desc: (
      <>
        Cada partida te da{" "}
        <span className="text-light-success font-semibold">XP</span>. Mejora tu
        perfil,{" "}
        <span className="text-light-success font-semibold">
          desbloquea logros
        </span>{" "}
        y consigue{" "}
        <span className="text-light-success font-semibold">nuevas skins</span>.
      </>
    ),
  },
  {
    icon: "game-icons:crown-coin",
    color: "tertiary",
    title: "Desafía a tus amigos y gana recompensas",
    desc: (
      <>
        Reta a tus amigos, escala en el{" "}
        <span className="text-ranking font-semibold">ranking</span> y obtén {""}
        <span className="text-ranking font-semibold">
          premios exclusivos
        </span>{" "}
        cada temporada.
      </>
    ),
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

export default function AboutUs() {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "mobile";
  return (
    <section className="bg-gradient-one text-center mx-auto max-w-[90%] lg:max-w-full min-h-screen flex flex-col justify-center items-center py-15">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{
          once: true,
          amount: 1,
          margin: isMobile ? "0px" : "-100px",
        }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold text-font mb-2"
      >
        ¿De que se trata esta plataforma?
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{
          once: true,
          amount: 1,
          margin: isMobile ? "0px" : "-100px",
        }}
        transition={{ duration: 0.6 }}
        className="mb-15 text-subtitle"
      >
        A continuación te mostraremos un resumen las funcionalidades de nuestra
        página
      </motion.p>
      {isMobile ? (
        <div className="flex items-center flex-wrap  justify-center gap-5">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
            >
              <AboutCard
                icon={card.icon}
                title={card.title}
                desc={card.desc}
                color={card.color}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6 }}
          className="flex items-center flex-wrap  justify-center gap-5"
        >
          {cards.map((card, index) => (
            <motion.div
              key={index}
              variants={item}
              viewport={{ once: true, amount: 1 }}
              transition={{ duration: 0.6 }}
            >
              <AboutCard
                icon={card.icon}
                title={card.title}
                desc={card.desc}
                color={card.color}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}
