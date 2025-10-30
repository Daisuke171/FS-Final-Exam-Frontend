"use client";

import Image from "next/image";
import FavoriteGames from "./FavoriteGames";
import MissionsSection from "./MissionsSection";
import NotificationsSection from "./NotificationsSection";

import { motion } from "motion/react";

export default function UserContent() {
  return (
    <div className="w-full relative gap-8 min-h-screen flex flex-col items-center justify-center pt-[calc(75px+2.5rem)] pb-10">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute top-0 left-0 w-full h-full"
      >
        <Image
          src="/backgrounds/sun-tornado.svg"
          fill
          alt="background"
          className="opacity-60"
        />
      </motion.div>
      <FavoriteGames />
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="flex flex-col z-10 md:flex-row w-[90%] max-w-300 justify-center gap-10"
      >
        <MissionsSection />
        <NotificationsSection />
      </motion.div>
    </div>
  );
}
