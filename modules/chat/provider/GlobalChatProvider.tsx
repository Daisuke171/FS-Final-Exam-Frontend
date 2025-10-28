"use client";

import { ReactNode, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getSocket } from "@shared/lib/socket";
import { useUnreadStore } from "../model/unread.store";
import { usePathname } from "next/navigation";
import { useChatEvents } from "@modules/chat/model/chat-events.store";

export function GlobalChatProvider({ children }: { children?: ReactNode }) {
  const { data: session } = useSession();
  const incrementUnread = useUnreadStore((s) => s.increment);
  const pathname = usePathname();
  const currentUserId = session?.user?.id;

   const ensureSocket = useChatEvents((s) => s.ensureSocket);

  useEffect(() => {
    if (!currentUserId) return;

    const socket = getSocket("/chat");
    if (!socket) return;
    ensureSocket(currentUserId);
    const handleConnect = () => {
      socket.emit("chat:set_user", { id: currentUserId });
    };

    // Handle new messages globally
    const handleGlobalNewMessage = (data: any) => { 
     if (data.senderId !== currentUserId) {
        if (pathname !== "/friends") {
          incrementUnread(data.chatId);
        }
      }
    };

    if (socket.connected) {
      handleConnect();
    }

    // Listen for connection and messages
    socket.on("connect", handleConnect);
    socket.on("chat:new", handleGlobalNewMessage);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("chat:new", handleGlobalNewMessage);
    };
  }, [currentUserId, pathname, incrementUnread, ensureSocket]);

  return <>{children}</>;
}
