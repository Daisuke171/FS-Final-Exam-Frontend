"use client";

import CustomTextInput from "../inputs/text/CustomTextInput";
import { useEffect, useState, useRef, useCallback } from "react";
import { getSocket } from "@/app/socket";
import { motion } from "motion/react";
import { useSession } from "next-auth/react";
import { Icon } from "@iconify/react";

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
  playerNickname,
  handleClose,
}: {
  roomId: string | string[];
  players: { id: string }[];
  playerNickname: string | undefined;
  handleClose?: () => void;
}) {
  const { data: session } = useSession();
  const socket = getSocket(session?.accessToken);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [logs, setLogs] = useState<LogsProps[]>([]);
  const [previousPlayerIds, setPreviousPlayerIds] = useState<Set<string>>(
    new Set()
  );
  const [isInitialized, setIsInitialized] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevMessagesLengthRef = useRef(0);
  const prevLogsLengthRef = useRef(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  console.log(`📦 ChatComponent renderizado: ${players}`);
  console.log(`Nickname enviado por props: ${playerNickname}`);

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

  const formatTime = (timestamp: string | number) => {
    const date =
      typeof timestamp === "string" ? new Date(timestamp) : new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    const messagesIncreased = messages.length > prevMessagesLengthRef.current;
    const logsIncreased =
      logs.length > prevLogsLengthRef.current && logs.length > 1;

    if ((messagesIncreased || logsIncreased) && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }

    prevMessagesLengthRef.current = messages.length;
    prevLogsLengthRef.current = logs.length;
  }, [messages.length, logs.length]);

  useEffect(() => {
    console.log("🧠 playerNickname en el cliente:", playerNickname);
  }, [playerNickname]);
  useEffect(() => {
    const handleRoomChatMessages = (data: ChatMessage) => {
      console.log("Received messages:", data);
      setMessages((prev) => [...prev, data]);
    };

    socket.on("roomChatMessages", handleRoomChatMessages);

    return () => {
      socket.off("roomChatMessages", handleRoomChatMessages);
    };
  }, [socket]);

  useEffect(() => {
    if (!isInitialized && playerNickname) {
      setLogs([
        {
          id: `${playerNickname}-join-${Date.now()}`,
          playerId: playerNickname,
          type: "join",
          timestamp: Date.now(),
        },
      ]);
      setPreviousPlayerIds(new Set(players.map((p) => p.id)));
      console.log(`Jugadores previos: ${previousPlayerIds}`);
      setIsInitialized(true);
    }
  }, [playerNickname, isInitialized, players, previousPlayerIds]);

  useEffect(() => {
    if (!isInitialized) return;

    const currentPlayerIds = new Set(players.map((p) => p.id));

    setPreviousPlayerIds((prevIds) => {
      players.forEach((player) => {
        if (!prevIds.has(player.id) && player.id !== playerNickname) {
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
      prevIds.forEach((oldPlayerId) => {
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

      return currentPlayerIds;
    });
  }, [players, isInitialized, playerNickname]);

  const handleSendMessage = useCallback(() => {
    const input = document.querySelector(
      'input[name="message"]'
    ) as HTMLInputElement;
    const message = input.value.trim();
    if (message.length === 0) return;
    socket.emit("roomChat", { roomId, message });
    input.value = "";
  }, [roomId, socket]);

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
      console.log(`Player ID del LOG: ${log.playerId}`);
      const text =
        log.type === "join"
          ? log.playerId === playerNickname
            ? "Te has unido a la sala"
            : `${log.playerId} se ha unido a la sala`
          : log.playerId === playerNickname
          ? "Te has desconectado"
          : `${log.playerId} se ha desconectado`;

      return (
        <div
          key={log.id}
          className={`px-4 ${
            log.playerId === playerNickname
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
            message.playerId === playerNickname
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
    <>
      <motion.div
        initial={{ opacity: 0, x: 200 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 200 }}
        className="fixed top-1/2 z-80 left-1/2 -translate-x-1/2 -translate-y-1/2 md:static
     w-[90%] md:w-[40%] h-120 md:h-full flex flex-col border-2 border-light-gray rounded-xl
     md:-translate-x-0 md:-translate-y-0"
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-2xl text-font md:hidden"
        >
          <Icon icon="material-symbols:close-rounded" />
        </button>
        <div className="bg-background rounded-t-xl">
          <h2 className="text-2xl font-bold p-4  text-slate-200">Chat</h2>
        </div>
        <div
          ref={containerRef}
          className=" pb-2 bg-white/7 md:backdrop-blur-md  relative flex-1 overflow-y-auto scrollbar-thin [&::-webkit-scrollbar]:w-2
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
        <div className="pb-4 rounded-b-xl bg-white/7 backdrop-blur-md">
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
      </motion.div>
    </>
  );
}
