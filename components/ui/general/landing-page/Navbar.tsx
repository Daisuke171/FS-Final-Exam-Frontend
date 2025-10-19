"use client";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";

interface NavbarProps {
  username: string;
  avatar: string;
  users: number;
}

export default function Navbar({ username, avatar, users }: NavbarProps) {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-center">
      <div
        className="absolute top-0 left-0 w-full h-full 
                     bg-[rgba(25,20,40,0.95)] backdrop-blur-md
                     border-b border-[var(--light-blue)]/30
                     shadow-[0_0_20px_rgba(76,201,240,0.2)]"
      ></div>

      {/* CONTENEDOR CENTRAL (Ancho y Altura final) */}
      <div
        className="relative w-full 
          max-w-[1024px] 
          lg:max-w-5xl 
          xl:max-w-7xl 
          mx-4 md:mx-8 lg:mx-16 flex items-center justify-between px-3 py-1.5"
      >
        {/* Versión móvil (sin cambios) */}
        <div className="flex w-full items-center justify-between md:hidden">
          <div className="flex flex-col items-center">
            <Image
              src={avatar}
              alt={username}
              width={30}
              height={30}
              className="rounded-full border-2 border-[var(--light-blue)] shadow-[0_0_8px_rgba(76,201,240,0.4)]"
            />
            <p
              className="text-white text-[9px] font-semibold mt-0.5"
              style={{
                textShadow:
                  "0 0 6px rgba(76, 201, 240, 0.8), 0 0 10px rgba(76, 201, 240, 0.4)",
              }}
            >
              {username}
            </p>
          </div>

          <div className="flex justify-center">
            <Image src="/Sanya-logo.png" alt="Logo" width={40} height={40} />
          </div>

          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md border border-[var(--light-blue)] bg-[var(--light-blue)]/10 text-white text-sm font-semibold shadow-[0_0_6px_rgba(76,201,240,0.4)]">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            {users}
          </div>
        </div>

        {/* Versión desktop con centrado simétrico RESTAURADO */}
        <div className="hidden md:flex w-full items-center justify-between">
          {/* Bloque Izquierdo (Logo): RESTAURAMOS w-40 para simetría */}
          <div className="flex items-center space-x-2 w-40">
            <Image src="/Sanya-logo.png" alt="Logo" width={45} height={45} />
          </div>

          {/* NAVEGACIÓN: RESTAURAMOS justify-center, AUMENTAMOS GAPS y limitamos w-auto */}
          <nav className="flex items-center gap-16 lg:gap-20 xl:gap-24 text-white font-semibold text-xs mx-auto justify-center">
            {/* INICIO */}
            <a
              href="/"
              className="flex items-center gap-2 hover:text-[var(--light-blue)] transition-all hover:scale-105 hover-blue-glow"
            >
              <Icon icon="mdi:home" width="18" />
              Inicio
            </a>

            {/* AMIGOS */}
            <a
              href="#amigos"
              className="flex items-center gap-2 hover:text-[var(--light-blue)] transition-all hover:scale-105 hover-blue-glow"
            >
              <Icon icon="mdi:account-group" width="18" />
              Amigos
            </a>

            {/* JUEGOS */}
            <a
              href="/games"
              className="flex items-center gap-2 hover:text-[var(--light-blue)] transition-all hover:scale-105 hover-blue-glow"
            >
              <Icon icon="mdi:gamepad-variant" width="18" />
              Juegos
            </a>

            {/* RANKING */}
            <a
              href="/ranking"
              className="flex items-center gap-2 hover:text-yellow-300 transition-all hover:scale-105 hover-gold-glow"
            >
              <Icon icon="mdi:trophy" width="18" />
              Ranking
            </a>
          </nav>

          {/* Bloque Derecho (Usuario + Conectados): RESTAURAMOS w-40 para simetría */}
          <div className="flex items-center gap-4 w-40 justify-end">
            {/* Contador desktop: usa text-xs */}
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md border border-[var(--light-blue)] bg-[var(--light-blue)]/10 text-white text-xs font-semibold shadow-[0_0_6px_rgba(76,201,240,0.4)]">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              {users}
            </div>

            {/* Nombre de Usuario desktop: usa text-[9px] */}
            <Link href="/profile">
              <div className="flex flex-col items-center text-center">
                <Image
                  src={avatar}
                  alt={username}
                  width={30}
                  height={30}
                  className="rounded-full border-2 border-[var(--light-blue)] shadow-[0_0_8px_rgba(76,201,240,0.4)]"
                />
                <p
                  className="text-white text-[9px] font-semibold mt-0.5"
                  style={{
                    textShadow:
                      "0 0 6px rgba(76, 201, 240, 0.8), 0 0 10px rgba(76, 201, 240, 0.4)",
                  }}
                >
                  {username}
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
