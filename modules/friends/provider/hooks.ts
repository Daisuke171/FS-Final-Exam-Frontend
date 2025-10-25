// modules/realtime/hooks.ts
import { useMemo } from "react";
import { useRealtime } from "./friendProvider";

export function useFriendsRealtime() {
  const { acceptedFriends, presenceByUserId, refreshFriends, openChat, unreadCountByChatId } = useRealtime();

  const friendsWithPresence = useMemo(() => {
    return acceptedFriends.map((f) => ({
      ...f,
      presence: presenceByUserId[f.id] ?? "offline",
      unreadCount: unreadCountByChatId[f.chatId] ?? 0,
    }));
  }, [acceptedFriends, presenceByUserId, unreadCountByChatId]);

  return { friends: friendsWithPresence, refreshFriends, openChat };
}

export function useChatRealtime(chatId?: string) {
  const {
    messagesByChatId,
    openedChatIds,
    sendMessage,
    openChat,
    closeChat,
    markMessagesAsRead,
  } = useRealtime();

  const messages = useMemo(() => (chatId ? (messagesByChatId.get(chatId) ?? []) : []), [messagesByChatId, chatId]);
  const isOpen = !!(chatId && openedChatIds.has(chatId));

  return { messages, isOpen, sendMessage, openChat, closeChat, markMessagesAsRead };
}
