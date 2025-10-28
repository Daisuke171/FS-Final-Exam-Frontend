import Image from "next/image";
import IconBtn from "../IconBtn";

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16">
      <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src="/logo.svg" alt="Logo" width={42} height={42} />
        </div>

        {/* Tabs desktop: ocultas en mobile, las mismas tabs se renderizan también abajo (BottomNav) */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <a className="px-3 py-1.5 rounded-lg bg-cyan-400/15 border border-cyan-300/30">Amigos</a>
          <a className="px-3 py-1.5 rounded-lg border border-transparent hover:border-cyan-300/30">Salas</a>
          <a className="px-3 py-1.5 rounded-lg border border-transparent hover:border-cyan-300/30">Juegos</a>
          <a className="px-3 py-1.5 rounded-lg text-yellow-300">Ranking</a>
          <span className="ml-6 px-3 py-1.5 rounded-lg border border-cyan-300/30 bg-cyan-300/10">1250</span>
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <IconBtn icon="mdi:account-circle" label="Perfil" className="w-10 h-10 rounded-full" />
        </div>
      </div>
    </header>
  );
}
