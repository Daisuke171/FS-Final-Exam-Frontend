import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
let codingWarSocket: Socket | null = null;

// Resolve a single base URL for all sockets
const getBaseUrl = () => {
  // Prefer an explicit URL (e.g., http://localhost:3059)
  const explicitUrl = process.env.NEXT_PUBLIC_API_URL;
  if (explicitUrl) return explicitUrl.replace(/\/$/, "");

  // Else build from host + port
  const port = process.env.NEXT_PUBLIC_API_PORT || "3010";
  const host =
    typeof window !== "undefined" ? window.location.hostname : "localhost";
  return `http://${host}:${port}`;
};

export const getSocket = (token?: string) => {
  if (socket && socket.disconnected) {
    socket.offAny();
    socket = null;
  }
  if (!socket) {
    const baseUrl = getBaseUrl();

    console.log("🔌 Intentando conectar a:", `${baseUrl}/rps`);

    socket = io(`${baseUrl}/rps`, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      auth: {
        token,
      },
    });

    socket.on("connect", () => {
      console.log("✅ Conectado al servidor RPS | Socket ID:", socket?.id);
    });

    socket.on("connect_error", (error: Error) => {
      console.error("❌ Error de conexión:", error);
    });

    socket.on("disconnect", (reason: string) => {
      console.warn("⚠️ Desconectado:", reason);
    });

    socket.on("error", (error: Error) => {
      console.error("❌ Error de Socket:", error);
      console.error(
        "❌ Detalles del Error (JSON):",
        JSON.stringify(error, null, 2)
      );
    });
  }

  return socket;
};

export const getCodingWarSocket = (token?: string) => {
  if (!codingWarSocket) {
    const baseUrl = getBaseUrl();
    console.log("🔌 Intentando conectar a:", `${baseUrl}/coding-war`);
    codingWarSocket = io(`${baseUrl}/coding-war`, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ["websocket", "polling"],
      auth: {
        token,
      },
    });

    codingWarSocket.on("connect", () => {
      console.log(
        "✅ Conectado al servidor Coding War | Socket ID:",
        codingWarSocket?.id
      );
    });

    codingWarSocket.on("connect_error", (error: Error) => {
      console.error("❌ Error de conexión (Coding War):", error);
    });

    codingWarSocket.on("disconnect", (reason: string) => {
      console.warn("⚠️ Desconectado (Coding War):", reason);
      codingWarSocket = null;
    });
  }
  return codingWarSocket;
};

export const onGameState = (callback: (data: unknown) => void) => {
  const s = getSocket();
  s?.on("gameState", callback);

  return () => {
    s?.off("gameState", callback);
  };
};

export const emitEvent = (event: string, data: unknown) => {
  const s = getSocket();
  if (s?.connected) {
    s.emit(event, data);
  } else {
    console.warn(`⚠️ Socket no conectado. No se puede emitir: ${event}`);
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.offAny();
    socket.disconnect();
    socket = null;
  }
  if (codingWarSocket) {
    codingWarSocket.offAny();
    codingWarSocket.disconnect();
    codingWarSocket = null;
  }
};

export const isSocketConnected = () => {
  return socket?.connected ?? false;
};
