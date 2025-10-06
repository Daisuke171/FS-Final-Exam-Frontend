import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "motion/react";

export default function CountdownCard({ countDown }: { countDown: number }) {
  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="p-10 border-2 bg-slate-300 border-slate-600 rounded-xl w-100 flex flex-col items-center"
      >
        <p className="text-xl text-center text-slate-700">¡Preparense!</p>
        <h2 className="text-4xl text-center font-bold text-slate-900">
          La partida comenzará en
        </h2>
        <div className="relative h-23 w-full mt-5">
          <p className="text-5xl font-bold text-slate-900 absolute top-1/2  left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {countDown}
          </p>
          <Icon
            icon="line-md:loading-twotone-loop"
            width="100"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2  -translate-y-1/2 text-slate-600"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
