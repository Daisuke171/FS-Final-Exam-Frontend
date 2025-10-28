"use client";

import CustomButtonOne from "@/components/game/rock-paper-scissors/buttons/CustomButtonOne";
import LpStatCard from "./LpStatCard";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";

const stats = [
  {
    icon: "streamline-ultimate:multiple-users-1",
    title: "Jugadores activos ahora",
    value: 823,
    color: "text-success",
  },
  {
    icon: "bxs:joystick",
    title: "Partidas jugadas hoy",
    value: 123,
    color: "text-light-blue",
  },
  {
    icon: "ph:dna",
    title: "Promedio de nivel de jugadores",
    color: "text-bright-purple",
    value: 14.3,
  },
  {
    icon: "solar:cup-bold",
    title: "Máximas copas ganadas",
    color: "text-ranking",
    value: 2300,
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

export default function CtaSection() {
  const router = useRouter();
  return (
    <section className="flex flex-col w-full items-center py-15">
      <div className="text-center max-w-[90%] flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 1 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-subtitle text-lg">¿Listo para la aventura?</p>
          <h2 className="text-5xl md:text-6xl font-extrabold text-transparent mb-2 tracking-wide text-clip bg-clip-text bg-gradient-to-r from-light-blue to-bright-purple">
            Comienza tu evolución
          </h2>
          <p className="text-subtitle text-2xl mb-10">
            Únete a miles de jugadores evolucionando cada día
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-center items-center max-w-100 w-[90%]"
        >
          <CustomButtonOne
            full
            text="Comenzar ahora"
            action={() => router.push("/register")}
            icon={"bxs:rocket"}
            color="white"
            center
            size="lg"
          />
        </motion.div>
      </div>
      <div className="h-0.5 w-[70%] bg-light-gray/40 rounded-full my-15"></div>
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6 }}
        className="flex justify-center gap-5 flex-wrap"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            viewport={{ once: true, amount: 1 }}
            transition={{ duration: 0.6 }}
            variants={item}
          >
            <LpStatCard {...stat} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
