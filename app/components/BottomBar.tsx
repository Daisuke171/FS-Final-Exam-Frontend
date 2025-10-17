"use client";
import { FaHome, FaGamepad, FaTrophy } from "react-icons/fa";

export default function BottomBar() {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-[var(--light-blue)]/20 flex justify-around py-2 shadow-lg z-50">
      <a href="#" className="text-white text-xl p-2 rounded-lg hover:bg-[var(--medium-blue)]/50 transition">
        <FaHome />
      </a>
      <a href="#" className="text-white text-xl p-2 rounded-lg hover:bg-[var(--medium-blue)]/50 transition">
        <FaGamepad />
      </a>
      <a href="#" className="text-white text-xl p-2 rounded-lg hover:bg-[var(--medium-blue)]/50 transition">
        <FaTrophy />
      </a>
    </div>
  );
}
