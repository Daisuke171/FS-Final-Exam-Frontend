import { getSocket } from "@shared/lib/socket";

// Join and leave chat rooms
export function joinChat(chatId: string) {
  getSocket("/chat").emit("chat:join", { chatId });
}

export function leaveChat(chatId: string) {
  getSocket("/chat").emit("chat:leave", { chatId });
}

// Chat history handlers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function onChatHistory(cb: (msgs: any[]) => void) {
  getSocket("/chat").on("chat:history", cb);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function offChatHistory(cb: (msgs: any[]) => void) {
  getSocket("/chat").off("chat:history", cb);
}

// New message handlers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function onChatNew(cb: (msg: any) => void) {
  getSocket("/chat").on("chat:new", cb);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function offChatNew(cb: (msg: any) => void) {
  getSocket("/chat").off("chat:new", cb);
}

// Read message handlers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function onChatRead(cb: (data: any) => void) {
  getSocket("/chat").on("chat:read", cb);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function offChatRead(cb: (data: any) => void) {
  getSocket("/chat").off("chat:read", cb);
}

// Legacy functions (keeping for backward compatibility)
export function joinChatLegacy(chatId: string) {
  getSocket().emit("join_chat", chatId);
}
// New Menssge Handlers (Legacy - for backward compatibility)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function onNewMessage(cb: (msg: any) => void) {
  getSocket().on("newMessage", cb); // on para escuchar eventos
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function offNewMessage(cb: (msg: any) => void) {
  getSocket().off("newMessage", cb); // off para dejar de escuchar
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function NewMessage(msg: any) {
  getSocket().emit("newMessage", msg);
}

// Handle read messages
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function onMessageRead(cb: (data: any) => void) {
  getSocket("/chat").on("read_message", cb);
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function offMessageRead(cb: (data: any) => void) {
  getSocket("/chat").off("read_message", cb);
}
export function readMessage(chatId: string, messageId: string) {
  getSocket("/chat").emit("chat:read", { chatId, messageId });
}

// Handle send messages
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function onSendMessage(cb: (data: any) => void) {
  getSocket().on("send_message", cb);
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function offSendMessage(cb: (data: any) => void) {
  getSocket().off("send_message", cb);
}

export function sendMessage(chatId: string, message: string) {
  getSocket().emit("send_message", { chatId, message });
}
