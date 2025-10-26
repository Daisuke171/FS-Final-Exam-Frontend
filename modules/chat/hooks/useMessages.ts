"use client";
import type { ApolloCache } from "@apollo/client";
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
    fetchPolicy: "network-only",         // Always fetch fresh data for real-time updates
    nextFetchPolicy: "network-only",     // Keep fetching fresh data on subsequent requests
    pollInterval: 0,                     // Don't poll, we have subscriptions
  });  

  // Suscripción en tiempo real para nuevos mensajes
  useSubscription<{ messageAdded: Message }>(MESSAGE_ADDED, {
    skip: !chatId,
    variables: { chatId: chatId as string },
    onData: ({ data, client: subClient }) => {
      console.log("📨 New message via GraphQL subscription:", data);
      const incoming = data.data?.messageAdded;
      if (!incoming) return;

      try {
        // Read current cache
        const existing = client.cache.readQuery<{ messages: Message[] }>({
          query: GET_MESSAGES,
          variables: { chatId: chatId as string },
        });

        if (existing) {
          const prevList = existing.messages ?? [];
          const noTemps = prevList.filter((m) => !m.id.startsWith("tmp-"));
          const exists = noTemps.some((m) => m.id === incoming.id);
          
          if (!exists) {
            // Write updated cache
            client.cache.writeQuery({
              query: GET_MESSAGES,
              variables: { chatId: chatId as string },
              data: { messages: [...noTemps, incoming] },
            });
          }
        }
      } catch (err) {
        console.warn("Cache update failed, refetching:", err);
        refetch?.();
      }
    },
  });

  // Suscripción para actualizaciones de mensajes (read receipts)
  useSubscription<{ messageUpdated: Message }>(MESSAGE_UPDATED, {
    skip: !chatId,
    variables: { chatId: chatId as string },
    onData: ({ data }) => {
      console.log("📬 Message updated (read receipt) via GraphQL:", data);
      const updated = data.data?.messageUpdated;
      if (!updated) return;

      try {
        // Read current cache
        const existing = client.cache.readQuery<{ messages: Message[] }>({
          query: GET_MESSAGES,
          variables: { chatId: chatId as string },
        });

        if (existing) {
          // Update the specific message
          const updatedMessages = existing.messages.map((m) =>
            m.id === updated.id ? updated : m
          );

          // Write back to cache
          client.cache.writeQuery({
            query: GET_MESSAGES,
            variables: { chatId: chatId as string },
            data: { messages: updatedMessages },
          });
        }
      } catch (err) {
        console.warn("Cache update failed for read receipt, refetching:", err);
        refetch?.();
      }
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
    update: (cache, { data }) => {
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
    send: ({ chatId, message }: InputMessage) =>
      mutate({ variables: { input: { chatId, message } } }),
    loading,
  };
}
