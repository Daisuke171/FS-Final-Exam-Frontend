import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
let codingWarSocket: Socket | null = null;

// Resolve a single base URL for all sockets
const getBaseUrl = () => {
  // Prefer an explicit URL (e.g., http://localhost:3059)
  const explicitUrl = process.env.NEXT_PUBLIC_API_URL;
  if (explicitUrl) return explicitUrl.replace(/\/$/, "");

  // Else build from host + port
  const port = process.env.NEXT_PUBLIC_API_PORT || "3059";
  const host = typeof window !== "undefined" ? window.location.hostname : "localhost";
  return `http://${host}:${port}`;
};

export const getSocket = () => {
  if (!socket) {
    const baseUrl = getBaseUrl();

    console.log("🔌 Intentando conectar a:", `${baseUrl}/rps`);

    socket = io(`${baseUrl}/rps`, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socket.on("connect", () => {
      console.log("✅ Conectado al servidor RPS | Socket ID:", socket?.id);
    });

    socket.on("connect_error", (error: any) => {
      console.error("❌ Error de conexión:", error);
    });

    socket.on("disconnect", (reason: string) => {
      console.warn("⚠️ Desconectado:", reason);
      socket = null; // Reset para reconectar
    });

    socket.on("error", (error: any) => {
      console.error("❌ Error de Socket:", error);
    });
  }

  return socket;
};

export const getCodingWarSocket = () => {
  if (!codingWarSocket) {
    const baseUrl = getBaseUrl();
    console.log("🔌 Intentando conectar a:", `${baseUrl}/coding-war`);
    codingWarSocket = io(`${baseUrl}/coding-war`, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ["websocket", "polling"],
    });

    codingWarSocket.on("connect", () => {
      console.log("✅ Conectado al servidor Coding War | Socket ID:", codingWarSocket?.id);
    });

    codingWarSocket.on("connect_error", (error: any) => {
      console.error("❌ Error de conexión (Coding War):", error);
    });

    codingWarSocket.on("disconnect", (reason: string) => {
      console.warn("⚠️ Desconectado (Coding War):", reason);
      codingWarSocket = null;
    });
  }
  return codingWarSocket;
};

export const onGameState = (callback: (data: any) => void) => {
  const s = getSocket();
  s?.on("gameState", callback);

  return () => {
    s?.off("gameState", callback);
  };
};

export const emitEvent = (event: string, data: any) => {
  const s = getSocket();
  if (s?.connected) {
    s.emit(event, data);
  } else {
    console.warn(`⚠️ Socket no conectado. No se puede emitir: ${event}`);
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const isSocketConnected = () => {
  return socket?.connected ?? false;
};
