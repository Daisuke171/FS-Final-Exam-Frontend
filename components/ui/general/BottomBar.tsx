"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";

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
      active: "text-light-blue drop-shadow-[0_0_14px_var(--color-medium-blue)]",
      borderColor: "bg-light-blue",
    },
    {
      name: "Juegos",
      href: "/games",
      icon: {
        img: "streamline:desktop-game-solid",
      },
      styles: "text-2xl",
      active:
        "text-bright-purple drop-shadow-[0_0_14px_var(--color-hover-purple)]",
      borderColor: "bg-bright-purple",
    },
    {
      name: "Amigos",
      href: "/friends",
      icon: {
        img: "teenyicons:users-solid",
      },
      styles: "text-2xl",
      active: "text-success drop-shadow-[0_0_14px_var(--color-shadow-success)]",
      borderColor: "bg-success",
    },
    {
      name: "Ranking",
      href: "/ranking",
      icon: {
        img: "icomoon-free:trophy",
      },
      styles: "text-2xl",
      active: "text-ranking drop-shadow-[0_0_14px_var(--color-shadow-ranking)]",
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
            className="h-17 flex items-center justify-center relative rounded-full "
            whileTap={{
              scale: 0.95,
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            }}
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className={`absolute top-0 left-0 right-0 h-0.5 ${link.borderColor}`}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
              />
            )}
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
