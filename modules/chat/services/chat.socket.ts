import { getSocket } from "@shared/lib/socket";

// ========================
// 🔹 JOIN / LEAVE CHAT ROOM
// ========================
export function joinChat(chatId: string) {
  const socket = getSocket("/chat");
  socket.emit("chat:join", { chatId });
  console.log(`🔌 Unido al chat ${chatId}`);
}

export function leaveChat(chatId: string) {
  const socket = getSocket("/chat");
  socket.emit("chat:leave", { chatId });
  console.log(`🔌 Saliste del chat ${chatId}`);
}

// ========================
// 🔹 CHAT HISTORY
// ========================
export function onChatHistory(
  chatId: string,
  cb: (msgs: any[]) => void
) {
  const socket = getSocket("/chat");

  // Desvincula eventos anteriores para evitar duplicados
  socket.off("chat:history");

  // Escucha el evento de historial
  const handleHistory = (payload: any) => {
    console.log("🔍 Payload recibido:", payload);
    
    if (!payload) {
      console.error("❌ Payload vacío");
      return;
    }

    if (payload[0].chatId !== chatId) {
      console.log("⚠️ ChatId no coincide:", payload[0].chatId, "!=", chatId);
      return;
    }

    if (!Array.isArray(payload)) {
      console.error("❌ El formato de mensajes no es válido:", payload.messages);
      return;
    }

    console.log("✅ Historial válido recibido:", payload.length, "mensajes");
    cb(payload);
  };
  
  socket.on("chat:history", handleHistory);

  // Solicita el historial
  console.log("📤 Solicitando historial para chat:", chatId);
  socket.emit("chat:history", { chatId });

  console.log(`📜 Escuchando historial del chat ${chatId}`);
}

export function offChatHistory() {
  const socket = getSocket("/chat");
  socket.off("chat:history");
  console.log("📴 Dejaste de escuchar el historial");
}

// ========================
// 🔹 NUEVOS MENSAJES
// ========================

/*  { chatId, message, senderId } */
export function chatNew(data: { chatId: string; message: string; senderId: string }) {
  const socket = getSocket("/chat");
  socket.emit("chat:new", data);
  console.log(`💬 Nuevo mensaje enviado a chat ${data.message}`);
}

export function onChatNew(cb: (msg: any) => void) {
  const socket = getSocket("/chat");
  
  // Desvincula el evento anterior si existe
  socket.off("chat:new");
  
  // Registra el nuevo manejador
  socket.on("chat:new", (msg) => {
    console.log("💬 Nuevo mensaje recibido en socket:", msg);
    cb(msg);
    
    // Emitir evento local para actualizar badges
    socket.emit("local:message:new", msg);
  });
  
  console.log("💬 Escuchando nuevos mensajes...");
}

export function offChatNew(cb: (msg: any) => void) {
  const socket = getSocket("/chat");
  socket.off("chat:new");
  socket.off("local:message:new");
}

// ========================
// 🔹 MENSAJES LEÍDOS
// ========================
export function readMessage(chatId: string, messageId: string) {
  const socket = getSocket("/chat");
  socket.emit("chat:read", { chatId, messageId });
  console.log(`👀 Marcado como leído: ${messageId}`);
}

export function readAllMessages(chatId: string, userId: string) {
  const socket = getSocket("/chat");
  const data = { chatId, userId };
  socket.emit("chat:readAll", data);
  // Emitimos el evento localmente también para actualización inmediata
  socket.emit("chat:readAll", { ...data, local: true });
  console.log(`👀 Todos los mensajes marcados como leídos en chat ${chatId}`);
}

export function onChatRead(cb: (data: any) => void) {
  const socket = getSocket("/chat");
  
  const handleRead = (data: any) => {
    console.log("👁️ Evento de lectura recibido:", data);
    cb(data);
  };

  socket.on("chat:read", handleRead);
  socket.on("chat:readAll", handleRead);
  console.log("👂 Escuchando eventos de lectura de mensajes...");
}

export function offChatRead(cb: (data: any) => void) {
  const socket = getSocket("/chat");
  socket.off("chat:read", cb);
  socket.off("chat:readAll", cb);
  console.log("👂 Dejando de escuchar eventos de lectura");
}

// ========================
// 🔹 ENVIAR MENSAJES
// ========================
export function sendMessage(chatId: string, message: string) {
  const socket = getSocket("/chat");
  socket.emit("chat:send", { chatId, message });
  console.log(`📤 Mensaje enviado a chat ${chatId}`);
}

export function onSendMessage(cb: (data: any) => void) {
  const socket = getSocket("/chat");
  socket.on("chat:send", cb);
  console.log("📡 Escuchando envío de mensajes...");
}

export function offSendMessage(cb: (data: any) => void) {
  const socket = getSocket("/chat");
  socket.off("chat:send", cb);
}

// ========================
// 🔹 HELPERS (Opcional)
// ========================
export function cleanupChatListeners() {
  const socket = getSocket("/chat");
  socket.removeAllListeners();
  console.log("🧹 Limpieza de listeners del chat completada");
}
