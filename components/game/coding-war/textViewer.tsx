"use client";

import React, { useEffect, useRef, useState } from "react";
import Dragonhead from "./icons";
import { useSocketContext } from "@/app/games/coding-war/provider/SocketContext";
import jsonData from "@/public/textTest.json";

type TypingStats = {
  wpm: number;
  accuracy: number;
  correctChars: number;
  typedChars: number;
  finished: boolean;
};

function calcWpm(correctChars: number, elapsedSeconds: number) {
  if (elapsedSeconds <= 0) return 0;
  const words = correctChars / 5;
  return Math.round((words / (elapsedSeconds / 60)) || 0);
}

function calcAccuracy(correctChars: number, typedChars: number) {
  if (typedChars <= 0) return 100;
  return Math.round((correctChars / typedChars) * 100);
}

function TypingPanel({
  label,
  text,
  onUpdate,
}: {
  label: string;
  text: string;
  onUpdate: (stats: TypingStats) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [typed, setTyped] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [correctChars, setCorrectChars] = useState(0);
  const [typedChars, setTypedChars] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    if (!startTime && value.length > 0) setStartTime(Date.now());
    setTyped(value);
    const typedLen = value.length;
    setTypedChars(typedLen);

    let correct = 0;
    for (let i = 0; i < typedLen && i < text.length; i++) {
      if (value[i] === text[i]) correct++;
    }
    setCorrectChars(correct);

    if (typedLen >= text.length) setFinished(true);
  }

  const elapsed = startTime ? (Date.now() - startTime) / 1000 : 0;
  const wpm = calcWpm(correctChars, elapsed);
  const accuracy = calcAccuracy(correctChars, typedChars);

  useEffect(() => {
    onUpdate({ wpm, accuracy, correctChars, typedChars, finished });
  }, [wpm, accuracy, correctChars, typedChars, finished]);

  return (
    <section className="flex flex-col">
      <div className="rounded-lg overflow-hidden border border-white/10 bg-gradient-to-br from-black/50 to-black/30 p-3">
        <div className="text-xs text-white/60 mb-2">{label}</div>
        <pre className="bg-transparent p-3 rounded-md overflow-auto text-sm whitespace-pre-wrap break-words">
          {text.split("").map((c, i) => {
            const isTyped = i < typed.length;
            const typedChar = typed[i];
            const correct = isTyped && typedChar === c;
            const isCurrent = i === typed.length;
            let color = "text-gray-400";
            if (isTyped) color = correct ? "text-green-400" : "text-red-500";
            if (isCurrent && !finished) color = "text-blue-400";
            return (
              <span key={i} className={color}>
                {c}
              </span>
            );
          })}
        </pre>
      </div>

      <input
        ref={inputRef}
        value={typed}
        onChange={handleChange}
        disabled={finished}
        type="text"
        inputMode="text"
        autoComplete="off"
        aria-label={`${label} input`}
        className="mt-3 bg-black/40 border border-gray-700 text-gray-200 px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition w-full"
      />
    </section>
  );
}

export default function TextViewer() {
  const { leave } = useSocketContext();
  const code = (jsonData.text ?? "").replace(/\r/g, "");

  const [player1Stats, setPlayer1Stats] = useState<TypingStats>({
    wpm: 0,
    accuracy: 100,
    correctChars: 0,
    typedChars: 0,
    finished: false,
  });
  const [player2Stats, setPlayer2Stats] = useState<TypingStats>({
    wpm: 0,
    accuracy: 100,
    correctChars: 0,
    typedChars: 0,
    finished: false,
  });

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

      {/* GAME LAYOUT */}
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Player 1 */}
        <TypingPanel
          label="Player 1"
          text={code}
          onUpdate={setPlayer1Stats}
        />

        {/* Scoreboard */}
        <section className="flex flex-col items-center justify-center bg-gradient-to-b from-gray-900/80 to-black/60 border border-white/10 p-6 rounded-2xl">
          <Dragonhead />
          <h1 className="text-indigo-400 text-4xl font-semibold mt-4 mb-2">
            SCORE
          </h1>

          <div className="w-56 bg-black/30 rounded-lg p-4 mt-3 space-y-2 text-sm text-white/70">
            <div className="flex justify-between">
              <span>Player 1</span>
              <span>
                {player1Stats.wpm} WPM / {player1Stats.accuracy}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Player 2</span>
              <span>
                {player2Stats.wpm} WPM / {player2Stats.accuracy}%
              </span>
            </div>
          </div>
        </section>

        {/* Player 2 */}
        <TypingPanel
          label="Player 2"
          text={code}
          onUpdate={setPlayer2Stats}
        />
      </main>
    </div>
  );
}
