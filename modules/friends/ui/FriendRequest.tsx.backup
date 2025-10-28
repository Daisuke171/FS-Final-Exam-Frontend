"use client";
import type { Friend } from "../model/types";
import { useFriends } from "../model/useFriends";
import FriendCard from "./FriendCard";

export default function FriendList({
    currentUserId,
}: {
    currentUserId: string;
}) {
    const { list, loading, accept, decline, block } = useFriends(currentUserId);

    if (loading) return <div>Cargando…</div>;
    return (
        <div className="space-y-3">
            {list.map((f) => {
                const other =
                    f.requesterId === currentUserId ? f.receiver : f.requester;
                return (
                    <div
                        key={f.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-cyan-300/30"
                    >
                        <div className="font-semibold">{other.username}</div>
                        {f.status === "PENDING" ? (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => accept(f.id)}
                                    className="px-3 py-1 rounded bg-green-600 text-white"
                                >
                                    Aceptar
                                </button>
                                <button
                                    onClick={() => decline(f.id)}
                                    className="px-3 py-1 rounded bg-slate-600 text-white"
                                >
                                    Rechazar
                                </button>
                            </div>
                        ) : f.status === "ACCEPTED" ? (
                            <button
                                onClick={() => block(f.id)}
                                className="px-3 py-1 rounded bg-rose-600 text-white"
                            >
                                Bloquear
                            </button>
                        ) : null}
                    </div>
                );
            })}
        </div>
    );
}
