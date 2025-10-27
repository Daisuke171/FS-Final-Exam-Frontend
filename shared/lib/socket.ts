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
            // Normalize message and avoid dumping entire error object (which can include stack)
            const message = err && typeof err === "object" ? (err as any).message ?? String(err) : String(err);

            // If server replies "Invalid namespace", that means the backend doesn't expose this namespace.
            // Clean up this socket instance to avoid repeated noisy errors and let future calls fall back.
            if (message && message.includes("Invalid namespace")) {
                console.warn(`⚠️ WS server does not expose namespace '${namespace}'. Cleaning up client socket to avoid repeated errors.`);
                try {
                    socketInstances[namespace]?.offAny();
                    socketInstances[namespace]?.disconnect();
                } catch (e) {
                    // ignore cleanup errors
                }
                // Remove the instance so subsequent calls to getSocket will create a fresh connection (or a different namespace)
                // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                delete socketInstances[namespace];
                return;
            }

            // Generic connect error: log succinct info (message + optional data) to reduce noise in console
            const data = err && typeof err === "object" ? (err as any).data ?? null : null;
            console.error(`❌ WS connect_error [${namespace}]:`, message, data);
        });
    }
    return socketInstances[namespace]!;
}