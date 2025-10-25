// modules/chat/model/useMessages.ts
"use client";
import type { ApolloCache, DefaultContext } from "@apollo/client";
import { useApolloClient } from "@apollo/client/react"
import { useQuery, useMutation, useSubscription } from "@apollo/client/react";
import type { Message , MessageDTO, InputMessage } from "../types/message.types";
import { GET_MESSAGES } from "../api/chat.queries.gql";
import { SEND_MESSAGE  } from "../api/chat.mutation";
import { MESSAGE_ADDED, MESSAGE_UPDATED } from "../api/chat.subscritions";
import { useUnreadStore } from "../model/unread.store";
import { usePathname } from "next/navigation";
// Helper opcional (si querés DTO para la UI)
export function toDTO(m: Message, currentUserId?: string): MessageDTO {
  return {
    id: m.id,
    from: m.senderId === currentUserId ? "me" : "friend",
    text: m.message,
    at: new Date(m.timestamp).getTime(),
  };
}

/** Trae mensajes por chatId */
export function useGetMessages(chatId?: string) {
  const client = useApolloClient();
  const pathname = usePathname();
  const incrementUnread = useUnreadStore((s) => s.increment);
  
  const { data, loading, error, refetch } = useQuery<
    { messages: Message[] },
    { chatId: string }
  >(GET_MESSAGES, {
    variables: { chatId: chatId ?? "" },
    skip: !chatId,                       // ← evita ejecutar sin chatId
    fetchPolicy: "cache-and-network",
  });  

  // Suscripción en tiempo real
  useSubscription<{ messageAdded: Message }>(MESSAGE_ADDED, {
    skip: !chatId,
    variables: { chatId: chatId as string },
    onData: ({ data }) => {
      console.log(data, "useGetMessages");
      const incoming = data.data?.messageAdded;
      if (!incoming) return;

      // Evitar duplicados con mensajes optimistas
      client.updateQuery<{ messages: Message[] }>(
        { query: GET_MESSAGES, variables: { chatId: chatId as string } },
        (prev) => {
          const prevList = prev?.messages ?? [];
          const noTemps = prevList.filter((m) => !m.id.startsWith("tmp-"));
          const exists = noTemps.some((m) => m.id === incoming.id);
          return { messages: exists ? noTemps : [...noTemps, incoming] };
        }
      );
    },
  } );

  // Suscripción para actualizaciones de mensajes (read receipts)
  useSubscription<{ messageUpdated: Message }>(MESSAGE_UPDATED, {
    skip: !chatId,
    variables: { chatId: chatId as string },
    onData: ({ data }) => {
      console.log("📬 Message updated (read receipt):", data);
      const updated = data.data?.messageUpdated;
      if (!updated) return;

      // Actualizar el mensaje en el cache
      client.updateQuery<{ messages: Message[] }>(
        { query: GET_MESSAGES, variables: { chatId: chatId as string } },
        (prev) => {
          const prevList = prev?.messages ?? [];
          return {
            messages: prevList.map((m) =>
              m.id === updated.id ? updated : m
            ),
          };
        }
      );
    },
  });


  return {
    list: data?.messages ?? [],
    loading,
    error,
    refetch,
  };
}

export function useSendMessage(currentUserId?: string) {
  const [mutate, { loading }] = useMutation<
    { sendMessage: Message },
    { input: { chatId: string; message: string } }
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
    update: (cache: ApolloCache<unknown>, { data }) => {
      const next = data?.sendMessage;
      if (!next) return;

      const queryOptions = {
        query: GET_MESSAGES,
        variables: { chatId: next.chatId as string },
      };

      // 1) leer cache actual
      const prev = cache.readQuery<{ messages: Message[] }>(queryOptions);
      const prevList = prev?.messages ?? [];

      // 2) quitar optimistas y evitar duplicados
      const noTemps = prevList.filter((m) => !m.id.startsWith("tmp-"));
      const exists = noTemps.some((m) => m.id === next.id);
      const merged = exists ? noTemps : [...noTemps, next];
      merged.sort((a, b) => +new Date(a.timestamp) - +new Date(b.timestamp));
      // 3) escribir nuevo estado
      cache.writeQuery({
        ...queryOptions,
        data: { messages: merged },
      });
    },
  });
  return {
    send: ({ chatId, message, senderId }: InputMessage) =>
      mutate({ variables: { input: { chatId, message, senderId } } }),
    loading,
  };
}
