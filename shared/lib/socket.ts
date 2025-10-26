import { io, Socket } from "socket.io-client";

type Namespace = "/" | "/chat" | "/friends" | "/presence" | "/calls" | "/rps";


const socketInstances: Partial<Record<Namespace, Socket>> = {};

export function getSocket(namespace: Namespace = "/") {
    if (typeof window === "undefined") return null; // SSR guard

    if (!socketInstances[namespace]) {
        const host = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost";
        const port = process.env.NEXT_PUBLIC_API_PORT ?? "3011";
        const url = `${host}:${port}${namespace}`;

        socketInstances[namespace] = io(url, {
            transports: ["websocket", "polling"],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
        });

        socketInstances[namespace].on("connect", () => {
            console.log(`✅ WS conectado [${namespace}]:`, socketInstances[namespace]?.id);
        });

        socketInstances[namespace].on("disconnect", (reason) => {
            console.warn(`⚠️ WS disconnect [${namespace}]:`, reason);
        });

        socketInstances[namespace].on("connect_error", (err) => {
            console.error(`❌ WS connect_error [${namespace}]:`, err);
        });
    }
    return socketInstances[namespace]!;
}