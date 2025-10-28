
"use client";

import { create } from "zustand";
import type { Socket } from "socket.io-client";
import { getSocket } from "@shared/lib/socket";

/* ========================= * Modelos y Tipos de Dominio * ========================= */
export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  text?: string;
  createdAt?: string;
  read?: boolean;
}

export interface ChatReadPayload {
  chatId: string;
  messageIds?: string[];
  at?: string; // ISO string
}

export interface ChatSlice {
  visible: boolean;
  unread: number;
  lastMessage: ChatMessage | null;
  lastReadAt: string | null; // ISO
}

/* ========================= * Tipado de eventos Socket.IO * ========================= */
// Eventos que el servidor envía al cliente
export interface ChatServerToClientEvents {
  "chat:new": (data: ChatMessage) => void;
  "chat:read": (data: ChatReadPayload) => void;
}

// Eventos que el cliente envía al servidor
export interface ChatClientToServerEvents {
  "chat:join": (data: { chatId: string }) => void;
  "chat:leave": (data: { chatId: string }) => void;
  "chat:set_user": (data: { id: string }) => void;
}

// Socket tipado para el namespace "/chat"
type ChatSocket = Socket<ChatServerToClientEvents, ChatClientToServerEvents>;

/* ========================= * Estado y Acciones del Store * ========================= */
export interface ChatEventsState {
  chats: Record<string, ChatSlice>;
  socketReady: boolean;
  currentUserId?: string;
}

export interface ChatEventsActions {
  // sesión/usuario en el namespace
  ensureSocket: (userId?: string) => void;

  // visibilidad
  openChat: (chatId: string, userId?: string) => void;
  closeChat: (chatId: string) => void;

  // unread & lecturas
  clearUnread: (chatId: string) => void;
  incrementUnread: (chatId: string) => void;

  // unión a salas
  joinRoom: (chatId: string) => void;
  leaveRoom: (chatId: string) => void;

  // eventos entrantes del socket
  onNewMessage: (msg: ChatMessage) => void;
  onMessageRead: (payload: ChatReadPayload) => void;
}

type State = ChatEventsState & ChatEventsActions;

/* ========================= * Util: asegurar slice por chat * ========================= */
const ensureChat = (state: ChatEventsState, chatId: string): ChatSlice => {
  if (!state.chats[chatId]) {
    state.chats[chatId] = {
      visible: false,
      unread: 0,
      lastMessage: null,
      lastReadAt: null,
    };
  }
  return state.chats[chatId];
};

/* ========================= * Store * ========================= */
export const useChatEvents = create<State>((set, get) => ({
  chats: {},
  socketReady: false,
  currentUserId: undefined,

  ensureSocket: (userId) => {
    const socket = getSocket("/chat") as ChatSocket | undefined;
    if (!socket) return;

    // set user (si tu handshake JWT no lo hace)
    if (userId) socket.emit("chat:set_user", { id: userId });

    if (!get().socketReady) {
      // Escuchas globales (una sola vez)
      socket.on("chat:new", (data) => get().onNewMessage(data));
      socket.on("chat:read", (data) => get().onMessageRead(data));

      set({ socketReady: true, currentUserId: userId });
    }
  },

  openChat: (chatId, userId) => {
    const socket = (getSocket("/chat") as ChatSocket | undefined);
    if (!socket) return;

    // Asegura socket y set_user
    get().ensureSocket(userId);

    socket.emit("chat:join", { chatId });

    set((s) => {
      const c = ensureChat(s, chatId);
      c.visible = true;
      c.unread = 0; // al abrir, limpiamos
      return { chats: { ...s.chats } };
    });
  },

  closeChat: (chatId) => {
    get().leaveRoom(chatId);
    set((s) => {
      const c = ensureChat(s, chatId);
      c.visible = false;
      return { chats: { ...s.chats } };
    });
  },

  clearUnread: (chatId) =>
    set((s) => {
      const c = ensureChat(s, chatId);
      c.unread = 0;
      return { chats: { ...s.chats } };
    }),

  incrementUnread: (chatId) =>
    set((s) => {
      const c = ensureChat(s, chatId);
      c.unread += 1;
      return { chats: { ...s.chats } };
    }),

  joinRoom: (chatId) => {
    const socket = (getSocket("/chat") as ChatSocket | undefined);
    socket?.emit("chat:join", { chatId });
  },

  leaveRoom: (chatId) => {
    const socket = (getSocket("/chat") as ChatSocket | undefined);
    socket?.emit("chat:leave", { chatId });
  },

  onNewMessage: (msg) =>
    set((s) => {
      const c = ensureChat(s, msg.chatId);
      c.lastMessage = msg;

      // si el chat NO está visible y el mensaje no es mío => unread++
      if (!c.visible && msg.senderId !== s.currentUserId) {
        c.unread += 1;
      }
      return { chats: { ...s.chats } };
    }),

  onMessageRead: ({ chatId, at }) =>
    set((s) => {
      const c = ensureChat(s, chatId);
      c.lastReadAt = at ?? new Date().toISOString();
      return { chats: { ...s.chats } };
    }),
}));
