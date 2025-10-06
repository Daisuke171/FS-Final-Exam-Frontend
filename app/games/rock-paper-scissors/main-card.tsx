"use client";

import { AnimatePresence } from "motion/react";
import { Icon } from "@iconify-icon/react";
import CreateRoomModal from "@/components/game/rock-paper-scissors/modals/CreateRoomModal";
import { useEffect, useState } from "react";
import CustomButtonTwo from "@/components/game/rock-paper-scissors/buttons/CustomButtonTwo";
import { getSocket } from "@/app/socket";
import { useRouter } from "next/navigation";
import CustomTextInput from "@/components/game/rock-paper-scissors/inputs/text/CustomTextInput";

const socket = getSocket();

export default function MainCard() {
  const [openModal, setOpenModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    socket.on("joinRoomError", (data) => {
      setError(data.message);
    });
    socket.on("joinRoomSuccess", ({ roomId }) => {
      setError(null);
      router.push(`/games/rock-paper-scissors/${roomId}`);
    });
    return () => {
      socket.off("joinRoomError");
      socket.off("joinRoomSuccess");
    };
  }, []);

  const handleOpenModal = () => {
    setOpenModal(!openModal);
  };

  const handleJoinRoomById = () => {
    const input = document.querySelector(
      'input[name="roomId"]'
    ) as HTMLInputElement;
    const roomId = input.value.trim();
    if (roomId.length === 0) {
      setError("El campo no puede estar vacío");
      return;
    }
    socket.emit("joinRoom", { roomId });
  };
  return (
    <div>
      <div className="glass-box-one w-140 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-font">Piedra, papel o tijera</h1>
        <p className="text-lg text-center text-subtitle">
          Juega esta versión reinventada del juego!
        </p>
        <div className="mt-10 flex flex-col items-center gap-5  justify-center w-[85%]">
          <div className="flex gap-3 w-full justify-center">
            <CustomButtonTwo
              text="Ver salas"
              icon="lucide-lab:houses"
              onClick={() => {
                window.location.href = "/games/rock-paper-scissors/rooms";
              }}
              full
            />
            <CustomButtonTwo
              color="secondary"
              text="Crea una sala"
              icon="mdi:home-plus-outline"
              variant="outlined"
              onClick={handleOpenModal}
              full
            />
          </div>
          <div className="flex flex-col gap-2 justify-center w-full items-center">
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
          </div>
        </div>
      </div>
      <AnimatePresence>
        {openModal && <CreateRoomModal setCloseModal={handleOpenModal} />}
      </AnimatePresence>
    </div>
  );
}
