"use client";
import { ReactNode } from "react";

interface AppShellProps {
	children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-dvh bg-[#0e0b1a] text-white">
      <div className="fixed inset-x-0 top-0 z-40 h-16 bg-[rgba(25,20,40,.95)] backdrop-blur
                      border-b border-cyan-300/30 shadow-[0_0_20px_rgba(76,201,240,.2)]" />
      <div className="pt-16">{children}</div>
    </div>
  );
}

