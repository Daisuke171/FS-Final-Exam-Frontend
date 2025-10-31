"use client";

import { motion, AnimatePresence } from "motion/react";
import type { Toast } from "@/context/ToastContext";
import { Icon } from "@iconify/react";

const getToastColor = {
  success: "bg-shadow-success",
  error: "bg-error",
  info: "bg-shadow-blue",
};

const icons = {
  success: "lets-icons:check-ring",
  error: "charm:circle-cross",
  info: "material-symbols:info-outline-rounded",
};

export function ToastContainer({
  toasts,
  remove,
}: {
  toasts: Toast[];
  remove: (id: number) => void;
}) {
  return (
    <div
      className="fixed top-6 left-1/2 -translate-x-1/2 
        z-300 flex flex-col items-center gap-3"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`px-4 py-2 rounded-lg shadow-lg text-font cursor-pointer ${
              getToastColor[toast.type]
            }`}
            onClick={() => remove(toast.id)}
          >
            <div className="flex items-center gap-1">
              <Icon
                icon={icons[toast.type]}
                className="text-lg"
              />
              <h3 className="font-medium text-base">{toast.title}</h3>
            </div>
            <p className="text-sm">{toast.message}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
