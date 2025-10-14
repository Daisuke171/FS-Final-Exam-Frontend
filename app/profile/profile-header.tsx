"use client";

import StatCard, {
  StatCardProps,
} from "@/components/ui/cards/profile/StatCard";
import ChipOne from "@/components/ui/chips/profile/ChipOne";
import ChangeAvatar from "@/components/ui/modals/profile/ChangeAvatar";
import { Icon } from "@iconify-icon/react";
import { useState } from "react";
import { AnimatePresence } from "motion/react";

const cards: StatCardProps[] = [
  {
    title: "Partidas jugadas",
    number: 53,
    color: "neutral",
    icon: "famicons:game-controller",
  },
  {
    title: "Partidas ganadas",
    number: 25,
    color: "victory",
    icon: "mdi:crown",
  },
  {
    title: "Partidas perdidas",
    number: 20,
    color: "defeat",
    icon: "game-icons:dead-head",
  },
  {
    title: "Partidas empatadas",
    number: 8,
    color: "draw",
    icon: "material-symbols-light:swords-rounded",
  },
];

export default function ProfileHeader() {
  const [open, setOpen] = useState(false);

  const handleModalOpen = () => {
    setOpen(!open);
  };
  return (
    <>
      <section className="bg-white/7 backdrop-blur-md max-w-350 px-10 py-8 rounded-b-2xl w-[95%]">
        <div className="items-center flex justify-between max-w-300 mx-auto">
          <article className="flex items-center gap-5">
            <div
              onClick={handleModalOpen}
              className="h-30 w-30 cursor-pointer group flex items-center relative justify-center overflow-hidden rounded-full bg-background border border-dark-gray"
            >
              <Icon
                icon="mdi:user"
                width="90"
                className="text-subtitle"
              />
              <div className="w-full h-full absolute backdrop-blur-md transition-all duration-300 opacity-0 group-hover:opacity-100 bg-black/80 rounded-full"></div>
              <Icon
                icon="mdi:account-cog"
                width="50"
                className="absolute transition-all duration-300 text-font transform translate-y-8 opacity-0 group-hover:opacity-100 group-hover:translate-y-0"
              />
            </div>
            <div>
              <div className="flex items-center gap-5">
                <h2 className="text-lg text-font font-medium flex items-center gap-1">
                  Usuario123
                  <Icon
                    icon="material-symbols:verified"
                    width="22"
                    className="text-light-blue"
                  />
                </h2>
                <Icon
                  icon="material-symbols:edit-rounded"
                  width="22"
                  className="hover:text-light-blue transition-all cursor-pointer"
                />
              </div>
              <p className="text-subtitle">usuario@usuario.com</p>
              <div className="flex items-center gap-2">
                <ChipOne
                  value="2423"
                  icon="ix:trophy-filled"
                  color="secondary"
                />
                <ChipOne
                  value="1443"
                  icon="ix:coins-filled"
                  color="primary"
                />
              </div>
            </div>
          </article>
          <article className="w-[40%] max-w-80 flex flex-col justify-center gap-2 border-l border-dark-gray h-23 pl-5">
            <div className="flex justify-between items-center">
              <p className="text-font text-base font-medium">Level 28</p>
              <p className="text-font text-sm font-medium">
                1210 <span className="text-subtitle">/ 2500</span>
              </p>
            </div>
            <div className="relative w-full h-3 overflow-hidden rounded-2xl bg-background">
              <div className="h-3 absolute w-1/2 bg-gradient-to-r from-shadow-blue to-medium-blue rounded-2xl"></div>
            </div>
            <div className="flex items-center mt-1 gap-1">
              <div className="h-7 w-7 flex items-center justify-center rounded-full border border-medium-blue">
                <p className="font-medium text-font">Ni</p>
              </div>
              <p className="text-font text-sm font-medium">Níquel</p>
            </div>
          </article>
          <article>
            <div className="text-center flex items-center">
              {cards.map((card) => (
                <StatCard
                  key={card.title}
                  icon={card.icon}
                  title={card.title}
                  number={card.number}
                  color={card.color}
                />
              ))}
            </div>
          </article>
        </div>
      </section>
      <AnimatePresence>
        {open && <ChangeAvatar closeModal={handleModalOpen} />}
      </AnimatePresence>
    </>
  );
}
