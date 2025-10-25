"use client";
import { useState, FormEvent } from "react";
import IconBtn from "@shared/ui/IconBtn";
import {} from "../hooks/useChatSocket"

interface MessageInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export default function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    onSend(value);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Mensaje"
        disabled={disabled}
        className="flex-1 px-4 py-2 rounded-2xl border border-cyan-300/30 bg-white/5 outline-none placeholder:text-slate-300/60"
      />
      <IconBtn
        icon="mdi:send"
        label="Enviar"
        className="w-10 h-10 rounded-full"
      />
    </form>
  );
}