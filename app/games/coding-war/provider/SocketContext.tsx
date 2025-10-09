"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { socket, joinRoom, leaveRoom } from "@/app/games/coding-war/socket";

interface SocketContextProps {
  joined: boolean;
  join: (room: string) => void;
  leave: (room: string) => void;
}

const SocketContext = createContext<SocketContextProps | undefined>(undefined);

export function SocketProvider({ children }: { children: ReactNode }) {
  const [joined, setJoined] = useState(false);

  const join = (room: string) => {
    joinRoom(room);
    setJoined(true);
  };

  const leave = (room: string) => {
    leaveRoom(room);
    setJoined(false);
  };

  return (
    <SocketContext.Provider value={{ joined, join, leave }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocketContext must be used inside SocketProvider");
  }
  return context;
};
