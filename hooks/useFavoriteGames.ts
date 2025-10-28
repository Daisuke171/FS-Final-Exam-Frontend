import { useQuery, useMutation } from "@apollo/client/react";
import {
  GET_USER_FAVORITES,
  TOGGLE_FAVORITE,
} from "@/shared/graphql/queries/user.queries";
import { useSession } from "next-auth/react";
import { GameFavorite, GetUserFavoritesData } from "@/types/game.types";

export interface FavoriteGame {
  id: string;
  name: string;
  img: string;
  games: number;
  winrate: number;
  lastgame: string;
}

export const useFavoriteGames = () => {
  const { data: session } = useSession();

  const { data, loading, error, refetch } = useQuery<GetUserFavoritesData>(
    GET_USER_FAVORITES,
    {
      skip: !session?.user,
    }
  );

  const [toggleFavoriteMutation, { loading: toggling }] = useMutation(
    TOGGLE_FAVORITE,
    {
      refetchQueries: [{ query: GET_USER_FAVORITES }],
      onCompleted: () => {
        console.log("✅ Favorito actualizado");
      },
      onError: (error) => {
        console.error("❌ Error al actualizar favorito:", error);
      },
    }
  );

  const toggleFavorite = async (gameId: string) => {
    try {
      await toggleFavoriteMutation({ variables: { gameId } });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const favoriteGames: FavoriteGame[] =
    data?.userFavorites?.map((fav: GameFavorite) => ({
      id: fav.game.id,
      name: fav.game.name,
      img: fav.game.gameLogo || "/logos/default-game.webp",
      games: fav.totalGames || 0,
      winrate: fav.winRate || 0,
      lastgame: fav.lastPlayed || "Nunca",
    })) || [];

  return {
    favoriteGames,
    loading,
    error,
    toggleFavorite,
    toggling,
    refetch,
  };
};
