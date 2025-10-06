import { Icon } from "@iconify/react";
import characterIcon from "@iconify-icons/game-icons/character";

interface Player {
  id: string;
}

export default function PlayersInRoom({
  players,
  confirmedPlayers,
  playerId,
  label,
}: {
  players: Player[];
  confirmedPlayers: string[];
  playerId: string | undefined;
  label: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      {label && (
        <h3 className="text-lg text-slate-800 mb-2 font-medium">
          Jugadores confirmados: ({confirmedPlayers.length}/2)
        </h3>
      )}
      <div className="flex flex-col items-center border-2 border-slate-800 justify-center px-6 py-3 bg-slate-400 rounded-xl">
        <div className="flex gap-2 text-slate-950">
          {[...players]
            .sort((a, b) => {
              if (a?.id === playerId) return -1;
              if (b?.id === playerId) return 1;
              return 0;
            })
            .concat(Array(2 - players.length).fill(null))
            .slice(0, 2)
            .map((player, index) => {
              const isConfirmed = player
                ? confirmedPlayers.includes(player.id)
                : false;
              return (
                <div
                  key={player?.id || index}
                  className="flex items-center"
                >
                  <Icon
                    icon={characterIcon}
                    width={25}
                    className={`transition-all ${
                      isConfirmed
                        ? "text-indigo-800 drop-shadow-[0_0_8px_var(--color-indigo-700)]"
                        : "text-slate-950"
                    }`}
                  />
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
