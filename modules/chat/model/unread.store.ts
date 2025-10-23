import { create } from "zustand";

type UnreadState = {
  unread: Record<string, number>; // chatId -> count
  increment: (chatId: string) => void;
  clear: (chatId: string) => void;
  getCount: (chatId: string) => number;
};

export const useUnreadStore = create<UnreadState>((set, get) => ({
  unread: {},
  increment: (chatId) =>
    set((s) => ({
      unread: { ...s.unread, [chatId]: (s.unread[chatId] ?? 0) + 1 },
    })),
  clear: (chatId) =>
    set((s) => {
      const copy = { ...s.unread };
      delete copy[chatId];
      return { unread: copy };
    }),
  getCount: (chatId) => get().unread[chatId] ?? 0,
}));
