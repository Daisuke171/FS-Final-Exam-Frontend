// modules/chat/model/useChatSocket.ts
import { useEffect } from "react";
import { getSocket } from "@shared/lib/socket";
import { useQueryClient } from "@tanstack/react-query";
import type { MessageDTO } from "./types";

export function useChatSocket(friendId: string, onTyping?: (v: boolean) => void) {
  const qc = useQueryClient();
  useEffect(() => {
    const s = getSocket();
    const onNew = (payload: { friendId: string; message: MessageDTO }) => {
      if (payload.friendId !== friendId) return;
      qc.setQueryData<MessageDTO[]>(["messages", friendId], (prev = []) => [...prev, payload.message]);
    };
    const onTypingEv = (payload: { friendId: string; typing: boolean }) => {
      if (payload.friendId !== friendId) return;
      onTyping?.(payload.typing);
    };

    s.emit("chat:join", { friendId });
    s.on("chat:message", onNew);
    s.on("chat:typing", onTypingEv);

    return () => {
      s.emit("chat:leave", { friendId });
      s.off("chat:message", onNew);
      s.off("chat:typing", onTypingEv);
    };
  }, [friendId, qc, onTyping]);
}
