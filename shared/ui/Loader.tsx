"use client";

import { Icon } from "@iconify/react";
import { motion } from "motion/react";

interface LoaderProps {
  text?: string;
}

export default function Loader({ text }: LoaderProps): void {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed top-1/2 left-1/2 transform min-w-110 -translate-x-1/2 -translate-y-1/2 glass-box-one flex flex-col items-center justify-center gap-4"
    >
      <h2 className="text-font text-center text-4xl font-ligth">{text ?? "Cargando..."}</h2>
      <Icon
        icon="line-md:loading-twotone-loop"
        width="110"
        className="text-light-purple"
      />
    </motion.div>
  );
}
