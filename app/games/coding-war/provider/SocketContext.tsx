"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { joinRoom, leaveRoom, socket } from "@/app/games/coding-war/socket";

interface SocketContextProps {
  joined: boolean;
  join: (room: string) => void;
  leave: (room: string) => void;
}

const SocketContext = createContext<SocketContextProps | undefined>(undefined);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [joined, setJoined] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);

  useEffect(() => {
    const s = socket();

    s.on("connect", () => console.log("✅ Socket connected:", s.id));
    s.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      setJoined(false);
    });

    return () => {
      s.disconnect();
    };
  }, []);

  const join = (room: string) => {
    joinRoom(room);
    setJoined(true);
    setCurrentRoom(room);
  };

  const leave = (room: string) => {
    leaveRoom(room);
    setJoined(false);
    setCurrentRoom(null);
  };

  return (
    <SocketContext.Provider value={{ joined, join, leave }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocketContext must be used within SocketProvider");
  }
  return context;
};
