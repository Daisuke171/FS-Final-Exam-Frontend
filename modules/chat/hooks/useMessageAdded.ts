import { useSubscription } from "@apollo/client";
import { useQueryClient } from "@tanstack/react-query";
import { MESSAGE_ADDED } from "../api/chat.subscritions";

export function useMessageAdded(chatId: string) {
  const qc = useQueryClient();

  useSubscription(MESSAGE_ADDED, {
    variables: { chatId },
    onData: ({ data }) => {
        console.log(data , "mensaje recibido por suscripción");
        console.log(data.data, "mensaje recibido por suscripción data.data");
        
      const newMessage = data.data.messageAdded;
      qc.setQueryData(["messages", chatId], (prev = []) => [...prev, newMessage]);
    },
  });
}
