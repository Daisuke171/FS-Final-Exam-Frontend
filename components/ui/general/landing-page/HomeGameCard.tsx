"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

interface HomeGameCardProps {
  title?: string;
  description?: string;
  image?: string;
  isComingSoon?: boolean;
  action?: () => void;
}

const HomeGameCard = ({
  title = "Piedra, Papel o Tijera",
  description = "El clásico reinventado",
  image = "/api/placeholder/400/250",
  isComingSoon = false,
  action,
}: HomeGameCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`group relative bg-black-blue w-full max-w-xs overflow-hidden rounded-xl md:bg-black/10 md:backdrop-blur-sm 
      border border-light-gray transition-all duration-500 ${
        !isComingSoon && "hover:border-light-blue hover:bg-medium-blue/10"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={action}
    >
      <div className="relative h-60 overflow-hidden bg-black/20">
        <Image
          src={image}
          alt={title}
          width={500}
          height={350}
          loading="lazy"
          className={`w-full h-full object-cover transition-all duration-700 ${
            isHovered && !isComingSoon
              ? "scale-105 opacity-80"
              : "scale-100 opacity-60"
          } ${isComingSoon ? "grayscale" : ""}`}
        />

        {isComingSoon && (
          <div className="absolute top-3 right-3 bg-transparent-purple md:backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-purple-300 border border-shadow-purple">
            Próximamente
          </div>
        )}
      </div>

      <div className="p-5 space-y-3">
        <h3 className="text-xl font-semibold text-font">{title}</h3>

        <p className="text-subtitle text-sm">{description}</p>

        <div
          className={`flex items-center gap-2 text-sm font-medium transition-all duration-300 ${
            isComingSoon
              ? "text-light-gray"
              : "text-medium-blue group-hover:text-light-blue group-hover:gap-3"
          }`}
        >
          {isComingSoon ? "Disponible pronto" : "Explorar"}
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>

      {!isComingSoon && (
        <div
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-light-blue to-shadow-blue transition-all duration-500"
          style={{ width: isHovered ? "100%" : "0%" }}
        />
      )}
    </div>
  );
};

export default HomeGameCard;
