"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/ui/general/landing-page/Navbar";

const MOCK_NAV_PROPS = {
  username: "Nombre",
  avatar: "/default-pfp.jpg",
  users: 124,
};

const games = [
  {
    key: "coding-war",
    title: "Coding War",
    description: "Compite tipeando código en tiempo real.",
    href: "/games/coding-war",
    image: "/images/placeholder/bg-placeholder.jpg",
    badge: "Nuevo",
  },
  {
    key: "rock-paper-scissors",
    title: "Piedra Papel Tijera",
    description: "Clásico duelo al mejor de 3.",
    href: "/games/rock-paper-scissors",
    image: "/images/placeholder/bg-placeholder.jpg",
    badge: "Popular",
  },
];

export default function GamesHub() {
  return (
    <>
      <Navbar {...MOCK_NAV_PROPS} />
      <div className="min-h-screen bg-gradient-one pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-font">Juegos</h1>
            <p className="text-subtitle">Elige un juego para empezar</p>
          </header>

          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((g) => (
              <Link
                key={g.key}
                href={g.href}
                className="group relative rounded-xl overflow-hidden border border-white/10 hover:shadow-[0_0_20px_var(--shadow-purple)] transition min-h-48 md:min-h-56"
              >
                {/* Background image */}
                <Image
                  src={g.image}
                  alt={g.title}
                  fill
                  priority={false}
                  className="object-cover absolute inset-0 scale-100 group-hover:scale-105 transition duration-300"
                />
                {/* Dark gradient overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/20" />

                {/* Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-400/30">
                    {g.badge}
                  </span>
                </div>
                {/* Foreground content */}
                <div className="relative z-10 flex flex-col justify-end w-full h-full px-4 pb-4 pt-20">
                  <h2 className="text-lg font-semibold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]">
                    {g.title}
                  </h2>
                  <p className="text-sm text-white/80">
                    {g.description}
                  </p>
                </div>
              </Link>
            ))}
          </section>
        </div>
      </div>
    </>
  );
}
