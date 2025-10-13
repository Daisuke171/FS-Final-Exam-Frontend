import { io, Socket } from "socket.io-client";

let defaultSocket: Socket | null = null;
let codingWarSocket: Socket | null = null;

export const getSocket = () => {
  if (!defaultSocket) {
    defaultSocket = io("http://localhost:3010", {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ["websocket", "polling"],
    });
  }
  return defaultSocket;
};

export const getCodingWarSocket = () => {
  if (!codingWarSocket) {
    codingWarSocket = io("http://localhost:3010/coding-war", {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ["websocket", "polling"],
    });
  }
  return codingWarSocket;
};
