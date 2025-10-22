import { useEffect, useRef, useState } from "react";
import { getSocket } from "@/app/socket";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { XpDataMap } from "@/types/rock-paper-scissors/CardProps";
import { useSession } from "next-auth/react";
import { Socket } from "socket.io-client";

interface PlayedMovements {
  id: string;
  move: string;
}
interface PlayerHealth {
  [playerId: string]: number;
}

interface RoomInfo {
  id: string;
  name: string;
  maxPlayers: number;
  currentPlayers: number;
  isPrivate: boolean;
}

export function useGameSocket(roomId: string | string[]) {
  const [winner, setWinner] = useState<string | null | undefined>(undefined);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [state, setState] = useState<string | null>(null);
  const [clicked, setClicked] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [selectedMove, setSelectedMove] = useState<string | null>(null);
  const [playerId, setPlayerId] = useState<string | undefined>(undefined);
  const [confirmedPlayers, setConfirmedPlayers] = useState<string[]>([]);
  const [countDown, setCountDown] = useState<number | null>(null);
  const [players, setPlayers] = useState<{ id: string }[]>([]);
  const [disableCards, setDisableCards] = useState<boolean>(false);
  const [gameInitialized, setGameInitialized] = useState<boolean>(false);
  const [playedMovements, setPlayedMovements] = useState<PlayedMovements[]>([]);
  const [playerHealth, setPlayerHealth] = useState<PlayerHealth>({});
  const [healthDamage, setHealthDamage] = useState<Record<string, number>>({});
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [totalDuration, setTotalDuration] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [roomInfo, setRoomInfo] = useState<RoomInfo | null>(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [score, setScore] = useState<{ [id: string]: number }>({});
  const [message, setMessage] = useState<string | null>(null);
  const [showXp, setShowXp] = useState(false);
  const [xpData, setXpData] = useState<XpDataMap | null>(null);
  const [gameWinner, setGameWinner] = useState<string | null>(null);
  const [playerNickname, setPlayerNickname] = useState<string | null>(null);
  const [showBattleAnimation, setShowBattleAnimation] =
    useState<boolean>(false);
  const [battleStage, setBattleStage] = useState<
    "moves" | "impact" | "damage" | "complete"
  >("moves");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const isAnimatingHealthRef = useRef(false);
  const previousHealthRef = useRef<PlayerHealth>({});
  const router = useRouter();
  const currentPathname = usePathname();
  const { data: session, status } = useSession();

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  useEffect(() => {
    if (status === "loading") return; // Esperar a que cargue la sesión
    if (!session?.accessToken) {
      console.warn("No hay token de autenticación");
      return;
    }

    const socket = getSocket(session.accessToken);
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Socket conectado:", socket.id);
    });

    socket.on("authenticated", (data) => {
      console.log("✅ Autenticado como:", data.nickname);
    });

    return () => {
      socketRef.current = null;
    };
  }, [session?.accessToken, status]);

  useEffect(() => {
    const socket = socketRef.current;

    if (!socket || !roomId) return;

    if (socket.connected) {
      setTimeout(() => {
        socket.emit("playerReadyForMatch", { roomId });
      }, 10);
    } else {
      socket.once("connect", () => {
        setTimeout(() => {
          socket.emit("playerReadyForMatch", { roomId });
        }, 10);
      });
    }

    const handleAuthenticated = (data: {
      nickname: string;
      socketId: string;
    }) => {
      console.log("✅ Autenticado como:", data.nickname);
      setPlayerNickname(data.nickname); // ← Guardar el nickname
      setPlayerId(data.socketId);
    };

    socket.on("authenticated", handleAuthenticated);

    socket.on("gameState", async (data) => {
      setPlayers(data.players.map((id: string) => ({ id })));
      console.log(`Jugadores en sala: ${data.players}`);
      if (!isAnimatingHealthRef.current) {
        setPlayerHealth(data.hp);
      }
      const confirmed = Object.entries(data.ready)
        .filter(([_, isReady]) => isReady)
        .map(([playerId]) => playerId);
      setConfirmedPlayers(confirmed);
      setRoomInfo(data.roomInfo);
      console.log(confirmed);
      console.log(data.hp);
      if (data.state === "PlayingState") {
        setWinner(undefined);
        setState("PlayingState");
        console.log(data.state);
        setGameInitialized(true);
      }

      if (data.state === "RevealingState") {
        setTimeLeft(null);
      }
      if (data.state === "FinishedState") {
        setState("FinishedState");
      }
    });

    socket.on("countDown", (data) => {
      setCountDown(data);
      console.log(`TIMER RECIBIDO: ${data}`);
      if (data === 0) {
        setCountDown(null);
      }
    });

    socket.on("roundResult", async (data) => {
      isAnimatingHealthRef.current = true;
      setGameOver(true);
      const movesArray: PlayedMovements[] = Object.entries(data.moves).map(
        ([id, move]) => ({
          id,
          move: String(move),
        })
      );
      setPlayedMovements(movesArray);
      previousHealthRef.current = { ...playerHealth };
      setWinner(data.winner);
      setHealthDamage(data.damage);
      setState("RevealingState");
      setDisableCards(true);
      setConfirmedPlayers([]);
      setShowBattleAnimation(true);
      const animationPromise = (async () => {
        setBattleStage("moves");
        await sleep(2500);
        setBattleStage("impact");
        await sleep(2000);
        setBattleStage("damage");
        setPlayerHealth(data.hpAfter);
        await sleep(2300);
        setBattleStage("complete");
        setShowBattleAnimation(false);
        isAnimatingHealthRef.current = false;
      })();
      await animationPromise;
    });

    socket.on("roundOver", () => {
      setConfirmed(false);
      setDisableCards(false);
      setSelectedMove(null);
      setClicked(null);
      setShowBattleAnimation(false);
      setPlayedMovements([]);
      socket.emit("playerReadyForMatch", { roomId });
    });

    socket.on("isPrivate", (data) => {
      setIsPrivate(true);
      setMessage(data.message);
    });

    socket.on("joinRoomError", (data) => {
      setError(data.message);
    });

    socket.on("joinRoomSuccess", ({ roomId }) => {
      setError(null);
      setIsPrivate(false);
      const targetUrl = `/games/rock-paper-scissors/${roomId}`;

      if (currentPathname === targetUrl) {
        router.refresh();
      } else {
        router.push(targetUrl);
      }
    });

    socket.on("playAgainStatus", (data) => {
      setConfirmedPlayers(data.confirmed);
    });

    socket.on("playAgainConfirmed", () => {
      setGameOver(false);
      setGameWinner(null);
    });

    socket.on("gameOver", (data) => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setScore(data.scores);
      setGameWinner(data.winner);

      setXpData(data.experienceResults);
      setTimeout(() => setShowXp(true), 2000);
    });

    socket.on("timerStart", (data) => {
      setTimeLeft(parseFloat(data.duration.toFixed(1)));
      const total = data.duration / 1000;
      setTotalDuration(total);
      console.log(data.duration);
    });

    socket.on("timerTick", (data) => {
      const rawMs = Number(data.remaining);
      if (!isFinite(rawMs)) return;

      const seconds = rawMs / 1000;
      const display = Math.floor(seconds * 10) / 10;
      setTimeLeft(display);
    });

    return () => {
      socket.off("playerJoined");
      socket.off("playersUpdate");
      socket.off("playAgainStatus");
      socket.off("playAgainConfirmed");
      socket.off("playerReadyForMatch");
      socket.off("timerStart");
      socket.off("roundOver");
      socket.off("roundStart");
      socket.off("autoMove");
      socket.off("gameOver");
      socket.off("healthUpdate");
      socket.off("waitingForPlayers");
      socket.off("countDown");
      socket.off("timerTick");
      socket.off("gameState");
      socket.off("roundResult");
      socket.off("joinRoomError");
      socket.off("joinRoomSuccess");
      socket.off("isPrivate");
      socket.off("authenticated");
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [roomId]);

  useEffect(() => {
    console.log("🔄 Estado cambió:", { clicked, confirmed, disableCards });
  }, [clicked, confirmed, disableCards]);

  const handlePlayerMove = (move: string) => {
    setClicked(move);
    setSelectedMove(move);
  };

  const handleConfirmMove = () => {
    if (selectedMove === null) return;
    setConfirmed(true);
    setDisableCards(true);
    socketRef?.current?.emit("makeMove", {
      roomId,
      move: selectedMove,
    });
  };

  const handlePlayAgain = () => {
    setDisableCards(false);
    setConfirmed(false);
    setClicked(null);
    setSelectedMove(null);
    socketRef?.current?.emit("confirmReady", { roomId });
  };

  const handleJoinRoomById = () => {
    const input = document.querySelector(
      'input[name="roomId"]'
    ) as HTMLInputElement;
    const roomId = input.value.trim();
    if (roomId.length === 0) {
      setError("El campo no puede estar vacío");
      return;
    }
    socketRef?.current?.emit("joinRoom", { roomId });
  };

  const handleJoinRoomByPassword = () => {
    const input = document.querySelector(
      'input[name="password"]'
    ) as HTMLInputElement;
    const password = input.value.trim();
    if (password.length === 0) {
      setError("El campo no puede estar vacío");
      return;
    }
    socketRef?.current?.emit("joinRoom", { roomId, password });
  };

  return {
    handlePlayerMove,
    handleConfirmMove,
    handlePlayAgain,
    playerId,
    players,
    confirmedPlayers,
    countDown,
    gameInitialized,
    playedMovements,
    playerHealth,
    healthDamage,
    gameOver,
    gameWinner,
    previousHealth: previousHealthRef.current,
    showBattleAnimation,
    battleStage,
    winner,
    timeLeft,
    disableCards,
    confirmed,
    selectedMove,
    clicked,
    state,
    totalDuration,
    handleJoinRoomByPassword,
    handleJoinRoomById,
    error,
    message,
    isPrivate,
    roomInfo,
    score,
    xpData,
    showXp,
    setShowXp,
    isLoading: status === "loading",
    isAuthenticated: !!session,
    playerNickname,
  };
}
