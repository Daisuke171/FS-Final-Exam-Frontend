import Image from "next/image";

interface FavouriteGameProps {
  name: string;
  img: string;
  winrate: string;
  games: number;
  lastgame: string;
  onToggleFavorite?: () => void;
}

export default function FavouriteGame({
  name,
  img,
  winrate,
  games,
  lastgame,
  onToggleFavorite,
}: FavouriteGameProps) {
  return (
    <div className="p-5 flex flex-col gap-5 bg-white/4 hover:bg-white/6 transition-colors duration-300  rounded-xl min-w-68.5">
      <div className="flex items-center justify-between">
        <div className="h-13 w-16 rounded-lg overflow-hidden">
          <Image
            src={img}
            alt={name}
            width={50}
            height={50}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="flex flex-col items-end">
          <h3 className="text-2xl text-success font-bold">{winrate}</h3>
          <p className="text-subtitle text-sm">Win Rate</p>
        </div>
      </div>
      <div>
        <h3 className="text-lg text-font font-medium mb-3">{name}</h3>
        <div className="flex items-center justify-between">
          <p className="text-subtitle text-sm">{games} partidas</p>
          <p className="text-subtitle text-sm">{lastgame}</p>
        </div>
      </div>
    </div>
  );
}
