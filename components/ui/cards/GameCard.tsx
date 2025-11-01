"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import CustomButtonOne from "@/components/game/rock-paper-scissors/buttons/CustomButtonOne";
import { useRouter } from "next/navigation";
import Image from "next/image";

export interface GameCardProps {
  title?: string;
  description?: string;
  image?: string;
  players?: string;
  difficulty?: "easy" | "medium" | "hard";
  xpReward?: string;
  gameType?: string;
  isComingSoon?: boolean;
  href?: string;
  priority?: boolean;
}

const getDifficultyColor = {
  easy: "border-success text-light-success bg-transparent-success",
  medium: "border-ranking text-light-ranking bg-transparent-ranking",
  hard: "border-error text-light-error bg-transparent-error",
};

const GameCard = ({
  title = "Piedra, Papel o Tijera",
  description = "El clásico juego de manos reinventado. Desafía a tus amigos o enfrenta a la IA en partidas rápidas y emocionantes.",
  image = "/logos/rps-logo-lp.webp",
  players = "1-2",
  difficulty = "easy",
  xpReward = "+ 40",
  gameType = "Estrategia",
  isComingSoon = false,
  href = "#",
  priority = false,
}: GameCardProps) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative w-full bg-background max-w-sm overflow-hidden rounded-2xl ${
        isComingSoon
          ? "bg-neutral-900"
          : "bg-gradient-to-br from-black/10 via-black/20 to-black/30"
      } border border-light-gray/20 shadow-2xl transition-all duration-300 ${
        isComingSoon
          ? ""
          : "hover:shadow-medium-blue/40 hover:border-medium-blue"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isComingSoon && (
        <div className="absolute top-4 right-4 z-20 bg-light-purple  px-3 py-1 rounded-full text-xs font-bold text-white/80">
          Próximamente
        </div>
      )}

      <div className="relative h-48 overflow-hidden bg-black/60">
        <div
          className={`absolute inset-0 bg-gradient-to-b from-transparent ${
            isComingSoon ? "to-neutral-900/60" : "to-background/90"
          } z-10`}
        />
        <Image
          src={image}
          alt={title}
          width={350}
          height={200}
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isHovered ? "scale-110" : "scale-100"
          } ${isComingSoon ? "opacity-40 grayscale" : ""}`}
        />
        <div
          className={`absolute inset-0 bg-gradient-to-r from-medium-blue/0 via-medium-blue/20 to-medium-blue/0 transition-opacity duration-300 ${
            isHovered && !isComingSoon ? "opacity-100" : "opacity-0"
          }`}
          style={{
            transform:
              isHovered && !isComingSoon
                ? "translateX(100%)"
                : "translateX(-100%)",
            transition: "transform 0.8s ease-in-out, opacity 0.3s",
          }}
        />

        <div
          className={`absolute ${
            isComingSoon ? "grayscale" : ""
          } top-4 left-4 z-20 bg-transparent-blue md:backdrop-blur-sm px-3 py-1 rounded-full text-xs 
          font-semibold text-bright-blue border border-light-blue`}
        >
          {gameType}
        </div>
      </div>

      <div className="p-6 space-y-4">
        <h3 className="text-2xl font-bold text-font tracking-tight">{title}</h3>

        <p className="text-subtitle text-sm leading-relaxed line-clamp-2">
          {description}
        </p>

        <div
          className={`${
            isComingSoon ? "grayscale" : ""
          } grid grid-cols-2 gap-3`}
        >
          <div className="flex items-center gap-2 bg-white/4 rounded-lg px-3 py-2 border border-white/10">
            <Icon
              icon="mdi:users"
              className="text-light-blue text-xl"
            />
            <div>
              <p className="text-xs text-light-gray">Jugadores</p>
              <p className="text-sm font-semibold text-font">{players}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/4 rounded-lg px-3 py-2 border border-white/10">
            <Icon
              icon="streamline-ultimate:reward-stars-4-bold"
              className="text-ranking text-xl"
            />
            <div>
              <p className="text-xs text-light-gray">Recompensa</p>
              <div className="flex text-ranking items-center gap-1">
                <p className="text-sm font-semibold">{xpReward}</p>
                <Icon
                  icon="ix:trophy-filled"
                  className="text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className={`flex items-center gap-2 flex-wrap ${
            isComingSoon ? "grayscale" : ""
          }`}
        >
          <span
            className={`px-2 py-1 text-xs font-medium rounded-md border ${getDifficultyColor[difficulty]}`}
          >
            {difficulty === "easy"
              ? "Facil"
              : difficulty === "medium"
              ? "Medio"
              : "Dificil"}
          </span>
          <span className="px-2 py-1 bg-transparent-purple text-bright-purple text-xs font-medium rounded-md border border-bright-purple flex items-center gap-1">
            <Icon
              icon="material-symbols:trophy-outline"
              className="text-xs"
            />
            Competitivo
          </span>
          <span className="px-2 py-1 bg-transparent-blue text-bright-blue text-xs font-medium rounded-md border border-light-blue flex items-center gap-1">
            <Icon
              icon="material-symbols:timer-outline"
              className="text-xs"
            />
            Contrarreloj
          </span>
        </div>

        {/* Botón de acción */}
        <CustomButtonOne
          text={isComingSoon ? "Próximamente" : "Jugar Ahora"}
          icon="bxs:joystick"
          size="sm"
          disabled={isComingSoon}
          full
          center
          action={() => router.push(href)}
          variant="filled"
          color="secondary"
        />
      </div>

      {/* Efecto de brillo en el borde */}
      <div
        className={`absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none ${
          isHovered && !isComingSoon ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.1), transparent)",
        }}
      />
    </div>
  );
};

export default GameCard;
