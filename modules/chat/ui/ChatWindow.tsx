"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Avatar from "@shared/ui/Avatar";
import IconBtn from "@shared/ui/IconBtn";
import MessageInput from "./MessageInput";
import { cn } from "@shared/lib/utils";
import { useGetMessages, useSendMessage } from "../hooks/useMessages";
import { readMessage } from "../services/chat.socket";
import { Icon } from "@iconify/react";
import type { Msg, ChatWindowProps } from "../types/chatUI.types";
import { InputMessage } from "../types/message.types";
import { getSocket } from "@shared/lib/socket";
import { useUnreadStore } from "../model/unread.store";

export default function ChatWindow({
  friend,
  visible,
  onClose,
  className = "",
  currentUserId,
}: ChatWindowProps) {
  const chatId = friend?.chatId ?? "";

  const { list, loading, refetch } = useGetMessages(chatId);

  const { send } = useSendMessage(currentUserId);
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  // Get unread store methods
  const clearUnread = useUnreadStore((s) => s.clear);
  const incrementUnread = useUnreadStore((s) => s.increment);

  const messages: Msg[] = useMemo(
    () =>
      list
        .slice()
        .sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        )
        .map((m) => ({
          id: m.id,
          from:
            (currentUserId && m.senderId === currentUserId) ||
            (!currentUserId && m.senderId !== (friend?.id ?? "")) // fallback: si no hay currentUserId, asumimos que el que no es el friend soy "yo"
              ? "me"
              : "friend",
          text: m.message,
          at: new Date(m.timestamp).getTime(),
          read: m.read,
        })),
    [list, currentUserId, friend?.id]
  );

  // marcar como leídos al montar / cuando llega algo nuevo
  useEffect(() => {
    if (!friend?.chatId) return;
    // marca como leído todos los mensajes del otro
    const messagesNews = messages.filter((m) => m.from === "friend" && !m.read);

    if (messagesNews.length > 0) {
      messagesNews.map((m) => readMessage(friend.chatId, m.id));
    }
  }, [friend?.chatId, messages]);

  // Agrupar por “bloques” diarios dia : hoy - ayer - fechas anteriores
  const groups = useMemo(() => {
    const out: Array<{ timeLabel: string; msgs: Msg[] }> = [];
    const map = new Map<string, Msg[]>();

    for (const m of messages) {
      const d = new Date(m.at);
      const dateKey = d.toDateString();
      if (!map.has(dateKey)) map.set(dateKey, []);
      map.get(dateKey)!.push(m);
    }

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const labelFor = (d: Date) => {
      const diffDays = Math.floor(
        (today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diffDays === 0) return "Hoy";
      if (diffDays === 1) return "Ayer";
      return d.toLocaleDateString("es-AR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    };

    // Ordenar las fechas cronológicamente
    const sortedDates = [...map.keys()]
      .map((k) => new Date(k))
      .sort((a, b) => a.getTime() - b.getTime());

    for (const date of sortedDates) {
      const msgs = map.get(date.toDateString())!;
      out.push({
        timeLabel: labelFor(date),
        msgs: msgs.sort((a, b) => a.at - b.at),
      });
    }

    return out;
  }, [messages]);

  // Auto-scroll al final
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, visible]);

  // WebSocket real-time integration
  useEffect(() => {
    if (!chatId || !visible) return;

    const socket = getSocket("/chat");
    if (!socket) return;

   
    socket.emit("chat:join", { chatId });

   
    if (currentUserId) {
      socket.emit("chat:set_user", { id: currentUserId });
    }

    
    clearUnread(chatId);


    const handleNewMessage = (data: any) => {
       refetch?.();
            
      if (data.senderId !== currentUserId && !visible) {
        incrementUnread(chatId);
      }
    };

    // Listen for message read updates
    const handleMessageRead = (data: any) => {
      incrementUnread(chatId);
      refetch?.();
    };

    socket.on("chat:new", handleNewMessage);
    socket.on("chat:read", handleMessageRead);

    // Cleanup on unmount or when chatId changes
    return () => {
      console.log("🔌 Leaving chat room:", chatId);
      socket.emit("chat:leave", { chatId });
      socket.off("chat:new", handleNewMessage);
      socket.off("chat:read", handleMessageRead);
    };
  }, [chatId, visible, currentUserId, clearUnread, incrementUnread, refetch]);

  
  if (!visible || !friend) return null;

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const msg = new InputMessage(friend.chatId, text, currentUserId);
    void send(msg);
  };

  return (
    <section
      className={cn(
        "flex flex-col rounded-2xl border border-cyan-300/30",
        "bg-gradient-to-b from-white/5 to-white/0 shadow-[0_0_20px_rgba(76,201,240,.15)]",
        "h-[70dvh] md:h-[65dvh] lg:h-[60dvh] w-full",
        className
      )}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between px-3 py-2 bg-cyan-400/15 border-b border-cyan-300/30 shrink-0">
        <div className="flex items-center gap-3">
          <Avatar
            src={friend.skin ?? "/avatars/derpy.svg"}
            alt={friend.nickname}
            size={16}
          />
          <div className="font-semibold">{friend.nickname}</div>
        </div>
        <div className="flex items-center gap-5">
          <IconBtn
            icon="mdi:phone"
            sizeIcon={16}
            className="p-2 hidden"
          />
          <IconBtn
            icon="mdi:close"
            onClick={onClose}
            className="p-2 rounded-full cursor-pointer"
            sizeIcon={20}
          />
        </div>
      </div>

      {/* MENSAJES */}
      <div
        className={cn(
          "flex-1 overflow-y-auto p-4 chat-scroll chat-inner-shadow bg-[var(--bg-container,transparent)]",
          "max-h-[calc(70dvh-100px)] md:max-h-[calc(65dvh-100px)] lg:max-h-[calc(60dvh-100px)]"
        )}
      >
        {loading && (
          <div className="text-center text-sm opacity-70">Cargando…</div>
        )}

        {groups.map((g, gi) => (
          <div key={gi}>
            {g.timeLabel && (
              <div className="text-xs bg-gray-200 px-4 py-1 rounded-full text-gray-500 w-fit mx-auto">
                {g.timeLabel}
              </div>
            )}
            {g.msgs.map((m) => {
              const isMe = m.from === "me";
              return (
                <div
                  key={m.id}
                  className={cn(
                    "box-border px-4 py-2 m-4 w-fit max-w-[66%] min-h-9 rounded-2xl shadow-lg/5",
                    isMe
                      ? "ml-auto mr-4 text-white rounded-br-none bg-[var(--violet,#7c3aed)]/50"
                      : "ml-4 mr-auto bg-cyan-500/50 rounded-bl-none text-slate-100"
                  )}
                >
                  <div className="whitespace-pre-wrap break-words">
                    {m.text}
                  </div>
                  <div className="flex items-center justify-end gap-1 mt-1 text-[10px]">
                    <span
                      className={cn(isMe ? "text-white/80" : "text-slate-300")}
                    >
                      {new Date(m.at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>

                    {/* solo mostrar tilde si es un mensaje mío */}
                    {isMe && (
                      <Icon
                        icon="mdi:check-all"
                        width={14}
                        height={14}
                        className={cn(
                          "ml-1 message-status",
                          !m.read ? "text-gray-400" : "text-cyan-300"
                        )}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {isTyping && (
          <div className="ml-4 mr-auto w-fit max-w-[66%]">
            <div className="px-4 py-2 m-4 rounded-2xl rounded-bl-none bg-cyan-500/50 text-slate-700 w-fit">
              <span className="inline-flex gap-1 align-middle">
                <i className="typing-1 inline-block w-2 h-2 rounded-full bg-gray-400" />
                <i className="typing-2 inline-block w-2 h-2 rounded-full bg-gray-400" />
                <i className="typing-3 inline-block w-2 h-2 rounded-full bg-gray-400" />
              </span>
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* INPUT */}
      <div className="p-3 shrink-0 bg-gradient-to-t from-black/10 to-transparent">
        <MessageInput onSend={sendMessage} />
      </div>
    </section>
  );
}
