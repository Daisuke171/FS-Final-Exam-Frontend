// useChatSocket.ts
import { useEffect, useRef } from "react";
import {
  joinChat,
  onChatNew,
  offChatNew,
  onChatRead,
  offChatRead,
  onChatHistory,
  offChatHistory,
} from "../services/chat.socket";
import { getSocket } from "@shared/lib/socket";

type Opts = {
  onHistory?: (msgs: any[]) => void;
  onNew?: (m: any) => void;
  onRead?: (d: any) => void;
  // optional user bootstrap if you still need it
  user?: { id: string; username?: string };
};

export function useChatSocket(chatId?: string, opts: Opts = {}) {
  const rHist = useRef(opts.onHistory);
  const rNew = useRef(opts.onNew);
  const rRead = useRef(opts.onRead);
  useEffect(() => {
    rHist.current = opts.onHistory;
  }, [opts.onHistory]);
  useEffect(() => {
    rNew.current = opts.onNew;
  }, [opts.onNew]);
  useEffect(() => {
    rRead.current = opts.onRead;
  }, [opts.onRead]);

  useEffect(() => {
    if (!chatId) return;
    const socket = getSocket("/chat");

    // si no hay auth por handshake y aún necesitás set_user:
    // if (opts.user) socket.emit('chat:set_user', opts.user);

    const hHist = (arr: any[]) => rHist.current?.(arr);
    const hNew = (m: any) => m.chatId === chatId && rNew.current?.(m);
    const hRead = (d: any) => d.chatId === chatId && rRead.current?.(d);

    joinChat(chatId);
    onChatHistory(hHist);
    onChatNew(hNew);
    onChatRead(hRead);

    // rejoin al reconectar
    const rejoin = () => joinChat(chatId);
    socket.on("reconnect", rejoin);

    return () => {
      offChatHistory(hHist);
      offChatNew(hNew);
      offChatRead(hRead);
      socket.off("reconnect", rejoin);
    };
  }, [chatId]);
}
