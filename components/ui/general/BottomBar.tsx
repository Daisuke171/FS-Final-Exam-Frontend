"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";

const blueGlowStyle = {
  filter:
    "drop-shadow(0 0 5px rgba(76, 201, 240, 0.8)) drop-shadow(0 0 10px rgba(76, 201, 240, 0.4))",
  color: "inherit",
};

// Estilo para el glow dorado (manteniendo el anterior)
const goldGlowStyle = {
  filter:
    "drop-shadow(0 0 5px rgba(253, 230, 138, 0.8)) drop-shadow(0 0 10px rgba(253, 230, 138, 0.4))",
  color: "inherit",
};

const links = [
  {
    name: "Inicio",
    href: "/",
    icon: {
      img: "material-symbols:home",
      style: blueGlowStyle,
    },
    styles:
      "text-light-blue text-xl p-2 rounded-lg hover:bg-shadow-blue/50 transition",
  },
  {
    name: "Juegos",
    href: "/games",
    icon: {
      img: "mingcute:game-2-fill",
      style: blueGlowStyle,
    },
    styles:
      "text-light-blue text-xl p-2 rounded-lg hover:bg-shadow-blue/50 transition",
  },
  {
    name: "Amigos",
    href: "/friends",
    icon: {
      img: "fa-solid:user-friends",
      style: blueGlowStyle,
    },
    styles:
      "text-light-blue text-xl p-2 rounded-lg hover:bg-shadow-blue/50 transition",
  },
  {
    name: "Clasificaciones",
    href: "/ranking",
    icon: {
      img: "solar:ranking-bold",
      style: goldGlowStyle,
    },
    styles:
      "text-ranking text-xl p-2 rounded-lg hover:bg-shadow-ranking/60 transition",
  },
];

export default function BottomBar() {
  // Estilo para el glow celeste, basado en tu barra superior

  return (
    <div className="bottom-bar-mobile">
      {/* HOME: Color y glow celeste */}
      {links.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className={link.styles}
        >
          <Icon
            icon={link.icon.img}
            style={link.icon.style}
            className="text-2xl"
          />
        </Link>
      ))}
    </div>
  );
}
