import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";

const GET_MESSAGES = gql`
  query GetMessages($friendId: ID!) {
    messages(friendId: $friendId) {
      id
      from
      text
      at
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation SendMessage($friendId: ID!, $text: String!) {
    sendMessage(friendId: $friendId, text: $text) {
      id
      from
      text
      at
    }
  }
`;

interface Message {
  id: string;
  from: string;
  text: string;
  at: number;
}

interface GetMessagesData {
  messages: Message[];
}

interface GetMessagesVars {
  friendId: string;
}

interface SendMessageData {
  sendMessage: Message;
}

interface SendMessageVars {
  friendId: string;
  text: string;
}

export function useMessages(friendId: string) {
  const { data, loading } = useQuery<GetMessagesData, GetMessagesVars>(
    GET_MESSAGES, 
    { variables: { friendId } }
  );
  const [sendMessage] = useMutation<SendMessageData, SendMessageVars>(SEND_MESSAGE);

  return {
    messages: (data?.messages ?? []) as Message[],
    loading,
    sendMessage: (text: string) => sendMessage({ variables: { friendId, text } }),
  };
}
