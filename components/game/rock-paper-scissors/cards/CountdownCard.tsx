import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "motion/react";

export default function CountdownCard({ countDown }: { countDown: number }) {
  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="glass-box-one w-100 flex flex-col items-center"
      >
        <p className="text-xl text-center text-subtitle">¡Preparense!</p>
        <h2 className="text-4xl text-center font-bold text-font">
          La partida comenzará en...
        </h2>
        <div className="relative h-23 w-full mt-5">
          <p className="text-5xl leading-none font-bold text-shadow-[0_0_10px_var(--color-light-purple)] text-bright-purple absolute top-[47%]  left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {countDown}
          </p>
          <Icon
            icon="line-md:loading-twotone-loop"
            width="120"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2  -translate-y-1/2 text-light-purple"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
