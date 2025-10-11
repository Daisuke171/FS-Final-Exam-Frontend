"use client";

import { useState, useMemo } from "react";
import Dragonhead from "./icons";
import { useSocketContext } from "@/app/games/coding-war/provider/SocketContext";
import jsonData from "@/public/textTest.json";

export default function TextViewer() {
  const { leave } = useSocketContext();
  const code = jsonData.text;

  // Split code into lines
  const originalLines = useMemo(() => code.split("\n"), [code]);
  const trimmedLines = useMemo(
    () => originalLines.map((line) => line.trim()),
    [originalLines]
  );

  // Helpers
  const getIndentLength = (line: string) =>
    line.match(/^[\t ]*/)?.[0].length || 0;

  // Player 1 state
  const [currentLineP1, setCurrentLineP1] = useState(0);
  const [inputValueP1, setInputValueP1] = useState("");
  const [scoreP1, setScoreP1] = useState(0);
  const [coloredLinesP1, setColoredLinesP1] = useState<{
    [index: number]: string[];
  }>({});

  // Player 2 state
  const [currentLineP2, setCurrentLineP2] = useState(0);
  const [inputValueP2, setInputValueP2] = useState("");
  const [scoreP2, setScoreP2] = useState(0);
  const [coloredLinesP2, setColoredLinesP2] = useState<{
    [index: number]: string[];
  }>({});

  // === SHARED LOGIC HANDLERS ===

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    player: 1 | 2
  ) => {
    const value = e.target.value;
    const currentLine =
      player === 1 ? currentLineP1 : currentLineP2;
    const fullOriginalLine = originalLines[currentLine];
    const indentLength = getIndentLength(fullOriginalLine);
    const lineWithoutIndent = fullOriginalLine.slice(indentLength);

    const newColoredLine = fullOriginalLine.split("").map((char, i) => {
      if (i < indentLength) return "text-white/90";
      const charIndex = i - indentLength;
      const isCorrect = value[charIndex] === lineWithoutIndent[charIndex];
      return isCorrect
        ? "text-green-400"
        : value[charIndex]
        ? "text-red-400"
        : "text-white/90";
    });

    if (player === 1) {
      setColoredLinesP1((prev) => ({ ...prev, [currentLine]: newColoredLine }));
      setInputValueP1(value);
    } else {
      setColoredLinesP2((prev) => ({ ...prev, [currentLine]: newColoredLine }));
      setInputValueP2(value);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    player: 1 | 2
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const currentLine =
        player === 1 ? currentLineP1 : currentLineP2;
      const fullOriginalLine = originalLines[currentLine];
      const indentLength = getIndentLength(fullOriginalLine);
      const expectedLine = fullOriginalLine.slice(indentLength);
      const inputValue =
        player === 1 ? inputValueP1 : inputValueP2;
      const trimmedInput = inputValue.trimEnd();
      let lineScore = 0;
      let hasErrors = false;

      for (let i = 0; i < trimmedInput.length; i++) {
        if (trimmedInput[i] === expectedLine[i]) lineScore += 1;
        else {
          lineScore -= 0.9;
          hasErrors = true;
        }
      }

      if (trimmedInput === expectedLine) lineScore *= 1.5;
      else if (hasErrors) lineScore *= 1.1;

      if (player === 1) {
        setScoreP1((prev) => prev + lineScore);
      } else {
        setScoreP2((prev) => prev + lineScore);
      }

      const newColoredLine = fullOriginalLine.split("").map((char, i) => {
        if (i < indentLength) return "text-white/90";
        const charIndex = i - indentLength;
        if (charIndex < trimmedInput.length) {
          return trimmedInput[charIndex] === char
            ? "text-green-400"
            : "text-red-400";
        }
        return "text-white/90";
      });

      if (player === 1) {
        setColoredLinesP1((prev) => ({
          ...prev,
          [currentLine]: newColoredLine,
        }));
        setCurrentLineP1((prev) => Math.min(prev + 1, originalLines.length - 1));
        setInputValueP1("");
      } else {
        setColoredLinesP2((prev) => ({
          ...prev,
          [currentLine]: newColoredLine,
        }));
        setCurrentLineP2((prev) => Math.min(prev + 1, originalLines.length - 1));
        setInputValueP2("");
      }
    }
  };

  // === RENDER HELPERS ===

  const renderColoredCode = (
    player: 1 | 2,
    currentLine: number,
    coloredLines: { [index: number]: string[] },
    inputValue: string
  ) => {
    return originalLines.map((line, i) => {
      if (line.trim() === "") {
        return (
          <div key={i} className="leading-relaxed font-mono h-5">
            {""}
          </div>
        );
      }

      if (coloredLines[i]) {
        return (
          <div key={i} className="leading-relaxed whitespace-pre font-mono">
            {line.split("").map((char, idx) => (
              <span key={idx} className={coloredLines[i][idx]}>
                {char}
              </span>
            ))}
          </div>
        );
      }

      if (i === currentLine) {
        const indentLength = getIndentLength(line);
        return (
          <div key={i} className="leading-relaxed whitespace-pre font-mono">
            {line.split("").map((char, idx) => {
              if (idx < indentLength) {
                return (
                  <span key={idx} className="text-white/90">
                    {char}
                  </span>
                );
              }

              const charIndex = idx - indentLength;
              if (charIndex < inputValue.length) {
                const isCorrect = inputValue[charIndex] === line[idx];
                return (
                  <span
                    key={idx}
                    className={isCorrect ? "text-green-400" : "text-red-400"}
                  >
                    {char}
                  </span>
                );
              }

              return (
                <span key={idx} className="text-white/90">
                  {char}
                </span>
              );
            })}
          </div>
        );
      }

      return (
        <div
          key={i}
          className="leading-relaxed whitespace-pre font-mono text-white/90"
        >
          {line}
        </div>
      );
    });
  };

  // === RENDER UI ===

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

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Player 1 */}
        <section className="flex flex-col">
          <div className="rounded-lg overflow-hidden border border-white/10 bg-gradient-to-br from-black/50 to-black/30 p-3">
            <div className="text-xs text-white/60 mb-2">Player 1</div>
            <pre className="bg-transparent p-3 rounded-md overflow-auto text-sm whitespace-pre-wrap break-words font-mono">
              {renderColoredCode(1, currentLineP1, coloredLinesP1, inputValueP1)}
            </pre>
          </div>

          <input
            type="text"
            value={inputValueP1}
            onChange={(e) => handleInputChange(e, 1)}
            onKeyDown={(e) => handleKeyDown(e, 1)}
            inputMode="text"
            autoComplete="off"
            aria-label="Player 1 input"
            placeholder="Type the current line..."
            className="mt-3 bg-black/40 border border-gray-700 text-gray-200 px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition w-full"
          />

          <div className="mt-3 text-indigo-400 text-lg font-semibold">
            Score: {scoreP1.toFixed(2)}
          </div>
        </section>

        {/* Center scoreboard */}
        <section className="flex flex-col items-center justify-center bg-gradient-to-b from-gray-900/80 to-black/60 border border-white/10 p-6 rounded-2xl">
          <Dragonhead />
          <h1 className="text-indigo-400 text-4xl font-semibold mt-4 mb-2">
            SCORE
          </h1>

          <div className="w-48 bg-black/30 rounded-lg p-4 mt-3">
            <div className="flex justify-between text-sm text-white/60 mb-2">
              <span>Player 1</span>
              <span className="text-green-400 font-medium">
                {scoreP1.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm text-white/60">
              <span>Player 2</span>
              <span className="text-green-400 font-medium">
                {scoreP2.toFixed(2)}
              </span>
            </div>
          </div>
        </section>

        {/* Player 2 */}
        <section className="flex flex-col">
          <div className="rounded-lg overflow-hidden border border-white/10 bg-gradient-to-br from-black/50 to-black/30 p-3">
            <div className="text-xs text-white/60 mb-2">Player 2</div>
            <pre className="bg-transparent p-3 rounded-md overflow-auto text-sm whitespace-pre-wrap break-words font-mono">
              {renderColoredCode(2, currentLineP2, coloredLinesP2, inputValueP2)}
            </pre>
          </div>

          <input
            type="text"
            value={inputValueP2}
            onChange={(e) => handleInputChange(e, 2)}
            onKeyDown={(e) => handleKeyDown(e, 2)}
            inputMode="text"
            autoComplete="off"
            aria-label="Player 2 input"
            placeholder="Type the current line..."
            className="mt-3 bg-black/40 border border-gray-700 text-gray-200 px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition w-full"
          />

          <div className="mt-3 text-indigo-400 text-lg font-semibold">
            Score: {scoreP2.toFixed(2)}
          </div>
        </section>
      </main>
    </div>
  );
}
