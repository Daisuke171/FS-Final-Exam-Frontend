"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import PlayersInRoom from "@/components/game/rock-paper-scissors/general/PlayersInRoom";
import CustomButtonOne from "@/components/game/rock-paper-scissors/buttons/CustomButtonOne";
import { AnimatePresence, motion } from "motion/react";
import CopiedLinkModal from "@/components/game/rock-paper-scissors/modals/CopiedLinkModal";
import ChatComponent from "@/components/game/rock-paper-scissors/general/ChatComponent";
import CountdownCard from "@/components/game/rock-paper-scissors/cards/CountdownCard";
import RoomErrorCard from "@/components/game/rock-paper-scissors/cards/RoomErrorCard";
import { useGameSocket } from "@/hooks/rock-paper-scissors/useGameSocket";
import JoinByPassword from "@/components/game/rock-paper-scissors/general/JoinByPassword";
import { useSession } from "next-auth/react";
import { getSocket } from "@/app/socket";
import useBreakpoint from "@/hooks/useBreakpoint";
import GlobalLoader from "@/components/ui/loaders/GlobalLoader";

export default function RoomComponent() {
  const { data: session, status } = useSession();
  const [clicked, setClicked] = useState<boolean>(false);
  const [countDown, setCountDown] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [openChat, setOpenChat] = useState(false);
  const playerNickname = session?.user?.nickname;
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();
  const params = useParams();
  const roomId = params.roomId || "";
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "mobile";

  const {
    handleJoinRoomByPassword,
    handleConfirmReady,
    message,
    isPrivate,
    error,
    roomInfo,
    players,
    confirmedPlayers,
    countDown: hookCountDown,
  } = useGameSocket(roomId || "");

  useEffect(() => {
    if (hookCountDown !== null) {
      setCountDown(hookCountDown);
      if (hookCountDown === 0) {
        setIsRedirecting(true);
        setCountDown(null);
        setTimeout(() => {
          router.push(`/games/rock-paper-scissors/${roomId}/match`);
        }, 100);
      }
    }
  }, [hookCountDown, roomId, router]);

  const handleConfirmPlayers = () => {
    handleConfirmReady(!clicked);
    setClicked(!clicked);
  };

  const shareRoomLink = () => {
    const roomUrl = `${window.location.origin}/games/rock-paper-scissors/${roomId}`;
    navigator.clipboard.writeText(roomUrl);
    setModalOpen(true);
    setTimeout(() => setModalOpen(false), 2000);
  };

  const handleLeaveRoom = () => {
    const socket = getSocket(session?.accessToken);
    if (socket && roomId) {
      socket.emit("leaveRoom", { roomId });

      setTimeout(() => {
        router.push("/games/rock-paper-scissors");
      }, 100);
    } else {
      router.push("/games/rock-paper-scissors");
    }
  };

  const handleChatOpen = () => {
    setOpenChat(!openChat);
  };

  if (status === "loading") {
    return <GlobalLoader />;
  }

  if (countDown !== null && countDown > 0) {
    return <CountdownCard countDown={countDown} />;
  }

  if (isRedirecting) {
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

  if (error?.includes("existe")) {
    return (
      <RoomErrorCard
        error="La sala no existe"
        subtitle="Redireccionando..."
        icon="streamline-freehand:help-question-circle"
        action={() => router.push("/games/rock-paper-scissors")}
      />
    );
  }

  if (error?.includes("llena")) {
    return (
      <RoomErrorCard
        error={error}
        subtitle="Redireccionando..."
        icon="ph:users-four-light"
        action={() => router.push("/games/rock-paper-scissors")}
      />
    );
  }

  if (roomInfo) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex gap-5 w-[90%] max-w-230 h-100 justify-center mt-10"
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
              playerNickname={playerNickname}
              roomId={roomId}
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
            <div>
              <ChatComponent
                handleClose={handleChatOpen}
                playerNickname={playerNickname}
                roomId={roomId}
                players={players}
              />
            </div>
          )}
        </AnimatePresence>
      </>
    );
  }
}
