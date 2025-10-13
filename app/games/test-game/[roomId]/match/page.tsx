"use client";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";

export default function Match() {
  const router = useRouter();
  return (
    <div className="flex flex-col h-screen items-center justify-center bg-gradient-one">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-box-one p-8 flex flex-col items-center gap-4"
      >
      <h2 className="text-2xl text-font">Test Game Placeholder</h2>
      <p className="text-subtitle">No hay lógica de juego aquí todavía.</p>
      <button
        className="px-4 py-2 rounded-md bg-dark-gray text-white"
        onClick={() => router.back()}
      >
        Volver a la sala
      </button>
      </motion.div>
    </div>
  );
}
