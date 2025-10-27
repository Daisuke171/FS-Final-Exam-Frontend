"use client";

import { useEffect, useRef, useState } from "react";
import { getTuringSocket } from "@/app/socket";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { Icon } from "@iconify-icon/react";
import PlayersInRoom from "@/components/game/turing-detective/general/PlayersInRoom";
import CustomButtonOne from "@/components/game/turing-detective/buttons/CustomButtonOne";
import { AnimatePresence, motion } from "motion/react";
import CopiedLinkModal from "@/components/game/turing-detective/modals/CopiedLinkModal";
import LoaderCard from "@/components/game/turing-detective/cards/LoaderCard";
import ChatComponent from "@/components/game/turing-detective/general/ChatComponent";
import CountdownCard from "@/components/game/turing-detective/cards/CountdownCard";
import RoomErrorCard from "@/components/game/turing-detective/cards/RoomErrorCard";
import { useRoomSocket } from "@/hooks/turing-detective/useRoomSocket";
import JoinByPassword from "@/components/game/turing-detective/general/JoinByPassword";

export default function RoomComponent() {
  const { data: session, status } = useSession();
  const socketRef = useRef<ReturnType<typeof getTuringSocket> | null>(null);
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
    if (status !== "authenticated" || !session?.accessToken) return;
    socketRef.current = getTuringSocket(session.accessToken);
  }, [status, session?.accessToken]);

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
      console.log(`[RoomComponent] TIMER RECIBIDO for ${roomId}:`, data);
      if (data === 0) {
        setIsRedirecting(true);
        setCountDown(null);
        router.push(`/games/turing-detective/${roomId}/match`);
      }
    };
  const s = socketRef.current;
  if (!s) {
    console.warn("[RoomComponent] No socket available yet for room:", roomId);
    return;
  }
  const onGameState = () => {
    console.log("[RoomComponent] received gameState, socket id:", s.id);
    setPlayerId(s.id);
  };

  s.on("countDown", onCountDown);
  s.on("gameState", onGameState);
    // Join only after we have a valid roomId, and avoid duplicate emits across StrictMode remounts
    const anySocket = s as unknown as { _cwJoinedRooms?: Set<string> };
    if (!anySocket._cwJoinedRooms) anySocket._cwJoinedRooms = new Set<string>();
    if (!anySocket._cwJoinedRooms.has(roomId)) {
      console.log("[RoomComponent] Emitting joinRoom for:", roomId);
      s.emit("joinRoom", { roomId });
      anySocket._cwJoinedRooms.add(roomId);
      // After joining, request the current room state to populate UI
      setTimeout(() => {
        console.log("[RoomComponent] Emitting requestGameState for:", roomId);
        s.emit("requestGameState", { roomId });
      }, 50);
    } else {
      // Already joined previously, safe to request state
      console.log("[RoomComponent] Already joined, requesting state for:", roomId);
      s.emit("requestGameState", { roomId });
    }

    return () => {
      console.log("[RoomComponent] Cleaning up listeners for:", roomId);
      s.off("gameState", onGameState);
      s.off("joinRoomError");
      s.off("countDown", onCountDown);
    };
  }, [roomId, router, status, session?.accessToken]);

  const handleConfirmPlayers = () => {
    const next = !clicked;
    socketRef.current?.emit("confirmReady", { roomId, ready: next });
    setClicked(next);
  };

  const shareRoomLink = () => {
    const roomUrl = `${window.location.origin}/games/turing-detective/${roomId}`;
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
        action={() => router.push("/games/turing-detective")}
      />
    );
  }

  if (error?.includes("llena")) {
    return (
      <RoomErrorCard
        error={error}
        subtitle="Redireccionando..."
        icon="ph:users-four-light"
        action={() => router.push("/games/turing-detective")}
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
                action={() => router.push("/games/turing-detective")}
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
