import { useEffect, useRef, useState } from "react";
import { getSocket } from "@/app/socket";

interface PlayedMovements {
  id: string;
  move: string;
}
interface PlayerHealth {
  [playerId: string]: number;
}

// interface GameResult {
//   players: {
//     id: string;
//     userName: string;
//     move: string;
//   };
//   winner: string;
//   healthDamage: number;
// }

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
  const [gameWinner, setGameWinner] = useState<string | null>(null);
  const [showBattleAnimation, setShowBattleAnimation] =
    useState<boolean>(false);
  const [battleStage, setBattleStage] = useState<
    "moves" | "impact" | "damage" | "complete"
  >("moves");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const socketRef = useRef(getSocket());
  const isAnimatingHealthRef = useRef(false);
  const previousHealthRef = useRef<PlayerHealth>({});

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    const socket = socketRef.current;

    if (roomId) {
      socket.emit("playerReadyForMatch", { roomId });
    }

    setPlayerId(socket.id);

    const playerHealth: PlayerHealth = {};
    players.forEach((player) => {
      playerHealth[player.id] = 100;
    });
    setPlayerHealth(playerHealth);

    socket.on("gameState", async (data) => {
      setPlayers(data.players.map((id: string) => ({ id })));
      if (!isAnimatingHealthRef.current) {
        setPlayerHealth(data.hp || {});
      }
      const confirmed = Object.entries(data.ready)
        .filter(([_, isReady]) => isReady)
        .map(([playerId]) => playerId);
      setConfirmedPlayers(confirmed);
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
        setTimeout(() => {
          socket.emit("playerReadyForMatch", { roomId });
        }, 200);
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

      setGameWinner(data.winner);
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
      socket.off("roundStart");
      socket.off("autoMove");
      socket.off("gameOver");
      socket.off("healthUpdate");
      socket.off("waitingForPlayers");
      socket.off("countDown");
      socket.off("timerTick");
      socket.off("gameState");
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

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
    socketRef.current.emit("makeMove", {
      roomId,
      move: selectedMove,
    });
  };

  const handlePlayAgain = () => {
    setDisableCards(false);
    setConfirmed(false);
    setClicked(null);
    setSelectedMove(null);
    socketRef.current.emit("confirmReady", { roomId });
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
  };
}
