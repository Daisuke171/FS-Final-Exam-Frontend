"use client";

import TextViewer from "@/components/game/turing-detective/TextViewer";
import { SocketProvider } from "@/app/games/turing-detective/provider/SocketContext";
import { useParams } from "next/navigation";

export default function GameComponent() {
  const params = useParams();
  const roomId = String(params.roomId || "turing-detective-room-1");

  return (
    <SocketProvider>
      <div className="w-full max-w-7xl mx-auto px-4 py-6">
        <TextViewer roomId={roomId} />
      </div>
    </SocketProvider>
  );
}
