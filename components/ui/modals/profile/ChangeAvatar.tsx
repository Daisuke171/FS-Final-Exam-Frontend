"use client";

import CustomButtonOne from "@/components/game/rock-paper-scissors/buttons/CustomButtonOne";
import { motion } from "motion/react";

export default function ChangeAvatar({
  closeModal,
}: {
  closeModal: () => void;
}) {
  const avatars = Array.from({ length: 10 });
  const frames = Array.from({ length: 5 });
  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-1/2 flex w-190 gap-15 items-top border border-dark-gray bg-white/7 rounded-2xl p-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
      >
        <div className="flex flex-col items-center gap-5">
          <h2 className="text-xl font-medium text-font">Preview</h2>
          <div className="h-38 w-38 rounded-full bg-background border-4 border-medium-blue"></div>
        </div>
        <div className="flex flex-col gap-10">
          <div className="w-full">
            <h3 className="text-xl font-medium text-font">
              Avatares disponibles
            </h3>
            <div className="grid grid-cols-5 gap-5 mt-5 w-full">
              {avatars.map((_, index) => (
                <div
                  key={index}
                  className="h-18 w-18 bg-background rounded-full"
                ></div>
              ))}
            </div>
          </div>
          <div className="w-full">
            <h3 className="text-xl font-medium text-font">
              Marcos disponibles
            </h3>
            <div className="grid grid-cols-5 gap-5 mt-5 w-full">
              {frames.map((_, index) => (
                <div
                  key={index}
                  className="h-18 w-18 bg-background rounded-full"
                ></div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-5 mt-3">
            <CustomButtonOne
              icon={"material-symbols:check-circle-outline"}
              text="Confirmar"
              color="secondary"
            />
            <CustomButtonOne
              action={closeModal}
              icon={"material-symbols:cancel-outline-rounded"}
              text="Cancelar"
              color="error"
              variant="outlined"
            />
          </div>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeModal}
        className="fixed w-full h-full top-0 left-0 bg-black/80 backdrop-blur-md z-10"
      ></motion.div>
    </>
  );
}
