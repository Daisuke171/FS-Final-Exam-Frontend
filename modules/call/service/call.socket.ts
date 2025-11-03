"use client";
import { getSocket } from "@shared/lib/socket";

export function getCallSocket(userId: string) {
  const s = getSocket("/call");
  // autenticar sala por userId cada vez que conecte
  s.once("connect", () => {
    s.emit("auth", { userId });
  });
  return s;
}
