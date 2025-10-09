import { io, Socket } from "socket.io-client";

let socketInstance: Socket | null = null;

export const socket = () => {
  if (!socketInstance) {
    socketInstance = io("http://localhost:3010", {
      reconnectionAttempts: 5,
      transports: ["websocket", "polling"],
    });
  }
  return socketInstance;
};

export function joinRoom(room: string) {
  const s = socket();
  if (!s.connected) {
    s.once("connect", () => s.emit("joinRoom", { room }));
  } else {
    s.emit("joinRoom", { room });
  }
}

export function leaveRoom(room: string) {
  const s = socket();
  if (!s.connected) {
    s.once("connect", () => s.emit("leaveRoom", { room }));
  } else {
    s.emit("leaveRoom", { room });
  }
}

