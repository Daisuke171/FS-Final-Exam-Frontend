"use client";
import { create } from "zustand";

type FriendLite = {
    id: string;
    nickname: string;
    avatar?: string
};

type Incoming = {
    callId: string;
    from: string;
    sdpOffer?: RTCSessionDescriptionInit
};

type CallState = {
    active: boolean;
    callId: string | null;
    friend: FriendLite | null;
    uiState: "IDLE" | "RINGING" | "IN_CALL" | "ENDED" | "REJECTED";
    incoming: Incoming | null;
    // funciones provenientes del hook
    startCall?: (calleeId: string) => Promise<void | string>;
    acceptCall?: () => Promise<void>;
    rejectCall?: () => Promise<void>;
    endCall?: () => Promise<void>;
    toggleMute?: () => void;
    toggleCamera?: () => void;
    shareScreen?: () => Promise<MediaStream | void>;
    // setters utiles
    setFromHook: (p: Partial<CallState>) => void;
    setUi: (ui: CallState["uiState"]) => void;
    show: (callId: string, friend: FriendLite) => void;
    hide: () => void;
    setIncoming: (inc: Incoming | null) => void;
};

export const useCallStore = create<CallState>((set) => ({
    active: false,
    callId: null,
    friend: null,
    uiState: "IDLE",
    incoming: null,
    setFromHook: (p) => set(p),
    show: (callId, friend) => set({ active: true, callId, friend }),
    hide: () => set({ active: false, callId: null, friend: null, uiState: "IDLE" }),
    setUi: (ui) => set({ uiState: ui }),
    setIncoming: (inc) => set({ incoming: inc, uiState: inc ? "RINGING" : "IDLE" }),
}));
