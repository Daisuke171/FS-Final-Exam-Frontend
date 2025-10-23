import { gql, useMutation, useQuery } from "@apollo/client";

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

export function useMessages(friendId: string) {
  const { data, loading } = useQuery(GET_MESSAGES, { variables: { friendId } });
  const [sendMessage] = useMutation(SEND_MESSAGE);

  return {
    messages: data?.messages ?? [],
    loading,
    sendMessage: (text: string) => sendMessage({ variables: { friendId, text } }),
  };
}
