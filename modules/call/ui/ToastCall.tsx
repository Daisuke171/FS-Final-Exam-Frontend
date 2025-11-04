"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { useMemo, useCallback } from "react"

export function ToastCall({
    show,
    room,
    me,
    peers,
    connected,
    muted,
    onMute,
    onMic,
    onStop,
}: {
    show: boolean;
    room: string;
    me: { id: string; nickname: string; skin?: string | null };
    peers: string[]; // del hook actual
    connected: boolean;
    muted: boolean;
    onMute: (m: boolean) => void;
    onMic: () => void;
    onStop: () => void;
}) {
    if (!show) return null;

    const participants = useMemo(
        () => [me.nickname, ...peers].filter(Boolean),
        [me.nickname, peers]
    );

    const handleToggleMute = useCallback(() => {
        if (muted) {
            // Pasar a activo
            onMic();        // inicia envío/captura si aún no está
            onMute(false);  // desmutea
        } else {
            // Pasar a muteado
            onMute(true);   // mutea 
        }
    }, [muted, onMic, onMute]);


    return (
        <div className="fixed bottom-22 left-1/2 -translate-x-1/2 z-40 w-[80%] max-w-[520px] rounded-2xl border border-cyan-300/30 bg-[rgba(25,20,40,0.85)] backdrop-blur-md shadow-2xl px-4 py-3">
            <div className="flex items-center justify-between gap-3">
                {/* Info */}
                <div className="min-w-0">
                    <div className="text-xs uppercase tracking-wide text-cyan-200/70">
                        Sala
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">{room}</span>
                        <span
                            className={`inline-block size-2 rounded-full ${connected ? "bg-emerald-400" : "bg-rose-400"
                                }`}
                            title={connected ? "Conectado" : "Desconectado"}
                        />
                    </div>
                    <div className="text-xs text-cyan-100/60 truncate max-w-[46ch]">
                        Participantes: {participants.join(", ") || "—"}
                    </div>
                </div>

                {/* Avatares */}
                <div className="hidden md:flex -space-x-2 items-center overflow-hidden px-2">
                    {me.skin ? (
                        <div className="h-10 w-10 overflow-hidden rounded-full">
                            <Image
                                src={me.skin}
                                alt={me.nickname}
                                width={30}
                                height={30}
                                className="inline-block rounded-full w-full h-full object-cover ring-2 ring-white outline -outline-offset-1 outline-black/5"
                            />
                        </div>
                    ) : (
                        <div className="inline-block size-8 rounded-full bg-cyan-400/30 ring-2 ring-white outline -outline-offset-1 outline-black/5" />
                    )}
                    {peers.slice(0, 5).map((p, i) => (
                        <div
                            key={p + i}
                            className="inline-grid place-items-center size-8 rounded-full bg-white/10 ring-2 ring-white outline -outline-offset-1 outline-black/5 text-[10px]"
                            title={p}
                        >
                            {p.slice(0, 2).toUpperCase()}
                        </div>
                    ))}
                    {peers.length > 5 && (
                        <div className="inline-grid place-items-center size-8 rounded-full bg-white/10 ring-2 ring-white outline -outline-offset-1 outline-black/5 text-[10px]">
                            +{peers.length - 5}
                        </div>
                    )}
                </div>

                {/* Controles */}
                <div className="flex items-center gap-2">

                    <button
                        onClick={handleToggleMute}
                        className={[
                            "px-3 py-2 rounded-xl border transition inline-flex items-center gap-2",
                            muted
                                ? "border-cyan-300/30 bg-white/5 hover:bg-white/10 text-cyan-100/80"
                                : "border-cyan-400/40 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-200"
                        ].join(" ")}
                        title={muted ? "Activar micrófono" : "Silenciar micrófono"}
                        aria-pressed={!muted}
                        aria-label={muted ? "Activar micrófono" : "Silenciar micrófono"}
                    >
                        <Icon
                            icon={muted ? "mdi:microphone-off" : "mdi:microphone"}
                            className="text-xl"
                        />
                        <span className="text-sm hidden sm:inline">
                            {muted ? "Activar" : "Silenciar"}
                        </span>
                    </button>
                    <button
                        onClick={onStop}
                        className="px-3 py-2 rounded-xl bg-rose-500/90 text-white hover:bg-rose-500 transition shadow-md"
                        title="Finalizar"
                    >
                        <Icon icon="mdi:phone-hangup" className="text-xl" />
                    </button>
                </div>
            </div>
        </div>
    );
}
