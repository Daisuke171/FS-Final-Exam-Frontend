"use client";

import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import FavouriteGame from "./FavouriteGame";
import { useFavoriteGames } from "@/hooks/useFavoriteGames";
import SelectFavoriteModal from "./SelectFavoriteModal";
import FavoriteGameSkeleton from "@/components/ui/skeletons/landing-page/user-view/FavoriteGameSkeleton";

// const favoriteGames = [
//   {
//     id: 1,
//     name: "Rock Paper Scissors",
//     img: "/logos/rps-logo-lp.webp",
//     games: 234,
//     winrate: 67,
//     lastgame: "Hace 2h",
//   },
//   {
//     id: 2,
//     name: "Code War",
//     img: "/logos/cw-logo-lp.webp",
//     games: 156,
//     winrate: 71,
//     lastgame: "Hace 5h",
//   },
//   {
//     id: 3,
//     name: "Turing Detective",
//     img: "/logos/td-logo-lp.jpg",
//     games: 89,
//     winrate: 45,
//     lastgame: "Ayer",
//   },
//   {
//     id: 4,
//     name: "Math War",
//     img: "/logos/md-logo-lp.webp",
//     games: 67,
//     winrate: 82,
//     lastgame: "Hace 3 días",
//   },
//   {
//     id: 5,
//     name: "Tic Tac Toe",
//     img: "/logos/md-logo-lp.webp",
//     games: 237,
//     winrate: 42,
//     lastgame: "Hace 3 días",
//   },
// ];

export default function FavoriteGames() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const { favoriteGames, loading, toggleFavorite, toggling } =
    useFavoriteGames();

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [favoriteGames]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollPosition =
        direction === "left"
          ? scrollContainerRef.current.scrollLeft - scrollAmount
          : scrollContainerRef.current.scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: "smooth",
      });
    }
  };

  const handleOpenModal = () => {
    setOpenModal(!openModal);
  };
  const skeletons = 4;
  return (
    <motion.section
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="w-[90%] flex flex-col z-20 items-center max-w-300"
    >
      <div className="flex items-start gap-5 xs:gap-0 xs:items-center flex-col xs:flex-row xs:justify-between mb-5 w-full">
        <h2 className="text-xl md:text-2xl text-font pb-3 font-medium flex items-center relative gap-2 after:h-0.5 after:absolute after:w-2/3 after:bg-gradient-to-r after:from-light-blue after:to-medium-blue after:-bottom-1 after:left-0 after:rounded-full">
          <Icon
            icon={"material-symbols:star"}
            className="text-light-blue text-2xl md:text-3xl"
          />
          Juegos Favoritos
        </h2>
        <button
          onClick={handleOpenModal}
          className="cursor-pointer flex items-center gap-1 py-2 px-4 bg-white/5 rounded-lg hover:bg-dark-blue transition-all"
        >
          <Icon
            icon="mdi:favorite-add-outline"
            className="text-2xl"
          />
          Añadir un juego
        </button>
      </div>
      {loading ? (
        <div className="relative group w-[100%] max-w-300 bg-white/2 backdrop-blur-sm  p-4 rounded-xl h-51">
          <div className="flex items-center gap-6 overflow-x-auto w-full h-full">
            {Array.from({ length: skeletons }).map((_, index) => (
              <FavoriteGameSkeleton key={index} />
            ))}
          </div>
        </div>
      ) : favoriteGames.length > 0 ? (
        <div className="relative group w-[100%] max-w-300 bg-white/2 backdrop-blur-sm p-4 rounded-xl">
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/90 hover:bg-background 
              border-2 border-light-gray rounded-full p-2 transition-all opacity-0 group-hover:opacity-100 shadow-lg"
              aria-label="Scroll left"
            >
              <Icon
                icon="material-symbols:chevron-left"
                className="text-font text-2xl"
              />
            </button>
          )}
          <motion.div
            ref={scrollContainerRef}
            layout
            onScroll={checkScroll}
            className="flex items-center gap-6 overflow-x-auto scrollbar-none scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <AnimatePresence mode="popLayout">
              {favoriteGames.map((game) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  key={game.id}
                  layout
                >
                  <FavouriteGame
                    name={game.name}
                    img={game.img}
                    winrate={`${game.winrate}%`}
                    games={game.games}
                    lastgame={game.lastgame}
                    onToggleFavorite={() => toggleFavorite(game.id)}
                    toggling={toggling}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/90 hover:bg-background 
              border-2 border-light-gray rounded-full p-2 transition-all opacity-0 group-hover:opacity-100 shadow-lg"
              aria-label="Scroll right"
            >
              <Icon
                icon="material-symbols:chevron-right"
                className="text-font text-2xl"
              />
            </button>
          )}
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center text-font
           font-medium w-full max-w-300 h-51 backdrop-blur-sm  bg-white/2 rounded-xl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center"
          >
            <Icon
              icon="mingcute:empty-box-fill"
              className="text-7xl"
            />
            <p className="flex items-center gap-2 text-xl">
              No tienes juegos favoritos aún
            </p>
            <p className="text-subtitle font-normal">
              Añade alguno de tus juegos favoritos
            </p>
          </motion.div>
        </div>
      )}
      <AnimatePresence>
        {openModal && (
          <SelectFavoriteModal
            onClose={handleOpenModal}
            onAdd={toggleFavorite}
            toggling={toggling}
            favoriteGames={favoriteGames}
          />
        )}
      </AnimatePresence>
    </motion.section>
  );
}
