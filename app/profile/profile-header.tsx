"use client";

import ChangeAvatar from "@/components/ui/modals/profile/ChangeAvatar";
import { useState } from "react";
import { AnimatePresence } from "motion/react";
import ProfileHeaderStats from "@/components/ui/general/profile/ProfileHeaderStats";
import LevelBar from "@/components/ui/general/profile/LevelBar";
import ProfileHeaderInfo from "@/components/ui/general/profile/ProfileHeaderInfo";
import { useQuery } from "@apollo/client/react";
import { User } from "@/types/user.types";
import { GET_ME } from "@shared/graphql/queries/user.queries";

export default function ProfileHeader() {
  const { data, loading, error } = useQuery<{ me: User }>(GET_ME, {});
  const user = data?.me;
  const [open, setOpen] = useState(false);

  const handleModalOpen = () => {
    setOpen(!open);
  };
  return (
    <>
      <section className="bg-white/4 backdrop-blur-md max-w-350 p-4 py-6 lg:p-8 xl:px-10 xl:py-8 rounded-b-2xl w-[95%]">
        <div className="md:items-center flex flex-col  md:flex-row gap-y-5 lg:flex lg:flex-row justify-center lg:justify-between w-full">
          <ProfileHeaderInfo
            user={user}
            error={error}
            loading={loading}
            action={handleModalOpen}
          />
          <div className="w-[90%] h-0.5 bg-white/6 mx-auto md:hidden rounded-full"></div>
          <LevelBar
            user={user}
            error={error}
            loading={loading}
          />
          <ProfileHeaderStats />
        </div>
        <ProfileHeaderStats responsive />
      </section>
      <AnimatePresence>
        {open && <ChangeAvatar closeModal={handleModalOpen} />}
      </AnimatePresence>
    </>
  );
}
