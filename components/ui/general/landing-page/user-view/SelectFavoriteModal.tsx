import { useQuery } from "@apollo/client/react";
import { GET_GAMES } from "@/shared/graphql/queries/game.queries";
import { Game } from "@/types/game.types";
import CustomButtonOne from "@/components/game/rock-paper-scissors/buttons/CustomButtonOne";
import { useLockBodyScroll } from "@/hooks/useBlockBodyScroll";
import { motion } from "motion/react";
import Image from "next/image";

interface Games {
  games: Game[];
}

export default function SelectFavoriteModal({
  onAdd,
  onClose,
  toggling,
}: {
  onAdd: (gameId: string) => void;
  onClose: () => void;
  toggling: boolean;
}) {
  const { data, loading } = useQuery<Games>(GET_GAMES);
  useLockBodyScroll();
  const games = data?.games || [];

  const skeletons = 3;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/7
        rounded-xl p-6 z-90 w-[90%] max-w-190"
      >
        <div className="w-full">
          <h3 className="text-2xl font-bold text-font mb-4">
            Añadir juego favorito
          </h3>

          {loading ? (
            <div className="grid grid-cols-3 gap-4 mb-5 w-full">
              {Array.from({ length: skeletons }, (_, index) => (
                <div
                  key={index}
                  className="p-4 bg-black/20 min-w-55 min-h-66 rounded-lg animate-pulse"
                >
                  <div className="w-full h-32 bg-white/10 rounded mb-2 animate-pulse"></div>
                  <div className="h-6 bg-white/10 rounded w-3/4 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-white/10 rounded w-1/2 animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 mb-5 w-full">
              {games?.map((game: Game) => (
                <button
                  key={game.id}
                  onClick={() => {
                    onAdd(game.id);
                    onClose();
                  }}
                  className="p-4 cursor-pointer bg-black/15 min-w-55 rounded-lg hover:bg-white/10 transition-all"
                >
                  <Image
                    src={game.gameLogo || "/logos/default-game.webp"}
                    alt={game.name}
                    width={120}
                    height={160}
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                  <p className="text-center text-font font-medium mb-2 text-lg">
                    {game.name}
                  </p>
                  <p className="text-sm text-subtitle line-clamp-3">
                    {game.description}
                  </p>
                </button>
              ))}
            </div>
          )}

          <CustomButtonOne
            text="Cerrar"
            color="error"
            action={onClose}
            loading={toggling}
            icon={"carbon:close-outline"}
          />
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed top-0 left-0 w-full h-full bg-black/70 backdrop-blur-md z-80"
      ></motion.div>
    </>
  );
}
