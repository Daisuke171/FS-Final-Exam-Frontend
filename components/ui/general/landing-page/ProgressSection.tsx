"use client";

import ProgressArticle, { ProgressArticleProps } from "./ProgressArticle";
import { motion } from "motion/react";

const progressionSections: ProgressArticleProps[] = [
  {
    title: "Evoluciona Como los Elementos",
    desc: (
      <>
        Tu progreso se refleja en la tabla periódica. Comienza como{" "}
        <span className="text-bright-blue font-medium">Hidrógeno (H)</span> y
        evoluciona a través de todos los{" "}
        <span className="text-bright-blue font-medium">elementos químicos</span>
        . Cada nivel representa un nuevo elemento, desde los más ligeros hasta
        los más <span className="text-bright-blue font-medium">pesados</span> y{" "}
        <span className="text-bright-blue font-medium">complejos</span>.{" "}
      </>
    ),
    listItems: [
      "Gana XP en cada partida",
      "Desbloquea un nuevo elemento con cada nivel",
      "118 niveles únicos basados en elementos reales",
      "Tu elemento actual se muestra en tu perfil",
    ],
    image: "/images/prog-section-img-1.webp",
    reverse: false,
    color: "blue",
    chipicon: "mynaui:atom",
    chiptext: "Niveles",
  },
  {
    title: "Compite por la Cima",
    desc: (
      <>
        El sistema de copas refleja{" "}
        <span className="font-medium text-light-ranking">
          tu habilidad competitiva
        </span>
        . Gana copas al vencer oponentes de tu mismo nivel o superior. Pierde
        copas solo contra jugadores de menor ranking. Cada rango de copas te
        coloca en una{" "}
        <span className="font-medium text-light-ranking">liga diferente</span>.
      </>
    ),
    listItems: [
      "Sistema ELO basado en copas",
      "Ligas competitivas (Bronce, Plata, Oro, Platino, Diamante)",
      "Matchmaking justo según tu ranking",
      "Recompensas de temporada por liga",
    ],
    image: "/images/prog-section-img-2.webp",
    reverse: true,
    chipicon: "solar:cup-bold",
    chiptext: "Ranking",
    color: "yellow",
  },
  {
    title: "Desbloquea Tu Estilo",
    desc: (
      <>
        A medida que subes de nivel, desbloqueas{" "}
        <span className="font-medium text-bright-purple">
          contenido exclusivo
        </span>{" "}
        para personalizar tu perfil. Cada elemento químico trae consigo nuevos{" "}
        <span className="font-medium text-bright-purple">
          avatares temáticos
        </span>{" "}
        y <span className="font-medium text-bright-purple">marcos únicos</span>{" "}
        inspirados en sus propiedades.
      </>
    ),
    listItems: [
      "Avatares exclusivos por elemento",
      "Marcos de perfil únicos",
      "Colecciona todas las variantes",
      "Muestra tu progreso con estilo",
    ],
    image: "/images/prog-section-img-3.webp",
    reverse: false,
    chipicon: "entypo:round-brush",
    chiptext: "Personalización",
    color: "purple",
  },
];

export default function ProgressSection() {
  return (
    <section className="flex flex-col w-full bg-black-blue items-center justify-center min-h-screen py-15">
      <div className="max-w-[90%]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 1, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl text-center font-bold text-font mb-2">
            Sistema de progresión
          </h2>
          <p className="mb-10 text-center text-subtitle">
            Sistema único de progresión basado en elementos químicos
          </p>
        </motion.div>
        <div className="flex flex-col items-center gap-5">
          {progressionSections.map((section, index) => (
            <ProgressArticle
              key={index}
              {...section}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
