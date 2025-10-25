import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket() {
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
            console.log("✅ WS conectado:", socket?.id);
        });

        socket.on("disconnect", (reason) => {
            console.warn("⚠️ WS disconnect:", reason);
        });

        socket.on("connect_error", (err) => {
            console.error("❌ WS connect_error:", err);
        });
    }
    return socket;
}