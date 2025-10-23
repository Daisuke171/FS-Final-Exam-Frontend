import { io, Socket } from "socket.io-client";

let chatSocket: Socket | null = null;

export function getChatSocket() {
  if (typeof window === "undefined") return null;

  if (!chatSocket) {
    const host = process.env.NEXT_PUBLIC_API_HOST ?? "http://localhost";
    const port = process.env.NEXT_PUBLIC_API_PORT ?? "3010";
    const url = `${host}:${port}`; // raíz; si usas namespace: `${host}:${port}/rps`

    chatSocket = io(url, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      withCredentials: true,
    });

    chatSocket.on("connect", () => {
      console.log("✅ Chat WS conectado:", chatSocket?.id);
    });

    chatSocket.on("disconnect", (reason) => {
      console.warn("⚠️ Chat WS disconnect:", reason);
    });

    chatSocket.on("connect_error", (err) => {
      console.error("❌ Chat WS connect_error:", err);
    });
  }

  return chatSocket;
}

// --- helpers
export function setUser(user: { id: string; username: string }) {
  const s = getChatSocket();
  if (!s) return;
  const emit = () => s.emit("set_user", user);
  s.connected ? emit() : s.once("connect", emit);
}

export function joinChatRoom(chatId: string) {
  const s = getChatSocket();
  if (!s || !chatId) return;
  s.emit("join_chat", chatId);
}

export function sendSocketMessage(chatId: string, message: string) {
  const s = getChatSocket();
  if (!s || !chatId || !message.trim()) return;
  s.emit("send_message", { chatId, message });
}

// marcar leído
export function readMessage(chatId: string, messageId: string) {
  const s = getChatSocket();
  if (!s) return;
  s.emit("read_message", { chatId, messageId });
}

// pedir historial por socket (si querés)
export function requestMessages(chatId: string) {
  const s = getChatSocket();
  if (!s) return;
  s.emit("get_messages", { chatId });
}

// listeners + off
export function onNewMessage(cb: (msg: any) => void) {
  const s = getChatSocket();
  s?.on("newMessage", cb);
  return () => s?.off("newMessage", cb);
}

export function onSent(cb: (msg: any) => void) {
  const s = getChatSocket();
  s?.on("sent", cb);
  return () => s?.off("sent", cb);
}

export function onMessages(cb: (msgs: any[]) => void) {
  const s = getChatSocket();
  s?.on("messages", cb);
  return () => s?.off("messages", cb);
}

export function onMessageRead(cb: (msg: any) => void) {
  const s = getChatSocket();
  s?.on("message_read", cb);
  return () => s?.off("message_read", cb);
}
