"use client";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { useCallStore } from "../model/call.store";
import { useFriendLookup } from "@modules/friends/model/useFriends";

type FriendLite = { id: string; nickname: string; skin?: string | null };

export default function IncomingCallToast() {
  const { incoming, setIncoming, show, acceptCall, rejectCall } = useCallStore();
  const lookup = useFriendLookup();
  const [friend, setFriend] = useState<FriendLite | null>(null);
  const [loading, setLoading] = useState(false);

  // Resolver datos del caller (nombre/avatar) cuando llega el ring
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!incoming?.from) {
        setFriend(null);
        return;
      }
      const f = await lookup.get(incoming.from);
      if (!cancelled) setFriend(f);
    })();
    return () => {
      cancelled = true;
    };
  }, [incoming, lookup]);

  if (!incoming) return null;

  const nickname = friend?.nickname ?? "Contacto";
  const avatar = friend?.skin ?? "/default-avatar.png";

  const onAccept = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await acceptCall?.(); // el hook hace answerCall y el back emite call:accepted
      if (friend) show(incoming.callId, friend); // muestra tray global
      setIncoming(null);
    } finally {
      setLoading(false);
    }
  };

  const onReject = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await rejectCall?.(); // mutation reject + evento
      setIncoming(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[1001]">
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl
                      bg-black/80 border border-white/10 backdrop-blur shadow-xl">
        <img
          src={avatar}
          alt={nickname}
          className="w-9 h-9 rounded-full object-cover"
        />
        <div className="text-white">
          <div className="text-sm font-semibold">Llamada entrante</div>
          <div className="text-xs opacity-80">{nickname}</div>
        </div>

        <button
          onClick={onAccept}
          disabled={loading}
          className="ml-2 px-3 py-2 rounded-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white flex items-center gap-1"
        >
          <Icon icon="mdi:phone" width={18} />
          Aceptar
        </button>
        <button
          onClick={onReject}
          disabled={loading}
          className="px-3 py-2 rounded-full bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white flex items-center gap-1"
        >
          <Icon icon="mdi:phone-hangup" width={18} />
          Rechazar
        </button>
      </div>
    </div>
  );
}
