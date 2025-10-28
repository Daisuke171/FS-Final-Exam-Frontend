"use client";
import { useEffect, useState } from "react";
import { useGetMessages } from "@modules/chat/hooks/useMessages";

export function useHandleEvents(chatId: string, currentUserId: string) {
  const [unread, setUnread] = useState(0);
  const { list, refetch } = useGetMessages(chatId);

  useEffect(() => {
    if (!chatId) return;
    const messagesNews = list.filter((m) => m.senderId !== currentUserId && !m.read);

    if (messagesNews.length > 0) {
      setUnread(messagesNews.length);

    } else {
      setUnread(0);
    }
    refetch();
  }, [chatId, list, unread]);

  return ({
    unread,
    list
  });
}
