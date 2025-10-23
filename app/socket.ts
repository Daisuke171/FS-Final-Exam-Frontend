import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = () => {
  if (typeof window === "undefined") return null; // SSR guard

  if (!socket) {
    const port = process.env.NEXT_PUBLIC_API_PORT || "3010";
    const host = process.env.NEXT_PUBLIC_API_HOST || "http://localhost";
    const url = `${host}:${port}`;

    // Opcional: token de auth
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    console.log("🔌 Conectando a:", `${url}/rps`);

    socket = io(`${url}/rps`, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      withCredentials: true,                 // si tu server usa cookies CORS
      auth: token ? { token } : undefined,   // si tu server valida token en handshake
      // path: "/socket.io",                 // ajustar si se usa otro path
    });

    socket.on("connect", () => {
      console.log("✅ Socket conectado:", socket?.id);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ connect_error:", error);
    });

    socket.on("disconnect", (reason) => {
      console.warn("⚠️ disconnect:", reason);
    });

    socket.on("error", (error) => {
      console.error("❌ socket error:", error);
    });
  }

  return socket;
};

export const isSocketConnected = () => socket?.connected ?? false;

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};

export const emitEvent = (event: string, data: any) => {
  const s = getSocket();
  if (!s) return;
  if (s.connected) {
    s.emit(event, data);
  } else {
    s.once("connect", () => s.emit(event, data));
  }
};


export const onGameState = (callback: (data: any) => void) => {
  const s = getSocket();
  s?.on("gameState", callback);
  return () => s?.off("gameState", callback);
};

export const onNewFriend = (callback: (data: any) => void) => {
  const s = getSocket();
  s?.on("newFriend", callback);   
  return () => s?.off("newFriend", callback);
};

export const onNewMessage = (callback: (data: any) => void) => {
  const s = getSocket();
  s?.on("newMessage", callback);  
  return () => s?.off("newMessage", callback);
};
