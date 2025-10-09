"use client";

import { useSocketContext } from "@/app/games/coding-war/provider/SocketContext";

export default function Room() {
  const { joined, join } = useSocketContext();

  return (
    <main className="flex items-center justify-center min-h-screen px-4">
      <div className="glass-box-one max-w-md w-full text-center text-[var(--font-light)] shadow-[0_0_30px_var(--transparent-blue)] animate-[glow_2s_ease-in-out_infinite]">
        <h1 className="text-3xl font-bold mb-4 text-[var(--bright-purple)]">
          {joined ? "You joined the Room 🎉" : "Welcome to the Lobby"}
        </h1>

        <p className="text-[var(--font-medium)] mb-8">
          {joined
            ? "You are now connected to the main room."
            : "Join our main room to chat and hang out."}
        </p>

        {!joined && (
          <button
            onClick={() => join("main")}
            aria-label="Join main room"
            className="btn-gradient-one text-white font-semibold py-2.5 px-6 rounded-xl
                       shadow-[0_0_12px_var(--transparent-purple)]
                       transition-all duration-300
                       hover:scale-[1.03] hover:shadow-[0_0_20px_var(--shadow-purple)]
                       focus:outline-none focus:ring-2 focus:ring-[var(--light-purple)]"
          >
            Join Room
          </button>
        )}
      </div>
    </main>
  );
}
