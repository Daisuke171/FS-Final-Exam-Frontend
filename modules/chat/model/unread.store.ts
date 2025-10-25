import { create } from "zustand";
import { persist } from "zustand/middleware";

type UnreadState = {
  unread: Record<string, number>; // chatId -> count
  increment: (chatId: string) => void;
  clear: (chatId: string) => void;
  getCount: (chatId: string) => number;
  setCount: (chatId: string, count: number) => void;
  clearAll: () => void;
};

export const useUnreadStore = create<UnreadState>()(
  persist(
    (set, get) => ({
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
      setCount: (chatId, count) =>
        set((s) => ({
          unread: { ...s.unread, [chatId]: count },
        })),
      clearAll: () => set({ unread: {} }),
      getCount: (chatId) => get().unread[chatId] ?? 0,
    }),
    {
      name: "chat-unread-storage", // unique name for localStorage
      partialize: (state) => ({ unread: state.unread }), // only persist the unread object
    }
  )
);
