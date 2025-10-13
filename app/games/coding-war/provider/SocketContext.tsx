"use client";

import { createContext, useContext, useMemo, useState } from "react";

interface SocketCtx {
  joined: boolean;
  currentRoom?: string;
  role?: "player1" | "player2" | "spectator";
  join: (room: string) => void;
  leave: (scope?: string) => void;
}

const Ctx = createContext<SocketCtx | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [joined, setJoined] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<string | undefined>();

  const api = useMemo<SocketCtx>(
    () => ({
      joined,
      currentRoom,
      role: "spectator",
      join: (room: string) => {
        setJoined(true);
        setCurrentRoom(room);
      },
      leave: () => {
        setJoined(false);
        setCurrentRoom(undefined);
      },
    }),
    [joined, currentRoom]
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useSocketContext() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("SocketContext missing provider");
  return ctx;
}
