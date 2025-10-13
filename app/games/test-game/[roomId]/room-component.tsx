"use client";

import { useEffect, useState } from "react";
import { getSocket } from "@/app/socket";
import { useParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import PlayersInRoom from "@/components/game/rock-paper-scissors/general/PlayersInRoom";
import CustomButtonOne from "@/components/game/rock-paper-scissors/buttons/CustomButtonOne";
import CopiedLinkModal from "@/components/game/rock-paper-scissors/modals/CopiedLinkModal";
import ChatComponent from "@/components/game/rock-paper-scissors/general/ChatComponent";

const socket = getSocket();

export default function RoomComponent() {
  const [players, setPlayers] = useState<string[]>([]);
  const [readyPlayers, setReadyPlayers] = useState<string[]>([]);
  const [spectators, setSpectators] = useState<string[]>([]);
  const [roomName, setRoomName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const params = useParams();
  const roomId = String(params.roomId || "");
  const [selfId, setSelfId] = useState<string>("");
  const [role, setRole] = useState<'player' | 'spectator' | null>(null);
  const isPlayer = players.includes(selfId);
  const isReady = readyPlayers.includes(selfId);

  useEffect(() => {
  setSelfId(socket.id ?? "");
    socket.emit("joinRoom", { roomId });
    socket.on("joinRoomError", (data: { message: string }) => {
      setError(data.message);
    });
    socket.on("gameState", (data: any) => {
      setPlayers(data.players || []);
      setReadyPlayers(data.readyPlayers || []);
      setSpectators(data.spectators || []);
      setRoomName(data.roomInfo?.name || "");
      // If we didn't get a role yet from joinRoomSuccess, infer it from current players
      if (!role) {
        const inferred = (data.players || []).includes(socket.id) ? 'player' : 'spectator';
        setRole(inferred);
      }
    });
    socket.on("joinRoomSuccess", ({ role }: { role: 'player' | 'spectator' }) => {
      setRole(role);
    });
    return () => {
      socket.off("joinRoomError");
      socket.off("gameState");
      socket.off("joinRoomSuccess");
    };
  }, [roomId]);

  const shareRoomLink = () => {
    const roomUrl = `${window.location.origin}/games/test-game/${roomId}`;
    navigator.clipboard.writeText(roomUrl);
    setModalOpen(true);
    setTimeout(() => setModalOpen(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex gap-5 w-[95%] justify-center"
    >
      <div className="flex flex-col glass-box-one h-[30rem] min-w-140 p-6">
        <div className="flex items-center justify-between mb-5 gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-font">Sala {roomName}</h1>
            {role && (
              <span
                className={`px-2 py-1 rounded-md text-xs ${
                  role === 'player'
                    ? 'bg-hover-purple/20 text-hover-purple'
                    : 'bg-light-gray/20 text-subtitle'
                }`}
                title={role === 'player' ? 'Jugador' : 'Espectador'}
              >
                {role === 'player' ? 'Jugador' : 'Espectador'}
              </span>
            )}
          </div>
          <p className="text-subtitle mr-3">{players.length}/2 Jugadores en sala</p>
        </div>
        <div className="flex flex-col h-full justify-center items-center mb-6 gap-5">
          <div
            onClick={shareRoomLink}
            className="cursor-pointer py-2 px-4 flex items-center gap-2 bg-shadow-blue text-font rounded-lg"
          >
            <span>Haz click para copiar el enlace!</span>
          </div>
          <div className="">
            <PlayersInRoom
              players={players.map((id) => ({ id }))}
              confirmedPlayers={readyPlayers}
              playerId={selfId}
              label
            />
          </div>
        </div>
        <div className="flex gap-2 justify-center items-center">
          {isPlayer && (
            <CustomButtonOne
              text={isReady ? "Cancelar" : "Confirmar"}
              action={() => socket.emit("test:confirmReady", { roomId, ready: !isReady })}
              icon={isReady ? "mage:user-cross" : "mage:user-check"}
            />
          )}
          <CustomButtonOne
            text="Salir de la sala"
            variant="outlined"
            color="secondary"
            action={() => router.push("/games/test-game")}
            icon="streamline:return-2"
          />
        </div>
        {error && <p className="text-error mt-4 text-center">{error}</p>}
      </div>
      {modalOpen && <CopiedLinkModal />}
      <ChatComponent
        roomId={roomId}
        playerId={selfId}
        players={players.map((id) => ({ id }))}
      />
      {role && (
        <div className="fixed bottom-6 left-6 glass-box-two px-3 py-1 rounded-md text-sm text-font">
          Rol: <span className="ml-1 font-semibold">{role === 'player' ? 'Jugador' : 'Espectador'}</span>
        </div>
      )}
    </motion.div>
  );
}
