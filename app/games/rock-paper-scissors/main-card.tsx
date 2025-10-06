"use client";

import { AnimatePresence } from "motion/react";
import { Icon } from "@iconify/react";
import CreateRoomModal from "@/components/game/rock-paper-scissors/modals/CreateRoomModal";
import { useEffect, useState } from "react";
import CustomButtonTwo from "@/components/game/rock-paper-scissors/buttons/CustomButtonTwo";
import { getSocket } from "@/app/socket";
import { useRouter } from "next/navigation";

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
      router.push(`/rock-paper-scissors/${roomId}`);
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
      <div className="p-10 border-2 bg-slate-300 border-slate-900 rounded-xl w-140 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-slate-900">
          Piedra, papel o tijera
        </h1>
        <p className="text-lg text-center text-slate-700">
          Juega esta versión reinventada del juego!
        </p>
        <div className="mt-10 flex flex-col items-center gap-5  justify-center w-[85%]">
          <div className="flex gap-3 w-full justify-center">
            <CustomButtonTwo
              text="Ver salas"
              icon="lucide-lab:houses"
              onClick={() => {
                window.location.href = "/rock-paper-scissors/rooms";
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
              className="text-lg text-slate-900 font-medium"
              htmlFor="roomId"
            >
              Únete a una sala
            </label>
            <div className="border-2 mb-2 w-full rounded-xl flex border-slate-600 group transition-all focus-within:border-indigo-500 relative">
              <input
                name="roomId"
                type="text"
                placeholder="ID de la sala"
                className=" placeholder:text-slate-500 rounded-xl w-full py-4 px-6 pr-14 focus:outline-none text-slate-900"
              />
              <div
                onClick={handleJoinRoomById}
                className="cursor-pointer"
              >
                <Icon
                  icon="iconamoon:enter"
                  width={25}
                  className="absolute right-0 top-1/2 transform transition-all -translate-y-1/2 p-4 text-slate-500 group-focus-within:text-indigo-500"
                />
              </div>
            </div>
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
