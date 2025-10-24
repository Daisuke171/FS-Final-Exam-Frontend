"use client";

import { getCodingWarSocket } from "@/app/socket";

export const socket = () => getCodingWarSocket();

export const joinRoom = (room: string) => {
  const s = socket();
  s.emit("joinRoom", { roomId: room });
};

export const leaveRoom = (room: string) => {
  const s = socket();
  s.emit("leaveRoom", { room });
};
