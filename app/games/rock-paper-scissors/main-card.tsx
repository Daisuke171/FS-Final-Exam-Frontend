"use client";

import { AnimatePresence, motion } from "motion/react";
import CreateRoomModal from "@/components/game/rock-paper-scissors/modals/CreateRoomModal";
import { useEffect, useState } from "react";
import CustomButtonTwo from "@/components/game/rock-paper-scissors/buttons/CustomButtonTwo";
import { getSocket } from "@/app/socket";
import CustomTextInput from "@/components/game/rock-paper-scissors/inputs/text/CustomTextInput";
import { useGameSocket } from "@/hooks/rock-paper-scissors/useGameSocket";
import JoinByPassword from "@/components/game/rock-paper-scissors/general/JoinByPassword";

const socket = getSocket();

export default function MainCard() {
  const [openModal, setOpenModal] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const {
    error,
    handleJoinRoomByPassword,
    handleJoinRoomById,
    message,
    isPrivate,
  } = useGameSocket(roomId || "");

  useEffect(() => {
    socket.on("isPrivate", (data) => {
      setRoomId(data.roomId);
    });

    return () => {
      socket.off("isPrivate");
    };
  }, []);

  const handleOpenModal = () => {
    setOpenModal(!openModal);
  };

  if (isPrivate) {
    return (
      <JoinByPassword
        error={error}
        message={message}
        action={handleJoinRoomByPassword}
      />
    );
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          duration: 1,
          stiffness: 100,
          damping: 10,
        }}
        className="glass-box-one w-140 flex flex-col items-center"
      >
        <h1 className="text-4xl font-bold text-font">Piedra, papel o tijera</h1>
        <p className="text-lg text-center text-subtitle">
          Juega esta versión reinventada del juego!
        </p>
        <div className="mt-10 flex flex-col items-center gap-5  justify-center w-[85%]">
          <div className="flex gap-3 w-full justify-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: [0, 0.4, 0.6, 1], x: 0 }}
              transition={{
                opacity: { duration: 0.8, ease: "easeOut", delay: 0.2 },
                x: { type: "spring", stiffness: 100, damping: 10, delay: 0.2 },
              }}
              className="w-full"
            >
              <CustomButtonTwo
                text="Ver salas"
                icon="lucide-lab:houses"
                onClick={() => {
                  window.location.href = "/games/rock-paper-scissors/rooms";
                }}
                full
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: [0, 0.4, 0.6, 1], x: 0 }}
              transition={{
                opacity: { duration: 0.8, ease: "easeOut", delay: 0.3 },
                x: { type: "spring", stiffness: 100, damping: 10, delay: 0.3 },
              }}
              className="w-full"
            >
              <CustomButtonTwo
                color="secondary"
                text="Crea una sala"
                icon="mdi:home-plus-outline"
                variant="outlined"
                onClick={handleOpenModal}
                full
              />
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: [0, 0.4, 0.6, 1], x: 0 }}
            transition={{
              opacity: { duration: 0.8, ease: "easeOut", delay: 0.4 },
              x: { type: "spring", stiffness: 100, damping: 10, delay: 0.4 },
            }}
            className="flex flex-col gap-2 justify-center w-full items-center"
          >
            <label
              className="text-lg text-font font-medium"
              htmlFor="roomId"
            >
              Únete a una sala
            </label>
            <CustomTextInput
              name="roomId"
              placeholder="ID de la sala"
              action={handleJoinRoomById}
              size="lg"
              icon="iconamoon:enter"
            />
            {error && <p className="text-rose-800">{error}</p>}
          </motion.div>
        </div>
      </motion.div>
      <AnimatePresence>
        {openModal && <CreateRoomModal setCloseModal={handleOpenModal} />}
      </AnimatePresence>
    </div>
  );
}
