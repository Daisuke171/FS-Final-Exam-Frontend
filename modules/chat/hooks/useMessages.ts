"use client";
import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client/react";
import type { Message, MessageDTO, InputMessage } from "../types/message.types";
import { GET_MESSAGES } from "../api/chat.queries.gql";
import { SEND_MESSAGE } from "../api/chat.mutation";
import { getSocket } from "@shared/lib/socket";
import {
  onChatNew,
  onChatRead,
  onChatHistory,
  leaveChat,
  cleanupChatListeners,
  offChatHistory,
  offChatNew,
  chatNew
} from "../services/chat.socket";

export function toDTO(m: Message, currentUserId?: string): MessageDTO {
  return {
    id: m.id,
    from: m.senderId === currentUserId ? "me" : "friend",
    text: m.message,
    at: new Date(m.timestamp).getTime(),
  };
}

export function useGetMessages(chatId?: string, currentUserId?: string) {
  // const client = useApolloClient();
  const [messages, setMessages] = useState<Message[]>([]);

  // Función para unirse al chat
  const joinChat = (chatId: string) => {
    const socket = getSocket("/chat");
    socket.emit("chat:join", { chatId });
    console.log(`🔌 Unido al chat ${chatId}`);
  };

  useEffect(() => {
    if (!chatId) {
      console.log("❌ No hay chatId proporcionado");
      return;
    }

    // Unirse al chat primero
    joinChat(chatId);
    console.log("📡 Conectando al chat:", chatId);

    //  Escucha el historial inicial
    onChatHistory(chatId, (receivedMessages) => {
      if (Array.isArray(receivedMessages) && receivedMessages.length > 0) {
        // Validar estructura de mensajes
        const validMessages = receivedMessages.filter(msg => 
          msg && 
          typeof msg === 'object' && 
          'id' in msg && 
          'message' in msg && 
          'senderId' in msg && 
          'timestamp' in msg
        );
        setMessages(validMessages);
      } else {
        console.warn("⚠️ No hay mensajes en el historial o formato inválido");
        setMessages([]);
      }
    });

    // Escucha mensajes nuevos
    const handleNewMessage = (msg: Message) => {
      console.log("💬 Nuevo mensaje recibido:", msg);
      if (msg.chatId === chatId) {
        setMessages((prev) => {
          const exists = prev.some(m => m.id === msg.id);
          if (exists) return prev;
          return [...prev, msg];
        });
      }
    };
    onChatNew(handleNewMessage);

    // Escucha lecturas de mensajes
    const handleMessageRead = (data: any) => {     
      
      if (data.chatId === chatId) {
        setMessages(prev => {
          return prev.map(msg => {
            // Solo actualizamos los mensajes que fueron enviados por el usuario actual
            // cuando el otro usuario los marca como leídos
            if (msg.senderId === currentUserId && data.userId !== currentUserId) {
              
              return { ...msg, read: true };
            }
            return msg;
          });
        });
      }
    };
    onChatRead(handleMessageRead);

    return () => {
      offChatHistory();
      offChatNew(handleNewMessage);
      leaveChat(chatId);
      cleanupChatListeners();
      console.log("🔌 Desconectado del chat", chatId);
    };
  }, [chatId]);

  return {
    list: messages,
  };
}

export function useSendMessage(currentUserId?: string) {
  const [mutate, { loading }] = useMutation<
    { sendMessage: Message },
    { input: { chatId: string; message: string; senderId: string } }
  >(SEND_MESSAGE, {
    optimisticResponse: ({ input }) => ({
      sendMessage: {
        __typename: "ChatMessage",
        id: "tmp-" + crypto.randomUUID(),
        chatId: input.chatId,
        senderId: currentUserId ?? "me",
        message: input.message,
        status: "sended",
        read: false,
        timestamp: new Date().toISOString(),
      },
    }),
    update: (cache, { data }) => {
      const next = data?.sendMessage;
      if (!next) return;

      const queryOptions = {
        query: GET_MESSAGES,
        variables: { chatId: next.chatId as string },
      };

      const prev = cache.readQuery<{ messages: Message[] }>(queryOptions);
      const prevList = prev?.messages ?? [];

      const noTemps = prevList.filter((m) => !m.id.startsWith("tmp-"));
      const exists = noTemps.some((m) => m.id === next.id);
      const merged = exists ? noTemps : [...noTemps, next];
      merged.sort((a, b) => +new Date(a.timestamp) - +new Date(b.timestamp));
      cache.writeQuery({
        ...queryOptions,
        data: { messages: merged },
      });
    },
  });
  const send = ({ chatId, message, senderId }: InputMessage) => {
    chatNew({ chatId, message, senderId });

    mutate({ variables: { input: { chatId, message, senderId } } });
  };
  return {
    send,
    loading
  }
}


