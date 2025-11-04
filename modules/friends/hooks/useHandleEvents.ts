"use client";
import { useEffect, useState } from "react";
import { useGetMessages } from "@modules/chat/hooks/useMessages";
import { getSocket } from "@shared/lib/socket";
import type { Message } from "@/modules/chat";

export function useHandleEvents(chatId: string, currentUserId: string) {
  const [unread, setUnread] = useState(0);
  const [unreadIds, setUnreadIds] = useState<string[]>([]);


  const { list } = useGetMessages(chatId, currentUserId);

  useEffect(() => {
    if (!chatId) return;
    const incoming = (list || []).filter(
      (m: Message) => m.chatId === chatId && m.senderId !== currentUserId && !m.read
    );
    setUnread(incoming.length);
    setUnreadIds(incoming.map((m) => m.id));
  }, [chatId, currentUserId, list]);


  useEffect(() => {
    if (!chatId) return;
    const socket = getSocket("/chat");

    const onNew = (msg: Message) => {
      if (msg.chatId !== chatId) return;
      if (msg.senderId === currentUserId) return;
      setUnreadIds((prev) => {
        if (prev.includes(msg.id)) return prev;
        setUnread((u) => u + 1);
        return [...prev, msg.id];
      });
    };

    const onRead = (data: any) => {
      if (data?.chatId !== chatId) return;
      setUnreadIds((prev) => {
        if (!prev.includes(data.messageId)) return prev;
        const next = prev.filter((id) => id !== data.messageId);
        setUnread(next.length);
        return next;
      });
    };

    const onReadAll = (data: any) => {
      if (data?.chatId !== chatId) return;
      if (data?.userId !== currentUserId) return;
      setUnread(0);
      setUnreadIds([]);
    };

    socket.on("chat:new", onNew);
    socket.on("local:message:new", onNew);
    socket.on("chat:read", onRead);
    socket.on("chat:readAll", onReadAll);

    return () => {
      socket.off("chat:new", onNew);
      socket.off("local:message:new", onNew);
      socket.off("chat:read", onRead);
      socket.off("chat:readAll", onReadAll);
    };
  }, [chatId, currentUserId]);

  return { unread, list, msgsUnreads: unreadIds };
}
