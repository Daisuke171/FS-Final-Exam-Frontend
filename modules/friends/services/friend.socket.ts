import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getFriendsSocket() {
    if (typeof window === "undefined") return null; // SSR guard

    if (!socket) {
        const host = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost";
        const port = process.env.NEXT_PUBLIC_API_PORT ?? "3010";
        const url = `${host}:${port}`;

        socket = io(url, {
            transports: ["websocket", "polling"],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
        });

        socket.on("connect", () => {
            console.log("✅ Friends WS conectado:", socket?.id);
        });

        socket.on("disconnect", (reason) => {
            console.warn("⚠️ Friends WS disconnect:", reason);
        });

        socket.on("connect_error", (err) => {
            console.error("❌ Friends WS connect_error:", err);
        });
    }
    return socket;
}

export function authFriendsSocket(userId: string) {
    const s = getFriendsSocket();
    if (!s) return;
    const emit = () => {
        s.emit("auth", { userId });
        s.emit("presence:get", { userId });
    };
    if (s.connected) emit();
    else s.once("connect", emit); // once hace que se llame solo una vez
}

// listeners
export type PresenceUpdate = { userId: string; online: boolean };

export function onPresenceUpdate(cb: (p: PresenceUpdate) => void) {
    const s = getFriendsSocket();
    s?.on("presence:update", cb);
    return () => s?.off("presence:update", cb);
}

export function onPresenceSnapshot(cb: (onlineFriendIds: string[]) => void) {
    const s = getFriendsSocket();
    s?.on("presence:snapshot", cb);
    return () => s?.off("presence:snapshot", cb);
}

/** Suscribirse al evento 'friend:event' */
export function onFriendEvent(cb: (evt: FriendEvent) => void) {
    const s = getFriendsSocket();
    s?.on("friend:event", cb);
    return () => s?.off("friend:event", cb);
}

/** Tipos de eventos */
export type FriendEvent =
    | { type: "friend:request"; userId: string; friendId: string }
    | { type: "friend:accepted"; userId: string; friendId: string }
    | { type: "friend:declined"; userId: string; friendId: string }
    | { type: "friend:removed"; userId: string; friendId: string }
    | { type: string; userId: string; [k: string]: any };

export function disconnectFriendsSocket() {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}
