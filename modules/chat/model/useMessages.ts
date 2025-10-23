// modules/chat/model/useMessages.ts
"use client";
import type { ApolloCache, DefaultContext } from "@apollo/client";
import { gql } from "@apollo/client/core";
import { useQuery, useMutation, useSubscription } from "@apollo/client/react";

export type Message = {
  id: string;
  chatId: string;
  senderId: string;
  message: string;
  status: string;
  read: boolean;
  timestamp: string; // ISO
};

export type MessageDTO = {
  id: string;
  from: "me" | "friend";
  text: string;
  at: number;
};

export class InputMessage  {
  chatId: string;
  message: string;
  senderId: string;
  constructor(chatId: string, message: string, senderId: string) {
    this.chatId = chatId;
    this.message = message;
    this.senderId = senderId;
  }

  toDTO() {
    return {
      chatId: this.chatId,
      message: this.message,
      senderId: this.senderId,
    };
  }
}


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

const SEND_MESSAGE = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
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

const MESSAGE_ADDED = gql`
  subscription MessageAdded($chatId: ID!) {
    messageAdded(chatId: $chatId) {
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
  const { data, loading, error, refetch, client } = useQuery<
    { messages: Message[] },
    { chatId: string }
  >(GET_MESSAGES, {
    variables: { chatId: chatId ?? "" },
    skip: !chatId,                       // ← evita ejecutar sin chatId
    fetchPolicy: "cache-and-network",
  });

  // Suscripción en tiempo real (opcional, si ya tenés WS configurado)
  useSubscription<{ messageAdded: Message }>(MESSAGE_ADDED, {
    skip: !chatId,
    variables: { chatId: chatId as string },
    onData: ({ data }) => {
      const incoming = data.data?.messageAdded;
      if (!incoming) return;

      // Evitar duplicado y reemplazar optimistas
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
