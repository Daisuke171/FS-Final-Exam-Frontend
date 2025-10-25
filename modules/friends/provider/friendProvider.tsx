// modules/realtime/RealtimeProvider.tsx
"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { getSocket } from "@shared/lib/socket";
import type {
	RealtimeContextValue,
	FriendSummary,
	PresenceState,
	ChatMessage,
	ChatViewMessage,
} from "./types";

// Helpers
const toRoomName = (chatId: string) => `chat:${chatId}`;

const RealtimeContext = createContext<RealtimeContextValue | null>(null);

export function RealtimeProvider({
	children,
	initialUserId = null,
}: {
	children: React.ReactNode;
	initialUserId?: string | null;
}) {
	// ======== Session ========
	const [currentUserId, setCurrentUserId] = useState<string | null>(
		initialUserId
	);
	const setCurrentUser = useCallback(
		(userId: string) => setCurrentUserId(userId),
		[]
	);

	// ======== Friends / Presence ========
	const [acceptedFriends, setAcceptedFriends] = useState<FriendSummary[]>([]);
	const [presenceByUserId, setPresenceByUserId] = useState<
		Record<string, PresenceState>
	>({});

	// ======== Chat ========
	const [openedChatIds, setOpenedChatIds] = useState<Set<string>>(new Set());
	const [messagesByChatId, setMessagesByChatId] = useState<
		Map<string, ChatViewMessage[]>
	>(new Map());
	const [unreadCountByChatId, setUnreadCountByChatId] = useState<
		Record<string, number>
	>({});

	// Debounce para lecturas
	const pendingReadIdsByChat = useRef<Map<string, Set<string>>>(new Map());
	const readDebounceTimerId = useRef<number | null>(null);

	// ======== Sockets (singleton) ========
	const friendsSocket = useMemo(() => getSocket("/friends"), []);
	const chatSocket = useMemo(() => getSocket("/chat"), []);

	// ======== Friends: cargar y suscribirse ========
	const refreshFriends = useCallback(async () => {
		// Si tenés GraphQL/REST, traelos desde tu API. Placeholder:
		// const data = await fetch(...);
		// setAcceptedFriends(data);
		friendsSocket.emit("friends:list"); // si tu WS devuelve listado
	}, [friendsSocket]);

	useEffect(() => {
		// Establecer identidad si no usas JWT en handshake
		if (currentUserId) {
			friendsSocket.emit("friends:set_user", { id: currentUserId });
			chatSocket.emit("chat:set_user", { id: currentUserId });
			friendsSocket.emit("presence:get", { userId: currentUserId });
		}
	}, [currentUserId, friendsSocket, chatSocket]);

	useEffect(() => {
		// Amigos aceptados (depende de tu backend)
		const handleFriendsList = (items: FriendSummary[]) => {
			setAcceptedFriends(
				items.filter((f) => f.status === "ACCEPTED" && f.active)
			);
		};
		const handleFriendAccepted = (_payload: any) => refreshFriends();
		const handlePresenceUpdate = (payload: {
			userId: string;
			presence: PresenceState;
		}) => {
			setPresenceByUserId((prev) => ({
				...prev,
				[payload.userId]: payload.presence,
			}));
		};

		friendsSocket.on("friends:list:result", handleFriendsList);
		friendsSocket.on("friend:accepted", handleFriendAccepted);
		friendsSocket.on("presence:state", handlePresenceUpdate);

		// bootstrap
		refreshFriends();

		return () => {
			friendsSocket.off("friends:list:result", handleFriendsList);
			friendsSocket.off("friend:accepted", handleFriendAccepted);
			friendsSocket.off("presence:state", handlePresenceUpdate);
		};
	}, [friendsSocket, refreshFriends]);

	// ======== Chat: open / close ========
	const openChat = useCallback(
		(chatId: string) => {
			setOpenedChatIds((prev) => {
				if (prev.has(chatId)) return prev;
				const next = new Set(prev);
				next.add(chatId);
				return next;
			});
			chatSocket.emit("chat:join", { chatId });
		},
		[chatSocket]
	);

	const closeChat = useCallback(
		(chatId: string) => {
			setOpenedChatIds((prev) => {
				if (!prev.has(chatId)) return prev;
				const next = new Set(prev);
				next.delete(chatId);
				return next;
			});
			chatSocket.emit("chat:leave", { chatId });
		},
		[chatSocket]
	);

	// ======== Chat: recibir history/new/read ========
	useEffect(() => {
		const handleChatHistory = (history: ChatMessage[] | any[]) => {
			// Podría llegarte history sin chatId; preferible que tu backend lo incluya.
			// Si no, asumimos que cada item trae chatId.
			if (!Array.isArray(history) || history.length === 0) return;

			setMessagesByChatId((prev) => {
				const next = new Map(prev);
				// Agrupar por chatId por si llegan múltiples (defensivo)
				const byChat: Record<string, ChatViewMessage[]> = {};
				for (const m of history) {
					const norm: ChatViewMessage = {
						id: m.id,
						text: m.message ?? m.text,
						isOwn: m.senderId === currentUserId,
						createdAt: new Date(
							m.timestamp ?? m.createdAt
						).getTime(),
						isRead: !!m.read || !!m.readAt,
						senderId: m.senderId,
					};
					const cid = m.chatId;
					if (!byChat[cid]) byChat[cid] = [];
					byChat[cid].push(norm);
				}
				Object.entries(byChat).forEach(([cid, arr]) => {
					const existing = next.get(cid) ?? [];
					const merged = [...existing, ...arr].sort(
						(a, b) => a.createdAt - b.createdAt
					);
					// eliminar duplicados por id
					const unique = Array.from(
						new Map(merged.map((x) => [x.id, x])).values()
					);
					next.set(cid, unique);
				});
				return next;
			});
		};

		const handleChatNew = (message: ChatMessage | any) => {
			const cid = message.chatId;
			const normalized: ChatViewMessage = {
				id: message.id,
				text: message.message ?? message.text,
				isOwn: message.senderId === currentUserId,
				createdAt: new Date(
					message.timestamp ?? message.createdAt
				).getTime(),
				isRead: !!message.read || !!message.readAt,
				senderId: message.senderId,
			};

			setMessagesByChatId((prev) => {
				const next = new Map(prev);
				const list = next.get(cid) ?? [];
				if (!list.some((m) => m.id === normalized.id)) {
					list.push(normalized);
					list.sort((a, b) => a.createdAt - b.createdAt);
					next.set(cid, list);
				}
				return next;
			});

			// actualizar no leídos si el chat no está abierto o si no es tuyo
			setUnreadCountByChatId((prev) => {
				const isOwn = normalized.isOwn;
				const isOpened = openedChatIds.has(cid);
				if (isOwn || isOpened) return prev;
				const count = (prev[cid] ?? 0) + 1;
				return { ...prev, [cid]: count };
			});
		};

		const handleChatRead = (data: {
			chatId: string;
			messageId: string;
		}) => {
			setMessagesByChatId((prev) => {
				const next = new Map(prev);
				const list = next.get(data.chatId) ?? [];
				next.set(
					data.chatId,
					list.map((m) =>
						m.id === data.messageId ? { ...m, isRead: true } : m
					)
				);
				return next;
			});
		};

		chatSocket.on("chat:history", handleChatHistory);
		chatSocket.on("chat:new", handleChatNew);
		chatSocket.on("chat:read", handleChatRead);

		return () => {
			chatSocket.off("chat:history", handleChatHistory);
			chatSocket.off("chat:new", handleChatNew);
			chatSocket.off("chat:read", handleChatRead);
		};
	}, [chatSocket, currentUserId, openedChatIds]);

	// ======== Chat: enviar y marcar leídos ========
	const sendMessage = useCallback(
		(chatId: string, text: string) => {
			const trimmed = text.trim();
			if (!trimmed) return;

			// Optimista UI
			const temporaryId = `temp-${Date.now()}`;
			const optimistic: ChatViewMessage = {
				id: temporaryId,
				text: trimmed,
				isOwn: true,
				createdAt: Date.now(),
				isRead: false,
				senderId: currentUserId ?? "me",
			};

			setMessagesByChatId((prev) => {
				const next = new Map(prev);
				const list = next.get(chatId) ?? [];
				list.push(optimistic);
				list.sort((a, b) => a.createdAt - b.createdAt);
				next.set(chatId, list);
				return next;
			});

			// Emitir al server (el servidor emitirá chat:new con la versión persistida)
			chatSocket.emit("chat:send", { chatId, text: trimmed });
		},
		[chatSocket, currentUserId]
	);

	const markMessagesAsRead = useCallback(
		(chatId: string, messageIds: string[]) => {
			if (!messageIds.length) return;

			// actualizar UI local para feedback inmediato
			setMessagesByChatId((prev) => {
				const next = new Map(prev);
				const list = next.get(chatId) ?? [];
				next.set(
					chatId,
					list.map((m) =>
						messageIds.includes(m.id) ? { ...m, isRead: true } : m
					)
				);
				return next;
			});

			// actualizar contador de no leídos
			setUnreadCountByChatId((prev) => ({ ...prev, [chatId]: 0 }));

			// enqueue para debounce de envío real
			const setForChat =
				pendingReadIdsByChat.current.get(chatId) ?? new Set<string>();
			messageIds.forEach((id) => setForChat.add(id));
			pendingReadIdsByChat.current.set(chatId, setForChat);

			if (readDebounceTimerId.current)
				window.clearTimeout(readDebounceTimerId.current);
			readDebounceTimerId.current = window.setTimeout(() => {
				const snapshot = new Map(pendingReadIdsByChat.current);
				pendingReadIdsByChat.current.clear();
				snapshot.forEach((ids, cid) => {
					ids.forEach((id) =>
						chatSocket.emit("chat:read", {
							chatId: cid,
							messageId: id,
						})
					);
				});
				readDebounceTimerId.current = null;
			}, 200);
		},
		[chatSocket]
	);

	// ======== Valor del contexto ========
	const contextValue = useMemo<RealtimeContextValue>(
		() => ({
			// friends
			acceptedFriends,
			presenceByUserId,
			refreshFriends,

			// chat
			openedChatIds,
			messagesByChatId,
			unreadCountByChatId,

			openChat,
			closeChat,
			sendMessage,
			markMessagesAsRead,

			// session
			currentUserId,
			setCurrentUser,
		}),
		[
			acceptedFriends,
			presenceByUserId,
			refreshFriends,
			openedChatIds,
			messagesByChatId,
			unreadCountByChatId,
			openChat,
			closeChat,
			sendMessage,
			markMessagesAsRead,
			currentUserId,
			setCurrentUser,
		]
	);

	return (
		<RealtimeContext.Provider value={contextValue}>
			{children}
		</RealtimeContext.Provider>
	);
}

export function useRealtime() {
	const ctx = useContext(RealtimeContext);
	if (!ctx)
		throw new Error("useRealtime must be used within RealtimeProvider");
	return ctx;
}
