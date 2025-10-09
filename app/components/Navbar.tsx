import { Icon } from "@iconify/react";
import Image from "next/image";

interface NavbarProps {
  username: string;
  avatar: string;
  users: number;
}

export default function Navbar({ username, avatar, users }: NavbarProps) {
  return (
    <header className="navbar-glass fixed top-0 left-0 w-full z-50 flex justify-center px-3 py-1">
      <div className="w-full max-w-6xl flex items-center justify-between">
        {/* --- Versión móvil --- */}
        <div className="flex w-full items-center justify-between md:hidden">
          {/* Usuario */}
          <div className="flex flex-col items-center">
            <Image
              src={avatar}
              alt={username}
              width={35}
              height={35}
              className="rounded-full border border-[var(--light-blue)] shadow-[0_0_8px_rgba(76,201,240,0.4)]"
            />
            <p
              className="text-white text-xs font-semibold mt-1"
              style={{
                textShadow:
                  "0 0 6px rgba(76, 201, 240, 0.8), 0 0 10px rgba(76, 201, 240, 0.4)",
              }}
            >
              {username}
            </p>
          </div>

          {/* Logo */}
          <div className="flex justify-center">
            <Image
              src="/Sanya-logo.jpeg"
              alt="Logo"
              width={50}
              height={50}
              className="rounded-full"
            />
          </div>

          {/* Usuarios conectados */}
          <div className="px-3 py-1 rounded-lg border border-[var(--light-blue)] bg-[var(--light-blue)]/10 text-white text-sm font-semibold">
            {users}
          </div>
        </div>

        {/* --- Versión tablet / desktop --- */}
        <div className="hidden md:flex w-full items-center justify-between">
          {/* Logo a la izquierda */}
          <div className="flex items-center space-x-2">
            <Image
              src="/Sanya-logo.jpeg"
              alt="Logo"
              width={55}
              height={55}
              className="rounded-full"
            />
          </div>

          {/* Botones centrales con iconos */}
          <nav className="flex items-center gap-20 text-white font-semibold text-sm mx-auto">
            <a
              href="#amigos"
              className="flex items-center gap-2 hover:text-[var(--light-blue)] transition-colors"
            >
              <Icon icon="mdi:account-group" color="var(--light-blue)" width="20" />
              Amigos
            </a>

            <a
              href="#juegos"
              className="flex items-center gap-2 hover:text-[var(--light-blue)] transition-colors"
            >
              <Icon icon="mdi:gamepad-variant" color="var(--light-blue)" width="20" />
              Juegos
            </a>

            <a
              href="#ranking"
              className="flex items-center gap-2 hover:text-[var(--light-blue)] transition-colors"
            >
              <Icon icon="mdi:trophy" color="var(--light-blue)" width="20" />
              Ranking
            </a>
          </nav>

          {/* Conectados + usuario */}
          <div className="flex items-center gap-6">
            {/* Conectados */}
            <div className="px-3 py-1 rounded-lg border border-[var(--light-blue)] bg-[var(--light-blue)]/10 text-white text-sm font-semibold">
              {users}
            </div>

            {/* Usuario */}
            <div className="flex flex-col items-center text-center">
              <Image
                src={avatar}
                alt={username}
                width={35}
                height={35}
                className="rounded-full border border-[var(--light-blue)] shadow-[0_0_8px_rgba(76,201,240,0.4)]"
              />
              <p
                className="text-white text-xs font-semibold mt-1"
                style={{
                  textShadow:
                    "0 0 6px rgba(76, 201, 240, 0.8), 0 0 10px rgba(76, 201, 240, 0.4)",
                }}
              >
                {username}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
