"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import ProfileDropdown from "./ProfileDropdown";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Session } from "next-auth";
import SidebarMobile from "./SidebarMobile";
import AuthDropdown from "./AuthDropdown";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface NavbarProps {
  users: number;
  session: Session | null;
}

export default function Navbar({ users, session }: NavbarProps) {
  // const { data: session } = useSession();
  const { isVisible } = useScrollDirection({ threshold: 80, topOffset: 10 });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isAuthenticated = !!session?.user;
  const [avatarUrl, setAvatarUrl] = useState(session?.user?.avatar);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    setIsDropdownOpen(false);
    setIsSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleAvatarChange = (event: CustomEvent) => {
      setAvatarUrl(event.detail.avatar);
    };

    window.addEventListener(
      "avatarChanged",
      handleAvatarChange as EventListener
    );

    return () => {
      window.removeEventListener(
        "avatarChanged",
        handleAvatarChange as EventListener
      );
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const links = [
    {
      name: "Inicio",
      href: "/",
      icon: "mdi:home",
    },
    {
      name: "Amigos",
      href: "/friends",
      icon: "mdi:account-group",
    },
    {
      name: "Juegos",
      href: "/games",
      icon: "mdi:gamepad-variant",
    },
    {
      name: "Ranking",
      href: "/ranking",
      icon: "solar:ranking-bold",
      hover: "hover:text-ranking",
    },
  ];

  const handleDropdownOpen = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSidebarOpen = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-0 left-0 w-full z-50 flex justify-center"
    >
      <div
        className="absolute top-0 left-0 w-full h-full 
                     bg-white/4 backdrop-blur-md
                     border-b-2 border-white/10
                     shadow-lg
                     "
      ></div>

      {/* CONTENEDOR CENTRAL (Ancho y Altura final) */}
      <div
        className="relative w-[95%]
          max-w-350
          mx-4 flex items-center justify-between px-0  py-3"
      >
        {/* Versión móvil (sin cambios) */}
        <div className="flex w-full items-center justify-between md:hidden">
          <div className="flex flex-col items-center">
            <div className="relative flex items-center gap-2">
              <Icon
                icon="quill:hamburger-sidebar"
                className={`text-3xl transition-all duration-300 `}
                onClick={handleSidebarOpen}
              />
              {session?.user?.avatar ? (
                <Image
                  key={avatarUrl}
                  src={avatarUrl!}
                  alt={session?.user?.name ?? "Avatar"}
                  width={48}
                  height={48}
                  className="rounded-full border-2 border-[var(--light-blue)] shadow-[0_0_8px_rgba(76,201,240,0.4)]"
                />
              ) : (
                <div className="h-12 w-12 border border-white/10 rounded-full overflow-hidden bg-background flex items-center justify-center">
                  <Icon icon="mdi:user" width="28" className="text-font" />
                </div>
              )}
            </div>
          </div>
          <AnimatePresence>
            {isSidebarOpen && (
              <SidebarMobile
                closeSidebar={handleSidebarOpen}
                isAuthenticated={isAuthenticated}
                avatar={session?.user?.avatar}
                nickname={session?.user?.nickname}
                email={session?.user?.email}
                name={session?.user?.name}
              />
            )}
          </AnimatePresence>
          <div className="flex justify-center">
            <Image
              src="/logos/sanya-logo-1.webp"
              alt="Logo"
              width={100}
              height={100}
            />
          </div>

          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md border border-[var(--light-blue)] bg-[var(--light-blue)]/10 text-white text-sm font-semibold shadow-[0_0_6px_rgba(76,201,240,0.4)]">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            {users}
          </div>
        </div>

        <div className="hidden md:flex w-full items-center">
          <div className="flex items-center space-x-2 md:w-25 lg:w-32">
            <Link href="/">
              <Image
                src="/logos/sanya-logo-1.webp"
                alt="Logo"
                width={100}
                height={100}
              />
            </Link>
          </div>
          <nav
            className={`flex items-center ${
              isAuthenticated ? "max-w-[70%]" : "max-w-[75%]"
            } gap-14 text-white font-semibold text-sm mx-auto justify-between`}
          >
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`flex items-center gap-2 ${
                  link.hover || "hover:text-light-blue "
                } cursor-pointer transition-colors duration-300 ease-in-out`}
              >
                <Icon icon={link.icon} className="text-lg" />
                {link.name}
              </a>
            ))}
          </nav>

          {!isAuthenticated && (
            <div ref={dropdownRef} className="relative">
              <div
                onClick={handleDropdownOpen}
                className="flex items-center gap-2 cursor-pointer w-25"
              >
                <Icon
                  icon="solar:user-circle-bold"
                  className="text-5xl cursor-pointer"
                />
                <Icon
                  icon="rivet-icons:chevron-up"
                  className={`text-base transition-all duration-300 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
              <AnimatePresence>
                {isDropdownOpen && <AuthDropdown />}
              </AnimatePresence>
            </div>
          )}

          <div className="flex items-center gap-4 justify-end">
            {isAuthenticated && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-md border border-[var(--light-blue)] bg-[var(--light-blue)]/10 text-white text-xs font-semibold shadow-[0_0_6px_rgba(76,201,240,0.4)]">
                <span className="w-2 h-2 rounded-full bg-light-success"></span>
                {users}
              </div>
            )}
            {isAuthenticated && (
              <div className="flex flex-col items-center text-center">
                <div
                  ref={dropdownRef}
                  className="flex items-center gap-2 cursor-pointer relative"
                >
                  <div
                    onClick={handleDropdownOpen}
                    className="flex items-center gap-2"
                  >
                    {session?.user?.avatar ? (
                      <Image
                        key={avatarUrl}
                        src={avatarUrl!}
                        alt={session?.user?.name ?? "Avatar"}
                        width={44}
                        height={44}
                        className="rounded-full border-2 border-[var(--light-blue)] shadow-[0_0_8px_rgba(76,201,240,0.4)]"
                      />
                    ) : (
                      <div className="h-11 w-11 border border-white/10 rounded-full overflow-hidden bg-background flex items-center justify-center">
                        <Icon icon="mdi:user" className="text-font text-2xl" />
                      </div>
                    )}
                    <Icon
                      icon="rivet-icons:chevron-up"
                      className={`text-base transition-all duration-300 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <ProfileDropdown
                        avatar={avatarUrl!}
                        username={session?.user?.username}
                        email={session?.user?.email}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
