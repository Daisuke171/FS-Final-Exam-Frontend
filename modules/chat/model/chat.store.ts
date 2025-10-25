import { create } from "zustand";
import { getSocket } from "@shared/lib/socket";

interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface ChatState {
  messages: ChatMessage[];
  init: (chatId: string, userId: string) => void;
  send: (chatId: string, text: string) => void;
  markRead: (chatId: string, messageId: string) => void;
  clear: () => void;
}

const chatSocket = getSocket("/chat");

export const useChatStore = create<ChatState>((set) => ({
  messages: [],

  init: (chatId, userId) => {
    chatSocket.emit("chat:set_user", { id: userId });
    chatSocket.emit("chat:join", { chatId });

    chatSocket.on("chat:history", (msgs) => set({ messages: msgs }));

    chatSocket.on("chat:new", (msg) =>
      set((s) => ({ messages: [...s.messages, msg] }))
    );

    chatSocket.on("chat:read", ({ messageId }) =>
      set((s) => ({
        messages: s.messages.map((m) =>
          m.id === messageId ? { ...m, read: true } : m
        ),
      }))
    );
  },

  send: (chatId, text) => {
    chatSocket.emit("chat:send", { chatId, text });
  },

  markRead: (chatId, messageId) => {
    chatSocket.emit("chat:read", { chatId, messageId });
  },

  clear: () => {
    chatSocket.removeAllListeners();
    set({ messages: [] });
  },
}));
