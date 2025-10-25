"use client";

import { AnimatePresence, motion } from "motion/react";
import CreateRoomModal from "@/components/game/coding-war/modals/CreateRoomModal";
import { useEffect, useMemo, useRef, useState } from "react";
import CustomButtonTwo from "@/components/game/coding-war/buttons/CustomButtonTwo";
import { getCodingWarSocket } from "@/app/socket";
import CustomTextInput from "@/components/game/coding-war/inputs/text/CustomTextInput";
import { useRoomSocket } from "@/hooks/coding-war/useRoomSocket";
import JoinByPassword from "@/components/game/coding-war/general/JoinByPassword";
import { useSession } from "next-auth/react";

export default function MainCard() {
  const { data: session, status } = useSession();
  const socketRef = useRef<ReturnType<typeof getCodingWarSocket> | null>(null);
  // Create socket only when authenticated
  useEffect(() => {
    if (status !== "authenticated" || !session?.accessToken) return;
    socketRef.current = getCodingWarSocket(session.accessToken);
    return () => {
      // do not disconnect globally here; listeners are attached per effect below
    };
  }, [status, session?.accessToken]);
  const [openModal, setOpenModal] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const { error, handleJoinRoomByPassword, handleJoinRoomById, message, isPrivate } =
    useRoomSocket(roomId || "");

  useEffect(() => {
    const s = socketRef.current;
    if (!s) return;
    const onIsPrivate = (data: { roomId: string }) => setRoomId(data.roomId);
    s.on("isPrivate", onIsPrivate);
    return () => {
      s.off("isPrivate", onIsPrivate);
    };
  }, [socketRef.current]);

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
        <h1 className="text-4xl font-bold text-font">Coding War</h1>
        <p className="text-lg text-center text-subtitle">
          Compite tipeando código en tiempo real. ¡Gana quien escriba mejor y más rápido!
        </p>
        <div className="mt-10 flex flex-col items-center gap-5  justify-center w-[85%]">
          <div className="flex gap-3 w-full justify-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: [0, 0.4, 0.6, 1], x: 0 }}
              transition={{
                // Use a tween for multi-keyframe opacity to avoid spring keyframe warnings
                opacity: { duration: 0.8, ease: "easeOut", delay: 0.2 },
                // Keep spring for the x translation
                x: { type: "spring", stiffness: 100, damping: 10, delay: 0.2 },
              }}
              className="w-full"
            >
              <CustomButtonTwo
                text="Ver salas"
                icon="lucide-lab:houses"
                onClick={() => {
                  window.location.href = "/games/coding-war/rooms";
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
