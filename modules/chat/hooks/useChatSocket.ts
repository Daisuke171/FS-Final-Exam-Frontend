import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { joinChat, onNewMessage, offNewMessage, NewMessage } from "../services/chat.socket";

export function useChatSocket(chatId: string) {
  const qc = useQueryClient();

  useEffect(() => {
    joinChat(chatId);

    const handler = (msg: any) => {
      qc.setQueryData(["messages", chatId], (prev = []) => [...prev, msg]);
      NewMessage(msg);
    };

    onNewMessage(handler);

    return () => {
      offNewMessage(handler);
    };
  }, [chatId, qc]);
}
