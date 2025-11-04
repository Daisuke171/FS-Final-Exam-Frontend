"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";

export default function BottomBar() {
  const pathname = usePathname();

  const links = [
    {
      name: "Inicio",
      href: "/",
      icon: {
        img: "ion:home",
      },
      styles: "text-[28px]",
      active: "text-light-blue",
      borderColor: "bg-light-blue",
    },
    {
      name: "Juegos",
      href: "/games",
      icon: {
        img: "streamline:desktop-game-solid",
      },
      styles: "text-2xl",
      active: "text-bright-purple",
      borderColor: "bg-bright-purple",
    },
    {
      name: "Amigos",
      href: "/friends",
      icon: {
        img: "teenyicons:users-solid",
      },
      styles: "text-2xl",
      active: "text-success",
      borderColor: "bg-success",
    },
    {
      name: "Ranking",
      href: "/ranking",
      icon: {
        img: "icomoon-free:trophy",
      },
      styles: "text-2xl",
      active: "text-ranking",
      borderColor: "bg-ranking shadow",
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full flex items-center border-t border-white/6 justify-around z-40 bg-black-blue backdrop-blur-md">
      {links.map((link) => {
        const isActive =
          link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
        const activeClass = isActive ? link.active : "";
        return (
          <motion.div
            key={link.name}
            className="h-17 flex relative items-center justify-center rounded-full "
            whileTap={{
              scale: 0.85,
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            }}
          >
            <AnimatePresence>
              {isActive && (
                <motion.div
                  className={`absolute top-0 left-0 right-0 h-0.5 ${link.borderColor}`}
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  exit={{ scaleX: 0, opacity: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                  }}
                />
              )}
            </AnimatePresence>
            <Link
              href={link.href}
              className={`${link.styles} w-17 py-2 px-3 text-subtitle flex flex-col items-center gap-1`}
            >
              <Icon
                icon={link.icon.img}
                className={`${activeClass} transition-all`}
              />
              <p className={`${activeClass} transition-all text-xs`}>
                {link.name}
              </p>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
