"use client";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function MainContent() {
  return (
    <div
      className="
        w-full flex justify-center 
        px-2 md:px-6 lg:px-0 
        pt-20 md:pt-24 lg:pt-20 
        pb-24 md:pb-0
      "
    >
      <div
        className="
          w-full 
          max-w-[900px] 
          lg:max-w-4xl 
          xl:max-w-6xl 
          flex flex-col items-center 
          space-y-6 
          relative z-10
        "
      >
        {/* JUEGOS FAVORITOS */}
        <div className="favorites-box glass-glow p-6 max-w-lg w-full mx-auto">
          {/* Título: text-sm en móvil, text-base en escritorio */}
          <h2 className="text-white font-bold text-sm md:text-base mb-6 text-left">
            Juegos favoritos
          </h2>

          <div className="flex justify-center gap-4">
            <button className="w-24 h-24 rounded-lg border border-[var(--light-blue)] bg-[var(--medium-blue)]/10 text-3xl text-white transition btn-glow">
              +
            </button>
            <button className="w-24 h-24 rounded-lg border border-[var(--light-blue)] bg-[var(--medium-blue)]/10 text-white text-3xl transition btn-glow">
              🎮
            </button>
            <button className="w-24 h-24 rounded-lg border border-[var(--light-blue)] bg-[var(--medium-blue)]/10 text-white text-3xl transition btn-glow">
              🎲
            </button>
          </div>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* MISIONES DIARIAS */}
          <div className="glass-glow p-6">
            {/* Título: text-sm en móvil, text-base en escritorio */}
            <h2 className="text-sm md:text-base font-bold text-white mb-4 text-left">
              Misiones diarias
            </h2>

            <div className="flex flex-col gap-3">
              {/* Contenido: text-xs en móvil y escritorio */}
              <button className="mission-btn btn-glow">
                <span className="text-xs">Gana 3 partidas de Tic-Tac-Toe</span>
                <span className="text-[var(--light-blue)] text-xs">(0/3)</span>
              </button>
              <button className="mission-btn btn-glow">
                <span className="text-xs">Gana 10 partidas de Piedra-Papel-Tijeras</span>
                <span className="text-[var(--light-blue)] text-xs">(5/10)</span>
              </button>
              <button className="mission-btn btn-glow">
                <span className="text-xs">Desafía a 3 amigos en Tic-Tac-Toe</span>
                <span className="text-[var(--light-blue)] text-xs">(0/3)</span>
              </button>
            </div>
          </div>

          {/* NOTIFICACIONES */}
          <div className="glass-glow p-6">
            {/* Título: text-sm en móvil, text-base en escritorio */}
            <h2 className="text-sm md:text-base font-bold text-white mb-4 text-left">
              Notificaciones
            </h2>

            <div className="flex flex-col gap-3">
              {/* Contenido: text-xs en móvil y escritorio */}
              <div className="mission-btn btn-glow justify-between">
                <span className="text-xs">Tu amigo Jhon te ha desafiado...</span>
                <div className="flex gap-2 action-icons">
                  <button className="btn-glow p-1"><FaCheck /></button>
                  <button className="btn-glow p-1"><FaTimes /></button>
                </div>
              </div>

              <div className="mission-btn btn-glow justify-between">
                <span className="text-xs">Tienes nuevos mensajes...</span>
                <div className="flex gap-2 action-icons">
                  <button className="btn-glow p-1"><FaCheck /></button>
                  <button className="btn-glow p-1"><FaTimes /></button>
                </div>
              </div>

              <div className="mission-btn btn-glow justify-between">
                <span className="text-xs">¡Subiste de nivel!</span>
                <div className="flex gap-2 action-icons">
                  <button className="btn-glow p-1"><FaCheck /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}