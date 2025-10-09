"use client";

import Room from "@/components/game/coding-war/room";
import TextViewer from "@/components/game/coding-war/textViewer";
import {
  SocketProvider,
  useSocketContext,
} from "@/app/games/coding-war/provider/SocketContext";

function CodingWarContent() {
  const { joined } = useSocketContext();

  return (
    <div className="max-h-screen flex flex-col bg-gradient-one text-[var(--font-light)]">
      {/* HEADER */}
      <header className="backdrop-blur-md bg-white/5 border-b border-[var(--transparent-purple)] shadow-[0_0_15px_var(--transparent-blue)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="text-3xl animate-[vibrate-1_1s_ease-in-out_infinite]">⚔️</div>
            <h1 className="text-2xl font-bold text-[var(--bright-purple)] drop-shadow-[0_0_10px_var(--transparent-purple)]">
              CodingWar
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex gap-6">
            <a
              href="#"
              className="text-[var(--font-medium)] hover:text-[var(--light-blue)] transition-colors duration-200"
            >
              Home
            </a>
            <a
              href="#"
              className="text-[var(--font-medium)] hover:text-[var(--light-blue)] transition-colors duration-200"
            >
              Leaderboard
            </a>
            <a
              href="#"
              className="text-[var(--font-medium)] hover:text-[var(--light-blue)] transition-colors duration-200"
            >
              Profile
            </a>
          </nav>
        </div>
      </header>

      {/* MAIN */}
      <main className="">
        <section className="">
          {joined ? (
            <div className="w-full">
              <TextViewer />
            </div>
          ) : (
            <div className="">
              <Room />
            </div>
          )}
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[var(--transparent-purple)] bg-white/5 backdrop-blur-md py-4 text-center text-sm text-[var(--font-medium)]">
        © 2025 <span className="text-[var(--bright-purple)] font-semibold">CodingWar</span> — Built
        with Next.js & Socket.io
      </footer>
    </div>
  );
}

export default function CodingWarLayout() {
  return (
    <SocketProvider>
      <CodingWarContent />
    </SocketProvider>
  );
}
