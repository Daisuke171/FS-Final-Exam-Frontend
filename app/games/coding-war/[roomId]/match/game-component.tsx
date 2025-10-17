"use client";

import TextViewer from "@/components/game/coding-war/TextViewer";
import { SocketProvider } from "@/app/games/coding-war/provider/SocketContext";
import { useParams } from "next/navigation";

export default function GameComponent() {
  const params = useParams();
  const roomId = String(params.roomId || "coding-war-room-1");

  return (
    <SocketProvider>
      <div className="w-full max-w-7xl mx-auto px-4 py-6">
        <TextViewer roomId={roomId} />
      </div>
    </SocketProvider>
  );
}
