// src/components/layout/MainLayout.tsx
"use client";
import React from "react";
import Navbar from "../ui/general/landing-page/Navbar";
import BottomBar from "../ui/general/landing-page/BottomBar";

// Interfaces para las props
interface NavbarProps {
  username: string;
  avatar: string;
  users: number;
}

interface MainLayoutProps {
  children: React.ReactNode;
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

      <main className="flex justify-center w-full">{children}</main>

      <BottomBar />
    </div>
  );
}
