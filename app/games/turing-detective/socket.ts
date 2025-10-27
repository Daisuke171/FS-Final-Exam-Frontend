"use client";

import { getTuringSocket } from "@/app/socket";

// Token-aware helpers. Prefer calling getCodingWarSocket(session?.accessToken)
// at the call site, but keep these wrappers for convenience.
export const socket = (token?: string) => getTuringSocket(token);

export const joinRoom = (room: string, token?: string) => {
  const s = socket(token);
  s.emit("joinRoom", { roomId: room });
};

export const leaveRoom = (room: string, token?: string) => {
  const s = socket(token);
  s.emit("leaveRoom", { room });
};
