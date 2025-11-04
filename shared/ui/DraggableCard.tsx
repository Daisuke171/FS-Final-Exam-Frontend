"use client";
import { useRef, ReactNode } from "react";
import { useDraggable } from "@/hooks/useDraggable";

interface DraggableCardProps {
    children?: ReactNode;
    className?: string;
}

export default function DraggableCard({ children, className = "" }: DraggableCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const drag = useDraggable({ bounds: containerRef.current! });

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none">
      <div
        ref={drag.ref}
        {...drag.handlers}
        className="pointer-events-auto w-[320px] rounded-2xl border border-cyan-300/30 bg-white/5 backdrop-blur px-4 py-3 shadow-xl cursor-grab active:cursor-grabbing"
        style={drag.style}
      >
        {children}
      </div>
    </div>
  );
}
