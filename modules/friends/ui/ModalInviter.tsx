import { ReactNode } from "react";
import { cn } from "@shared/lib/utils";

export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  open?: boolean;
  children: ReactNode;
}) {
  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />
      <div className={cn(
            "relative w-full max-w-md rounded-xl border border-cyan-300/30 bg-cyan-300/10 p-4 shadow-2xl",
            "backdrop-blur shadow-[0_0_12px_rgba(76,201,240,.25)]",
            "transition-all duration-150",
            open
              ? "opacity-100 scale-100 pointer-events-auto"
              : "opacity-0 scale-95 pointer-events-none"
          )}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold capitalize">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-white/5" aria-label="Cerrar">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

