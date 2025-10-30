"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Icon } from "@iconify-icon/react";
import PlayersInRoom from "@/components/game/coding-war/general/PlayersInRoom";
import CustomButtonOne from "@/components/game/coding-war/buttons/CustomButtonOne";
import { AnimatePresence, motion } from "motion/react";
import CopiedLinkModal from "@/components/game/coding-war/modals/CopiedLinkModal";
import ChatComponent from "@/components/game/coding-war/general/ChatComponent";
import CountdownCard from "@/components/game/coding-war/cards/CountdownCard";
import RoomErrorCard from "@/components/game/coding-war/cards/RoomErrorCard";
import { useRoomSocket } from "@/hooks/coding-war/useRoomSocket";
import JoinByPassword from "@/components/game/coding-war/general/JoinByPassword";
import { useSession } from "next-auth/react";
import { getCodingWarSocket } from "@/app/socket";
import useBreakpoint from "@/hooks/useBreakpoint";
import LoaderCard from "@/components/game/coding-war/cards/LoaderCard";

export default function RoomComponent() {
  const { data: session, status } = useSession();
  const [clicked, setClicked] = useState<boolean>(false);
  const [countDown, setCountDown] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [openChat, setOpenChat] = useState(false);
  const playerNickname = session?.user?.nickname;
  const [playerId, setPlayerId] = useState<string | undefined>(undefined);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();
  const params = useParams();
  const roomId = Array.isArray(params.roomId)
    ? params.roomId[0]
    : (params.roomId as string | undefined) || "";
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "mobile";

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
    
    const socket = getCodingWarSocket(session?.accessToken);
    if (!socket) return;
    
    const onGameState = () => setPlayerId(socket.id);

    socket.on("countDown", onCountDown);
    socket.on("gameState", onGameState);
    
    // Join only after we have a valid roomId, and avoid duplicate emits across StrictMode remounts
    const anySocket = socket as unknown as { _cwJoinedRooms?: Set<string> };
    if (!anySocket._cwJoinedRooms) anySocket._cwJoinedRooms = new Set<string>();
    if (!anySocket._cwJoinedRooms.has(roomId)) {
      socket.emit("joinRoom", { roomId });
      anySocket._cwJoinedRooms.add(roomId);
      // After joining, request the current room state to populate UI
      setTimeout(() => {
        socket.emit("requestGameState", { roomId });
      }, 50);
    } else {
      // Already joined previously, safe to request state
      socket.emit("requestGameState", { roomId });
    }

    return () => {
      if (socket && typeof socket.off === 'function') {
        socket.off("gameState", onGameState);
        socket.off("joinRoomError");
        socket.off("countDown", onCountDown);
      }
    };
  }, [roomId, router, status, session?.accessToken]);

  const handleConfirmPlayers = () => {
    const socket = getCodingWarSocket(session?.accessToken);
    if (!socket || typeof socket.emit !== 'function') {
      console.warn("⚠️ No hay socket disponible para confirmar jugadores");
      return;
    }
    const next = !clicked;
    socket.emit("confirmReady", { roomId, ready: next });
    setClicked(next);
  };

  const handleLeaveRoom = () => {
    const socket = getCodingWarSocket(session?.accessToken);
    if (socket && roomId) {
      socket.emit("leaveRoom", { roomId });

      setTimeout(() => {
        router.push("/games/coding-war");
      }, 100);
    } else {
      router.push("/games/coding-war");
    }
  };

  const shareRoomLink = () => {
    const roomUrl = `${window.location.origin}/games/coding-war/${roomId}`;
    navigator.clipboard.writeText(roomUrl);
    setModalOpen(true);
    setTimeout(() => setModalOpen(false), 2000);
  };

  const handleChatOpen = () => {
    setOpenChat(!openChat);
  };

  // Prevent body scroll when mobile chat is open
  useEffect(() => {
    if (openChat && isMobile) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [openChat, isMobile]);

  if (status === "loading") {
    return <LoaderCard />;
  }

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
          className="flex gap-5 w-[90%] max-w-230 h-100 justify-center mt-15"
        >
          <div className="flex flex-col glass-box-one h-full w-full max-w-120 md:w-[60%]">
            {isMobile && (
              <button
                onClick={handleChatOpen}
                className="absolute top-5 right-5"
              >
                <Icon
                  icon="material-symbols:chat"
                  className="text-font text-3xl"
                />
              </button>
            )}

            <div className="flex items-center flex-col md:flex-row justify-center md:justify-between mb-5">
              <h1 className="text-3xl font-bold text-font">
                Sala {roomInfo.name}
              </h1>
              <p className="text-subtitle mt-2 md:mr-3">
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
                  playerId={playerNickname}
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
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <CustomButtonOne
                text="Salir de la sala"
                variant="outlined"
                color="secondary"
                action={handleLeaveRoom}
                icon="streamline:return-2"
              />
            </div>
          </div>
          <AnimatePresence mode="popLayout">
            {modalOpen && <CopiedLinkModal />}
          </AnimatePresence>
          {isMobile ? null : (
            <ChatComponent
              roomId={roomId}
              playerId={playerId}
              players={players}
            />
          )}
        </motion.div>
        <AnimatePresence mode="popLayout">
          {openChat && isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={handleChatOpen}
              className="fixed top-0 z-20 left-0 bg-black/50 backdrop-blur-sm w-full h-full"
            ></motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence mode="popLayout">
          {openChat && isMobile && (
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ duration: 0.3 }}
              className="fixed inset-x-0 bottom-0 z-30 h-[80vh] bg-background border-t-2 border-light-gray rounded-t-xl"
            >
              <div className="h-full p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-font">Chat</h2>
                  <button
                    onClick={handleChatOpen}
                    className="text-font hover:text-subtitle"
                  >
                    <Icon icon="mdi:close" className="text-2xl" />
                  </button>
                </div>
                <div className="h-[calc(100%-4rem)]">
                  <ChatComponent
                    roomId={roomId}
                    playerId={playerId}
                    players={players}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Fallback while roomInfo is loading or awaiting server state
  return <LoaderCard />;
}
