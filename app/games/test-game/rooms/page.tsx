"use client";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";

export default function Rooms() {
  const router = useRouter();
  return (
    <div className="flex flex-col h-screen items-center justify-center bg-gradient-one">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-box-one min-w-120 min-h-40 p-8 flex flex-col items-center gap-3"
      >
        <h2 className="text-2xl text-font">Salas públicas (Placeholder)</h2>
        <p className="text-subtitle">Listado de salas no implementado.</p>
        <button
          className="px-4 py-2 rounded-md bg-dark-gray text-white"
          onClick={() => router.push("/games/test-game")}
        >
          Volver
        </button>
      </motion.div>
    </div>
  );
}
