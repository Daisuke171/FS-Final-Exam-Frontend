// app/components/ui/MissionItem.tsx
"use client";
import React from 'react';

interface MissionItemProps {
  children: React.ReactNode;
  isButton?: boolean; // Para decidir si es <button> o <div> (Misiones vs Notificaciones)
  onClick?: () => void;
}

export default function MissionItem({ children, isButton = false, onClick }: MissionItemProps) {
  // Clases del contenedor .mission-btn y .btn-glow (fondo, borde, padding)
  const commonClasses = "mission-btn btn-glow flex justify-between items-center w-full px-4 py-2 rounded-lg text-white font-semibold bg-[var(--medium-blue)]/20 border border-[var(--light-blue)]/30 transition-all";
  
  if (isButton) {
    return (
      <button className={commonClasses} onClick={onClick}>
        {children}
      </button>
    );
  }

  return (
    <div className={commonClasses}>
      {children}
    </div>
  );
}