"use client";
import { useEffect } from "react";
import { authFriendsSocket, getFriendsSocket, onFriendEvent, FriendEvent, PresenceUpdate, onPresenceUpdate, onPresenceSnapshot } from "@shared/lib/friend-socket";
import { usePresenceStore } from "./presence.store";

export function useFriendsWS(
  userId: string,
  opts?: {
    onEvent?: (e: FriendEvent) => void;
    onRefresh?: () => void; 
  }
) {
    const setOnline = usePresenceStore((s) => s.setOnline);
  const setOffline = usePresenceStore((s) => s.setOffline);
  const setBulk = usePresenceStore((s) => s.setBulk);

  useEffect(() => {
    if (!userId) return;

    const s = getFriendsSocket();
    if (!s) return;

    // auth al conectar y reconectar
    const doAuth = () => authFriendsSocket(userId);
    if (s.connected) doAuth();
    s.once("connect", doAuth);
    s.on("reconnect", doAuth);

     // eventos de amistad (opcionales)
    const offFriend = onFriendEvent((evt) => {
      opts?.onEvent?.(evt);
      if (evt.type?.startsWith?.("friend:")) opts?.onRefresh?.();
    });

      // presencia en vivo (uno a uno)
    const offPresence = onPresenceUpdate((p: PresenceUpdate) => {
      if (p.online) setOnline(p.userId);
      else setOffline(p.userId);
    });
     // snapshot inicial (lista online)
    const offSnapshot = onPresenceSnapshot((ids) => {
      setBulk(ids);
    });


    // cleanup
    return () => {
      offFriend?.();
      offPresence?.();
      offSnapshot?.();
      s.off("connect", doAuth);
      s.off("reconnect", doAuth);
    };
  }, [userId, opts?.onEvent, opts?.onRefresh, setOnline, setOffline, setBulk]);

  
}
