import { create } from "zustand";

type PresenceState = {
  online: Set<string>;
  setOnline: (id: string) => void;
  setOffline: (id: string) => void;
  setBulk: (ids: string[]) => void;
  isOnline: (id?: string) => boolean;
};

export const usePresenceStore = create<PresenceState>((set, get) => ({
  online: new Set<string>(),
  setOnline: (id) => set((s) => ({ online: new Set([...s.online, id]) })),
  setOffline: (id) => set((s) => {
    const next = new Set(s.online);
    next.delete(id);
    return { online: next };
  }),
  setBulk: (ids) => set({ online: new Set(ids) }),
  isOnline: (id) => (!!id && get().online.has(id)),
}));
