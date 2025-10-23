import { Icon } from "@iconify-icon/react";
import { motion } from "motion/react";

export default function CopiedLinkModal() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="flex z-90 fixed bottom-5 border-2 border-light-purple gap-3 py-4 px-6 items-center bg-shadow-purple rounded-xl"
    >
      <Icon
        icon="material-symbols:check-circle-outline"
        width="55"
        className="text-bright-purple"
      />
      <div className="flex flex-col">
        <h2 className="text-lg font-medium text-slate-100">
          Enlace copiado con éxito!
        </h2>
        <p className=" text-subtitle">Compártelo con tus amigos</p>
      </div>
    </motion.div>
  );
}
