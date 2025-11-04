"use client";
import { create } from "zustand";

type FriendLite = { id: string; nickname: string; skin?: string | null };

type Incoming = { callId: string; from: string; sdpOffer: RTCSessionDescriptionInit } | null;

type ActionsFromHook = {
    startCall?: (calleeId: string) => Promise<string | undefined>;
    acceptCall?: (toUserId: string) => Promise<void>;
    rejectCall?: (toUserId: string) => void;
    endCall?: (peerUserId: string) => void;
    toggleMute?: () => void;
    toggleCamera?: () => void;
    shareScreen?: () => Promise<MediaStream>;
};

type State = {
    ui: "IDLE" | "RINGING" | "IN_CALL" | "REJECTED" | "ENDED";
    incoming: Incoming;
    trayVisible: boolean;
    trayCallId: string | null;
    trayPeer: FriendLite | null;
    fromHook: ActionsFromHook;
};

type Mut = {
    setUi: (u: State["ui"]) => void;
    setIncoming: (i: Incoming) => void;
    setFromHook: (a: ActionsFromHook) => void;
    show: (callId: string, peer: FriendLite) => void;
    hide: () => void;
};

export const useCallStore = create<State & Mut>((set) => ({
    ui: "IDLE",
    incoming: null,
    trayVisible: false,
    trayCallId: null,
    trayPeer: null,
    fromHook: {},

    setUi: (u) => set({ ui: u }),
    setIncoming: (i) => set({ incoming: i }),
    setFromHook: (a) => set((s) => ({ fromHook: { ...s.fromHook, ...a } })),
    show: (callId, peer) => set({ trayVisible: true, trayCallId: callId, trayPeer: peer }),
    hide: () => set({ trayVisible: false, trayCallId: null, trayPeer: null }),
}));
