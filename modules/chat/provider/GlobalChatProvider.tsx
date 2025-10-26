"use client";

import { ReactNode, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getSocket } from "@shared/lib/socket";
import { useUnreadStore } from "../model/unread.store";
import { usePathname } from "next/navigation";

export function GlobalChatProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const incrementUnread = useUnreadStore((s) => s.increment);
  const pathname = usePathname();
  const currentUserId = session?.user?.id;

  useEffect(() => {
    if (!currentUserId) return;

    const socket = getSocket("/chat");
    if (!socket) return;

    // Set user when connected
    const handleConnect = () => {
      console.log("🔌 Global chat provider connected to /chat namespace");
      socket.emit("chat:set_user", { id: currentUserId });
    };

    // Handle new messages globally
    const handleGlobalNewMessage = (data: any) => {
      console.log("📬 Global chat: new message received", data);
      
      // Only increment unread count if:
      // 1. Message is not from the current user
      // 2. User is not currently on the friends page with that chat open
      if (data.senderId !== currentUserId) {
        // Check if user is on friends page - if so, the ChatWindow will handle clearing
        // If not on friends page, increment unread
        if (pathname !== "/friends") {
          console.log("📬 Incrementing unread for chatId:", data.chatId);
          incrementUnread(data.chatId);
        }
      }
    };

    // Set user if already connected
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
  }, [currentUserId, pathname, incrementUnread]);

  return <>{children}</>;
}
