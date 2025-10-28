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
    ? "bg-background opacity-50 border-light-gray shadow-none transform translate-y-1 pointer-events-none"
    : "";

  return (
    <div className="relative group">
      <div
        onClick={onClick}
        className={`flex flex-col items-center p-4 gap-2 cursor-pointer border-2 bg-background transition-all rounded-xl  ${
          disableCards && isClicked
            ? "bg-bright-purple border-hover-purple opacity-80 shadow-none transform translate-y-1 pointer-events-none"
            : disableCards
            ? disableStyles
            : isClicked
            ? "bg-hover-purple border-background shadow-none transform translate-y-1 pointer-events-none"
            : "hover:border-hover-purple"
        }`}
      >
        <Icon
          icon={img}
          className={`pointer-events-none text-6xl sm:text-8xl ${
            disableCards && isClicked
              ? "scale-110 rotate-12 text-shadow-purple"
              : disableCards
              ? "scale-110 rotate-12 text-light-gray"
              : isClicked
              ? "scale-110 rotate-12 text-background"
              : "group-hover:scale-110 group-hover:text-bright-purple group-hover:rotate-12 text-subtitle  duration-300"
          } transition-all`}
        />
        <h2
          className={`text-lg sm:text-2xl ${galindo.className} ${
            disableCards && isClicked
              ? "text-shadow-purple"
              : disableCards
              ? "text-light-gray"
              : isClicked
              ? "text-background"
              : "text-font"
          }`}
        >
          {title}
        </h2>
      </div>
      {!disableCards && !isClicked && (
        <div
          className="absolute transition-all delay-100
       duration-500 inset-0 rounded-lg pointer-events-none 
       w-full h-full bg-bright-purple blur-md opacity-0 group-hover:opacity-40 -z-2"
        ></div>
      )}
    </div>
  );
}
