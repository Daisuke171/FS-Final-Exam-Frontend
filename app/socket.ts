import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
let codingWarSocket: Socket | null = null;
let lastCodingWarToken: string | undefined;

// Resolve a single base URL for all sockets
const getBaseUrl = () => {
  // Prefer an explicit URL (e.g., http://localhost:3059)
  const explicitUrl = process.env.NEXT_PUBLIC_API_URL;
  if (explicitUrl) return explicitUrl.replace(/\/$/, "");

  // Else build from host + port
  // Backend default (see backend src/main.ts) is 3011; prefer env override
  const port = process.env.NEXT_PUBLIC_API_PORT || "3011";
  const host =
    typeof window !== "undefined" ? window.location.hostname : "localhost";
  return `http://${host}:${port}`;
};

export const getSocket = (token?: string) => {
  if (socket && socket.disconnected) {
    socket.offAny();
    socket = null;
  }
  if (!socket) {
    const baseUrl = getBaseUrl();

    console.log("🔌 Intentando conectar a:", `${baseUrl}/rps`);

    socket = io(`${baseUrl}/rps`, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      auth: {
        token,
      },
    });

    socket.on("connect", () => {
      console.log("✅ Conectado al servidor RPS | Socket ID:", socket?.id);
    });

    socket.on("connect_error", (error: Error) => {
      console.error("❌ Error de conexión:", error);
    });

    socket.on("disconnect", (reason: string) => {
      console.warn("⚠️ Desconectado:", reason);
    });

    socket.on("error", (error: unknown) => {
      console.error("❌ Error de Socket:", error);
      console.error(
        "❌ Detalles del Error (JSON):",
        JSON.stringify(error, null, 2)
      );
    });
  }

  return socket;
};

export const getCodingWarSocket = (token?: string) => {
  // update stored token if provided, so later reuse remains authenticated
  if (token) {
    console.log("🔑 Token recibido para Coding War socket (primeros 20 chars):", token.substring(0, 20) + "...");
    lastCodingWarToken = token;
  }
  
  // Recreate socket if it's present but disconnected, mirroring getSocket behavior
  if (codingWarSocket && codingWarSocket.disconnected) {
    console.log("♻️ Socket desconectado detectado, limpiando...");
    codingWarSocket.offAny();
    codingWarSocket = null;
  }

  // If a socket already exists but we now have a newer token, refresh auth
  if (codingWarSocket && lastCodingWarToken) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const currentToken = (codingWarSocket as any).auth?.token as
      | string
      | undefined;
    if (currentToken !== lastCodingWarToken) {
      console.log("🔄 Actualizando token en socket existente...");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (codingWarSocket as any).auth = { token: lastCodingWarToken };
      // If we're connected with wrong/empty auth, reconnect so server sees the new token
      if (codingWarSocket.connected) {
        codingWarSocket.disconnect();
        codingWarSocket.connect();
      }
    } else {
      console.log("✓ Socket existente con token correcto, reutilizando...");
    }
  }

  if (!codingWarSocket) {
    // CRITICAL: Do not create socket without a token. Server will reject it immediately.
    if (!lastCodingWarToken) {
      console.warn(
        "⚠️ getCodingWarSocket: no se puede crear socket sin token. Esperando autenticación..."
      );
      // Return a dummy socket-like object that won't connect (or return null and guard all usages)
      // For safety, we return null and let components handle it
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return null as any;
    }
    const baseUrl = getBaseUrl();
    console.log("🔌 Creando nuevo socket Coding War con token a:", `${baseUrl}/coding-war`);
    codingWarSocket = io(`${baseUrl}/coding-war`, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      withCredentials: true,
      auth: { token: lastCodingWarToken },
    });

    codingWarSocket.on("connect", () => {
      console.log(
        "✅ Conectado al servidor Coding War | Socket ID:",
        codingWarSocket?.id
      );
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    codingWarSocket.on("authenticated", (data: any) => {
      console.log("✅ Autenticado en Coding War:", data);
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    codingWarSocket.on("connect_error", (error: any) => {
      const details = {
        name: error?.name,
        message: error?.message,
        description: error?.description,
        data: error?.data,
      };
      console.error("❌ Error de conexión (Coding War):", details);
    });

    codingWarSocket.on("disconnect", (reason: string) => {
      console.warn("⚠️ Desconectado (Coding War):", reason);
      codingWarSocket = null;
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    codingWarSocket.on("error", (error: any) => {
      // Improve visibility when the error object is not serializable (JSON shows {})
      const details =
        error && typeof error === "object"
          ? {
              name: error.name,
              message: error.message,
              description: error.description,
              data: error.data,
            }
          : error;
      if (
        details && typeof details === "object" &&
        !details.name && !details.message && !details.description && !details.data
      ) {
        // Ignore extremely noisy empty socket error events
        console.warn("⚠️ Evento 'error' de Coding War sin detalles recibido y omitido.");
        return;
      }
      console.error("❌ Error de Socket (Coding War):", details);
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    codingWarSocket.on("reconnect_error", (err: any) => {
      console.error("❌ Error al reconectar (Coding War):", {
        message: err?.message,
        data: err?.data,
      });
    });
    codingWarSocket.on("reconnect_failed", () => {
      console.error("❌ Falló la reconexión (Coding War)");
    });
  }
  return codingWarSocket;
};

export const onGameState = <T = unknown>(callback: (data: T) => void) => {
  const s = getSocket();
  s?.on("gameState", callback);

  return () => {
    s?.off("gameState", callback);
  };
};

export const emitEvent = (event: string, data: unknown) => {
  const s = getSocket();
  if (s?.connected) {
    s.emit(event, data);
  } else {
    console.warn(`⚠️ Socket no conectado. No se puede emitir: ${event}`);
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.offAny();
    socket.disconnect();
    socket = null;
  }
  if (codingWarSocket) {
    codingWarSocket.offAny();
    codingWarSocket.disconnect();
    codingWarSocket = null;
  }
};

export const isSocketConnected = () => {
  return socket?.connected ?? false;
};
