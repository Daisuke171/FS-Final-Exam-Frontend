import { motion } from "motion/react";
import { useLockBodyScroll } from "@/hooks/useBlockBodyScroll";

export default function ReconnectionModal({
  countdown,
  player,
}: {
  countdown: number;
  player: string;
}) {
  useLockBodyScroll();
  const coundownColor =
    countdown < 4
      ? "text-light-error"
      : countdown < 7
      ? "text-ranking"
      : "text-medium-blue";
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col z-90 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
      gap-5 p-8 lg:p-10 max-w-[95%] w-135 items-center bg-white/7 rounded-xl"
      >
        <div className="flex flex-col items-center">
          <h2 className="text-3xl font-medium text-font">
            <span className="text-medium-blue font-bold">{player}</span> se ha
            desconectado
          </h2>
          <p className="text-subtitle text-lg">Reconectando...</p>
        </div>
        {countdown && (
          <p className={`${coundownColor} text-6xl font-black`}>{countdown}</p>
        )}
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed z-85 top-0 left-0 w-screen h-screen bg-black/70 backdrop-blur-md"
      ></motion.div>
    </>
  );
}
