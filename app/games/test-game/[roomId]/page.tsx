"use client";
import RoomComponent from "./room-component";
import { motion } from "motion/react";

export default function Room() {
  return (
    <div className="flex flex-col h-screen items-center justify-center bg-gradient-one">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <RoomComponent />
      </motion.div>
    </div>
  );
}
