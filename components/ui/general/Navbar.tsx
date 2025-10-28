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
  users: string;
  session: Session | null;
}

interface LinkProps {
  name: string;
  href: string;
  icon: string;
  hover?: string;
  isComingSoon?: boolean;
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

  const links: LinkProps[] = [
    {
      name: "Inicio",
      href: "/",
      icon: "mdi:home",
      hover: "hover:text-bright-purple",
    },
    {
      name: "Amigos",
      href: "/friends",
      icon: "mdi:account-group",
      hover: "hover:text-light-success",
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
    {
      name: "Foro",
      href: "/forum",
      icon: "mdi:forum",
      isComingSoon: true,
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
                     backdrop-blur-md
                     border-b-2 border-white/10
                     shadow-lg
                     "
      ></div>

      {/* CONTENEDOR CENTRAL (Ancho y Altura final) */}
      <div
        className="relative w-full
          max-w-300
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
              {isAuthenticated &&
                (session?.user?.avatar ? (
                  <div className="h-12 w-12 overflow-hidden rounded-full">
                    <Image
                      key={avatarUrl}
                      src={avatarUrl!}
                      alt={session?.user?.name ?? "Avatar"}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-12 w-12 border border-white/10 rounded-full overflow-hidden bg-background flex items-center justify-center">
                    <Icon
                      icon="mdi:user"
                      width="28"
                      className="text-font"
                    />
                  </div>
                ))}
            </div>
          </div>
          <AnimatePresence>
            {isSidebarOpen && (
              <SidebarMobile
                closeSidebar={handleSidebarOpen}
                isAuthenticated={isAuthenticated}
                avatar={avatarUrl}
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
              priority
              style={{ width: "auto", height: "auto" }}
            />
          </div>

          <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-transparent-success/90 text-font text-base font-semibold">
            <Icon
              icon="gridicons:user"
              className="text-xl text-light-success"
            />
            {users}
          </div>
        </div>

        <div className="hidden md:flex w-full items-center">
          <Link
            className={`flex items-center ${
              isAuthenticated ? "w-38.5" : "w-25"
            }`}
            href="/"
          >
            <Image
              src="/logos/sanya-logo-1.webp"
              alt="Logo"
              width={100}
              height={100}
              priority
              style={{ width: "auto", height: "auto" }}
            />
          </Link>

          <nav
            className={`flex items-center ${
              isAuthenticated ? "max-w-[70%]" : "max-w-[75%]"
            } gap-5 lg:gap-8 text-font font-semibold text-sm mx-auto justify-between`}
          >
            {links.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              // 2. Define la clase de hover y la de activo
              const hoverClass = link.hover || "hover:text-light-blue";
              const activeClass = (
                link.hover || "hover:text-light-blue"
              ).replace("hover:", "");
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center py-3  px-4 gap-2 rounded-lg cursor-pointer ${
                    link.isComingSoon && "opacity-50 pointer-events-none"
                  } transition-colors duration-300 ease-in-out ${
                    isActive ? `${activeClass + " bg-white/4"}` : hoverClass
                  }`}
                >
                  <Icon
                    icon={link.icon}
                    className="text-lg"
                  />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {!isAuthenticated && (
            <div
              ref={dropdownRef}
              className="relative"
            >
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
              <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-transparent-success/90 text-font text-base font-semibold">
                <Icon
                  icon="gridicons:user"
                  className="text-xl text-light-success"
                />
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
                      <div className="h-11 w-11  flex items-center justify-center rounded-full overflow-hidden">
                        <Image
                          key={avatarUrl}
                          src={avatarUrl!}
                          alt={session?.user?.name ?? "Avatar"}
                          width={44}
                          height={44}
                          className="object-cover h-full w-full"
                        />
                      </div>
                    ) : (
                      <div className="h-11 w-11 border border-white/10 rounded-full overflow-hidden bg-background flex items-center justify-center">
                        <Icon
                          icon="mdi:user"
                          className="text-font text-2xl"
                        />
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
