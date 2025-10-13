"use client";

import { useEffect, useState } from "react";
import { getSocket } from "@/app/socket";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

const socket = getSocket();

export default function MainCard() {
  const router = useRouter();
  const [roomName, setRoomName] = useState("");
  const [roomIdJoin, setRoomIdJoin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const nameTooShort = roomName.trim().length > 0 && roomName.trim().length < 4;
  const nameEmpty = roomName.trim().length === 0;

  useEffect(() => {
    socket.on("roomCreated", (data: { roomId: string }) => {
      router.push(`/games/test-game/${data.roomId}`);
    });
    socket.on("joinRoomError", (data: { message: string }) => {
      setError(data.message);
    });
    socket.on("joinRoomSuccess", ({ roomId }: { roomId: string }) => {
      setError(null);
      router.push(`/games/test-game/${roomId}`);
    });
    return () => {
      socket.off("roomCreated");
      socket.off("joinRoomError");
      socket.off("joinRoomSuccess");
    };
  }, []);

  const createRoom = () => {
    if (nameEmpty) {
      setError("Ingresa un nombre de sala.");
      return;
    }
    if (nameTooShort) {
      setError("El nombre debe tener al menos 4 caracteres.");
      return;
    }
    setError(null);
    socket.emit("createRoom", { roomName: roomName.trim(), isPrivate: false });
  };
  const joinRoom = () => {
    socket.emit("joinRoom", { roomId: roomIdJoin });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      className="glass-box-one w-140 flex flex-col items-center p-8 gap-6"
    >
      <motion.h1
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.05 }}
        className="text-4xl font-bold text-font"
      >
        Test Game Placeholder
      </motion.h1>
      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-subtitle"
      >
        Solo base de salas: crear y unirse.
      </motion.p>
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="flex gap-3 w-full"
      >
        <input
          className="flex-1 py-3 px-4 rounded-md bg-black/20 border border-dark-gray text-font"
          placeholder="Nombre de la sala"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <button
          className={`px-4 py-3 rounded-md text-white ${
            nameEmpty || nameTooShort ? "bg-dark-gray cursor-not-allowed" : "bg-hover-purple"
          }`}
          disabled={nameEmpty || nameTooShort}
          onClick={createRoom}
        >
          Crear sala
        </button>
      </motion.div>
      {(nameEmpty || nameTooShort) && (
        <p className="text-warning text-sm -mt-3 self-start">
          {nameEmpty
            ? "Requerido: ingresa un nombre para la sala."
            : "Mínimo 4 caracteres."}
        </p>
      )}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex gap-3 w-full"
      >
        <input
          className="flex-1 py-3 px-4 rounded-md bg-black/20 border border-dark-gray text-font"
          placeholder="ID de la sala"
          value={roomIdJoin}
          onChange={(e) => setRoomIdJoin(e.target.value)}
        />
        <button
          className="px-4 py-3 rounded-md bg-shadow-blue text-white"
          onClick={joinRoom}
        >
          Unirse
        </button>
      </motion.div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-error mt-2"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
