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
import { useUnreadStore } from "../model/unread.store";
import { motion } from "motion/react";

export default function ChatWindow({
  friend,
  visible,
  onClose,
  className = "",
  currentUserId,
}: ChatWindowProps) {

  const chatId = friend?.chatId ?? "";
  console.log(chatId);
  
  const { list } = useGetMessages(chatId, currentUserId); // ahora viene del socket
  
  const { send } = useSendMessage(currentUserId);

  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  // Estado de no leídos
  const clearUnread = useUnreadStore((s) => s.clear);
  const alreadyReadRef = useRef<Set<string>>(new Set());

  /* Transformar la lista en formato visual (me / friend) */
  const messages: Msg[] = useMemo(
    () => {
      if (!Array.isArray(list)) {
        return [];
      }

      return list
        .slice()
        .sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        )
        .map((m) => {
          const isMe = currentUserId && m.senderId === currentUserId;
          return {
            id: m.id,
            from: isMe ? "me" : "friend",
            text: m.message,
            at: new Date(m.timestamp).getTime(),
            read: m.read,
          };
        });
    },
    [list, currentUserId]
  );

  /* Marcar mensajes como leídos cuando se visualiza */
  useEffect(() => {
    if (!visible || !friend?.chatId) return;

    const unreadNow = messages.filter((m) => m.from === "friend" && !m.read);
    if (unreadNow.length === 0) return;

    // Sólo enviar read por los que no enviamos antes
    for (const msg of unreadNow) {
      if (!alreadyReadRef.current.has(msg.id)) {
        readMessage(friend.chatId, msg.id);
        alreadyReadRef.current.add(msg.id);
      }
    }
    clearUnread(friend.chatId);
  }, [visible, friend?.chatId, messages, clearUnread]);

  /* Agrupar mensajes por día */
  const groups = useMemo(() => {
    const map = new Map<string, Msg[]>();
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    for (const m of messages) {
      const d = new Date(m.at);
      const dateKey = d.toDateString();
      if (!map.has(dateKey)) map.set(dateKey, []);
      map.get(dateKey)!.push(m);
    }

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

    return [...map.entries()]
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .map(([dateKey, msgs]) => ({
        timeLabel: labelFor(new Date(dateKey)),
        msgs: msgs.sort((a, b) => a.at - b.at),
      }));
  }, [messages]);

  /* Auto-scroll al final */
  useEffect(() => {
    if (!visible) return;
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, visible]);

  /* Enviar mensaje */
  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const msg = new InputMessage(friend.chatId, text, currentUserId);
    void send(msg);
  };

  if (!visible || !friend) return null;
  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
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
            src={friend.skin ?? "/default-avatar.png"}
            alt={friend.nickname}
            size={16}
          />
          <div className="font-semibold">{friend.nickname}</div>
        </div>
        <IconBtn
          icon="mdi:close"
          onClick={onClose}
          className="p-2 rounded-full cursor-pointer"
          sizeIcon={20}
        />
      </div>

      {/* MENSAJES */}
      <div
        className={cn(
          "flex-1 overflow-y-auto p-4 chat-scroll chat-inner-shadow",
          "max-h-[calc(70dvh-100px)] md:max-h-[calc(65dvh-100px)] lg:max-h-[calc(60dvh-100px)]"
        )}
      >
        {groups.map((g, gi) => (
          <div key={gi}>
            {g.timeLabel && (
              <div className="text-xs bg-gray-200 px-4 py-1 rounded-full text-gray-500 w-fit mx-auto mb-2">
                {g.timeLabel}
              </div>
            )}
            {g.msgs.map((m) => {
              const isMe = m.from === "me";
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.15 }}
                  className={cn(
                    "box-border px-4 py-2 m-3 w-fit max-w-[66%] min-h-9 rounded-2xl shadow-lg/5",
                    isMe
                      ? "ml-auto mr-4 text-white rounded-br-none bg-violet-500/60"
                      : "ml-4 mr-auto bg-cyan-500/50 rounded-bl-none text-slate-100"
                  )}
                >
                  <div className="whitespace-pre-wrap break-words">{m.text}</div>
                  <div className="flex items-center justify-end gap-1 mt-1 text-[10px]">
                    <span
                      className={cn(isMe ? "text-white/80" : "text-slate-300")}
                    >
                      {new Date(m.at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
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
                </motion.div>
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
    </motion.section>
  );
}
