import { Icon } from "@iconify-icon/react";
import { motion } from "motion/react";

export default function CopiedLinkModal() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="flex fixed bottom-5 py-6 px-10 items-center gap-2 bg-success rounded-xl"
    >
      <Icon
        icon="material-symbols:check-circle-outline"
        width="34"
        className="text-slate-100"
      />
      <h2 className="text-xl font-bold text-slate-100">Enlace copiado!</h2>
    </motion.div>
  );
}
