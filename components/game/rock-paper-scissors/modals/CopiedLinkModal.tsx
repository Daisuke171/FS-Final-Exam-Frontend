import { motion } from "motion/react";

export default function CopiedLinkModal() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="flex flex-col fixed bottom-5 p-6 items-center gap-4 bg-indigo-950 rounded-xl  w-120"
    >
      <h2 className="text-2xl font-bold text-slate-100">Enlace copiado!</h2>
      <p className="text-indigo-200 text-center">
        El enlace de la sala ha sido copiado al portapapeles. Compartelo con tus
        amigos para que puedan unirse!.
      </p>
    </motion.div>
  );
}
