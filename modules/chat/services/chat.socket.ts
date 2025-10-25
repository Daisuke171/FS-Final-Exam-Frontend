import { getSocket } from "@shared/lib/socket";


export function joinChat(chatId: string) {
  getSocket().emit("join_chat", chatId); // emit para enviar evento
}
// New Menssge Handlers
export function onNewMessage(cb: (msg: any) => void) {
  getSocket().on("newMessage", cb); // on para escuchar eventos
}

export function offNewMessage(cb: (msg: any) => void) {
  getSocket().off("newMessage", cb); // off para dejar de escuchar
}

export function NewMessage(msg: any) {
  getSocket().emit("newMessage", msg);
}

// Handle read messages
export function onMessageRead(cb: (data: any) => void) {
  getSocket().on("read_message", cb);
}
export function offMessageRead(cb: (data: any) => void) {
    getSocket().off("read_message", cb);
}
export function readMessage(chatId: string, messageId: string) {
  getSocket().emit("read_message", { chatId, messageId });
}

// Handle send messages
export function onSendMessage(cb: (data: any) => void) {
  getSocket().on("send_message", cb);
}
export function offSendMessage(cb: (data: any) => void) {
  getSocket().off("send_message", cb);
}

export function sendMessage(chatId: string, message: string) {
  getSocket().emit("send_message", { chatId, message });
}
