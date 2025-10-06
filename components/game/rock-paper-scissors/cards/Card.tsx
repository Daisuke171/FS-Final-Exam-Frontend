import { Icon } from "@iconify/react";
import { Galindo } from "next/font/google";
import type { CardProps } from "@/types/rock-paper-scissors/CardProps";

const galindo = Galindo({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-galindo",
});

export default function Card({
  title,
  img,
  onClick,
  isClicked,
  disableCards,
}: CardProps) {
  const disableStyles = disableCards
    ? "bg-slate-400 border-slate-600 shadow-none transform translate-y-1 pointer-events-none"
    : "";

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center group p-4 gap-2 cursor-pointer border-2 transition-all rounded-xl shadow-[0_4px_0_var(--color-slate-900)]  ${
        disableCards && isClicked
          ? "bg-indigo-950 border-indigo-500 shadow-none transform translate-y-1 pointer-events-none"
          : disableCards
          ? disableStyles
          : isClicked
          ? "bg-slate-400 border-slate-600 shadow-none transform translate-y-1 pointer-events-none"
          : "hover:bg-slate-200"
      }`}
    >
      <Icon
        icon={img}
        width={90}
        className={`${
          disableCards && isClicked
            ? "scale-110 rotate-12 text-indigo-500"
            : disableCards
            ? "scale-110 rotate-12 text-slate-600"
            : isClicked
            ? "scale-110 rotate-12 text-slate-600"
            : "group-hover:scale-110 group-hover:rotate-12 text-slate-900  duration-300"
        } transition-all`}
      />
      <h2
        className={`text-2xl ${galindo.className} ${
          disableCards && isClicked
            ? "text-indigo-500"
            : disableCards
            ? "text-slate-600"
            : isClicked
            ? "text-slate-600"
            : "text-slate-900"
        }`}
      >
        {title}
      </h2>
    </button>
  );
}
