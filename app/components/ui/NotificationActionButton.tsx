"use client";
import React from 'react';
import { FaCheck, FaTimes } from "react-icons/fa";

interface ActionButtonProps {
  icon: 'check' | 'times'; 
  onClick?: () => void;
}

export default function NotificationActionButton({ icon, onClick }: ActionButtonProps) {
  const IconComponent = icon === 'check' ? FaCheck : FaTimes;
  const shapeClasses = "w-8 h-8 rounded-full flex items-center justify-center";
  
  return (
    <button 
        className={`btn-glow btn-force-circle ${shapeClasses} bg-[var(--light-blue)]/20 hover:bg-[var(--light-blue)]/40`} 
        onClick={onClick}
    >
      <IconComponent />
    </button>
  );
}