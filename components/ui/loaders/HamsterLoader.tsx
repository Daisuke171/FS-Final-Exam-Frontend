import { motion } from "motion/react";
import Hamster from "./Hamster";

export default function HamsterLoader({
  text = "Cargando...",
}: {
  text?: string;
}) {
  return (
    <motion.div
      key="loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center bg-transparent-purple p-8 rounded-xl"
    >
      <div className="flex flex-col items-center">
        <Hamster />
        <p className="text-2xl text-subtitle font-bold mt-8">{text}</p>
        <p className="text-subtitle/70">Esto puede tardar unos segundos</p>
      </div>
    </motion.div>
  );
}
