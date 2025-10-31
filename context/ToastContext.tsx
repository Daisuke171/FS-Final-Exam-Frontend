"use client";

import { ToastContainer } from "@/components/ui/toasts/ToastContainer";
import { createContext, useContext, useState, useCallback } from "react";

export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: number;
  message: string;
  title?: string;
  type: ToastType;
}

interface ToastContextValue {
  toasts: Toast[];
  show: (
    message: string,
    options?: { title?: string; type?: ToastType; duration?: number }
  ) => void;
  remove: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (
      message: string,
      options?: { title?: string; type?: ToastType; duration?: number }
    ) => {
      const id = Date.now();
      const type = options?.type ?? "info";
      const duration = options?.duration ?? 3000;

      setToasts((prev) => [
        ...prev,
        { id, message, title: options?.title, type },
      ]);

      setTimeout(() => remove(id), duration);
    },
    [remove]
  );

  return (
    <ToastContext.Provider value={{ toasts, show, remove }}>
      {children}
      <ToastContainer
        toasts={toasts}
        remove={remove}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
}
