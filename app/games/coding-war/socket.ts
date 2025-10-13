"use client";

import { getSocket } from "@/app/socket";

export const socket = () => getSocket();

export const joinRoom = (room: string) => {
  const s = socket();
  s.emit("joinRoom", { room });
};

export const leaveRoom = (room: string) => {
  const s = socket();
  s.emit("leaveRoom", { room });
};
