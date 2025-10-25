"use client";
import GameButton from "../../buttons/landing-page/GameButton";
import MissionItem from "./MissionItem";
import NotificationActionButton from "../../buttons/landing-page/NotificationActionButton";

export default function UserContent() {
  return (
    <div className="w-full flex justify-center mt-10 px-2 md:px-6 lg:px-0 pt-20 md:pt-24 lg:pt-20 pb-24 md:pb-0">
      <div
        className="w-full max-w-[900px] lg:max-w-4xl xl:max-w-6xl 
                   flex flex-col items-center space-y-6 relative z-10"
      >
        {/* 🎮 Juegos Favoritos */}
        <div className="favorites-box glass-glow p-6 max-w-lg w-full mx-auto">
          <h2 className="text-white font-bold text-sm md:text-base mb-6 text-left">
            Juegos favoritos
          </h2>
          <div className="flex justify-center gap-4">
            {/* Uso modularizado */}
            <GameButton >+</GameButton>
            <GameButton>🎮</GameButton>
            <GameButton>🎲</GameButton>
          </div>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* MISIONES DIARIAS */}
          <div className="glass-glow p-6">
            <h2 className="text-sm md:text-base font-bold text-white mb-4 text-left">
              Misiones diarias
            </h2>
            <div className="flex flex-col gap-3">
              {/* Uso modularizado */}
              <MissionItem isButton={true}>
                <span className="text-xs">Gana 3 partidas de Tic-Tac-Toe</span>
                <span className="text-[var(--light-blue)] text-xs">(0/3)</span>
              </MissionItem>
              <MissionItem isButton={true}>
                <span className="text-xs">
                  Gana 10 partidas de Piedra-Papel-Tijeras
                </span>
                <span className="text-[var(--light-blue)] text-xs">(5/10)</span>
              </MissionItem>
              <MissionItem isButton={true}>
                <span className="text-xs">
                  Desafía a 3 amigos en Tic-Tac-Toe
                </span>
                <span className="text-[var(--light-blue)] text-xs">(0/3)</span>
              </MissionItem>
            </div>
          </div>

          {/* NOTIFICACIONES */}
          <div className="glass-glow p-6">
            <h2 className="text-sm md:text-base font-bold text-white mb-4 text-left">
              Notificaciones
            </h2>
            <div className="flex flex-col gap-3">
              {/* Uso modularizado */}
              <MissionItem>
                <span className="text-xs">
                  Tu amigo Jhon te ha desafiado...
                </span>
                <div className="flex gap-2">
                  <NotificationActionButton icon="check" />
                  <NotificationActionButton icon="times" />
                </div>
              </MissionItem>

              {/* Uso modularizado */}
              <MissionItem>
                <span className="text-xs">Tienes nuevos mensajes...</span>
                <div className="flex gap-2">
                  <NotificationActionButton icon="check" />
                  <NotificationActionButton icon="times" />
                </div>
              </MissionItem>

              {/* Uso modularizado */}
              <MissionItem>
                <span className="text-xs">¡Subiste de nivel!</span>
                <div className="flex gap-2">
                  <NotificationActionButton icon="check" />
                </div>
              </MissionItem>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
