"use client";

import Room from "@/components/game/coding-war/room";
import TextViewer from "@/components/game/coding-war//textViewer";
import { SocketProvider, useSocketContext } from "@/app/games/coding-war/provider/SocketContext";

function CodingWarContent() {
  const { joined } = useSocketContext();

  return (
    <>
  {!joined ? <Room /> : <TextViewer />}
    </>
  );
}

export default function CodingWar() {
  return (
    <SocketProvider>
      <CodingWarContent />
    </SocketProvider>
  );
}
