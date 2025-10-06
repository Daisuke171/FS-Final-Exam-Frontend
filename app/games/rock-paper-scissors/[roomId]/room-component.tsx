"use client";

import { useEffect, useState } from "react";
import { getSocket } from "@/app/socket";
import { useParams, useRouter } from "next/navigation";
import { Icon } from "@iconify-icon/react";
import PlayersInRoom from "@/components/game/rock-paper-scissors/general/PlayersInRoom";
import CustomButtonOne from "@/components/game/rock-paper-scissors/buttons/CustomButtonOne";
import { AnimatePresence, motion } from "motion/react";
import CopiedLinkModal from "@/components/game/rock-paper-scissors/modals/CopiedLinkModal";
import LoaderCard from "@/components/game/rock-paper-scissors/cards/LoaderCard";
import ChatComponent from "@/components/game/rock-paper-scissors/general/ChatComponent";
import CountdownCard from "@/components/game/rock-paper-scissors/cards/CountdownCard";

const socket = getSocket();

interface RoomInfo {
  id: string;
  name: string;
  maxPlayers: number;
  currentPlayers: number;
  isPrivate: boolean;
}

export default function RoomComponent() {
  const [error, setError] = useState<string | null>(null);
  const [players, setPlayers] = useState<{ id: string }[]>([]);
  const [roomInfo, setRoomInfo] = useState<RoomInfo | null>(null);
  const [confirmedPlayers, setConfirmedPlayers] = useState<string[]>([]);
  const [playerId, setPlayerId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [countDown, setCountDown] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const router = useRouter();
  const params = useParams();

  const roomId = params.roomId || "";
  console.log(roomId);
  useEffect(() => {
    socket.on("joinRoomError", (data) => {
      setError(data.message);
      if (error) {
        setTimeout(() => {
          router.push("/games/rock-paper-scissors");
        }, 3000);
      }
    });
    socket.on("countDown", (data) => {
      setCountDown(data);
      console.log(`TIMER RECIBIDO: ${data}`);
      if (data === 0) {
        setIsRedirecting(true);
        setCountDown(null);
        router.push(`/games/rock-paper-scissors/${roomId}/match`);
      }
    });

    socket.on("gameState", (data) => {
      console.log(data.players);
      const normalized = data.players.map((id: string) => ({ id }));
      setPlayers(normalized);
      setRoomInfo(data.roomInfo);
      setPlayerId(socket.id);
      console.log(normalized);
      const confirmed = Object.entries(data.ready)
        .filter(([_, isReady]) => isReady)
        .map(([playerId]) => playerId);
      setConfirmedPlayers(confirmed);
      setLoading(false);
      console.log(data.state);
    });

    socket.emit("joinRoom", { roomId });

    return () => {
      socket.off("gameState");
      socket.off("joinRoomError");
      socket.off("countDown");
    };
  }, []);

  const handleConfirmPlayers = () => {
    socket.emit("confirmReady", { roomId, ready: true });
    setLoading(true);
  };

  const shareRoomLink = () => {
    const roomUrl = `${window.location.origin}/games/rock-paper-scissors/${roomId}`;
    navigator.clipboard.writeText(roomUrl);
    setModalOpen(true);
    setTimeout(() => setModalOpen(false), 2000);
  };

  if (countDown !== null && countDown > 0) {
    return <CountdownCard countDown={countDown} />;
  }

  if (isRedirecting) {
    return <LoaderCard />;
  }

  if (error?.includes("existe")) {
    return (
      <div className="flex flex-col p-10 items-center gap-5 bg-slate-300 rounded-xl border-2 w-140 border-slate-500">
        <h2 className="text-4xl font-bold text-slate-600">
          Sala no encontrada
        </h2>
        <Icon
          icon="streamline-freehand:help-question-circle"
          width={150}
          className="text-slate-500"
        />
        <CustomButtonOne
          text="Volver al inicio"
          variant="outlined"
          color="secondary"
          action={() => router.push("/games/rock-paper-scissors")}
          icon="streamline:return-2"
        />
      </div>
    );
  }

  if (error?.includes("llena")) {
    return (
      <div className="flex flex-col p-10 items-center gap-5 bg-slate-300 rounded-xl border-2 w-140 border-slate-500">
        <h2 className="text-4xl font-bold text-slate-600">{error}</h2>
        <p className="text-slate-600 text-2xl">Redirigiendo...</p>
        <Icon
          icon="streamline-freehand:help-question-circle"
          width={150}
          className="text-slate-500"
        />
        <CustomButtonOne
          text="Volver al inicio"
          variant="outlined"
          color="secondary"
          action={() => router.push("/games/rock-paper-scissors")}
          icon="streamline:return-2"
        />
      </div>
    );
  }

  if (roomInfo) {
    return (
      <>
        <div className="flex gap-5 w-[95%] h-100 justify-center">
          <div className="flex flex-col p-6 bg-slate-300 rounded-xl h-full border-2 min-w-120 border-slate-900">
            <div className="flex items-center justify-between mb-5">
              <h1 className="text-3xl font-bold text-slate-800">
                Sala {roomInfo.name}
              </h1>
              <p className=" text-slate-700 mr-5">
                {players.length}/{roomInfo.maxPlayers} Jugadores en sala
              </p>
            </div>
            <div className="flex flex-col h-full justify-center items-center mb-6 gap-5">
              <div
                onClick={shareRoomLink}
                className="cursor-pointer py-2 px-4 flex items-center gap-2 bg-slate-800 text-slate-200 rounded-lg"
              >
                <Icon
                  icon="material-symbols:file-copy-outline"
                  width="24"
                  height="24"
                />
                <p>Haz click para copiar el enlace!</p>
              </div>
              <div className="">
                <PlayersInRoom
                  players={players}
                  confirmedPlayers={confirmedPlayers}
                  playerId={playerId}
                  label
                />
              </div>
            </div>
            <div className="flex gap-2 justify-center items-center">
              <AnimatePresence>
                {players.length === roomInfo.maxPlayers && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                  >
                    <CustomButtonOne
                      text="Confirmar jugador"
                      action={handleConfirmPlayers}
                      icon="mage:user-check"
                      loading={loading}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <CustomButtonOne
                text="Salir de la sala"
                variant="outlined"
                color="secondary"
                action={() => router.push("/games/rock-paper-scissors")}
                icon="streamline:return-2"
              />
            </div>
          </div>
          <AnimatePresence mode="popLayout">
            {modalOpen && <CopiedLinkModal />}
          </AnimatePresence>
          <ChatComponent
            roomId={roomId}
            playerId={playerId}
            players={players}
          />
        </div>
      </>
    );
  }
}
