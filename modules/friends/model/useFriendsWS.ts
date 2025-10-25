"use client";
import { useEffect, useRef } from "react";
import {
	authFriendsSocket,
	getFriendsSocket,
	onFriendEvent,
	FriendEvent,
	PresenceUpdate,
	onPresenceUpdate,
	onPresenceSnapshot,
} from "../services/friend.socket";
import { usePresenceStore } from "./presence.store";

type Handlers = {
	onEvent?: (evt: FriendEvent) => void;
	onRefresh?: () => void;
};

export function useFriendsWS(
	userId: string | null,
	{ onEvent, onRefresh }: Handlers = {}
) {
	const setOnline = usePresenceStore((s) => s.setOnline);
	const setOffline = usePresenceStore((s) => s.setOffline);
	const setBulk = usePresenceStore((s) => s.setBulk);

	const unsub = useRef<(() => void)[]>([]);
	useEffect(() => {
		if (!userId) return;

		const s = getFriendsSocket();
		if (!s) return;

		// Autenticar y pedir snapshot inicial
		authFriendsSocket(userId);

		// Re-auth en reconexión
		const onReconnect = () => authFriendsSocket(userId);
		s.on("reconnect", onReconnect);

		// Snapshot de presencia
		unsub.current.push(onPresenceSnapshot((ids) => setBulk(ids)));

		// Deltas de presencia
		unsub.current.push(
			onPresenceUpdate(({ userId: uid, online }) =>
				online ? setOnline(uid) : setOffline(uid)
			)
		);

		// Eventos de amistad (refetch si aceptan, etc.)
		if (onEvent) {
			unsub.current.push(
				onFriendEvent((evt) => {
					onEvent?.(evt);
					if (evt.type === "friend:accepted") onRefresh?.();
				})
			);
		}

		// Limpieza
		return () => {
			s.off("reconnect", onReconnect);
			unsub.current.forEach((fn) => fn());
			unsub.current = [];			
		};
	}, [userId, setBulk, setOnline, setOffline, onEvent, onRefresh]);
}
