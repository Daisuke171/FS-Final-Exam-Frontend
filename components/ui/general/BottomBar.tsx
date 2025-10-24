"use client";
import { FaHome, FaGamepad, FaTrophy, FaUserFriends } from "react-icons/fa";

export default function BottomBar() {
  // Estilo para el glow celeste, basado en tu barra superior
  const blueGlowStyle = {
    filter:
      "drop-shadow(0 0 5px rgba(76, 201, 240, 0.8)) drop-shadow(0 0 10px rgba(76, 201, 240, 0.4))",
    color: "inherit",
  };

  // Estilo para el glow dorado (manteniendo el anterior)
  const goldGlowStyle = {
    filter:
      "drop-shadow(0 0 5px rgba(253, 230, 138, 0.8)) drop-shadow(0 0 10px rgba(253, 230, 138, 0.4))",
    color: "inherit",
  };

  return (
    <div className="bottom-bar-mobile">
      {/* HOME: Color y glow celeste */}
      <a
        href=""
        className="text-light-blue text-xl p-2 rounded-lg hover:bg-shadow-blue/50 transition"
      >
        <FaHome style={blueGlowStyle} />
      </a>

      {/* GAMEPAD: Color y glow celeste */}
      <a
        href="#juegos"
        className="text-light-blue text-xl p-2 rounded-lg hover:bg-shadow-blue/50 transition"
      >
        <FaGamepad style={blueGlowStyle} />
      </a>

      {/* NUEVO BOTÓN: AMIGOS (Color y glow celeste, usando el link de la copa) */}
      <a
        href="app/friends/page.tsx"
        className="text-light-blue text-xl p-2 rounded-lg hover:bg-shadow-blue/50 transition"
      >
        <FaUserFriends style={blueGlowStyle} />
      </a>

      {/* TROPHY: Color y glow dorado (Actualizamos el link) */}
      <a
        href="#ranking"
        className="text-ranking text-xl p-2 rounded-lg hover:bg-shadow-ranking/60 transition"
      >
        <FaTrophy style={goldGlowStyle} />
      </a>
    </div>
  );
}
