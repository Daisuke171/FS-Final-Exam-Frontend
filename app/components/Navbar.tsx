"use client";
import { Icon } from "@iconify/react";
import Image from "next/image";

interface NavbarProps {
  username: string;
  avatar: string;
  users: number;
}

export default function Navbar({ username, avatar, users }: NavbarProps) {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-center">
      {/* Fondo semi-opaco con blur y glow */}
      <div
        className="absolute top-0 left-0 w-full h-full 
                   bg-[rgba(25,20,40,0.95)] backdrop-blur-md
                   border-b border-[var(--light-blue)]/30
                   shadow-[0_0_20px_rgba(76,201,240,0.2)]"
      ></div>

      {/* Contenedor acoplado al main */}
      <div className="relative w-full max-w-6xl mx-4 md:mx-8 lg:mx-16 flex items-center justify-between px-3 py-1">
        
        {/* --- Versión móvil --- */}
        <div className="flex w-full items-center justify-between md:hidden">
          {/* Usuario */}
          <div className="flex flex-col items-center">
            <Image
              src={avatar}
              alt={username}
              width={36}
              height={36}
              className="rounded-full border-2 border-[var(--light-blue)] shadow-[0_0_8px_rgba(76,201,240,0.4)]"
            />
            <p className="text-white text-[10px] font-semibold mt-1"
               style={{ textShadow: "0 0 6px rgba(76, 201, 240, 0.8), 0 0 10px rgba(76, 201, 240, 0.4)" }}>
              {username}
            </p>
          </div>

          {/* Logo */}
          <div className="flex justify-center">
            <Image src="/Sanya-logo.png" alt="Logo" width={40} height={40} />
          </div>

          {/* Conectados */}
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md border border-[var(--light-blue)] bg-[var(--light-blue)]/10 text-white text-sm font-semibold shadow-[0_0_6px_rgba(76,201,240,0.4)]">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            {users}
          </div>
        </div>

        {/* --- Versión desktop --- */}
        <div className="hidden md:flex w-full items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Image src="/Sanya-logo.png" alt="Logo" width={45} height={45} />
          </div>

          {/* Navegación */}
          <nav className="flex items-center gap-16 text-white font-semibold text-sm mx-auto">
            <a href="#amigos" className="flex items-center gap-2 hover:text-[var(--light-blue)] transition-all hover:scale-105">
              <Icon icon="mdi:account-group" color="var(--light-blue)" width="18" />
              Amigos
            </a>
            <a href="#juegos" className="flex items-center gap-2 hover:text-[var(--light-blue)] transition-all hover:scale-105">
              <Icon icon="mdi:gamepad-variant" color="var(--light-blue)" width="18" />
              Juegos
            </a>
            <a href="#ranking" className="flex items-center gap-2 hover:text-[var(--light-blue)] transition-all hover:scale-105">
              <Icon icon="mdi:trophy" color="var(--light-blue)" width="18" />
              Ranking
            </a>
          </nav>

          {/* Conectados + Usuario */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md border border-[var(--light-blue)] bg-[var(--light-blue)]/10 text-white text-sm font-semibold shadow-[0_0_6px_rgba(76,201,240,0.4)]">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              {users}
            </div>

            <div className="flex flex-col items-center text-center">
              <Image
                src={avatar}
                alt={username}
                width={36}
                height={36}
                className="rounded-full border-2 border-[var(--light-blue)] shadow-[0_0_8px_rgba(76,201,240,0.4)]"
              />
              <p className="text-white text-[10px] font-semibold mt-1"
                 style={{ textShadow: "0 0 6px rgba(76, 201, 240, 0.8), 0 0 10px rgba(76, 201, 240, 0.4)" }}>
                {username}
              </p>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}
