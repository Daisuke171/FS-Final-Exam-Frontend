import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
let codingWarSocket: Socket | null = null;
let turingSocket: Socket | null = null;
let lastCodingWarToken: string | undefined;
let lastTuringToken: string | undefined;
let lastRpsToken: string | undefined;

interface SocketAuth {
  token: string;
}

// Resolve a single base URL for all sockets
const getBaseUrl = () => {
  // Prefer an explicit URL (e.g., http://localhost:3059)
  const explicitUrl = process.env.NEXT_PUBLIC_API_URL;
  if (explicitUrl) return explicitUrl.replace(/\/$/, "");

  // Else build from host + port
  // Backend default (see backend src/main.ts) is 3011; prefer env override
  const port = process.env.NEXT_PUBLIC_API_PORT || "3010";
  const host =
    typeof window !== "undefined" ? window.location.hostname : "localhost";
  return `http://${host}:${port}`;
};

export const getSocket = (token?: string) => {
  if (token) {
    lastRpsToken = token;
  }

  if (socket && socket.disconnected) {
    socket.offAny();
    socket = null;
  }

  if (socket && lastRpsToken) {
    if (typeof socket.auth === "object" && socket.auth !== null) {
      const currentToken = (socket.auth as SocketAuth).token;

      if (currentToken !== lastRpsToken) {
        console.log("🔄 Actualizando token en socket RPS existente...");
        socket.auth = { token: lastRpsToken };
        if (socket.connected) {
          socket.disconnect();
          socket.connect();
        }
      }
    }
  }

  if (!socket) {
    if (!lastRpsToken) {
      console.warn("⚠️ getSocket (RPS): no se puede crear socket sin token.");
      return null;
    }

    const baseUrl = getBaseUrl();
    console.log("🔌 Intentando conectar a:", `${baseUrl}/rps`);

    socket = io(`${baseUrl}/rps`, {
      auth: {
        token: lastRpsToken,
      },
    });

    socket.on("heartbeat-ping", () => {
      console.log("💓 Heartbeat ping recibido, respondiendo...");
      socket?.emit("heartbeat-response");
    });
    socket.on("connect", () => {
      console.log("✅ Socket conectado:", socket?.id);
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

export const isSocketConnected = () => socket?.connected ?? false;

export const getCodingWarSocket = (token?: string) => {
  // update stored token if provided, so later reuse remains authenticated
  if (token) {
    console.log(
      "🔑 Token recibido para Coding War socket (primeros 20 chars):",
      token.substring(0, 20) + "..."
    );
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
      if (codingWarSocket?.connected) {
        // use optional chaining to avoid race conditions where the socket was nulled concurrently
        codingWarSocket.disconnect?.();
        codingWarSocket.connect?.();
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
    console.log(
      "🔌 Creando nuevo socket Coding War con token a:",
      `${baseUrl}/coding-war`
    );
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
        details &&
        typeof details === "object" &&
        !details.name &&
        !details.message &&
        !details.description &&
        !details.data
      ) {
        // Ignore extremely noisy empty socket error events
        console.warn(
          "⚠️ Evento 'error' de Coding War sin detalles recibido y omitido."
        );
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

export const getTuringSocket = (token?: string) => {
  // update stored token if provided, so later reuse remains authenticated
  if (token) {
    console.log(
      "🔑 Token recibido para Turing socket (primeros 20 chars):",
      token.substring(0, 20) + "..."
    );
    lastTuringToken = token;
  }

  // Recreate socket if it's present but disconnected, mirroring getSocket behavior
  if (turingSocket && turingSocket.disconnected) {
    console.log("♻️ Socket desconectado detectado, limpiando...");
    turingSocket.offAny();
    turingSocket = null;
  }

  // If a socket already exists but we now have a newer token, refresh auth
  if (turingSocket && lastTuringToken) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const currentToken = (turingSocket as any).auth?.token as
      | string
      | undefined;
    if (currentToken !== lastTuringToken) {
      console.log("🔄 Actualizando token en socket existente...");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (turingSocket as any).auth = { token: lastTuringToken };
      // If we're connected with wrong/empty auth, reconnect so server sees the new token
      if (turingSocket?.connected) {
        turingSocket.disconnect?.();
        turingSocket.connect?.();
      }
    } else {
      console.log("✓ Socket existente con token correcto, reutilizando...");
    }
  }

  if (!turingSocket) {
    // CRITICAL: Do not create socket without a token. Server will reject it immediately.
    if (!lastTuringToken) {
      console.warn(
        "⚠️ getTuringSocket: no se puede crear socket sin token. Esperando autenticación..."
      );
      // Return a dummy socket-like object that won't connect (or return null and guard all usages)
      // For safety, we return null and let components handle it
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return null as any;
    }
    const baseUrl = getBaseUrl();
    console.log(
      "🔌 Creando nuevo socket Turing Detective con token a:",
      `${baseUrl}/turing-detective`
    );
    turingSocket = io(`${baseUrl}/turing-detective`, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      withCredentials: true,
      auth: { token: lastTuringToken },
    });

    turingSocket.on("connect", () => {
      console.log(
        "✅ Conectado al servidor Turing Detective| Socket ID:",
        turingSocket?.id
      );
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    turingSocket.on("authenticated", (data: any) => {
      console.log("✅ Autenticado en Turing Detective:", data);
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    turingSocket.on("connect_error", (error: any) => {
      const details = {
        name: error?.name,
        message: error?.message,
        description: error?.description,
        data: error?.data,
      };
      console.error("❌ Error de conexión (Turing Detective):", details);
    });

    turingSocket.on("disconnect", (reason: string) => {
      console.warn("⚠️ Desconectado (Turing Detective):", reason);
      turingSocket = null;
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    turingSocket.on("error", (error: any) => {
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
        details &&
        typeof details === "object" &&
        !details.name &&
        !details.message &&
        !details.description &&
        !details.data
      ) {
        // Ignore extremely noisy empty socket error events
        console.warn(
          "⚠️ Evento 'error' de Turing Detective sin detalles recibido y omitido."
        );
        return;
      }
      console.error("❌ Error de Socket (Turing Detective):", details);
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    turingSocket.on("reconnect_error", (err: any) => {
      console.error("❌ Error al reconectar (Turing Detective):", {
        message: err?.message,
        data: err?.data,
      });
    });
    turingSocket.on("reconnect_failed", () => {
      console.error("❌ Falló la reconexión (Turing Detective)");
    });
  }
  return turingSocket;
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
  if (!s) return;
  if (s.connected) {
    s.emit(event, data);
  } else {
    s.once("connect", () => s.emit(event, data));
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
  if (turingSocket) {
    turingSocket.offAny();
    turingSocket.disconnect();
    turingSocket = null;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const onNewFriend = (callback: (data: any) => void) => {
  const s = getSocket();
  s?.on("newFriend", callback);
  return () => s?.off("newFriend", callback);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const onNewMessage = (callback: (data: any) => void) => {
  const s = getSocket();
  s?.on("newMessage", callback);
  return () => s?.off("newMessage", callback);
};
