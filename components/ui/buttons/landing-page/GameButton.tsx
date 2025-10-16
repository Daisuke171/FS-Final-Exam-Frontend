"use client";
import React from 'react';

interface GameButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export default function GameButton({ children, onClick }: GameButtonProps) {
  return (
    <button 
      className="w-24 h-24 rounded-lg border border-[var(--light-blue)] bg-[var(--medium-blue)]/10 text-3xl text-white transition btn-glow"
      onClick={onClick}
    >
      {children}
    </button>
  );
}