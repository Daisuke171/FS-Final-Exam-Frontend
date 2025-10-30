"use client";

import CustomTextInput from "../inputs/text/CustomTextInput";
import { useEffect, useState, useRef, useCallback } from "react";
import { getCodingWarSocket } from "@/app/socket";
import { useSession } from "next-auth/react";
import { motion } from "motion/react";


interface LogsProps {
  id: string;
  playerId: string;
  type: "join" | "leave";
  timestamp: number;
  message?: string;
}

type ChatItem = LogsProps | ChatMessage;

interface ChatMessage {
  playerId: string;
  message: string;
  timestamp: string;
  type: "message";
}

export default function ChatComponent({
  roomId,
  players,
  playerId,
}: {
  roomId: string | string[];
  players: { id: string }[];
  playerId: string | undefined;
}) {
  const { data: session, status } = useSession();
  const socketRef = useRef<ReturnType<typeof getCodingWarSocket> | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [logs, setLogs] = useState<LogsProps[]>([]);
  // Track previous player IDs in a ref to avoid triggering re-renders/effect loops
  const previousPlayerIdsRef = useRef<Set<string>>(new Set());
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      // Use requestAnimationFrame to ensure DOM has updated
      requestAnimationFrame(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      });
    }
  };

  const allItems: ChatItem[] = [...logs, ...messages].sort((a, b) => {
    const timeA =
      typeof a.timestamp === "string"
        ? new Date(a.timestamp).getTime()
        : a.timestamp;
    const timeB =
      typeof b.timestamp === "string"
        ? new Date(b.timestamp).getTime()
        : b.timestamp;
    return timeA - timeB;
  });

  // Create the socket only once we have a token
  useEffect(() => {
    if (status !== "authenticated" || !session?.accessToken) return;
    const socket = getCodingWarSocket(session.accessToken);
    if (!socket) {
      console.warn("⚠️ ChatComponent: No se pudo obtener el socket");
      return;
    }
    socketRef.current = socket;
  }, [status, session?.accessToken]);
  const formatTime = (timestamp: string | number) => {
    const date =
      typeof timestamp === "string" ? new Date(timestamp) : new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    // Only scroll if the user is already at or near the bottom
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 50; // 50px threshold
      
      if (isNearBottom) {
        scrollToBottom();
      }
    }
  }, [messages, logs]);

  useEffect(() => {
    if (status !== "authenticated" || !session?.accessToken) return;
    const s = getCodingWarSocket(session.accessToken);
    if (!s) return;
    socketRef.current = s;
    const handleRoomChatMessages = (data: ChatMessage) => {
      console.log("Received messages:", data);
      setMessages((prev) => [...prev, data]);
    };
    s.on("roomChatMessages", handleRoomChatMessages);
    return () => {
      s.off("roomChatMessages", handleRoomChatMessages);
    };
  }, [status, session?.accessToken]);

  useEffect(() => {
    if (!isInitialized && playerId) {
      setLogs([
        {
          id: `${playerId}-join-${Date.now()}`,
          playerId: playerId,
          type: "join",
          timestamp: Date.now(),
        },
      ]);
      previousPlayerIdsRef.current = new Set(players.map((p) => p.id));
      setIsInitialized(true);
    }
  }, [playerId, isInitialized, players]);

  useEffect(() => {
    if (!isInitialized) return;

    const currentPlayerIds = new Set(players.map((p) => p.id));
    const previousPlayerIds = previousPlayerIdsRef.current;

    players.forEach((player) => {
      if (!previousPlayerIds.has(player.id) && player.id !== playerId) {
        setLogs((prev) => [
          ...prev,
          {
            id: `${player.id}-join-${Date.now()}`,
            playerId: player.id,
            type: "join",
            timestamp: Date.now(),
          },
        ]);
      }
    });

    previousPlayerIds.forEach((oldPlayerId) => {
      if (!currentPlayerIds.has(oldPlayerId)) {
        setLogs((prev) => [
          ...prev,
          {
            id: `${oldPlayerId}-leave-${Date.now()}`,
            playerId: oldPlayerId,
            type: "leave",
            timestamp: Date.now(),
          },
        ]);
      }
    });

    // Update the ref with the latest snapshot without causing an extra render
    previousPlayerIdsRef.current = currentPlayerIds;
  }, [players, isInitialized, playerId]);

  const handleSendMessage = useCallback(() => {
    const input = document.querySelector(
      'input[name="message"]'
    ) as HTMLInputElement;
    const message = input.value.trim();
    if (message.length === 0) return;
    
    const socket = socketRef.current;
    if (!socket || typeof socket.emit !== 'function') {
      console.warn("⚠️ No hay socket disponible para enviar mensaje");
      return;
    }
    
    socket.emit("roomChat", { roomId, message });
    input.value = "";
  }, [roomId]);

  useEffect(() => {
    const input = document.querySelector(
      'input[name="message"]'
    ) as HTMLInputElement;

    if (input) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleSendMessage();
        }
      };

      input.addEventListener("keydown", handleKeyDown);

      return () => {
        input.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [roomId, handleSendMessage]);

  const renderItem = (item: ChatItem, index: number) => {
    if (item.type === "join" || item.type === "leave") {
      const log = item as LogsProps;
      const text =
        log.type === "join"
          ? log.playerId === playerId
            ? "Te has unido a la sala"
            : `${log.playerId} se ha unido a la sala`
          : log.playerId === playerId
          ? "Te has desconectado"
          : `${log.playerId} se ha desconectado`;

      return (
        <div
          key={log.id}
          className={`px-4 ${
            log.playerId === playerId
              ? "text-hover-purple"
              : log.type === "leave"
              ? "text-error"
              : "text-subtitle"
          }`}
        >
          <p className="text-sm italic">{text}</p>
        </div>
      );
    } else {
      const message = item as ChatMessage;
      return (
        <motion.div
          initial={{ opacity: 0, y: 10, scaleY: 0.4 }}
          animate={{ opacity: 1, y: 0, scaleY: 1 }}
          exit={{ opacity: 0, y: -10 }}
          key={`${message.timestamp}-${index}`}
          className={`py-1 rounded-lg flex ${
            message.playerId === playerId
              ? "text-font bg-light-purple rounded-br-none place-self-end"
              : "text-font bg-background rounded-bl-none place-self-start"
          }`}
        >
          <p className="text-base px-3 max-w-[33ch] break-words">
            {message.message}{" "}
          </p>
          <span className="text-xs pr-1 leading-none place-self-end">
            {formatTime(message.timestamp)}
          </span>
        </motion.div>
      );
    }
  };
  return (
    <div className="w-2/7 h-[25rem] flex flex-col border-2 border-light-gray rounded-xl overflow-hidden">
      <div className="bg-background rounded-t-xl shrink-0">
        <h2 className="text-2xl font-bold p-4 text-slate-200">Chat</h2>
      </div>
      <div
        ref={chatContainerRef}
        className="pb-2 bg-white/7 backdrop-blur-md relative flex-1 overflow-y-auto scrollbar-thin [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-slate-300
  [&::-webkit-scrollbar-thumb]:bg-slate-700"
      >
        <div className="mt-2">
          <div className="flex flex-col gap-2 px-2">
            {allItems.map((item, index) => renderItem(item, index))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
      <div className="pb-4 rounded-b-xl bg-white/7 backdrop-blur-md shrink-0">
        <div className="px-4">
          <CustomTextInput
            action={handleSendMessage}
            placeholder="Escribe tu mensaje"
            name="message"
            icon="material-symbols:send-rounded"
            size="sm"
          />
        </div>
      </div>
    </div>
  );
}
