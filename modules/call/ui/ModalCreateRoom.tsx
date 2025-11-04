"use client";

import { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import { CallerUser } from "./CallLauncher";

export function ModalCreateRoom({
  show,
  onClose,
  connected,
  room,
  setRoom,
  user,
  onJoin,
}: {
  show: boolean;
  onClose: () => void;
  connected: boolean;
  room: string;
  setRoom: Dispatch<SetStateAction<string>>;
  user: CallerUser;
  onJoin: () => void;
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Card */}
      <div className="relative w-[90%] max-w-[520px] rounded-2xl border border-cyan-300/30 bg-white/5 p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          {user.skin ? (
            <Image
              src={user.skin}
              alt={user.nickname}
              width={40}
              height={40}
              className="rounded-full ring-2 ring-cyan-300/40"
            />
          ) : (
            <div className="size-10 rounded-full bg-cyan-400/20 ring-2 ring-cyan-300/40" />
          )}
          <div>
            <h2 className="text-lg font-semibold tracking-wide">Unirse a Sala</h2>
            <p className="text-sm text-cyan-100/70">
              Si la sala no existe, se creará automáticamente
            </p>
          </div>
        </div>

        <label className="block text-sm mb-2">Nombre de la sala</label>
        <input
          name="room"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder="p. ej. demo-123"
          className="w-full rounded-xl bg-white/10 border border-cyan-300/30 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-300/40"
        />

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            className="px-4 py-2 rounded-xl border border-cyan-300/30 bg-white/5 hover:bg-white/10 transition"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 rounded-xl btn-gradient-1 btn-glow"
            disabled={!connected || !room.trim()}
            onClick={onJoin}
          >
            Unirme
          </button>
        </div>

        {!connected && (
          <p className="mt-3 text-xs text-amber-300/80">
            Conectate primero al servidor de llamadas…
          </p>
        )}
      </div>
    </div>
  );
}
