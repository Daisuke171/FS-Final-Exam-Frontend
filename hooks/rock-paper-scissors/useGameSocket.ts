import { useEffect, useRef, useState } from "react";
import { getSocket, disconnectSocket } from "@/app/socket";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { XpDataMap } from "@/types/rock-paper-scissors/CardProps";
import { useSession } from "next-auth/react";
import { Socket } from "socket.io-client";
import { set } from "zod";

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
  const [reconnectiontTimer, setReconnectionTimer] = useState<{
    player: string;
    timeLeft: number;
  } | null>(null);
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
    if (status === "loading") {
      console.log("⏳ Esperando sesión...");
      return;
    }

    if (status !== "authenticated" || !session?.accessToken) {
      console.warn("⚠️ No hay token de autenticación disponible");
      if (socketRef.current) {
        disconnectSocket();
        socketRef.current = null;
      }
      return;
    }

    if (socketRef.current) {
      console.log("♻️ Socket ya existe, reutilizando");
      return;
    }

    console.log(
      "🔌 Inicializando socket con token:",
      session.accessToken.substring(0, 20) + "..."
    );

    try {
      const socket = getSocket(session.accessToken);
      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("✅ Socket conectado:", socket.id);
      });

      socket.on("authenticated", (data) => {
        console.log("✅ Usuario autenticado:", data.nickname);
        setPlayerNickname(data.nickname);
        setPlayerId(data.socketId);
      });

      socket.on("error", (error) => {
        console.error("❌ Error del socket:", error);
      });

      socket.on("disconnect", (reason) => {
        console.log("❌ Socket desconectado:", reason);
      });
    } catch (error) {
      console.error("❌ Error al crear socket:", error);
    }

    return () => {
      console.log("🧹 Limpiando socket...");
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
      }
    };
  }, [session?.accessToken, status]);

  useEffect(() => {
    const socket = socketRef.current;

    if (!socket || !roomId) {
      console.log("⚠️ Socket o roomId no disponible");
      return;
    }

    console.log("🎮 Configurando listeners para room:", roomId);

    let hasJoined = false;

    const emitJoinRoom = () => {
      if (hasJoined) {
        console.log("⚠️ Ya se emitió joinRoom, saltando");
        return;
      }
      console.log("📤 Emitiendo joinRoom");
      socket.emit("joinRoom", { roomId });
    };

    if (socket.connected) {
      setTimeout(emitJoinRoom, 50);
    } else {
      socket.once("connect", () => {
        setTimeout(emitJoinRoom, 50);
      });
    }

    const handleGameState = async (data: any) => {
      console.log("📦 GAME STATE:", {
        state: data.state,
        players: data.players,
        ready: data.ready,
      });

      setPlayers(data.players.map((id: string) => ({ id })));

      if (!isAnimatingHealthRef.current) {
        setPlayerHealth(data.hp);
      }

      const confirmed = Object.entries(data.ready)
        .filter(([_, isReady]) => isReady)
        .map(([playerId]) => playerId);
      setConfirmedPlayers(confirmed);
      setRoomInfo(data.roomInfo);

      if (data.state) {
        console.log(`🔄 Cambiando estado a: ${data.state}`);
        setState(data.state);
      }

      if (data.state === "PlayingState" && !gameInitialized) {
        console.log("🎮 MODO JUEGO ACTIVADO");
        setWinner(undefined);
        setGameInitialized(true);
        setTimeout(() => {
          socket.emit("playerReadyForMatch", { roomId });
        }, 100);
      }
      if (data.state === "RevealingState") {
        console.log("👁️ REVELANDO RESULTADOS");
        setTimeLeft(null);
      }
    };

    const handleCountDown = (data: number) => {
      setCountDown(data);
      console.log(`⏱️ Countdown: ${data}`);
    };

    const handlePlayerDisconnected = (data: {
      nickname: string;
      reconnectionTime: number;
    }) => {
      setReconnectionTimer({
        player: data.nickname,
        timeLeft: data.reconnectionTime,
      });

      const countdownInterval = setInterval(() => {
        setReconnectionTimer((prev) => {
          if (!prev || prev.timeLeft <= 1) {
            clearInterval(countdownInterval);
            return null;
          }
          return {
            ...prev,
            timeLeft: prev.timeLeft - 1,
          };
        });
      }, 1000);
    };

    const handlePlayerReconnected = (data: { nickname: string }) => {
      console.log(`✅ ${data.nickname} se reconectó`);
      setReconnectionTimer(null);
    };

    const handleRoundResult = async (data: any) => {
      console.log("🎯 RESULTADO DE RONDA:", data);
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
    };

    const handleRoundOver = () => {
      console.log("🔄 RONDA TERMINADA");
      setConfirmed(false);
      setDisableCards(false);
      setSelectedMove(null);
      setClicked(null);
      setShowBattleAnimation(false);
      setPlayedMovements([]);
    };

    const handleIsPrivate = (data: any) => {
      console.log("🔒 Sala privada");
      setIsPrivate(true);
      setMessage(data.message);
    };

    const handleJoinRoomError = (data: any) => {
      console.log("❌ Error:", data.message);
      setError(data.message);
    };

    const handleJoinRoomSuccess = ({ roomId }: any) => {
      console.log("✅ Unido a sala:", roomId);
      setError(null);
      setIsPrivate(false);
      const targetUrl = `/games/rock-paper-scissors/${roomId}`;

      if (currentPathname === targetUrl) {
        router.refresh();
      } else {
        router.push(targetUrl);
      }
    };

    const handleGameOver = (data: any) => {
      console.log("🏁 JUEGO TERMINADO:", data);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setScore(data.scores);
      setGameWinner(data.winner);
      setXpData(data.experienceResults);
      setTimeout(() => setShowXp(true), 2000);
    };

    const handleTimerStart = (data: any) => {
      console.log("⏱️ Timer iniciado:", data.duration);
      setTimeLeft(parseFloat(data.duration.toFixed(1)));
      const total = data.duration / 1000;
      setTotalDuration(total);
    };

    const handleTimerTick = (data: any) => {
      const rawMs = Number(data.remaining);
      if (!isFinite(rawMs)) return;
      const seconds = rawMs / 1000;
      const display = Math.floor(seconds * 10) / 10;
      setTimeLeft(display);
    };

    socket.on("gameState", handleGameState);
    socket.on("countDown", handleCountDown);
    socket.on("roundResult", handleRoundResult);
    socket.on("roundOver", handleRoundOver);
    socket.on("isPrivate", handleIsPrivate);
    socket.on("joinRoomError", handleJoinRoomError);
    socket.on("joinRoomSuccess", handleJoinRoomSuccess);
    socket.on("gameOver", handleGameOver);
    socket.on("timerStart", handleTimerStart);
    socket.on("timerTick", handleTimerTick);
    socket.on("playerDisconnected", handlePlayerDisconnected);
    socket.on("playerReconnected", handlePlayerReconnected);

    return () => {
      socket.off("gameState", handleGameState);
      socket.off("countDown", handleCountDown);
      socket.off("roundResult", handleRoundResult);
      socket.off("roundOver", handleRoundOver);
      socket.off("isPrivate", handleIsPrivate);
      socket.off("joinRoomError", handleJoinRoomError);
      socket.off("joinRoomSuccess", handleJoinRoomSuccess);
      socket.off("gameOver", handleGameOver);
      socket.off("timerStart", handleTimerStart);
      socket.off("timerTick", handleTimerTick);
      socket.off("playerDisconnected", handlePlayerDisconnected);
      socket.off("playerReconnected", handlePlayerReconnected);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [roomId]);

  const handlePlayerMove = (move: string) => {
    setClicked(move);
    setSelectedMove(move);
  };

  const handleConfirmMove = () => {
    if (selectedMove === null || !socketRef.current) return;
    console.log("📤 Confirmando movimiento:", selectedMove);
    setConfirmed(true);
    setDisableCards(true);
    socketRef.current.emit("makeMove", {
      roomId,
      move: selectedMove,
    });
  };

  const handlePlayAgain = () => {
    if (!socketRef.current) return;
    console.log("🔄 Jugar de nuevo");
    setDisableCards(false);
    setConfirmed(false);
    setClicked(null);
    setSelectedMove(null);
    socketRef.current.emit("confirmReady", { roomId });
  };

  const handleJoinRoomById = () => {
    if (!socketRef.current) return;
    const input = document.querySelector(
      'input[name="roomId"]'
    ) as HTMLInputElement;
    const roomId = input.value.trim();
    if (roomId.length === 0) {
      setError("El campo no puede estar vacío");
      return;
    }
    console.log("📤 Uniéndose a sala:", roomId);
    socketRef.current.emit("joinRoom", { roomId });
  };

  const handleJoinRoomByPassword = () => {
    if (!socketRef.current) return;
    const input = document.querySelector(
      'input[name="password"]'
    ) as HTMLInputElement;
    const password = input.value.trim();
    if (password.length === 0) {
      setError("El campo no puede estar vacío");
      return;
    }
    console.log("📤 Uniéndose con contraseña");
    socketRef.current.emit("joinRoom", { roomId, password });
  };

  const handleConfirmReady = (ready: boolean = true) => {
    if (!socketRef.current) return;
    console.log("📤 Confirmando ready:", ready);
    socketRef.current.emit("confirmReady", { roomId, ready });
  };

  return {
    handlePlayerMove,
    handleConfirmMove,
    handlePlayAgain,
    handleConfirmReady,
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
    reconnectiontTimer,
  };
}
