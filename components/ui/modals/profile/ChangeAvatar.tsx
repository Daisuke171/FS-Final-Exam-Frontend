"use client";

import CustomButtonOne from "@/components/game/rock-paper-scissors/buttons/CustomButtonOne";
import { Icon } from "@iconify/react";
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
        className="fixed top-1/2 w-190 flex max-w-[95%] max-h-[98vh] items-top border border-dark-gray bg-white/7 rounded-2xl pr-2 p-6 md:p-8 lg:p-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
      >
        <div className="w-full flex flex-col sm:flex-row gap-10 sm:gap-15 overflow-y-auto custom-scrollbar pr-4">
          <div className="flex flex-col items-center gap-5">
            <div className="flex sm:hidden justify-between w-full">
              <Icon
                onClick={closeModal}
                icon="material-symbols:close-rounded"
                className="cursor-pointer text-light-error ml-3 text-3xl"
              />
              <CustomButtonOne
                icon={"material-symbols:check-circle-outline"}
                text="Confirmar"
                color="secondary"
                size="sm"
              />
            </div>
            <h2 className="text-xl font-medium text-font">Preview</h2>
            <div className="w-42 h-42 sm:h-38 sm:w-38 rounded-full bg-background border-4 border-medium-blue"></div>
          </div>
          <div className="flex flex-col gap-10 w-full">
            <div className="w-full">
              <h3 className="text-xl font-medium text-font">
                Avatares disponibles
              </h3>
              <div className="custom-grid-avatar gap-5 mt-5 w-full">
                {avatars.map((_, index) => (
                  <div
                    key={index}
                    className="h-16 w-16 sm:h-18 sm:w-18 bg-background rounded-full"
                  ></div>
                ))}
              </div>
            </div>
            <div className="w-full">
              <h3 className="text-xl font-medium text-font">
                Marcos disponibles
              </h3>
              <div className="custom-grid-avatar gap-5 mt-5 w-full">
                {frames.map((_, index) => (
                  <div
                    key={index}
                    className="h-16 w-16 sm:h-18 sm:w-18 bg-background rounded-full"
                  ></div>
                ))}
              </div>
            </div>
            <div className="hidden items-center gap-5 mt-3 sm:flex">
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
