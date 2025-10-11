"use client";

import { useState, useMemo } from "react";
import Dragonhead from "./icons";
import { useSocketContext } from "@/app/games/coding-war/provider/SocketContext";
import jsonData from "@/public/textTest.json";

export default function TextViewer() {
  const { leave } = useSocketContext();
  const code = jsonData.text;

  // Original lines (kept 100% intact for rendering)
  const originalLines = useMemo(() => code.split("\n"), [code]);

  // Trimmed lines for logical comparisons only
  const trimmedLines = useMemo(
    () => originalLines.map((line) => line.trim()),
    [originalLines]
  );

  const [currentLine, setCurrentLine] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [score, setScore] = useState(0);

  // Store finished lines and their color states
  const [coloredLines, setColoredLines] = useState<{
    [index: number]: string[];
  }>({});

  // Helper to calculate indentation (spaces/tabs)
  const getIndentLength = (line: string) =>
    line.match(/^[\t ]*/)?.[0].length || 0;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    const fullOriginalLine = originalLines[currentLine];
    const indentLength = getIndentLength(fullOriginalLine);
    const lineWithoutIndent = fullOriginalLine.slice(indentLength);

    // Compare input only against the non-indented part
    const newColoredLine = fullOriginalLine.split("").map((char, i) => {
      // Keep indentation always white (user doesn't type it)
      if (i < indentLength) return "text-white/90";

      const charIndex = i - indentLength;
      const isCorrect = value[charIndex] === lineWithoutIndent[charIndex];
      return isCorrect
        ? "text-green-400"
        : value[charIndex]
        ? "text-red-400"
        : "text-white/90";
    });

    setColoredLines((prev) => ({ ...prev, [currentLine]: newColoredLine }));
    setInputValue(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const fullOriginalLine = originalLines[currentLine];
      const indentLength = getIndentLength(fullOriginalLine);
      const expectedLine = fullOriginalLine.slice(indentLength);
      const trimmedInput = inputValue.trimEnd();
      let lineScore = 0;
      let hasErrors = false;

      // Compute score
      for (let i = 0; i < trimmedInput.length; i++) {
        if (trimmedInput[i] === expectedLine[i]) {
          lineScore += 1;
        } else {
          lineScore -= 0.9;
          hasErrors = true;
        }
      }

      if (trimmedInput === expectedLine) {
        lineScore *= 1.5;
      } else if (hasErrors) {
        lineScore *= 1.1;
      }

      setScore((prev) => prev + lineScore);

      // Save colored version permanently
      setColoredLines((prev) => ({
        ...prev,
        [currentLine]: fullOriginalLine.split("").map((char, i) => {
          if (i < indentLength) return "text-white/90"; // indentation stays neutral
          const charIndex = i - indentLength;
          if (charIndex < trimmedInput.length) {
            return trimmedInput[charIndex] === char
              ? "text-green-400"
              : "text-red-400";
          }
          return "text-white/90";
        }),
      }));

      // Move to next line
      setCurrentLine((prev) => Math.min(prev + 1, originalLines.length - 1));
      setInputValue("");
    }
  };

  // Render the live color updates for the current line
  const renderColoredCode = () => {
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
                // Indentation is neutral (not typed)
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
        {/* Player 1 panel */}
        <section className="flex flex-col">
          <div className="rounded-lg overflow-hidden border border-white/10 bg-gradient-to-br from-black/50 to-black/30 p-3">
            <div className="text-xs text-white/60 mb-2">Player 1</div>

            <pre className="bg-transparent p-3 rounded-md overflow-auto text-sm whitespace-pre-wrap break-words font-mono">
              {renderColoredCode()}
            </pre>
          </div>

          {/* Input */}
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            inputMode="text"
            autoComplete="off"
            aria-label="Player 1 input"
            placeholder="Type the current line..."
            className="mt-3 bg-black/40 border border-gray-700 text-gray-200 px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition w-full"
          />

          {/* Score */}
          <div className="mt-3 text-indigo-400 text-lg font-semibold">
            Score: {score.toFixed(2)}
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
                {score.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm text-white/60">
              <span>Player 2</span>
              <span className="text-green-400 font-medium">test</span>
            </div>
          </div>
        </section>

        {/* Player 2 static panel */}
        <section className="flex flex-col opacity-50">
          <div className="rounded-lg overflow-hidden border border-white/10 bg-gradient-to-br from-black/50 to-black/30 p-3">
            <div className="text-xs text-white/60 mb-2">Player 2</div>
            <pre className="bg-transparent p-3 rounded-md overflow-auto text-sm whitespace-pre-wrap break-words font-mono text-white/90">
              {code}
            </pre>
          </div>
        </section>
      </main>
    </div>
  );
}
