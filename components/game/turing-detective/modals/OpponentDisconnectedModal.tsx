"use client";

import { motion, AnimatePresence } from "motion/react";
import CustomButtonOne from "../buttons/CustomButtonOne";
import { Icon } from "@iconify-icon/react";

export default function OpponentDisconnectedModal({
  open,
  onClose,
  onGoToRoom,
}: {
  open: boolean;
  onClose: () => void;
  onGoToRoom: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-md rounded-2xl border border-white/10 bg-gradient-to-br from-black/70 to-black/40 p-6 text-center"
          >
            <div className="flex items-center justify-center mb-3">
              <Icon
                icon="mdi:account-off-outline"
                width="48"
                height="48"
                className="text-amber-300"
              />
            </div>
            <h2 className="text-xl font-semibold text-white mb-1">
              Opponent disconnected
            </h2>
            <p className="text-white/70 mb-6">
              The other player left the match. You can return to the room or stay on this page.
            </p>
            <div className="flex items-center justify-center gap-3">
              <CustomButtonOne
                text="Close"
                action={onClose}
                icon="material-symbols:close-rounded"
                variant="outlined"
                color="secondary"
              />
              <CustomButtonOne
                text="Go to Room"
                action={onGoToRoom}
                icon="streamline:return-2"
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
