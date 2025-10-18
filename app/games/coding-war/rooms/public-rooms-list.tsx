"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Icon } from "@iconify/react";
import { getCodingWarSocket } from "@/app/socket";
import CustomButtonOne from "@/components/game/coding-war/buttons/CustomButtonOne";
import { useRouter } from "next/navigation";
import CreateRoomModal from "@/components/game/coding-war/modals/CreateRoomModal";

interface RoomData {
  id: string;
  name: string;
  currentPlayers: number;
  maxPlayers: number;
  state: string;
}

export default function PublicRoomsList() {
  const socket = getCodingWarSocket();
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Escuchar la lista de salas públicas
    socket.on("publicRoomsList", (data: RoomData[]) => {
      setRooms(data);
      setIsLoading(false);
    });
    socket.emit("getPublicRooms");

    return () => {
      socket.off("publicRoomsList");
    };
  }, [socket]);

  const handleRefreshRooms = () => {
    setIsLoading(true);
    socket.emit("getPublicRooms");
  };

  const handleJoinRoom = (roomId: string) => {
    router.push(`/games/coding-war/${roomId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full  max-w-2xl mx-auto"
    >
      <div className="w-full glass-box-two px-6 border border-dark-gray py-4 text-xl font-semibold flex items-center justify-between">
        <span className="flex items-center text-font gap-2">
          <Icon
            icon="mdi:account-group"
            width={30}
          />
          Salas Públicas Disponibles
        </span>
      </div>

      <AnimatePresence>
        <motion.div className="overflow-hidden">
          <div className="mt-4 py-4 px-6 glass-box-two border border-dark-gray">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-font">
                {rooms.length}{" "}
                {rooms.length === 1 ? "sala disponible" : "salas disponibles"}
              </h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleRefreshRooms}
                disabled={isLoading}
                className="p-2 bg-dark-gray rounded-lg cursor-pointer hover:bg-slate-600 transition-colors disabled:opacity-50"
              >
                <motion.div
                  animate={{ rotate: isLoading ? 360 : 0 }}
                  transition={{
                    duration: 1,
                    repeat: isLoading ? Infinity : 0,
                    ease: "linear",
                  }}
                >
                  <Icon
                    icon="mdi:refresh"
                    width={20}
                    className="text-white"
                  />
                </motion.div>
              </motion.button>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <div>
                  <Icon
                    icon="line-md:loading-twotone-loop"
                    width="60"
                    className="text-bright-purple"
                  />
                </div>
              </div>
            ) : rooms.length === 0 ? (
              <div className="text-center py-8 flex flex-col items-center text-subtitle">
                <Icon
                  icon="mdi:emoticon-sad-outline"
                  width={48}
                  className="mx-auto mb-2"
                />
                <p>No hay salas públicas disponibles</p>
                <p className="text-sm mt-1 mb-5">¡Crea una nueva sala!</p>
                <CustomButtonOne
                  text="Crear sala"
                  size="sm"
                  color="secondary"
                  icon="mdi:home-plus-outline"
                  action={() => setModalOpen(true)}
                />
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto overflow-x-hidden">
                {rooms.map((room, index) => (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass-box-two p-4"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <h4 className="text-white font-semibold leading-none text-xl mb-4">
                          {room.name}
                        </h4>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1 text-subtitle">
                            <Icon
                              icon="mdi:account"
                              width={16}
                            />
                            {room.currentPlayers}/{room.maxPlayers}
                          </span>
                          <span className="flex items-center gap-1 text-success">
                            <Icon
                              icon="mdi:circle"
                              width={12}
                            />
                            Esperando jugadores
                          </span>
                        </div>
                      </div>
                      <CustomButtonOne
                        text="Unirse"
                        size="sm"
                        color="secondary"
                        action={() => handleJoinRoom(room.id)}
                        icon="material-symbols:arrow-upward-alt"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
        {modalOpen && (
          <CreateRoomModal setCloseModal={() => setModalOpen(false)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
