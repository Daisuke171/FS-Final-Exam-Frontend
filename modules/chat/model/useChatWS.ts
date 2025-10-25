// modules/chat/model/useChatWS.ts
"use client";
import { useEffect } from "react";
import {
  getChatSocket,
  setUser,
  joinChatRoom,
  onNewMessage,
  onSent,
  onMessageRead,
} from "@shared/lib/chat-socket";
import { useUnreadStore } from "./unread.store";
import { useApolloClient, gql } from "@apollo/client";

const GET_MESSAGES = gql`
  query Messages($chatId: ID!) {
    messages(chatId: $chatId) {
      id
      chatId
      senderId
      message
      status
      read
      timestamp
    }
  }
`;

type Msg = {
  id: string;
  chatId: string;
  senderId: string;
  message: string;
  status: string;
  read: boolean;
  timestamp: string;
};

export function useChatWS(params: {
  userId: string;
  username: string;
  chatId?: string;
  onIncomingState?: (m: Msg) => void; 
  onReadState?: (m: Msg) => void;
}) {
  const { userId, username, chatId, onIncomingState, onReadState } = params;
  const client = useApolloClient();
  const increment = useUnreadStore((incomingMessage) => incomingMessage.increment);

  // autenticar socket con set_user (y re-autenticar al reconectar)
  useEffect(() => {
    if (!userId) return;
    const s = getChatSocket();
    if (!s) return;
    const doAuth = () => setUser({ id: userId, username });
    if (s.connected) doAuth();
    s.once("connect", doAuth);
    s.on("reconnect", doAuth);
    return () => {
      s.off("reconnect", doAuth);
    };
  }, [userId, username]);

  // entrar al room del chat
  useEffect(() => {
    if (!chatId) return;
    joinChatRoom(chatId);
  }, [chatId]);

  // listeners (newMessage/sent/message_read) -> actualizar cache
  useEffect(() => {
    if (!chatId) return;

    const offNew = onNewMessage((incoming: Msg) => {
      // actualizar cache Apollo si es el chat activo
      if (incoming.chatId === chatId) {
        client.updateQuery<{ messages: Msg[] }, { chatId: string }>(
          { query: GET_MESSAGES, variables: { chatId } },
          (prev) => {
            const list = prev?.messages ?? [];
            const noTemps = list.filter((m) => !m.id.startsWith("tmp-"));
            const exists = noTemps.some((m) => m.id === incoming.id);
            return { messages: exists ? noTemps : [...noTemps, incoming] };
          }
        );
      }
      onIncomingState?.(incoming);
    });

    // eco al emisor (tu gateway emite 'sent' solo al emisor)
    const offSent = onSent((saved: Msg) => {
      if (saved.chatId !== chatId) return;
      client.updateQuery<{ messages: Msg[] }, { chatId: string }>(
        { query: GET_MESSAGES, variables: { chatId } },
        (prev) => {
          const list = prev?.messages ?? [];
          // reemplazar optimista si hiciste id "tmp-"
          const filtered = list.filter((m) => !m.id.startsWith("tmp-"));
          const exists = filtered.some((m) => m.id === saved.id);
          return { messages: exists ? filtered : [...filtered, saved] };
        }
      );
    });

    const offRead = onMessageRead((updated: Msg) => {
      if (updated.chatId !== chatId) return;
      client.updateQuery<{ messages: Msg[] }, { chatId: string }>(
        { query: GET_MESSAGES, variables: { chatId } },
        (prev) => {
          const list = prev?.messages ?? [];
          return {
            messages: list.map((m) => (m.id === updated.id ? { ...m, read: updated.read, status: updated.status } : m)),
          };
        }
      );
      onReadState?.(updated);
    });

    return () => {
      offNew?.();
      offSent?.();
      offRead?.();
    };
  }, [client, chatId, onIncomingState, onReadState]);

   useEffect(() => {
    if (!userId) return;

    // Cuando llega un nuevo mensaje
    const incomingMessage = onNewMessage((msg: any) => {
      // Si el mensaje NO es del usuario actual → marcar como no leído
      if (msg.senderId !== userId) {
        increment(msg.chatId);
      }
    });

    return () => incomingMessage?.();
  }, [userId, increment]);
}

 