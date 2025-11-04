import { useRef, useState, useCallback } from "react";

export function useDraggable({ bounds }: { bounds?: HTMLElement | null } = {}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const start = useRef<{ x: number; y: number } | null>(null);

  const clamp = (x: number, y: number) => {
    if (!bounds || !ref.current) return { x, y };
    const b = bounds.getBoundingClientRect();
    const r = ref.current.getBoundingClientRect();
    return {
      x: Math.min(Math.max(x, b.left - r.left + pos.x), b.right - r.right + pos.x),
      y: Math.min(Math.max(y, b.top  - r.top  + pos.y), b.bottom - r.bottom + pos.y),
    };
  };

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    start.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
  }, [pos]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!start.current) return;
    const nx = e.clientX - start.current.x;
    const ny = e.clientY - start.current.y;
    const c = clamp(nx, ny);
    setPos(c);
  }, [clamp]);

  const onPointerUp = useCallback(() => { start.current = null; }, []);

  return {
    ref,
    style: { transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` },
    handlers: { onPointerDown, onPointerMove, onPointerUp },
    setPos,
  };
}
