"use client";

import Dragonhead from "./icons";
import { useSocketContext } from "@/app/games/coding-war/provider/SocketContext";
import jsonData from "@/public/textTest.json";

export default function TextViewer() {
  const { joined, leave } = useSocketContext();
  const code = jsonData.text;

  return (
    <div className="">
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
        className="flex flex-row"
      >
        {/* Left Panel - Player 1 */}
        <section className="">
          <div className="">
            <h2 className="">Player 1</h2>
            <pre className="">
              {code}
            </pre>
            <input
              type="text"
              inputMode="text"
              autoComplete="off"
              aria-label="Player 1 input"
              className=""
              placeholder="Type your code..."
            />
          </div>
        </section>

        {/* Center Panel - Scoreboard */}
        <div
          className=""
        >
          <div className="mb-4">
            <Dragonhead />
          </div>
          <h1 className="">
            SCORE
          </h1>

          <div className="">
            <div className="">
              <span className="">Player 1</span>
              <span>0</span>
            </div>
            <div className="">
              <span className="">Player 2</span>
              <span>0</span>
            </div>
          </div>
        </div>

        {/* Right Panel - Player 2 */}
        <section className="">
          <div className="">
            <h2 className="">Player 2</h2>
            <pre className="">
              {code}
            </pre>
            <input
              type="text"
              inputMode="text"
              autoComplete="off"
              aria-label="Player 2 input"
              className=""
              placeholder="Type your code..."
            />
          </div>
        </section>
      </main>
    </div>
  );
}
