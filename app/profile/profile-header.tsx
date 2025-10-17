"use client";

import { StatCardProps } from "@/components/ui/cards/profile/StatCard";
import ChangeAvatar from "@/components/ui/modals/profile/ChangeAvatar";
import { useState } from "react";
import { AnimatePresence } from "motion/react";
import ProfileHeaderStats from "@/components/ui/general/profile/ProfileHeaderStats";
import LevelBar from "@/components/ui/general/profile/LevelBar";
import ProfileHeaderInfo from "@/components/ui/general/profile/ProfileHeaderInfo";
import { useQuery } from "@apollo/client/react";
import { User } from "@/types/game.types";
import { GET_ME } from "@/graphql/queries/user.queries";

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

export default function ProfileHeader({ userId }: { userId: string }) {
  const { data, loading, error } = useQuery<{ me: User }>(GET_ME, {
    variables: {
      userId,
    },
  });
  const user = data?.me;
  const [open, setOpen] = useState(false);

  const handleModalOpen = () => {
    setOpen(!open);
  };
  return (
    <>
      <section className="bg-white/7 backdrop-blur-md max-w-350 p-4 py-6 lg:p-8 xl:px-10 xl:py-8 rounded-b-2xl w-[95%]">
        <div className="md:items-center flex flex-col  md:flex-row gap-y-5 lg:flex lg:flex-row justify-center lg:justify-between w-full">
          <ProfileHeaderInfo
            user={user}
            error={error}
            loading={loading}
            action={handleModalOpen}
          />
          <div className="w-[90%] h-0.5 bg-white/10 mx-auto md:hidden rounded-full"></div>
          <LevelBar
            user={user}
            error={error}
            loading={loading}
          />
          <ProfileHeaderStats userId={userId} />
        </div>
        <ProfileHeaderStats
          userId={userId}
          responsive
        />
      </section>
      <AnimatePresence>
        {open && <ChangeAvatar closeModal={handleModalOpen} />}
      </AnimatePresence>
    </>
  );
}
