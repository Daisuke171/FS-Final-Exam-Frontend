import { Icon } from "@iconify/react";
import { motion } from "motion/react";

export default function RegisterSuccess({ countdown }: { countdown: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center bg-white/7 
    backdrop-blur-md max-w-[95%] rounded-2xl p-6 md:p-8 lg:p-10 border border-success"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Icon
          icon="streamline-flex:happy-face-solid"
          className="text-light-success text-8xl"
        />
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-light-success font-medium text-3xl mt-2"
      >
        ¡Registro exitoso!
      </motion.h2>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="py-2 px-4 border-2 bg-white/3  mt-4 border-success rounded-2xl"
      >
        <p className="text-lg text-font font-medium">¡Bienvenido a Sanya!</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col items-center"
      >
        <p className="text-subtitle mt-10 text-sm">
          Redirigiendo para iniciar sesión...
        </p>
        <div className="h-12 w-12 mt-3 border-3 border-subtitle flex items-center justify-center rounded-full">
          <p className="text-3xl text-font font-bold mb-[2px]">{countdown}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
