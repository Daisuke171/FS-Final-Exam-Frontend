"use client";
import { useEffect, useState } from "react";
import { useGetMessages } from "@modules/chat/hooks/useMessages";
import { getSocket } from "@shared/lib/socket";

export function useHandleEvents(chatId: string, currentUserId: string) {
  const [unread, setUnread] = useState(0);
  const { list } = useGetMessages(chatId);

  useEffect(() => {
    if (!chatId) return;

    // Función para contar mensajes no leídos
    const countUnread = () => {
      const messagesNews = list.filter((m) => m.senderId !== currentUserId && !m.read);
      setUnread(messagesNews.length);
    };

    // Contar inicialmente
    countUnread();

    // Escuchar eventos de socket
    const socket = getSocket("/chat");

    const handleNewMessage = (data: any) => {
      console.log("💌 Nuevo mensaje en FriendCard:", data);
      if (data.chatId === chatId && data.senderId !== currentUserId) {
        setUnread(prev => prev + 1);
      }
    };

    const handleReadAll = (data: any) => {
      console.log("👀 Mensajes leídos en FriendCard:", data);
      if (data.chatId === chatId) {
        setUnread(0);
      }
    };

    socket.on("chat:new", handleNewMessage);
    socket.on("chat:readAll", handleReadAll);
    socket.on("local:message:new", handleNewMessage);

    return () => {
      socket.off("chat:new", handleNewMessage);
      socket.off("chat:readAll", handleReadAll);
      socket.off("local:message:new", handleNewMessage);
    };
  }, [chatId, currentUserId, list]);

  return ({
    unread,
    list
  });
}
