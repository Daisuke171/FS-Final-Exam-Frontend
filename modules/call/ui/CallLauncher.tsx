"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { ModalCreateRoom } from "./ModalCreateRoom";
import { ToastCall } from "./ToastCall";
import { useVoiceSocket } from "@modules/call/hooks/useVoiceSocket";
export interface CallerUser {
  id: string;
  nickname: string;
  skin?: string | null;
}

export default function CallLauncher({
  currentUser,
  wsUrl = process.env.NEXT_PUBLIC_URL_CALL ?? "http://localhost:3010/call",
}: {
  currentUser: CallerUser;
  wsUrl?: string;
}) {
  const [showCreate, setShowCreate] = useState(false);
  const [room, setRoom] = useState("demo");

  const {
    connected,
    joinedRoom,
    peers,
    muted,
    connect,
    disconnect,
    join,
    startCapture,
    stopCapture,
    setMuted,
  } = useVoiceSocket(wsUrl);

  const onOpen = () => {
    if (!connected) connect();
    setShowCreate(true);
  };

  const onCancel = () => {
    setShowCreate(false);
    stopCapture();
    disconnect();
  };

  const onJoin = async () => {
    if (!connected) return;
    join(room, currentUser.nickname);
    setShowCreate(false);
  };

  return (
    <>
      {/* Botón para FriendPage */}
      <button className="btn-gradient-1 btn-glow flex items-center gap-2 px-2" onClick={onOpen}>
        <Icon icon="mdi:phone" className="text-xl" />
        Nueva Llamada
      </button>

      {/* Modal para crear/unirse a sala */}
      <ModalCreateRoom
        show={showCreate}
        onClose={onCancel}
        connected={connected}
        room={room}
        setRoom={setRoom}
        user={currentUser}
        onJoin={onJoin}
      />

      {/* Toast flotante de la llamada */}           
      <ToastCall
        show={!!joinedRoom}
        room={joinedRoom ?? ""}
        me={currentUser}
        peers={peers}
        connected={connected}
        muted={muted}
        onMute={setMuted}
        onStop={() => {
          stopCapture();
          disconnect();
        }}
        onMic={() => startCapture()}
      />
    </>
  );
}
