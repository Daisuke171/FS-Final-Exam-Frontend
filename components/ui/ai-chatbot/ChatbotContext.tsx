"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface ChatbotContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggleChat: () => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export function ChatbotProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <ChatbotContext.Provider value={{ isOpen, setIsOpen, toggleChat }}>
      {children}
    </ChatbotContext.Provider>
  );
}

export function useChatbot() {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
}

// Hook to open chatbot with a specific message
export function useChatbotHelper() {
  const { setIsOpen } = useChatbot();

  const openChatWithMessage = () => {
    setIsOpen(true);
    // This could be extended to pre-fill a message
  };

  return { openChatWithMessage };
}