"use client";

import { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "motion/react";
import { useSession } from "next-auth/react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: `¡Hola${
            session.user.name ? ` ${session.user.name}` : ""
          }! 🎮 Soy Sanya AI, tu asistente para la plataforma de gaming. ¿En qué puedo ayudarte hoy?

🎯 Puedo ayudarte con:
• Estrategias de juego
• Navegación de la plataforma  
• Consejos para mejorar
• Información sobre nuestros juegos`,
        },
      ]);
    } else if (status === "unauthenticated") {
      setMessages([
        {
          id: "auth-required",
          role: "assistant",
          content: `👋 ¡Hola! Para usar el chatbot de Sanya AI necesitas iniciar sesión.

🔐 Por favor, inicia sesión para acceder a:
• Consejos personalizados de gaming
• Ayuda con la plataforma
• Estrategias de juego
• Y mucho más`,
        },
      ]);
    }
  }, [session?.user?.name, session?.user, status]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleChat = () => setIsOpen(!isOpen);

  // Don't render if still loading authentication
  if (status === "loading") {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Check authentication
    if (status !== "authenticated" || !session?.user) {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content:
            "🔐 Necesitas iniciar sesión para usar el chatbot. Por favor, inicia sesión e intenta de nuevo.",
        },
      ]);
      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
    };

    setInput("");
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(
            "No autorizado. Por favor, inicia sesión e intenta de nuevo."
          );
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: "",
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;

        if (value) {
          const chunk = decoder.decode(value, { stream: true });

          // Parse the streamed text response
          // The AI SDK sends data in different formats, let's handle them
          if (chunk) {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessage.id
                  ? { ...msg, content: msg.content + chunk }
                  : msg
              )
            );
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "Lo siento, hubo un error. Por favor intenta de nuevo.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // Predefined quick actions
  const quickActions = [
    {
      text: "¿Cómo jugar Rock Paper Scissors?",
      icon: "game-icons:rock-paper-scissors",
    },
    { text: "Tips para Coding War", icon: "material-symbols:code" },
    { text: "¿Qué es Turing Detective?", icon: "material-symbols:psychology" },
    { text: "Ver mi progreso", icon: "material-symbols:trending-up" },
  ];

  const handleQuickAction = async (text: string) => {
    if (isLoading) return;

    // Check authentication
    if (status !== "authenticated" || !session?.user) {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content:
            "🔐 Necesitas iniciar sesión para usar el chatbot. Por favor, inicia sesión e intenta de nuevo.",
        },
      ]);
      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(
            "No autorizado. Por favor, inicia sesión e intenta de nuevo."
          );
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: "",
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;

        if (value) {
          const chunk = decoder.decode(value, { stream: true });

          if (chunk) {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessage.id
                  ? { ...msg, content: msg.content + chunk }
                  : msg
              )
            );
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "Lo siento, hubo un error. Por favor intenta de nuevo.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        onClick={toggleChat}
        className="fixed bottom-17 md:bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center z-50 border border-white/20"
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Icon
            icon={
              isOpen ? "material-symbols:close" : "material-symbols:smart-toy"
            }
            className="text-white text-3xl"
          />
        </motion.div>

        {/* Notification badge */}
        <motion.div
          className="absolute -top-1 -right-1 w-4 h-4 bg-error rounded-full flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: isOpen ? 0 : 1 }}
          transition={{ delay: 2 }}
        >
          <Icon
            icon="material-symbols:chat"
            className="text-white text-xs"
          />
        </motion.div>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-30 md:bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] h-[36rem] max-h-[calc(100vh-8rem)] bg-gray-900/90 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-2xl z-200 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600/30 via-blue-600/30 to-indigo-600/30 p-4 border-b border-purple-500/20">
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center"
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Icon
                    icon="material-symbols:smart-toy"
                    className="text-white text-xl"
                  />
                </motion.div>
                <div>
                  <h3 className="font-bold text-white text-lg">Sanya AI</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <p className="text-xs text-green-400">
                      Online • Gemini 1.5 Flash
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-900/50 to-gray-800/50">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                        : "bg-gray-800/80 text-white border border-gray-700/50 shadow-lg"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </p>
                    {message.role === "assistant" && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-gray-400">
                        <Icon
                          icon="material-symbols:smart-toy"
                          className="text-xs"
                        />
                        <span>Sanya AI</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-800/80 border border-gray-700/50 p-4 rounded-2xl shadow-lg">
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-400">
                        Sanya AI está pensando...
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length === 1 && status === "authenticated" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 py-2 border-t border-gray-700/50"
              >
                <p className="text-xs text-gray-400 mb-2">Acciones rápidas:</p>
                <div className="flex flex-wrap gap-1">
                  {quickActions.map((action, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleQuickAction(action.text)}
                      disabled={status !== "authenticated"}
                      className="flex items-center gap-1 px-2 py-1 bg-gray-800/60 hover:bg-purple-600/30 disabled:hover:bg-gray-800/60 border border-gray-700/50 rounded-lg text-xs text-gray-300 disabled:text-gray-500 transition-all duration-200"
                      whileHover={{
                        scale: status === "authenticated" ? 1.05 : 1,
                      }}
                      whileTap={{
                        scale: status === "authenticated" ? 0.95 : 1,
                      }}
                    >
                      <Icon
                        icon={action.icon}
                        className="text-xs"
                      />
                      <span className="truncate max-w-20">
                        {action.text.split(" ")[0]}...
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="p-4 border-t border-gray-700/50 bg-gray-900/50"
            >
              <div className="flex gap-3">
                <input
                  value={input}
                  onChange={handleInputChange}
                  placeholder={
                    status === "authenticated"
                      ? "Pregúntame sobre gaming..."
                      : "Inicia sesión para usar el chatbot"
                  }
                  className="flex-1 bg-gray-800/80 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading || status !== "authenticated"}
                />
                <motion.button
                  type="submit"
                  disabled={
                    isLoading || !input.trim() || status !== "authenticated"
                  }
                  className="bg-gradient-to-r from-purple-600 to-blue-600 disabled:from-gray-600 disabled:to-gray-700 p-3 rounded-xl transition-all duration-200 shadow-lg disabled:shadow-none disabled:opacity-50"
                  whileHover={{
                    scale:
                      status === "authenticated" && !isLoading && input.trim()
                        ? 1.05
                        : 1,
                  }}
                  whileTap={{
                    scale:
                      status === "authenticated" && !isLoading && input.trim()
                        ? 0.95
                        : 1,
                  }}
                >
                  <Icon
                    icon={
                      isLoading
                        ? "material-symbols:hourglass-empty"
                        : "material-symbols:send"
                    }
                    className={`text-white text-lg ${
                      isLoading ? "animate-spin" : ""
                    }`}
                  />
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
