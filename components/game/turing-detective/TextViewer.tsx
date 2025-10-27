"use client";

import { useEffect, useRef, useState } from "react";
import { getTuringSocket } from "@/app/socket";
import { useSession } from "next-auth/react";

interface Message {
  id: string;
  sender: string; // 'you'|'opponent'|'ai'|'system'
  text: string;
  timestamp: number;
}

export default function TextViewer({ roomId }: { roomId: string }) {
  const { data: session, status } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [round, setRound] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [opponentIsAI, setOpponentIsAI] = useState<boolean | null>(null);
  const aiTimerRef = useRef<number | null>(null);
  const socketRef = useRef<ReturnType<typeof getTuringSocket> | null>(null);

    const aiPhrases = [
      "Hola, ¿cómo estás?",
      "Me gusta este juego",
      "Creo que tu respuesta es correcta",
      "No se, no estoy seguro",
      "¿Puedes explicar más?",
      "Si, claro",
      "No entiendo bien",
      "Estoy confusoo", // intentional mistake
      "Por que pensas eso?", // missing accent
      "Talvez debimos preguntar antes", // misspelling
    ];

    // Try using the `ai` package when available; fall back to `aiPhrases` if it isn't or the API shape is unknown.
    async function fetchAiMessage(contextText = "") {
      // Build a short prompt requesting Spanish output and occasional grammar mistakes
      const prompt = `Responde en español argentino rioplatense. Habla como una persona real y de vez en cuando comete pequeños errores gramaticales o de acentuación, por lo general no se usa muchas comas. Mantén la respuesta corta (1-2 oraciones). Context: ${contextText}`;

      try {
        // dynamic import so bundlers/tree-shaking won't break if package missing
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const mod: any = await import("ai");

        // Try common entry points across different `ai` packages
        if (mod) {
          // 1) modern `ai` package may expose `chat.completions.create` or `chat.completions` style
          if (mod.chat && typeof mod.chat.completions?.create === "function") {
            const res = await mod.chat.completions.create({
              model: "gpt-4o-mini",
              messages: [{ role: "user", content: prompt }],
              max_tokens: 80,
            });
            return String(res?.choices?.[0]?.message?.content ?? res?.output ?? res?.text ?? aiPhrases[Math.floor(Math.random() * aiPhrases.length)]);
          }

          // 2) some libs expose `generate` or `complete`
          if (typeof mod.generate === "function") {
            const res = await mod.generate({ model: "gpt-4o-mini", prompt, max_tokens: 80 });
            return String(res?.output ?? res?.text ?? aiPhrases[Math.floor(Math.random() * aiPhrases.length)]);
          }

          if (typeof mod.complete === "function") {
            const res = await mod.complete(prompt);
            return String(res?.output ?? res?.text ?? aiPhrases[Math.floor(Math.random() * aiPhrases.length)]);
          }

          // 3) default export could be a function
          if (typeof mod.default === "function") {
            const res = await mod.default(prompt);
            return String(res ?? aiPhrases[Math.floor(Math.random() * aiPhrases.length)]);
          }
        }
      } catch (e) {
        // If import or call fails, fall back silently
        // console.debug("AI generation failed, falling back to canned phrases:", e);
      }

      // Fallback: return a random canned Spanish phrase (with occasional mistakes)
      return aiPhrases[Math.floor(Math.random() * aiPhrases.length)];
    }

  useEffect(() => {
    if (status !== "authenticated" || !session?.accessToken) return;
    
    // Use the Turing Detective namespace socket
    const s = getTuringSocket(session.accessToken);
    socketRef.current = s;

    if (!s) {
      // No socket available (SSR guard or not connected); start local-only mode
      addSystemMessage("Socket not available — running local demo mode.");
      console.warn("[TextViewer] No socket available for chat, running local demo");
      return;
    }

    console.log("[TextViewer] Using Turing socket (id):", s.id);
    // Join a room specific for this match so server or other clients can route messages
    console.log("[TextViewer] Emitting chat:join ->", { chatId: roomId });
    s.emit("chat:join", { chatId: roomId });

    const handleNew = (payload: any) => {
      // payload expected: { chatId, senderId?, text }
      console.log("[TextViewer] chat:new received:", payload);
      if (payload?.chatId !== roomId) return;
      const msg: Message = {
        id: String(Math.random()).slice(2),
        sender: payload.sender === "ai" ? "ai" : payload.senderId ? "opponent" : "opponent",
        text: payload.text,
        timestamp: Date.now(),
      };
      setMessages((m) => [...m, msg]);
    };

    s.on("chat:new", handleNew);

    return () => {
      try {
        s.emit("chat:leave", { chatId: roomId });
        s.off("chat:new", handleNew);
      } catch (e) {
        // ignore
      }
      socketRef.current = null;
      stopAI();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, status, session?.accessToken]);

  useEffect(() => {
    let tick: number | undefined;
    if (isRunning && timeLeft > 0) {
      tick = window.setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000) as unknown as number;
    } else if (timeLeft === 0) {
      // round ended
      stopAI();
      setIsRunning(false);
      addSystemMessage(`Round ${round} finished. Please guess if opponent was an AI.`);
    }

    return () => {
      if (tick) window.clearInterval(tick);
    };
  }, [isRunning, timeLeft, round]);

  function startRound() {
    setMessages([]);
    setInput("");
    setTimeLeft(60);
    setIsRunning(true);
    // Randomly decide whether opponent is AI for this demo if not set
    const isAI = Math.random() < 0.5;
    setOpponentIsAI(isAI);
    addSystemMessage(`Round ${round} started. You have 60 seconds to chat.`);
    if (isAI) startAI();
  }

  function nextRound() {
    if (round >= 3) {
      addSystemMessage("Game finished — 3 rounds completed.");
      // optionally emit final result to server
      return;
    }
    setRound((r) => r + 1);
    setOpponentIsAI(null);
    // small delay between rounds
    setTimeout(() => startRound(), 800);
  }

  function startAI() {
    stopAI();
    // AI will send messages at random intervals during the minute
      const sendAiMessage = async () => {
      const context = messages.slice(-6).map((m) => `${m.sender}: ${m.text}`).join(" \n ");
      const text = await fetchAiMessage(context);
      const msg: Message = {
        id: String(Math.random()).slice(2),
        sender: "ai",
        text,
        timestamp: Date.now(),
      };
      setMessages((m) => [...m, msg]);
    };

    const schedule = () => {
      // every 5-15 seconds
      const delay = 5000 + Math.floor(Math.random() * 10000);
      aiTimerRef.current = window.setTimeout(() => {
        sendAiMessage();
        if (isRunning && timeLeft > 0) schedule();
      }, delay) as unknown as number;
    };
    schedule();
  }

  function stopAI() {
    if (aiTimerRef.current) {
      window.clearTimeout(aiTimerRef.current as number);
      aiTimerRef.current = null;
    }
  }

  function addSystemMessage(text: string) {
    const msg: Message = {
      id: String(Math.random()).slice(2),
      sender: "system",
      text,
      timestamp: Date.now(),
    };
    setMessages((m) => [...m, msg]);
  }

  function sendMessage() {
    if (!input.trim()) return;
    const msg: Message = {
      id: String(Math.random()).slice(2),
      sender: "you",
      text: input.trim(),
      timestamp: Date.now(),
    };
    setMessages((m) => [...m, msg]);

    // Emit through socket if available so real opponent can receive it
    try {
      console.log("[TextViewer] Emitting chat:new ->", { chatId: roomId, text: input.trim() });
      socketRef.current?.emit("chat:new", { chatId: roomId, text: input.trim() });
    } catch (e) {
      console.error("[TextViewer] Error emitting chat:new", e);
    }

    setInput("");
  }

  function vote(isAiGuess: boolean) {
    const correct = opponentIsAI === isAiGuess;
    addSystemMessage(`You guessed ${isAiGuess ? "AI" : "Human"}. That is ${correct ? "correct" : "incorrect"}.`);
    // emit vote to server if needed
    try {
      console.log("[TextViewer] Emitting turing:vote ->", { roomId, round, guessIsAi: isAiGuess, correct });
      socketRef.current?.emit("turing:vote", { roomId, round, guessIsAi: isAiGuess, correct });
    } catch (e) {
      console.error("[TextViewer] Error emitting turing:vote", e);
    }
    // proceed to next round after a short delay
    setTimeout(() => nextRound(), 1200);
  }

  return (
    <div className="w-full bg-[#0b1020] text-white rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div>Round: {round} / 3</div>
        <div>Time left: {timeLeft}s</div>
      </div>

      <div className="h-72 overflow-y-auto mb-4 p-2 bg-[#0f1724] rounded" data-testid="messages">
        {messages.map((m) => (
          <div key={m.id} className={`mb-2 ${m.sender === "you" ? "text-right" : "text-left"}`}>
            <div className="text-xs text-gray-400">{m.sender}</div>
            <div className={m.sender === 'you' ? 'inline-block px-3 py-2 rounded bg-blue-600' : 'inline-block px-3 py-2 rounded bg-gray-700'}>{m.text}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 rounded bg-[#081026] border border-gray-700"
          placeholder={isRunning ? "Escribe un mensaje..." : "Start the round to chat"}
          disabled={!isRunning}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button onClick={sendMessage} disabled={!isRunning} className="px-4 py-2 bg-blue-600 rounded">
          Enviar
        </button>
      </div>

      <div className="mt-4 flex gap-2">
        {!isRunning && round <= 3 && (
          <button onClick={startRound} className="px-4 py-2 bg-green-600 rounded">
            Iniciar Ronda {round}
          </button>
        )}

        {timeLeft === 0 && (
          <>
            <button onClick={() => vote(true)} className="px-4 py-2 bg-red-600 rounded">
              Es AI
            </button>
            <button onClick={() => vote(false)} className="px-4 py-2 bg-indigo-600 rounded">
              Es Humano
            </button>
          </>
        )}
      </div>
    </div>
  );
}
