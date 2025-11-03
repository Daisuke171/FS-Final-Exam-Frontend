"use client";
import { useCallStore } from "../model/call.store";
import { Icon } from "@iconify/react";

export default function CallTray() {
  const { active, friend, uiState, toggleMute, toggleCamera, shareScreen, endCall } = useCallStore();
  if (!active || !friend) return null;

  const disabled = uiState !== "IN_CALL" && uiState !== "RINGING";

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[1000]">
      <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-black/70 border border-white/10 backdrop-blur shadow-lg">
        <img src={friend.avatar ?? "/default-avatar.png"} className="w-8 h-8 rounded-full" alt={friend.nickname} />
        <div className="text-sm text-white/90 pr-2">
          {friend.nickname} · {uiState === "RINGING" ? "Llamando…" : uiState === "IN_CALL" ? "En llamada" : "—"}
        </div>

        <button onClick={toggleMute} className="p-2 rounded-full bg-white/10 hover:bg-white/20" disabled={disabled} title="Mic on/off">
          <Icon icon="mdi:microphone" width={20} />
        </button>
        <button onClick={toggleCamera} className="p-2 rounded-full bg-white/10 hover:bg-white/20" disabled={disabled} title="Cam on/off">
          <Icon icon="mdi:video" width={20} />
        </button>
        <button onClick={() => { void shareScreen?.(); }} className="p-2 rounded-full bg-white/10 hover:bg-white/20" disabled={disabled} title="Compartir pantalla">
          <Icon icon="mdi:monitor-share" width={20} />
        </button>
        <button onClick={() => { void endCall?.(); }} className="ml-2 px-3 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white font-semibold" title="Cortar">
          <Icon icon="mdi:phone-hangup" width={18} className="inline mr-1" />
          Cortar
        </button>
      </div>
    </div>
  );
}
