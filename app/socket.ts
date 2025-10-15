import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    const port = process.env.REACT_APP_API_PORT || "3010";
    const url = `http://localhost:${port}`;

    console.log("🔌 Intentando conectar a:", url);

    socket = io(`${url}/rps`, {
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
