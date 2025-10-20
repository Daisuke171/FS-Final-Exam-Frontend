"use client";

import { useEffect, useState } from "react";
import { getCodingWarSocket } from "@/app/socket";
import { useParams, useRouter } from "next/navigation";
import { Icon } from "@iconify-icon/react";
import PlayersInRoom from "@/components/game/coding-war/general/PlayersInRoom";
import CustomButtonOne from "@/components/game/coding-war/buttons/CustomButtonOne";
import { AnimatePresence, motion } from "motion/react";
import CopiedLinkModal from "@/components/game/coding-war/modals/CopiedLinkModal";
import LoaderCard from "@/components/game/coding-war/cards/LoaderCard";
import ChatComponent from "@/components/game/coding-war/general/ChatComponent";
import CountdownCard from "@/components/game/coding-war/cards/CountdownCard";
import RoomErrorCard from "@/components/game/coding-war/cards/RoomErrorCard";
import { useRoomSocket } from "@/hooks/coding-war/useRoomSocket";
import JoinByPassword from "@/components/game/coding-war/general/JoinByPassword";

const socket = getCodingWarSocket();

export default function RoomComponent() {
  const [loading, setLoading] = useState(false);
  const [clicked, setClicked] = useState<boolean>(false);
  const [countDown, setCountDown] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [playerId, setPlayerId] = useState<string | undefined>(undefined);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();
  const params = useParams();
  const roomId = Array.isArray(params.roomId)
    ? params.roomId[0]
    : (params.roomId as string | undefined) || "";
  useEffect(() => {
    console.log("[RoomComponent] roomId:", roomId);
  }, [roomId]);

  const {
    handleJoinRoomByPassword,
    message,
    isPrivate,
    error,
    roomInfo,
    players,
    confirmedPlayers,
  } = useRoomSocket(roomId || "");
  useEffect(() => {
    if (!roomId) return; // wait until param is available

    const onCountDown = (data: number) => {
      setCountDown(data);
      console.log(`TIMER RECIBIDO: ${data}`);
      if (data === 0) {
        setIsRedirecting(true);
        setCountDown(null);
        router.push(`/games/coding-war/${roomId}/match`);
      }
    };
    const onGameState = () => setPlayerId(socket.id);

    socket.on("countDown", onCountDown);
    socket.on("gameState", onGameState);

  // Always request the current game/room state so the UI can populate
  socket.emit("requestGameState", { roomId });

    // Join only after we have a valid roomId, and avoid duplicate emits across StrictMode remounts
    const anySocket = socket as unknown as { _cwJoinedRooms?: Set<string> };
    if (!anySocket._cwJoinedRooms) anySocket._cwJoinedRooms = new Set<string>();
    if (!anySocket._cwJoinedRooms.has(roomId)) {
      socket.emit("joinRoom", { roomId });
      anySocket._cwJoinedRooms.add(roomId);
    }

    return () => {
      socket.off("gameState", onGameState);
      socket.off("joinRoomError");
      socket.off("countDown", onCountDown);
    };
  }, [roomId]);

  const handleConfirmPlayers = () => {
    socket.emit("confirmReady", { roomId, ready: true });
    setLoading(true);
    setClicked(true);
    if (clicked) {
      setTimeout(() => {
        socket.emit("confirmReady", { roomId, ready: false });
        setLoading(false);
        setClicked(false);
      }, 100);
    }
  };

  const shareRoomLink = () => {
  const roomUrl = `${window.location.origin}/games/coding-war/${roomId}`;
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

  if (isPrivate) {
    return (
      <JoinByPassword
        error={error}
        message={message}
        action={handleJoinRoomByPassword}
      />
    );
  }

  if (error?.includes("existe")) {
    return (
      <RoomErrorCard
        error="La sala no existe"
        subtitle="Redireccionando..."
        icon="streamline-freehand:help-question-circle"
  action={() => router.push("/games/coding-war")}
      />
    );
  }

  if (error?.includes("llena")) {
    return (
      <RoomErrorCard
        error={error}
        subtitle="Redireccionando..."
        icon="ph:users-four-light"
  action={() => router.push("/games/coding-war")}
      />
    );
  }

  if (roomInfo) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex gap-5 w-[95%] h-100 justify-center"
        >
          <div className="flex flex-col glass-box-one h-full min-w-120 ">
            <div className="flex items-center justify-between mb-5">
              <h1 className="text-3xl font-bold text-font">
                Sala {roomInfo.name}
              </h1>
              <p className="text-subtitle mr-3">
                {players.length}/{roomInfo.maxPlayers} Jugadores en sala
              </p>
            </div>
            <div className="flex flex-col h-full justify-center items-center mb-6 gap-5">
              <div
                onClick={shareRoomLink}
                className="cursor-pointer py-2 px-4 flex items-center gap-2 bg-shadow-blue text-font rounded-lg"
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
                      text={clicked ? "Cancelar" : "Confirmar"}
                      action={handleConfirmPlayers}
                      icon={clicked ? "mage:user-cross" : "mage:user-check"}
                      // loading={loading}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <CustomButtonOne
                text="Salir de la sala"
                variant="outlined"
                color="secondary"
                action={() => router.push("/games/coding-war")}
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
        </motion.div>
      </>
    );
  }

  // Fallback while roomInfo is loading or awaiting server state
  return <LoaderCard />;
}
