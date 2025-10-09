"use client";

export default function MainContent() {
  return (
    <div className="w-full flex justify-center px-2 md:px-6 lg:px-0 pt-28 pb-24 md:pb-0">
      {/* Contenedor principal centrado y limitado a 900px */}
      <div className="w-full max-w-[900px] flex flex-col items-center space-y-6 relative z-10">
        
        {/* Juegos Disponibles */}
        <div className="games-container bg-[var(--light-blue)]/20 rounded-xl p-4 shadow-lg w-full border border-gray-400/30 h-32 flex flex-col justify-center">
          <h2 className="text-white font-bold text-lg mb-2 text-center">Juegos Favoritos</h2>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => alert('Agregar nuevo juego favorito')}
              className="w-14 h-14 bg-[var(--medium-blue)]/50 hover:bg-[var(--medium-blue)]/70 
                         text-white text-2xl font-bold rounded-full flex items-center justify-center 
                         shadow-lg shadow-[var(--shadow-blue)]/40 transition"
            >
              ➕
            </button>

            <button
              onClick={() => (window.location.href = '/juego2')}
              className="w-16 h-16 bg-[var(--medium-blue)]/70 hover:bg-[var(--medium-blue)] 
                         text-white font-bold rounded-lg flex items-center justify-center 
                         shadow-md transition"
            >
              🎮 2
            </button>

            <button
              onClick={() => (window.location.href = '/juego3')}
              className="w-16 h-16 bg-[var(--medium-blue)]/70 hover:bg-[var(--medium-blue)] 
                         text-white font-bold rounded-lg flex items-center justify-center 
                         shadow-md transition"
            >
              🎮 3
            </button>
          </div>
        </div>

        {/* Notificaciones y Misiones */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="notification-box bg-[var(--light-blue)]/20 rounded-xl p-6 shadow-lg 
                          text-white border border-gray-400/30 h-48 flex flex-col justify-center">
            <h2 className="text-lg font-bold mb-2 text-center">Notificaciones</h2>
            
          </div>

          <div className="missions-box bg-[var(--light-blue)]/20 rounded-xl p-6 shadow-lg 
                          text-white border border-gray-400/30 h-48 flex flex-col justify-center">
            <h2 className="text-lg font-bold mb-2 text-center">Misiones</h2>
            
          </div>
        </div>
      </div>
    </div>
  );
}

