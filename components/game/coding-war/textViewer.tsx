"use client";

import Dragonhead from "./icons";
import { useSocketContext } from "@/app/games/coding-war/provider/SocketContext";
import jsonData from "@/public/textTest.json";

export default function TextViewer() {
  const { joined, leave } = useSocketContext();
  const code = jsonData.text;

  return (
    <div className="w-full">
      {/* Leave button */}
      <div className="w-full flex justify-end mb-4">
        <button
          onClick={() => leave("main")}
          className="btn-gradient-one text-white font-semibold py-2 px-6 rounded-lg shadow-[0_0_12px_var(--transparent-purple)]
                     transition-all duration-300 hover:scale-[1.05] hover:shadow-[0_0_18px_var(--shadow-purple)]
                     focus:outline-none focus:ring-2 focus:ring-[var(--light-purple)]"
        >
          Leave
        </button>
      </div>

      {/* GAME */}
      <main
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start"
      >
        {/* Left Panel - Player 1 */}
        <section className="flex flex-col">
          <div className="rounded-lg overflow-hidden border border-white/10 bg-gradient-to-br from-black/50 to-black/30 p-3">
            <div className="text-xs text-white/60 mb-2">Player 1</div>
            <pre className="bg-transparent p-3 rounded-md overflow-auto text-sm whitespace-pre-wrap break-words">
              {code}
            </pre>
          </div>

          <input
            type="text"
            inputMode="text"
            autoComplete="off"
            aria-label="Player 1 input"
            className="mt-3 bg-black/40 border border-gray-700 text-gray-200 px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition w-full"
          />
        </section>

        {/* Center Panel - Scoreboard */}
        <section className="flex flex-col items-center justify-center bg-gradient-to-b from-gray-900/80 to-black/60 border border-white/10 p-6 rounded-2xl">
          <Dragonhead />
          <h1 className="text-indigo-400 text-4xl font-semibold mt-4 mb-2">
            SCORE
          </h1>

          <div className="w-48 bg-black/30 rounded-lg p-4 mt-3">
            <div className="flex justify-between text-sm text-white/60 mb-2">
              <span>Player 1</span>
              <span className="text-green-400 font-medium">test</span>
            </div>
            <div className="flex justify-between text-sm text-white/60">
              <span>Player 2</span>
              <span className="text-green-400 font-medium">test</span>
            </div>
          </div>
        </section>

        {/* Right Panel - Player 2 */}
        <section className="flex flex-col">
          <div className="rounded-lg overflow-hidden border border-white/10 bg-gradient-to-br from-black/50 to-black/30 p-3">
            <div className="text-xs text-white/60 mb-2">Player 2</div>
            <pre className="bg-transparent p-3 rounded-md overflow-auto text-sm whitespace-pre-wrap break-words">
              {code}
            </pre>
          </div>

          <input
            type="text"
            inputMode="text"
            autoComplete="off"
            aria-label="Player 2 input"
            className="mt-3 bg-black/40 border border-gray-700 text-gray-200 px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition w-full"
          />
        </section>
      </main>
    </div>
  );
}
