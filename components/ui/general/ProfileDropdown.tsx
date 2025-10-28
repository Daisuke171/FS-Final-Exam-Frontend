"use client";

import { Icon } from "@iconify/react";
import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { useLogout } from "@/hooks/useLogout";

export default function ProfileDropdown({
  username,
  email,
  avatar,
}: {
  username: string;
  email: string;
  avatar: string;
}) {
  const { logout, isLoading } = useLogout();
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-65 py-2 text-font bg-white/2 backdrop-blur-md rounded-lg border border-white/20 absolute top-12 -left-15 transform -translate-x-1/2 z-10"
    >
      <div
        className="flex mb-4 relative items-center gap-3 pb-4 pt-2 after:absolute
       after:bottom-0 after:w-[80%] after:left-1/2 after:-translate-x-1/2 after:h-[1px] after:bg-white/20 px-4"
      >
        {avatar ? (
          <div className="h-14 w-14 rounded-full overflow-hidden">
            <Image
              key={avatar}
              src={avatar}
              alt="avatar"
              width={60}
              height={60}
              className="object-cover w-full h-full"
            />
          </div>
        ) : (
          <div className="w-15 h-15 rounded-full bg-background flex justify-center items-center">
            <Icon
              icon="mdi:user"
              className="text-4xl"
            />
          </div>
        )}
        <div className="flex flex-col items-start h-full">
          <h3 className="text-font text-lg font-medium truncate max-w-[20ch]">
            {username}
          </h3>
          <p className="text-subtitle text-sm truncate max-w-[20ch]">{email}</p>
        </div>
      </div>
      <Link
        href="/profile"
        className="flex font-medium items-center gap-2 hover:bg-white/7 transition-colors duration-300 ease-in-out px-4 py-2"
      >
        <Icon
          icon="mdi:user"
          className="text-lg"
        />
        Perfil
      </Link>
      <Link
        href="/profile/settings"
        className="flex font-medium items-center gap-2 hover:bg-white/7 transition-colors duration-300 ease-in-out px-4 py-2"
      >
        <Icon
          icon="material-symbols:settings"
          className="text-lg"
        />
        Configuración
      </Link>
      <button
        disabled={isLoading}
        onClick={() => logout()}
        className={`flex cursor-pointer font-medium items-center w-full text-light-error gap-2 hover:bg-white/7 transition-colors duration-300 ease-in-out px-4 py-2`}
      >
        {isLoading ? (
          <Icon
            icon="eos-icons:loading"
            className="animate-spin text-lg"
          />
        ) : (
          <Icon
            icon="mdi:logout"
            className="text-lg"
          />
        )}
        {isLoading ? "Cerrando..." : "Cerrar sesión"}
      </button>
    </motion.div>
  );
}
