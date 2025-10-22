"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useAnimationControls } from "motion/react";
import Dragonhead from "./icons";
import { useSocketContext } from "@/app/games/coding-war/provider/SocketContext";
import problems from "@/public/textTest.json";
import { getCodingWarSocket } from "@/app/socket";
import CustomButtonTwo from "./buttons/CustomButtonTwo";
import OpponentDisconnectedModal from "./modals/OpponentDisconnectedModal";

type Problem = { lang: string; code: string };

export default function TextViewer({ roomId }: { roomId?: string }) {
  const router = useRouter();
  const { leave } = useSocketContext();
  const problemList = (problems as unknown as Problem[]) ?? [];
  const [problemIndex, setProblemIndex] = useState(0); // local player's current problem index
  const [code, setCode] = useState<string>(problemList[0]?.code || "");
  const [lang, setLang] = useState<string>(problemList[0]?.lang || "");
  const [opponentProblemIndex, setOpponentProblemIndex] = useState(0);
  const [opponentCode, setOpponentCode] = useState<string>(
    problemList[0]?.code || ""
  );
  const [opponentLang, setOpponentLang] = useState<string>(
    problemList[0]?.lang || ""
  );
  const [room, setRoom] = useState(roomId ?? "");
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
  const prevConnectedRef = useRef<string[]>([]);
  const [opponentDisconnected, setOpponentDisconnected] = useState(false);
  const [selfId, setSelfId] = useState<string | null>(null);
  const [role, setRole] = useState<"P1" | "P2" | "spectator">("spectator");
  const [opponentId, setOpponentId] = useState<string | null>(null);
  const localPlayer = useMemo<1 | 2 | null>(
    () => (role === "P1" ? 1 : role === "P2" ? 2 : null),
    [role]
  );
  // Timer state (1 minute)
  const [remaining, setRemaining] = useState<number>(60);
  const [ended, setEnded] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const redirectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const redirectCountdownRef = useRef<NodeJS.Timeout | null>(null);
  const [redirectRemaining, setRedirectRemaining] = useState<number>(0);

  useEffect(() => {
    const s = getCodingWarSocket();

    if (room) {
      // Ask server to sync and attach us to the room if needed
      s.emit("requestGameState", { roomId: room });
      // Signal readiness so the PlayingState can start when both clients are ready
      s.emit("playerReadyForMatch", { roomId: room });
    }

    // Track own socket id
    if (s.id) setSelfId(s.id ?? null);
    const onConnect = () => setSelfId(s.id ?? null);
    s.on("connect", onConnect);

    // Optional listeners for timer events (can be wired into UI later)
    // Optional listeners for timer events (can be wired into UI later)
    const onTimerStart = (data: { duration: number }) => {
      setRemaining(Math.ceil((data.duration ?? 60000) / 1000));
      setEnded(false);
      // stop local fallback if any
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
    const onTimerTick = (data: { remaining: number }) => {
      const secs = Math.max(0, Math.floor((data.remaining ?? 0) / 1000));
      setRemaining(secs);
      if (secs <= 0) setEnded(true);
    };
    const onGameOver = (data: { winner?: string | null; finalScores?: Record<string, number> }) => {
      // Authoritative end-of-match signal from server
      setEnded(true);
      // Stop local fallback and future ticks to pause the clock display
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      s.off("timerTick", onTimerTick);
      // Optional: sync scores from server if provided
      if (data?.finalScores && connectedUsers.length) {
        const [p1Id, p2Id] = connectedUsers;
        if (p1Id !== undefined && data.finalScores[p1Id] !== undefined) {
          setScoreP1(data.finalScores[p1Id] ?? 0);
        }
        if (p2Id !== undefined && data.finalScores[p2Id] !== undefined) {
          setScoreP2(data.finalScores[p2Id] ?? 0);
        }
      }

      // Directly schedule redirect in 4s based on server scores
      if (!redirectFiredRef.current && room) {
        redirectFiredRef.current = true;
        // Compute winner and scores from payload if possible
        let p1 = scoreP1;
        let p2 = scoreP2;
        if (data?.finalScores && connectedUsers.length) {
          const [p1Id, p2Id] = connectedUsers;
          p1 = p1Id ? (data.finalScores[p1Id] ?? p1) : p1;
          p2 = p2Id ? (data.finalScores[p2Id] ?? p2) : p2;
        }
        const w = p1 === p2 ? "draw" : p1 > p2 ? "P1" : "P2";
        if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
        redirectTimerRef.current = setTimeout(() => {
          router.push(
            `/games/coding-war/${room}/result?winner=${w}&p1=${encodeURIComponent(
              p1.toFixed(2)
            )}&p2=${encodeURIComponent(p2.toFixed(2))}`
          );
        }, 4000);
      }
    };
    s.on("timerStart", onTimerStart);
    s.on("timerTick", onTimerTick);
    s.on("gameOver", onGameOver);

    // Derive connected users from the canonical gameState broadcast
    const onGameState = (state: {
      players?: string[];
      playerCount?: number;
      roomInfo?: { id: string };
      scores?: Record<string, number>;
      problemIndex?: Record<string, number>;
      result?: unknown;
    }) => {
      if (state?.players && Array.isArray(state.players)) {
        // detect disconnect: if previously had 2 and now less than 2, or opponent missing
        const prev = prevConnectedRef.current;
        const now = state.players;
        setConnectedUsers(now);
        // compute removed IDs robustly
        const removed = prev.filter((id) => !now.includes(id));
        // keep a snapshot, not the same reference
        prevConnectedRef.current = [...now];
        if (removed.length > 0) {
          // trigger when someone other than me left, or if we cannot resolve self yet
          if (!selfId || removed.some((id) => id !== selfId)) {
            setOpponentDisconnected(true);
            // Pause timer immediately when match ends due to disconnect
            setEnded(true);
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            s.off("timerTick", onTimerTick);
          }
        }
        // Determine role based on join order
        if (selfId) {
          const idx = state.players.indexOf(selfId);
          if (idx === 0) setRole("P1");
          else if (idx === 1) setRole("P2");
          else setRole("spectator");
          const opp = state.players.find((p) => p !== selfId) || null;
          setOpponentId(opp);
        }
        // Map authoritative scores to P1/P2 by players order
        if (state.scores) {
          const p1Id = state.players[0];
          const p2Id = state.players[1];
          if (p1Id) setScoreP1(state.scores[p1Id] ?? 0);
          if (p2Id) setScoreP2(state.scores[p2Id] ?? 0);
        }
        // Update my problem index
        if (
          state.problemIndex &&
          selfId &&
          state.problemIndex[selfId] !== undefined
        ) {
          const myIdx = state.problemIndex[selfId] ?? 0;
          if (myIdx !== problemIndex) {
            setProblemIndex(myIdx);
            const p = problemList[myIdx] ?? problemList[problemList.length - 1];
            setLang(p?.lang || "");
            setCode(p?.code || "");
            // reset per-problem visuals but keep scores
            setCurrentLineP1(0);
            setCurrentLineP2(0);
            setInputValueP1("");
            setInputValueP2("");
            setColoredLinesP1({});
            setColoredLinesP2({});
            setPerfectLinesP1(new Set());
            setPerfectLinesP2(new Set());
            setErroredLinesP1(new Set());
            setErroredLinesP2(new Set());
          }
        }
        // Update opponent problem index and code
        if (
          state.problemIndex &&
          opponentId &&
          state.problemIndex[opponentId] !== undefined
        ) {
          const oppIdx = state.problemIndex[opponentId] ?? 0;
          if (oppIdx !== opponentProblemIndex) {
            setOpponentProblemIndex(oppIdx);
            const op =
              problemList[oppIdx] ?? problemList[problemList.length - 1];
            setOpponentLang(op?.lang || "");
            setOpponentCode(op?.code || "");
            // reset opponent visuals only
            if (role === "P2") {
              // Opponent is P1 on my right
              setCurrentLineP1(0);
              setColoredLinesP1({});
              setPerfectLinesP1(new Set());
              setErroredLinesP1(new Set());
            } else {
              // Opponent is P2 on my right
              setCurrentLineP2(0);
              setColoredLinesP2({});
              setPerfectLinesP2(new Set());
              setErroredLinesP2(new Set());
            }
          }
        }
      } else if (typeof state?.playerCount === "number") {
        // Fallback: maintain an array of the reported size
        setConnectedUsers((prev) => {
          const len = state.playerCount ?? 0;
          if (prev.length === len) return prev;
          return Array.from({ length: len }, (_, i) => prev[i] ?? `${i}`);
        });
      }
      // Optionally sync room id if server reports canonical value
      if (state?.roomInfo?.id && state.roomInfo.id !== room) {
        setRoom(state.roomInfo.id);
      }
    };
    s.on("gameState", onGameState);

    // Example: handle potential room users broadcast (not currently emitted by backend)
    const onRoomUsersUpdate = (users: string[]) => setConnectedUsers(users);
    s.on("roomUsersUpdate", onRoomUsersUpdate);

    return () => {
      s.off("timerStart", onTimerStart);
      s.off("timerTick", onTimerTick);
      s.off("gameState", onGameState);
      s.off("roomUsersUpdate", onRoomUsersUpdate);
      s.off("connect", onConnect);
      s.off("gameOver", onGameOver);
    };
  }, [room, selfId]);

  useEffect(() => {
    if (roomId && roomId !== room) {
      setRoom(roomId);
    }
  }, [roomId]);

  // Start a local fallback timer only if server doesn't provide timer events
  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) clearInterval(timerRef.current);
    setEnded(false);
    // if server events connect later, they'll clear this
    timerRef.current = setInterval(() => {
      setRemaining((r) => {
        const next = Math.max(0, r - 1);
        if (next === 0) setEnded(true);
        return next;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
    };
  }, [room]);

  

  // Split code into lines
  const originalLines = useMemo(() => code.split("\n"), [code]);
  const opponentLines = useMemo(() => opponentCode.split("\n"), [opponentCode]);
  const trimmedLines = useMemo(
    () => originalLines.map((line) => line.trim()),
    [originalLines]
  );

  // Helpers
  const getIndentLength = (line: string) =>
    line.match(/^[\t ]*/)?.[0].length || 0;

  // Visual columns for indentation (tabs count as 4 spaces)
  const getIndentColumns = (line: string) => {
    const indent = line.match(/^[\t ]*/)?.[0] || "";
    let cols = 0;
    for (const ch of indent) cols += ch === "\t" ? 4 : 1;
    return cols;
  };

  // Player 1 state
  const [currentLineP1, setCurrentLineP1] = useState(0);
  const [inputValueP1, setInputValueP1] = useState("");
  const [scoreP1, setScoreP1] = useState(0);
  const [coloredLinesP1, setColoredLinesP1] = useState<{
    [index: number]: string[];
  }>({});
  const [perfectLinesP1, setPerfectLinesP1] = useState<Set<number>>(new Set());
  const [floatersP1, setFloatersP1] = useState<
    Array<{ id: number; value: number }>
  >([]);
  const [lastFeedbackP1, setLastFeedbackP1] = useState<
    "correct" | "incorrect" | null
  >(null);
  // Tracks if a mistake was ever made on a given line (irreversible for 'perfect' status)
  const [erroredLinesP1, setErroredLinesP1] = useState<Set<number>>(new Set());
  const controlsP1 = useAnimationControls();
  const inputRefP1 = useRef<HTMLInputElement | null>(null);

  // Player 2 state
  const [currentLineP2, setCurrentLineP2] = useState(0);
  const [inputValueP2, setInputValueP2] = useState("");
  const [scoreP2, setScoreP2] = useState(0);
  const [coloredLinesP2, setColoredLinesP2] = useState<{
    [index: number]: string[];
  }>({});
  const [perfectLinesP2, setPerfectLinesP2] = useState<Set<number>>(new Set());
  const [floatersP2, setFloatersP2] = useState<
    Array<{ id: number; value: number }>
  >([]);
  const [lastFeedbackP2, setLastFeedbackP2] = useState<
    "correct" | "incorrect" | null
  >(null);
  // Tracks if a mistake was ever made on a given line (irreversible for 'perfect' status)
  const [erroredLinesP2, setErroredLinesP2] = useState<Set<number>>(new Set());
  const controlsP2 = useAnimationControls();
  const inputRefP2 = useRef<HTMLInputElement | null>(null);
  // Opponent live input mirror
  const [opponentInput, setOpponentInput] = useState("");
  const [opponentLine, setOpponentLine] = useState<number>(0);

  // === SHARED LOGIC HANDLERS ===

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    player: 1 | 2
  ) => {
    if (ended) return; // no typing after end

    const value = e.target.value;
    const currentLine = player === 1 ? currentLineP1 : currentLineP2;
    const fullOriginalLine = originalLines[currentLine];
    const indentLength = getIndentLength(fullOriginalLine);
    const lineWithoutIndent = fullOriginalLine.slice(indentLength);

    // Typing feedback: detect new char correctness
    const prev = player === 1 ? inputValueP1 : inputValueP2;
    if (value.length > prev.length) {
      const idx = prev.length;
      const typedChar = value[idx];
      const expectedChar = lineWithoutIndent[idx];
      const isCorrectChar = typedChar === expectedChar;
      if (player === 1) {
        setLastFeedbackP1(isCorrectChar ? "correct" : "incorrect");
        if (!isCorrectChar) {
          setErroredLinesP1((prev) => {
            if (prev.has(currentLine)) return prev;
            const next = new Set(prev);
            next.add(currentLine);
            return next;
          });
        }
        if (isCorrectChar)
          void controlsP1.start({
            boxShadow: [
              "0 0 0px rgba(34,197,94,0)",
              "0 0 14px rgba(34,197,94,0.35)",
              "0 0 0px rgba(34,197,94,0)",
            ],
            transition: { duration: 0.22, ease: "easeOut" },
          });
        else
          void controlsP1.start({
            x: [0, -2, 2, -1, 1, 0],
            transition: { duration: 0.22, ease: "easeOut" },
          });
      } else {
        setLastFeedbackP2(isCorrectChar ? "correct" : "incorrect");
        if (!isCorrectChar) {
          setErroredLinesP2((prev) => {
            if (prev.has(currentLine)) return prev;
            const next = new Set(prev);
            next.add(currentLine);
            return next;
          });
        }
        if (isCorrectChar)
          void controlsP2.start({
            boxShadow: [
              "0 0 0px rgba(34,197,94,0)",
              "0 0 14px rgba(34,197,94,0.35)",
              "0 0 0px rgba(34,197,94,0)",
            ],
            transition: { duration: 0.22, ease: "easeOut" },
          });
        else
          void controlsP2.start({
            x: [0, -2, 2, -1, 1, 0],
            transition: { duration: 0.22, ease: "easeOut" },
          });
      }
    } else if (value.length < prev.length) {
      // on deletion reset to neutral
      if (player === 1) setLastFeedbackP1(null);
      else setLastFeedbackP2(null);
    }

    // Keep input focused even after re-renders
    requestAnimationFrame(() => {
      if (player === 1) {
        if (document.activeElement !== inputRefP1.current) {
          inputRefP1.current?.focus({ preventScroll: true });
        }
      } else {
        if (document.activeElement !== inputRefP2.current) {
          inputRefP2.current?.focus({ preventScroll: true });
        }
      }
    });

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
      // Emit typing progress for P1 when local player is P1
      if (localPlayer !== null && localPlayer === player) {
        getCodingWarSocket().emit("typingProgress", {
          roomId: room,
          lineIndex: currentLine,
          input: value,
        });
      }
    } else {
      setColoredLinesP2((prev) => ({ ...prev, [currentLine]: newColoredLine }));
      setInputValueP2(value);
      if (localPlayer !== null && localPlayer === player) {
        getCodingWarSocket().emit("typingProgress", {
          roomId: room,
          lineIndex: currentLine,
          input: value,
        });
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    player: 1 | 2
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (ended) return; // no commits after end

      const currentLine = player === 1 ? currentLineP1 : currentLineP2;
      const fullOriginalLine = originalLines[currentLine];
      const indentLength = getIndentLength(fullOriginalLine);
      const expectedLine = fullOriginalLine.slice(indentLength);
      const inputValue = player === 1 ? inputValueP1 : inputValueP2;
      const trimmedInput = inputValue.trimEnd();
      const madeError = (player === 1 ? erroredLinesP1 : erroredLinesP2).has(
        currentLine
      );
      const isPerfect = trimmedInput === expectedLine && !madeError;
      let lineScore = 0;
      let hasErrors = false;

      for (let i = 0; i < trimmedInput.length; i++) {
        if (trimmedInput[i] === expectedLine[i]) lineScore += 1;
        else {
          lineScore -= 0.9;
          hasErrors = true;
        }
      }

      if (isPerfect) lineScore *= 1.5;
      else if (hasErrors) lineScore *= 1.1;

      if (player === 1) {
        setScoreP1((prev) => prev + lineScore);
        // add floating +points for P1
        const id = Date.now() + Math.random();
        setFloatersP1((prev) => [...prev, { id, value: lineScore }]);
        setTimeout(() => {
          setFloatersP1((prev) => prev.filter((f) => f.id !== id));
        }, 750);
        // Broadcast line commit for opponent mirror
        if (localPlayer !== null && localPlayer === player) {
          getCodingWarSocket().emit("lineCommit", {
            roomId: room,
            lineIndex: currentLine,
            input: trimmedInput,
            isPerfect,
            score: lineScore,
          });
        }
      } else {
        setScoreP2((prev) => prev + lineScore);
        // add floating +points for P2
        const id = Date.now() + Math.random();
        setFloatersP2((prev) => [...prev, { id, value: lineScore }]);
        setTimeout(() => {
          setFloatersP2((prev) => prev.filter((f) => f.id !== id));
        }, 750);
        if (localPlayer !== null && localPlayer === player) {
          getCodingWarSocket().emit("lineCommit", {
            roomId: room,
            lineIndex: currentLine,
            input: trimmedInput,
            isPerfect,
            score: lineScore,
          });
        }
      }

      const newColoredLine = fullOriginalLine.split("").map((char, i) => {
        if (i < indentLength) return "text-white/90";
        if (isPerfect) return "text-yellow-400"; // golden highlight for perfect line
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
        setPerfectLinesP1((prev) => {
          const next = new Set(prev);
          if (isPerfect) next.add(currentLine);
          else next.delete(currentLine);
          return next;
        });
        const nextLine = Math.min(currentLine + 1, originalLines.length - 1);
        setCurrentLineP1(nextLine);
        setInputValueP1("");
      } else {
        setColoredLinesP2((prev) => ({
          ...prev,
          [currentLine]: newColoredLine,
        }));
        setPerfectLinesP2((prev) => {
          const next = new Set(prev);
          if (isPerfect) next.add(currentLine);
          else next.delete(currentLine);
          return next;
        });
        const nextLine = Math.min(currentLine + 1, originalLines.length - 1);
        setCurrentLineP2(nextLine);
        setInputValueP2("");
      }
      // If this player reached the last line, request next problem only for this player
      const atLastLine = currentLine >= originalLines.length - 1;
      if (atLastLine && localPlayer !== null && localPlayer === player) {
        getCodingWarSocket().emit("problemCompleted", { roomId: room });
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

      if (i === currentLine) {
        const indentLen = getIndentLength(line);
        const indentCols = getIndentColumns(line);
        const chars = line.split("").slice(indentLen);
        const caretIndex = inputValue.length;
        return (
          <div
            key={i}
            className="leading-relaxed font-mono grid"
            style={{ gridTemplateColumns: `${indentCols}ch 1fr` }}
          >
            <div aria-hidden="true" />
            <div className="whitespace-pre-wrap break-words relative">
              {chars.map((char, idx) => {
                const charIndex = idx;
                const beforeCaret = charIndex === caretIndex;
                return (
                  <span key={`char-${idx}`} className="relative">
                    {beforeCaret && (
                      <span
                        className="inline-block w-0.5 h-[1em] align-[-0.15em] bg-amber-400 animate-pulse mr-0.5"
                        aria-hidden="true"
                      />
                    )}
                    {charIndex < inputValue.length ? (
                      <span
                        className={
                          inputValue[charIndex] === char
                            ? "text-green-400"
                            : "text-red-400"
                        }
                      >
                        {char}
                      </span>
                    ) : (
                      <span className="text-white/90">{char}</span>
                    )}
                  </span>
                );
              })}
              {caretIndex >= chars.length && (
                <span
                  className="inline-block w-0.5 h-[1em] align-[-0.15em] bg-amber-400 animate-pulse ml-0.5"
                  aria-hidden="true"
                />
              )}
            </div>
          </div>
        );
      }

      if (coloredLines[i]) {
        const indentLen = getIndentLength(line);
        const indentCols = getIndentColumns(line);
        const chars = line.split("");
        const isPerfectLine = (
          player === 1 ? perfectLinesP1 : perfectLinesP2
        ).has(i);
        return (
          <div
            key={i}
            className="leading-relaxed font-mono grid"
            style={{ gridTemplateColumns: `${indentCols}ch 1fr` }}
          >
            <div aria-hidden="true" />
            <div className="whitespace-pre-wrap break-words relative overflow-hidden">
              {chars.slice(indentLen).map((char, idx) => (
                <span key={idx} className={coloredLines[i][idx + indentLen]}>
                  {char}
                </span>
              ))}
              {isPerfectLine && (
                <motion.div
                  initial={{ x: "-100%", opacity: 0.5 }}
                  animate={{ x: "100%", opacity: [0.5, 0.35, 0] }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                  className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-yellow-300/40 to-transparent"
                />
              )}
            </div>
          </div>
        );
      }

      const indentLen = getIndentLength(line);
      const indentCols = getIndentColumns(line);
      return (
        <div
          key={i}
          className="leading-relaxed font-mono grid text-white/90"
          style={{ gridTemplateColumns: `${indentCols}ch 1fr` }}
        >
          <div aria-hidden="true" />
          <div className="whitespace-pre-wrap break-words">
            {line.slice(indentLen)}
          </div>
        </div>
      );
    });
  };

  // Render helper for a provided lines array (opponent view)
  const renderColoredCodeLines = (
    lines: string[],
    player: 1 | 2,
    currentLine: number,
    coloredLines: { [index: number]: string[] },
    inputValue: string
  ) => {
    return lines.map((line, i) => {
      if (line.trim() === "") {
        return (
          <div key={i} className="leading-relaxed font-mono h-5">
            {""}
          </div>
        );
      }

      if (i === currentLine) {
        const indentLen = getIndentLength(line);
        const indentCols = getIndentColumns(line);
        const chars = line.split("").slice(indentLen);
        const caretIndex = inputValue.length;
        return (
          <div
            key={i}
            className="leading-relaxed font-mono grid"
            style={{ gridTemplateColumns: `${indentCols}ch 1fr` }}
          >
            <div aria-hidden="true" />
            <div className="whitespace-pre-wrap break-words relative">
              {chars.map((char, idx) => {
                const charIndex = idx;
                const beforeCaret = charIndex === caretIndex;
                return (
                  <span key={`char-${i}-${idx}`} className="relative">
                    {beforeCaret && (
                      <span
                        className="inline-block w-0.5 h-[1em] align-[-0.15em] bg-amber-400 animate-pulse mr-0.5"
                        aria-hidden="true"
                      />
                    )}
                    {charIndex < inputValue.length ? (
                      <span
                        className={
                          inputValue[charIndex] === char
                            ? "text-green-400"
                            : "text-red-400"
                        }
                      >
                        {char}
                      </span>
                    ) : (
                      <span className="text-white/90">{char}</span>
                    )}
                  </span>
                );
              })}
              {caretIndex >= chars.length && (
                <span
                  className="inline-block w-0.5 h-[1em] align-[-0.15em] bg-amber-400 animate-pulse ml-0.5"
                  aria-hidden="true"
                />
              )}
            </div>
          </div>
        );
      }

      if (coloredLines[i]) {
        const indentLen = getIndentLength(line);
        const indentCols = getIndentColumns(line);
        const chars = line.split("");
        const isPerfectLine = (
          player === 1 ? perfectLinesP1 : perfectLinesP2
        ).has(i);
        return (
          <div
            key={i}
            className="leading-relaxed font-mono grid"
            style={{ gridTemplateColumns: `${indentCols}ch 1fr` }}
          >
            <div aria-hidden="true" />
            <div className="whitespace-pre-wrap break-words relative overflow-hidden">
              {chars.slice(indentLen).map((char, idx) => (
                <span key={idx} className={coloredLines[i][idx + indentLen]}>
                  {char}
                </span>
              ))}
              {isPerfectLine && (
                <motion.div
                  initial={{ x: "-100%", opacity: 0.5 }}
                  animate={{ x: "100%", opacity: [0.5, 0.35, 0] }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                  className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-yellow-300/40 to-transparent"
                />
              )}
            </div>
          </div>
        );
      }

      const indentLen = getIndentLength(line);
      const indentCols = getIndentColumns(line);
      return (
        <div
          key={i}
          className="leading-relaxed font-mono grid text-white/90"
          style={{ gridTemplateColumns: `${indentCols}ch 1fr` }}
        >
          <div aria-hidden="true" />
          <div className="whitespace-pre-wrap break-words">
            {line.slice(indentLen)}
          </div>
        </div>
      );
    });
  };

  // === RENDER UI ===

  // Leave handler: mark not ready, disconnect socket, cleanup timers, navigate out
  const handleLeave = () => {
    try {
      const s = getCodingWarSocket();
      if (room) s.emit("confirmReady", { roomId: room, ready: false });
      // Disconnect from Coding War namespace so server cleans up membership
      s.disconnect();
    } catch {}
    // Cleanup local timers
    if (timerRef.current) clearInterval(timerRef.current);
    if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
    if (redirectCountdownRef.current) clearInterval(redirectCountdownRef.current);
    // Optionally reset context state
    leave?.("coding-war");
    // Navigate back to game hub
    router.push("/games/coding-war");
  };

  // Listen to opponent updates
  useEffect(() => {
    const s = getCodingWarSocket();
    const onTyping = (data: {
      playerId: string;
      lineIndex: number;
      input: string;
    }) => {
      // If it's not me, mirror on the opponent panel
      if (data.input !== undefined && (!selfId || data.playerId !== selfId)) {
        setOpponentLine(data.lineIndex);
        setOpponentInput(data.input);
        // Paint opponent side live (map to the correct player's state slots)
        const fullOriginalLine = opponentLines[data.lineIndex] ?? "";
        const indentLength = getIndentLength(fullOriginalLine);
        const lineWithoutIndent = fullOriginalLine.slice(indentLength);
        const newColoredLine = fullOriginalLine.split("").map((char, i) => {
          if (i < indentLength) return "text-white/90";
          const charIndex = i - indentLength;
          const isCorrect =
            data.input[charIndex] === lineWithoutIndent[charIndex];
          return isCorrect
            ? "text-green-400"
            : data.input[charIndex]
            ? "text-red-400"
            : "text-white/90";
        });
        if (role === "P2") {
          // Opponent is P1 on my right
          setColoredLinesP1((prev) => ({
            ...prev,
            [data.lineIndex]: newColoredLine,
          }));
        } else {
          // Opponent is P2 on my right
          setColoredLinesP2((prev) => ({
            ...prev,
            [data.lineIndex]: newColoredLine,
          }));
        }
      }
    };
    const onLineCommitted = (data: {
      playerId: string;
      lineIndex: number;
      input: string;
      isPerfect?: boolean;
    }) => {
      if (selfId && data.playerId === selfId) return; // ignore own echo
      const fullOriginalLine = opponentLines[data.lineIndex] ?? "";
      const indentLength = getIndentLength(fullOriginalLine);
      const newColoredLine = fullOriginalLine.split("").map((char, i) => {
        if (i < indentLength) return "text-white/90";
        if (data.isPerfect) return "text-yellow-400";
        const charIndex = i - indentLength;
        if (charIndex < (data.input?.length ?? 0)) {
          return data.input[charIndex] === char
            ? "text-green-400"
            : "text-red-400";
        }
        return "text-white/90";
      });
      if (role === "P2") {
        setColoredLinesP1((prev) => ({
          ...prev,
          [data.lineIndex]: newColoredLine,
        }));
        setCurrentLineP1((prev) =>
          data.lineIndex >= prev ? data.lineIndex + 1 : prev
        );
      } else {
        setColoredLinesP2((prev) => ({
          ...prev,
          [data.lineIndex]: newColoredLine,
        }));
        setCurrentLineP2((prev) =>
          data.lineIndex >= prev ? data.lineIndex + 1 : prev
        );
      }
    };
    const onProblemIndexUpdate = (data: {
      playerId: string;
      problemIndex: number;
    }) => {
      if (!selfId || data.playerId !== selfId) return; // only adjust my local view when my index changes
      const p =
        problemList[data.problemIndex] ?? problemList[problemList.length - 1];
      setProblemIndex(data.problemIndex);
      setLang(p?.lang || "");
      setCode(p?.code || "");
      // reset per-problem visuals
      setCurrentLineP1(0);
      setCurrentLineP2(0);
      setInputValueP1("");
      setInputValueP2("");
      setColoredLinesP1({});
      setColoredLinesP2({});
      setPerfectLinesP1(new Set());
      setPerfectLinesP2(new Set());
      setErroredLinesP1(new Set());
      setErroredLinesP2(new Set());
    };
    s.on("typingUpdate", onTyping);
    s.on("lineCommitted", onLineCommitted);
    s.on("problemIndexUpdate", onProblemIndexUpdate);
    return () => {
      s.off("typingUpdate", onTyping);
      s.off("lineCommitted", onLineCommitted);
      s.off("problemIndexUpdate", onProblemIndexUpdate);
    };
  }, [role, room, originalLines]);

  // Winner display helper
  const winner: "P1" | "P2" | "draw" | null = useMemo(() => {
    if (!ended) return null;
    if (scoreP1 > scoreP2) return "P1";
    if (scoreP2 > scoreP1) return "P2";
    return "draw";
  }, [ended, scoreP1, scoreP2]);

  // Navigate to result page 4s after end (fallback if gameOver is missed)
  const redirectFiredRef = useRef(false);
  useEffect(() => {
    if (!ended || redirectFiredRef.current) return;
    redirectFiredRef.current = true;
    // Snapshot current scores to compute winner once
    const p1Num = scoreP1;
    const p2Num = scoreP2;
    const w = p1Num === p2Num ? "draw" : p1Num > p2Num ? "P1" : "P2";
    setRedirectRemaining(4);
    if (redirectCountdownRef.current) clearInterval(redirectCountdownRef.current);
    redirectCountdownRef.current = setInterval(() => {
      setRedirectRemaining((r) => Math.max(0, r - 1));
    }, 1000);
    if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
    redirectTimerRef.current = setTimeout(() => {
      if (room) {
        router.push(
          `/games/coding-war/${room}/result?winner=${w}&p1=${encodeURIComponent(
            p1Num.toFixed(2)
          )}&p2=${encodeURIComponent(p2Num.toFixed(2))}`
        );
      }
    }, 4000);
    return () => {
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
      if (redirectCountdownRef.current) clearInterval(redirectCountdownRef.current);
    };
  }, [ended, room, router]);

  return (
    <div className="w-full">
      <OpponentDisconnectedModal
        open={opponentDisconnected}
        onClose={() => setOpponentDisconnected(false)}
        onGoToRoom={() => router.push(`/games/coding-war/${room}`)}
      />
      {/* Room info */}
      <div className="w-full flex justify-between mb-4">
        <div className="border border-white/10 bg-gradient-to-br from-black/50 to-black/30 p-4">
          Room: <span className="text-indigo-400">{room}</span> · Users:{" "}
          {connectedUsers.length}
        </div>
        {/* Leave button */}
        <div>
          <CustomButtonTwo
            color="primary"
            text="Leave"
            icon="iconamoon:enter"
            full
            size="md"
            onClick={handleLeave}
          />
        </div>
      </div>

      <main className="grid grid-cols-14 gap-6 items-start">
        {/* Timer and status */}
        <div className="col-span-14 mb-2 flex items-center justify-center gap-4">
          <div
            className={`px-4 py-2 rounded-lg border ${
              ended
                ? "border-rose-500 text-rose-400"
                : "border-indigo-600 text-indigo-300"
            } bg-black/40`}
          >
            Time: {Math.floor(remaining / 60)}:
            {String(remaining % 60).padStart(2, "0")}
          </div>
          {ended && (
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-lg border border-amber-500 text-amber-300 bg-black/40">
                {winner === "draw" ? "Draw!" : `${winner} wins`}
              </div>
              <div className="px-3 py-2 rounded-lg border border-white/10 text-white/80 bg-black/40">
                Redirecting in {redirectRemaining}s
              </div>
            </div>
          )}
        </div>
        {/* Left: Local player */}
        <div className="col-span-6">
          <section className="flex flex-col">
            <div className="rounded-lg overflow-hidden border border-white/10 bg-gradient-to-br from-black/50 to-black/30 p-4">
              <div className="text-xs text-white/60 mb-2 justify-between flex">
                {role === "P2" ? "Player 2" : "Player 1"}
                <span className="ml-4">
                  Lang: <span className="text-emerald-400">{lang}</span>
                </span>
              </div>

              <pre className="bg-transparent p-4 rounded-md overflow-auto text-sm whitespace-pre-wrap break-words font-mono">
                {role === "P2"
                  ? renderColoredCode(
                      2,
                      currentLineP2,
                      coloredLinesP2,
                      inputValueP2
                    )
                  : renderColoredCode(
                      1,
                      currentLineP1,
                      coloredLinesP1,
                      inputValueP1
                    )}
              </pre>
            </div>
            {/* Left input is always the local player's input */}
            <motion.div animate={role === "P2" ? controlsP2 : controlsP1}>
              <input
                type="text"
                value={role === "P2" ? inputValueP2 : inputValueP1}
                onChange={(e) => handleInputChange(e, role === "P2" ? 2 : 1)}
                onKeyDown={(e) => handleKeyDown(e, role === "P2" ? 2 : 1)}
                ref={role === "P2" ? inputRefP2 : inputRefP1}
                inputMode="text"
                autoComplete="off"
                aria-label="Local player input"
                placeholder={
                  role === "spectator"
                    ? "Spectating…"
                    : "Type the current line..."
                }
                disabled={role === "spectator" || ended}
                className={`mt-3 bg-black/40 border ${
                  (role === "P2" ? lastFeedbackP2 : lastFeedbackP1) ===
                  "incorrect"
                    ? "border-rose-600"
                    : (role === "P2" ? lastFeedbackP2 : lastFeedbackP1) ===
                      "correct"
                    ? "border-green-600"
                    : "border-gray-700"
                } caret-indigo-400 text-gray-200 px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition w-full disabled:opacity-60`}
              />
            </motion.div>

            <div className="mt-3 text-indigo-400 text-lg font-semibold">
              Score: {(role === "P2" ? scoreP2 : scoreP1).toFixed(2)}
            </div>
          </section>
        </div>

        {/* Center: Scoreboard */}
        <div className="col-span-2 flex justify-center">
          <section className="flex flex-col items-center justify-center bg-gradient-to-b from-gray-900/80 to-black/60 border border-white/10 p-3 rounded-2xl mt-3 pt-6">
            <Dragonhead />
            <h1 className="text-indigo-400 text-4xl font-semibold mt-4 mb-2">
              SCORE
            </h1>

            <div className="w-40 bg-black/30 rounded-lg p-4 mt-3 relative">
              <div className="flex justify-between text-sm text-white/60 mb-2 relative">
                <span>Player 1</span>
                <motion.span
                  key={scoreP1.toFixed(2)}
                  initial={{ scale: 1 }}
                  animate={{ scale: [1.15, 1] }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="text-green-400 font-medium"
                >
                  {scoreP1.toFixed(2)}
                </motion.span>
              </div>
              <div className="flex justify-between text-sm text-white/60 relative">
                <span>Player 2</span>
                <motion.span
                  key={scoreP2.toFixed(2)}
                  initial={{ scale: 1 }}
                  animate={{ scale: [1.15, 1] }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="text-green-400 font-medium"
                >
                  {scoreP2.toFixed(2)}
                </motion.span>
              </div>

              {/* Floating +points overlays */}
              <div className="pointer-events-none absolute inset-0">
                {/* Player 1 floaters (near first row) */}
                <div className="absolute right-2 top-3">
                  <AnimatePresence>
                    {floatersP1.map((f) => (
                      <motion.div
                        key={f.id}
                        initial={{ y: 8, opacity: 0, scale: 0.95 }}
                        animate={{ y: -10, opacity: 1, scale: 1 }}
                        exit={{ y: -22, opacity: 0 }}
                        transition={{ duration: 0.55, ease: "easeOut" }}
                        className={`text-sm font-semibold text-right ${
                          f.value >= 0 ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {(f.value >= 0 ? "+" : "") + f.value.toFixed(1)}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                {/* Player 2 floaters (near second row) */}
                <div className="absolute right-2 top-12">
                  <AnimatePresence>
                    {floatersP2.map((f) => (
                      <motion.div
                        key={f.id}
                        initial={{ y: 8, opacity: 0, scale: 0.95 }}
                        animate={{ y: -10, opacity: 1, scale: 1 }}
                        exit={{ y: -22, opacity: 0 }}
                        transition={{ duration: 0.55, ease: "easeOut" }}
                        className={`text-sm font-semibold text-right ${
                          f.value >= 0 ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {(f.value >= 0 ? "+" : "") + f.value.toFixed(1)}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right: Opponent view (read-only) */}
        <div className="col-span-6">
          <section className="flex flex-col">
            <div className="rounded-lg overflow-hidden border border-white/10 bg-gradient-to-br from-black/50 to-black/30 p-3">
              <div className="text-xs text-white/60 mb-2">
                {role === "P2" ? "Player 1" : "Player 2"}
              </div>
              <pre className="bg-transparent p-3 rounded-md overflow-auto text-sm whitespace-pre-wrap break-words font-mono">
                {role === "P2"
                  ? renderColoredCodeLines(
                      opponentLines,
                      1,
                      opponentLine,
                      coloredLinesP1,
                      opponentInput
                    )
                  : renderColoredCodeLines(
                      opponentLines,
                      2,
                      opponentLine,
                      coloredLinesP2,
                      opponentInput
                    )}
              </pre>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
