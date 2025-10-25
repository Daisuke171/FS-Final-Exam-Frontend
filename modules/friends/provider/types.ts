export type FriendSummary = {
  id: string;
  nickname: string;
  avatarUrl?: string;
  status: "PENDING" | "ACCEPTED" | "BLOCKED";
  active: boolean;          // “amigo activo” (tu regla actual)
  chatId: string;           // id de chat asociado
};

export type PresenceState = "online" | "offline" | "away";

export type ChatMessage = {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: number;        // epoch ms
  readAt?: number | null;
};

export type ChatViewMessage = {
  id: string;
  text: string;
  isOwn: boolean;
  createdAt: number;
  isRead: boolean;
  senderId: string;
};

export type RealtimeContextValue = {
  // Friends
  acceptedFriends: FriendSummary[];
  presenceByUserId: Record<string, PresenceState>;
  refreshFriends: () => Promise<void>;

  // Chat
  openedChatIds: Set<string>;
  messagesByChatId: Map<string, ChatViewMessage[]>;
  unreadCountByChatId: Record<string, number>;

  openChat: (chatId: string) => void;
  closeChat: (chatId: string) => void;
  sendMessage: (chatId: string, text: string) => void;
  markMessagesAsRead: (chatId: string, messageIds: string[]) => void;

  // Session
  currentUserId: string | null;
  setCurrentUser: (userId: string) => void;
};
