"use client";

import CustomButtonOne from "@/components/game/rock-paper-scissors/buttons/CustomButtonOne";
import { Icon } from "@iconify/react";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { LOGOUT_MUTATION } from "@/shared/graphql/queries/auth.mutations";
import { useMutation } from "@apollo/client/react";
import { useState } from "react";

interface SidebarMobileProps {
  avatar: string | undefined;
  nickname: string | undefined;
  email: string | undefined;
  name: string | undefined;
  isAuthenticated: boolean;
  closeSidebar: () => void;
}

const links = [
  {
    name: "Perfil",
    href: "/profile",
    icon: "mdi:user",
  },
  {
    name: "Configuración",
    href: "#",
    icon: "mdi:cog",
  },
];

export default function SidebarMobile({
  avatar,
  nickname,
  email,
  name,
  isAuthenticated,
  closeSidebar,
}: SidebarMobileProps) {
  const router = useRouter();
  const [logout] = useMutation(LOGOUT_MUTATION);
  const [isLoading, setIsLoading] = useState(false);
  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      await signOut({
        redirect: false,
      });
      window.location.href = "/";
    } catch (error) {
      console.error("Error al cerrar sesión:", error);

      setIsLoading(false);
    }
  };
  return (
    <>
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        exit={{ x: -300, transition: { duration: 0.2 } }}
        transition={{ type: "spring", duration: 0.6 }}
        className="h-screen z-100 bg-white/7 fixed left-0 max-w-68 top-0 backdrop-blur-md px-1 "
      >
        <div className="px-6 py-4">
          <Icon
            icon="mdi:hamburger-menu-back"
            width={30}
            className="text-font"
            onClick={closeSidebar}
          />
        </div>
        <div
          className="relative gap-2 p-6 pt-0 after:absolute 
      after:bottom-0 after:w-[80%] after:left-1/2 after:-translate-x-1/2 after:h-[1px] after:bg-white/20"
        >
          {isAuthenticated ? (
            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0, transition: { delay: 0.1 } }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
            >
              {avatar ? (
                <Image
                  key={avatar}
                  src={avatar}
                  alt={name!}
                  width={60}
                  height={60}
                  className="object-cover rounded-full"
                />
              ) : (
                <div className="w-15 h-15 rounded-full bg-background flex justify-center items-center">
                  <Icon
                    icon="mdi:user"
                    width="30"
                    className="text-font"
                  />
                </div>
              )}
              <div className="flex flex-col items-start">
                <p className="text-sm text-font font-medium">{nickname}</p>
                <p className="text-xs text-subtitle">{email}</p>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-2">
              <motion.h2
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0, transition: { delay: 0.1 } }}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                className="text-3xl font-medium text-font"
              >
                Bienvenido a{" "}
                <span className="text-light-blue font-bold text-shadow-[0_0_10px_var(--medium-blue)]">
                  <span className="text-bright-purple text-shadow-[0_0_10px_var(--light-purple)]">
                    SANYA
                  </span>{" "}
                  GAMES
                </span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
                exit={{ opacity: 0 }}
                className="text-sm text-subtitle"
              >
                Registrate o inicia sesion para empezar a jugar!
              </motion.p>
            </div>
          )}
        </div>
        <div>
          {isAuthenticated ? (
            <motion.ul
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0, transition: { delay: 0.1 } }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              className="flex flex-col text-sm font-medium gap-2 p-6"
            >
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex font-medium items-center w-full text-font gap-2 py-1.5"
                >
                  <Icon
                    icon={link.icon}
                    width={18}
                  />
                  {link.name}
                </Link>
              ))}
              <button
                disabled={isLoading}
                onClick={handleLogout}
                className={`flex cursor-pointer font-medium items-center w-full text-light-error gap-2 hover:bg-white/7 transition-colors duration-300 ease-in-out px-4 py-1.5`}
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
            </motion.ul>
          ) : (
            <motion.ul
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              className="flex flex-col text-sm font-medium gap-2 p-6"
            >
              <CustomButtonOne
                full
                text="Iniciar Sesión"
                size="sm"
                variant="outlined"
                icon={"material-symbols:login-rounded"}
                color="white"
                action={() => signIn()}
              />
              <CustomButtonOne
                full
                text="Registrarse"
                icon={"tabler:user-up"}
                size="sm"
                color="white"
                action={() => router.push("/register")}
              />
            </motion.ul>
          )}
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 0.1, duration: 0.2 }}
        onClick={closeSidebar}
        className="fixed top-0 left-0 h-screen w-screen bg-black/40 backdrop-blur-md z-99"
      ></motion.div>
    </>
  );
}
