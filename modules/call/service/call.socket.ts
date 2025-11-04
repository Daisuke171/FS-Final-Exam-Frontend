"use client";
import { io, Socket } from "socket.io-client";

// Mantener un mapa de sockets por userId para evitar interferencias entre usuarios
const socketMap = new Map<string, Socket>();

export function getCallSocket(userId: string) {
  if (typeof window === "undefined") return null;
  
  // Retornar el socket existente si ya está conectado
  const existingSocket = socketMap.get(userId);
  if (existingSocket?.connected) return existingSocket;

  // Limpiar socket existente si está desconectado
  if (existingSocket) {
    existingSocket.offAny();
    existingSocket.disconnect();
    socketMap.delete(userId);
  }

  const host = process.env.NEXT_PUBLIC_WS_URL ?? "http://localhost";
  const port = process.env.NEXT_PUBLIC_API_PORT ?? "3010";
  
  const socket = io(`${host}:${port}/call`, {
    transports: ["websocket", "polling"],
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
    autoConnect: true,
    // Forzar nuevo intento si websocket falla
    forceNew: true,
    // Esperar más tiempo antes de timeout
    connectTimeout: 30000,
  });

  // Manejar conexión y autenticación
  socket.on("connect", () => {
    console.log("✅ WS /call connected:", socket.id);
    // Autenticar inmediatamente al conectar
    socket.emit("auth", { userId });
  });

  socket.on("auth:ok", (data) => {
    console.log("✅ WS /call authenticated as:", data.userId);
  });

  // Reconexión y manejo de errores
  socket.on("disconnect", (reason) => {
    console.log("⚠️ WS /call disconnected:", reason);
    // Si la desconexión no fue intencional, intentar reconectar
    if (reason === "transport close" || reason === "transport error") {
      console.log("🔄 Intentando reconectar...");
    }
  });

  socket.on("reconnect", (attemptNumber) => {
    console.log(`✅ WS /call reconectado después de ${attemptNumber} intentos`);
    // Reautenticar después de la reconexión
    socket.emit("auth", { userId });
  });

  socket.on("reconnect_attempt", (attemptNumber) => {
    console.log(`🔄 Intento de reconexión #${attemptNumber}`);
  });

  socket.on("reconnect_error", (error) => {
    console.error("❌ Error de reconexión:", error);
  });

  socket.on("connect_error", (error) => {
    console.error("❌ WS /call error de conexión:", error.message);
  });

  // Guardar el socket en el mapa
  socketMap.set(userId, socket);
  return socket;
}

export function disconnectCallSocket(userId: string) {
  const socket = socketMap.get(userId);
  if (socket) {
    socket.offAny();
    socket.disconnect();
    socketMap.delete(userId);
  }
}
