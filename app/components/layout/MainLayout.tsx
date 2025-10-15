// src/components/layout/MainLayout.tsx
"use client";
import React from 'react';
// Asume que tus componentes también están en TSX (Navbar.tsx, BottomBar.tsx)
import Navbar from '../iu/Navbar'; 
import BottomBar from '../iu/BottomBar'; 

// Define las interfaces para las props
interface NavbarProps {
    username: string;
    avatar: string;
    users: number;
}

interface MainLayoutProps {
  children: React.ReactNode;
  // Usamos la interfaz definida para las props del Navbar
  navbarProps: NavbarProps; 
}

export default function MainLayout({ children, navbarProps }: MainLayoutProps) {
  return (
    <div className="min-h-screen relative">
      
      <Navbar 
        username={navbarProps.username} 
        avatar={navbarProps.avatar} 
        users={navbarProps.users} 
      />

      <main className="flex justify-center w-full">
        {children}
      </main>

      <BottomBar />

    </div>
  );
}