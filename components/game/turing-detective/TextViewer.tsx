"use client";

import { useEffect, useRef, useState } from "react";
import { getTuringSocket } from "@/app/socket";
import { useSession } from "next-auth/react";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

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
  const [myRole, setMyRole] = useState<"human" | "ai" | null>(null); // Am I playing as human or AI this round?
  const [opponentRole, setOpponentRole] = useState<"human" | "ai" | null>(null);
  const [waitingForVote, setWaitingForVote] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
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

  // Use Google's Gemini API via AI SDK
  async function fetchAiMessage(contextText = "") {
    const prompt = `Sos una persona argentina que habla español rioplatense. Respondé de manera natural y conversacional, como si estuvieras chateando con alguien. De vez en cuando cometés pequeños errores gramaticales o de tipeo (falta de tildes, errores de ortografía menores). Mantené la respuesta MUY corta (máximo 2 oraciones). No uses muchas comas. Contexto de la conversación: ${contextText}`;

    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY;
      if (!apiKey) {
        console.warn("No Google AI API key found, using canned phrases");
        return aiPhrases[Math.floor(Math.random() * aiPhrases.length)];
      }

      const result = await generateText({
        model: google("gemini-1.5-flash"),
        prompt,
      });

      return (
        result.text || aiPhrases[Math.floor(Math.random() * aiPhrases.length)]
      );
    } catch (e) {
      console.error("AI generation failed:", e);
      // Fallback to canned phrases
      return aiPhrases[Math.floor(Math.random() * aiPhrases.length)];
    }
  }

  useEffect(() => {
    if (status !== "authenticated" || !session?.accessToken) return;

    // Use the Turing Detective namespace socket
    const s = getTuringSocket(session.accessToken);
    socketRef.current = s;

    if (!s) {
      addSystemMessage("Socket not available — running local demo mode.");
      console.warn(
        "[TextViewer] No socket available for chat, running local demo"
      );
      return;
    }

    console.log("[TextViewer] Using Turing socket (id):", s.id);

    // Listen for round start from server
    s.on(
      "turing:roundStart",
      (data: {
        round: number;
        yourRole: "human" | "ai";
        opponentRole: "human" | "ai";
        timeLimit: number;
      }) => {
        console.log("[TextViewer] Round started:", data);
        setRound(data.round);
        setMyRole(data.yourRole);
        setOpponentRole(data.opponentRole);
        setTimeLeft(data.timeLimit);
        setIsRunning(true);
        setMessages([]);
        setWaitingForVote(false);

        if (data.yourRole === "ai") {
          addSystemMessage(
            "Esta ronda juegas como IA. Los mensajes serán generados automáticamente."
          );
          startAI();
        } else {
          addSystemMessage(
            `Ronda ${data.round} iniciada. Tienes ${data.timeLimit} segundos para chatear.`
          );
        }
      }
    );

    // Listen for chat messages
    s.on(
      "turing:message",
      (payload: { senderId: string; text: string; timestamp: number }) => {
        console.log("[TextViewer] Message received:", payload);
        const msg: Message = {
          id: String(Math.random()).slice(2),
          sender: payload.senderId === s.id ? "you" : "opponent",
          text: payload.text,
          timestamp: payload.timestamp,
        };
        setMessages((m) => [...m, msg]);
      }
    );

    // Listen for round end
    s.on("turing:roundEnd", () => {
      console.log("[TextViewer] Round ended");
      stopAI();
      setIsRunning(false);
      setWaitingForVote(true);
      addSystemMessage(
        "Tiempo terminado. Adivina si tu oponente era humano o IA."
      );
    });

    // Listen for vote results
    s.on(
      "turing:voteResult",
      (data: {
        yourGuess: boolean;
        correct: boolean;
        actualRole: "human" | "ai";
      }) => {
        console.log("[TextViewer] Vote result:", data);
        const guessText = data.yourGuess ? "IA" : "Humano";
        const actualText = data.actualRole === "ai" ? "IA" : "Humano";
        const resultText = data.correct ? "¡Correcto!" : "Incorrecto";
        addSystemMessage(
          `Adivinaste: ${guessText}. Era: ${actualText}. ${resultText}`
        );
        setWaitingForVote(false);
      }
    );

    // Listen for game over
    s.on(
      "turing:gameOver",
      (data: { winner?: string; scores: Record<string, number> }) => {
        console.log("[TextViewer] Game over:", data);
        const myScore = data.scores[s.id || ""] || 0;
        const isWinner = data.winner === s.id;
        addSystemMessage(
          `¡Juego terminado! Tu puntaje: ${myScore}. ${
            isWinner ? "¡Ganaste! 🎉" : "Mejor suerte la próxima."
          }`
        );
        setGameStarted(false);
      }
    );

    return () => {
      s.off("turing:roundStart");
      s.off("turing:message");
      s.off("turing:roundEnd");
      s.off("turing:voteResult");
      s.off("turing:gameOver");
      socketRef.current = null;
      stopAI();
    };
  }, [roomId, status, session?.accessToken]);

  useEffect(() => {
    let tick: number | undefined;
    if (isRunning && timeLeft > 0) {
      tick = window.setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            // Time's up, let server know (server will emit roundEnd)
            return 0;
          }
          return t - 1;
        });
      }, 1000) as unknown as number;
    }

    return () => {
      if (tick) window.clearInterval(tick);
    };
  }, [isRunning, timeLeft]);

  function startGame() {
    console.log("[TextViewer] Starting game, emitting turing:startGame");
    socketRef.current?.emit("turing:startGame", { roomId });
    setGameStarted(true);
  }

  function startAI() {
    stopAI();
    // AI will send messages at random intervals during the round
    const sendAiMessage = async () => {
      const context = messages
        .slice(-6)
        .map((m) => `${m.sender}: ${m.text}`)
        .join(" \n ");
      const text = await fetchAiMessage(context);

      // Send AI message through socket (not just local state)
      socketRef.current?.emit("turing:message", { roomId, text });

      console.log("[TextViewer] AI sent message:", text);
    };

    const schedule = () => {
      // every 5-15 seconds
      const delay = 5000 + Math.floor(Math.random() * 10000);
      aiTimerRef.current = window.setTimeout(() => {
        if (isRunning && timeLeft > 0) {
          sendAiMessage();
          schedule();
        }
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
    if (!input.trim() || myRole === "ai") return; // Can't send if you're AI this round

    const text = input.trim();
    console.log("[TextViewer] Sending message:", text);
    socketRef.current?.emit("turing:message", { roomId, text });
    setInput("");
  }

  function vote(guessOpponentIsAI: boolean) {
    console.log("[TextViewer] Voting:", guessOpponentIsAI);
    socketRef.current?.emit("turing:vote", { roomId, guessOpponentIsAI });
    setWaitingForVote(false);
    addSystemMessage("Voto enviado. Esperando resultado...");
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header with round info and timer */}
      <div className="glass-box-one mb-4 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-4 py-2 rounded-lg">
              <span className="text-sm font-semibold text-white">
                Ronda {round} / 3
              </span>
            </div>
            {myRole && (
              <div
                className={`text-sm px-3 py-1 rounded-full ${
                  myRole === "ai"
                    ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                    : "bg-green-500/20 text-green-400 border border-green-500/30"
                }`}
              >
                {myRole === "ai"
                  ? "🤖 Juegas como IA"
                  : "👤 Juegas como Humano"}
              </div>
            )}
            {isRunning && (
              <div className="text-sm text-subtitle animate-pulse">
                🎮 Chateando...
              </div>
            )}
          </div>
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              timeLeft <= 10 && timeLeft > 0
                ? "bg-red-500/20 text-red-400 animate-pulse"
                : "bg-slate-700/50 text-white"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-mono font-bold text-lg">{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Chat messages */}
      <div className="glass-box-one mb-4 p-4 h-96 flex flex-col">
        <div
          className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-slate-700/30"
          data-testid="messages"
        >
          {messages.length === 0 && (
            <div className="h-full flex items-center justify-center text-subtitle">
              <div className="text-center">
                <svg
                  className="w-16 h-16 mx-auto mb-3 opacity-50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <p className="text-sm">Sin mensajes aún</p>
              </div>
            </div>
          )}
          {messages.map((m, idx) => (
            <div
              key={m.id}
              className={`flex ${
                m.sender === "you" ? "justify-end" : "justify-start"
              } animate-in slide-in-from-bottom-2 duration-300`}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              {m.sender === "system" ? (
                <div className="w-full text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full text-yellow-400 text-sm">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {m.text}
                  </div>
                </div>
              ) : (
                <div
                  className={`max-w-[75%] ${
                    m.sender === "you" ? "items-end" : "items-start"
                  } flex flex-col gap-1`}
                >
                  <div className="flex items-center gap-2 px-2">
                    <span
                      className={`text-xs font-medium ${
                        m.sender === "you" ? "text-blue-400" : "text-green-400"
                      }`}
                    >
                      {m.sender === "you" ? "Tú" : "Oponente"}
                    </span>
                  </div>
                  <div
                    className={`px-4 py-3 rounded-2xl shadow-lg ${
                      m.sender === "you"
                        ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-none"
                        : "bg-gradient-to-br from-slate-700 to-slate-800 text-white rounded-bl-none border border-slate-600/50"
                    }`}
                  >
                    <p className="text-sm leading-relaxed break-words">
                      {m.text}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Input area */}
      <div className="glass-box-one p-4">
        <div className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-600/50 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder={
              myRole === "ai"
                ? "La IA envía mensajes automáticamente..."
                : isRunning
                ? "Escribe tu mensaje..."
                : "Esperando inicio de ronda..."
            }
            disabled={!isRunning || myRole === "ai"}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!isRunning || !input.trim() || myRole === "ai"}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 shadow-lg"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-4 flex gap-3 justify-center">
        {!gameStarted && (
          <button
            onClick={startGame}
            className="group px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 active:scale-95 shadow-xl flex items-center gap-3"
          >
            <svg
              className="w-6 h-6 group-hover:rotate-12 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Iniciar Juego
          </button>
        )}

        {waitingForVote && (
          <div className="flex flex-col items-center gap-3 w-full max-w-md">
            <p className="text-lg font-semibold text-white mb-2">
              ¿Tu oponente era una IA?
            </p>
            <div className="flex gap-4 w-full">
              <button
                onClick={() => vote(true)}
                className="flex-1 group px-6 py-4 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl font-bold hover:from-red-700 hover:to-rose-700 transition-all transform hover:scale-105 active:scale-95 shadow-xl"
              >
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="w-6 h-6 group-hover:rotate-12 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Sí, era IA</span>
                </div>
              </button>
              <button
                onClick={() => vote(false)}
                className="flex-1 group px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 active:scale-95 shadow-xl"
              >
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="w-6 h-6 group-hover:rotate-12 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span>No, era Humano</span>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
