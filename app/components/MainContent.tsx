"use client";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function MainContent() {
  return (
    <div className="w-full flex justify-center px-2 md:px-6 lg:px-0 pt-28 pb-24 md:pb-0">
      <div className="w-full max-w-[900px] flex flex-col items-center space-y-6 relative z-10">
        
        {/* 🎮 Juegos Favoritos */}
        <div className="favorites-box glass-glow p-6 w-full">
          <h2 className="text-white font-bold text-lg mb-3 text-left">
            Juegos favoritos
          </h2>

          <div className="flex justify-start gap-4">
            <button className="w-20 h-20 rounded-lg border border-[var(--light-blue)] bg-[var(--medium-blue)]/10 text-3xl text-white hover:bg-[var(--medium-blue)]/30 transition">
              +
            </button>
            <button className="w-20 h-20 rounded-lg border border-[var(--light-blue)] bg-[var(--medium-blue)]/10 hover:bg-[var(--medium-blue)]/30 transition text-white">
              🎮
            </button>
            <button className="w-20 h-20 rounded-lg border border-[var(--light-blue)] bg-[var(--medium-blue)]/10 hover:bg-[var(--medium-blue)]/30 transition text-white">
              🎲
            </button>
          </div>
        </div>

        {/* ⚔️ Misiones y Notificaciones */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Misiones Diarias */}
          <div className="glass-glow p-6">
            <h2 className="text-lg font-bold text-white mb-4 text-left">
              Misiones diarias
            </h2>

            <div className="flex flex-col gap-3">
              <button className="mission-btn">
                <span>Gana 3 partidas de Tic-Tac-Toe</span>
                <span className="text-[var(--light-blue)]">(0/3)</span>
              </button>
              <button className="mission-btn">
                <span>Gana 10 partidas de Piedra-Papel-Tijeras</span>
                <span className="text-[var(--light-blue)]">(5/10)</span>
              </button>
              <button className="mission-btn">
                <span>Desafía a 3 amigos en Tic-Tac-Toe</span>
                <span className="text-[var(--light-blue)]">(0/3)</span>
              </button>
            </div>
          </div>

          {/* Notificaciones */}
          <div className="glass-glow p-6">
            <h2 className="text-lg font-bold text-white mb-4 text-left">
              Notificaciones
            </h2>

            <div className="flex flex-col gap-3">
              <div className="mission-btn justify-between">
                <span>Tu amigo Jhon te ha desafiado...</span>
                <div className="flex gap-2 action-icons">
                  <button><FaCheck /></button>
                  <button><FaTimes /></button>
                </div>
              </div>

              <div className="mission-btn justify-between">
                <span>Tienes nuevos mensajes...</span>
                <div className="flex gap-2 action-icons">
                  <button><FaCheck /></button>
                  <button><FaTimes /></button>
                </div>
              </div>

              <div className="mission-btn justify-between">
                <span>¡Subiste de nivel!</span>
                <div className="flex gap-2 action-icons">
                  <button><FaCheck /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
