"use client";

import { useEffect } from "react";
import { useSubscription } from "@apollo/client/react";
import { MESSAGE_ADDED } from "../api/chat.subscritions";
import { useUnreadStore } from "../model/unread.store";
import { usePathname } from "next/navigation";
import type { Message } from "../types/message.types";

/**
 * Global listener for all chat messages across all chats.
 * Increments unread count when messages arrive for chats that are not currently open.
 */
export function useGlobalChatListener(currentUserId?: string) {
  const incrementUnread = useUnreadStore((s) => s.increment);
  const pathname = usePathname();
  
  // Listen to all MESSAGE_ADDED events globally
  // We'll subscribe without a specific chatId to catch all messages
  // Note: This requires backend support for a global subscription or we handle it differently
  
  useEffect(() => {
    if (!currentUserId) return;

    // We'll use WebSocket events for global listening since GraphQL subscriptions
    // are typically chat-specific
    const socket = typeof window !== "undefined" ? require("@shared/lib/socket").getSocket("/chat") : null;
    if (!socket) return;

    const handleGlobalNewMessage = (data: any) => {
      // Only increment if:
      // 1. Message is not from current user
      // 2. User is not currently on the friends page (viewing the chat)
      if (data.senderId !== currentUserId && pathname !== "/friends") {
        console.log("📬 New message from another chat, incrementing unread:", data.chatId);
        incrementUnread(data.chatId);
      }
    };

    socket.on("chat:new", handleGlobalNewMessage);

    return () => {
      socket.off("chat:new", handleGlobalNewMessage);
    };
  }, [currentUserId, pathname, incrementUnread]);
}
