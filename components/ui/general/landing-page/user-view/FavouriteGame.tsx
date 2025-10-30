"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";

interface FavouriteGameProps {
  name: string;
  img: string;
  winrate: string;
  games: number;
  lastgame: string;
  onToggleFavorite?: () => void;
  toggling?: boolean;
}

export default function FavouriteGame({
  name,
  img,
  winrate,
  games,
  lastgame,
  onToggleFavorite,
  toggling,
}: FavouriteGameProps) {
  const [show, setShow] = useState(false);

  const handleDropdownOpen = () => {
    setShow(!show);
  };
  return (
    <div className="p-5 flex relative flex-col gap-5 bg-white/4 hover:bg-white/6 transition-colors duration-300  rounded-xl min-w-68.5">
      <Icon
        onClick={handleDropdownOpen}
        icon="mi:options-vertical"
        className="absolute top-3 right-1 text-subtitle/70 text-2xl cursor-pointer"
      />
      <div className="flex items-center justify-between">
        <div className="h-13 w-16 rounded-lg overflow-hidden">
          <Image
            src={img}
            alt={name}
            width={50}
            height={50}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="flex flex-col items-end mr-3">
          <h3 className="text-2xl text-success font-bold">{winrate}</h3>
          <p className="text-subtitle text-sm">Win Rate</p>
        </div>
      </div>
      <div>
        <h3 className="text-lg text-font font-medium mb-3">{name}</h3>
        <div className="flex items-center justify-between">
          <p className="text-subtitle text-sm">{games} partidas</p>
          <p className="text-subtitle text-sm mr-3">{lastgame}</p>
        </div>
      </div>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col py-1 bg-background
          rounded-lg absolute top-10 right-3 w-40 shadow-lg z-10 text-sm text-subtitle items-start"
          >
            <button
              onClick={onToggleFavorite}
              className={`${
                toggling ? "grayscale" : ""
              } flex items-center gap-1 py-2 px-4 text-light-error hover:bg-transparent-error w-full
          transition-colors duration-300`}
            >
              {toggling ? (
                <Icon icon="line-md:loading-twotone-loop" />
              ) : (
                <Icon icon="tabler:trash" />
              )}
              Eliminar
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
