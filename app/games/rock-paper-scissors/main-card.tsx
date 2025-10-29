"use client";

import { AnimatePresence, motion } from "motion/react";
import CreateRoomModal from "@/components/game/rock-paper-scissors/modals/CreateRoomModal";
import { useEffect, useState } from "react";
import CustomButtonTwo from "@/components/game/rock-paper-scissors/buttons/CustomButtonTwo";
import { getSocket } from "@/app/socket";
import CustomTextInput from "@/components/game/rock-paper-scissors/inputs/text/CustomTextInput";
import { useGameSocket } from "@/hooks/rock-paper-scissors/useGameSocket";
import JoinByPassword from "@/components/game/rock-paper-scissors/general/JoinByPassword";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import GlobalLoader from "@/components/ui/loaders/GlobalLoader";
import CustomButtonOne from "@/components/game/rock-paper-scissors/buttons/CustomButtonOne";

export default function MainCard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const socket = getSocket(session?.accessToken);
  const [openModal, setOpenModal] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";
  const {
    error,
    handleJoinRoomByPassword,
    handleJoinRoomById,
    message,
    isPrivate,
  } = useGameSocket(roomId || "");

  useEffect(() => {
    if (!socket) return;
    socket.on("isPrivate", (data) => {
      setRoomId(data.roomId);
    });

    return () => {
      socket.off("isPrivate");
    };
  }, [socket]);

  const handleOpenModal = () => {
    setOpenModal(!openModal);
  };

  if (isLoading) {
    return <GlobalLoader />;
  }

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
    <div className="max-w-140 w-[90%]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          duration: 1,
          stiffness: 100,
          damping: 10,
        }}
        className="glass-box-one flex flex-col items-center text-center"
      >
        <h1 className="text-3xl mg:text-4xl font-bold text-font">
          Piedra, papel o tijera
        </h1>
        {isAuthenticated ? (
          <p className="text-lg text-center text-subtitle">
            Juega esta versión reinventada del juego!
          </p>
        ) : (
          <p className="text-lg text-center text-subtitle">
            Inicia sesión para guardar tu progreso y competir contra otros
            jugadores.
          </p>
        )}
        {isAuthenticated ? (
          <div className="mt-10 flex flex-col items-center gap-5  justify-center w-full">
            <div className="flex gap-3 flex-col sm:flex-row w-full justify-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: [0, 0.4, 0.6, 1], x: 0 }}
                transition={{
                  opacity: { duration: 0.8, ease: "easeOut", delay: 0.2 },
                  x: {
                    type: "spring",
                    stiffness: 100,
                    damping: 10,
                    delay: 0.2,
                  },
                }}
                className="w-full"
              >
                <CustomButtonTwo
                  text="Ver salas"
                  icon="lucide-lab:houses"
                  onClick={() => {
                    router.push("/games/rock-paper-scissors/rooms");
                  }}
                  full
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: [0, 0.4, 0.6, 1], x: 0 }}
                transition={{
                  opacity: { duration: 0.8, ease: "easeOut", delay: 0.3 },
                  x: {
                    type: "spring",
                    stiffness: 100,
                    damping: 10,
                    delay: 0.3,
                  },
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
              {error && <p className="text-error">{error}</p>}
            </motion.div>
          </div>
        ) : (
          <div className="flex gap-3 flex-col sm:flex-row w-full justify-center mt-5">
            <CustomButtonOne
              text="Iniciar sesión"
              icon="mdi:login-variant"
              action={() => router.push("/login")}
              full
              color="secondary"
            />
            <CustomButtonOne
              color="secondary"
              disabled
              text="Jugar como invitado"
              icon="mdi:account-plus-outline"
              full
            />
          </div>
        )}
      </motion.div>
      <AnimatePresence>
        {openModal && <CreateRoomModal setCloseModal={handleOpenModal} />}
      </AnimatePresence>
    </div>
  );
}
