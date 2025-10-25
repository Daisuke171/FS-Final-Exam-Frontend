import { useEffect, useRef, useState } from "react";
import { getCodingWarSocket } from "@/app/socket";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

interface RoomInfo {
  id: string;
  name: string;
  maxPlayers: number;
  currentPlayers: number;
  isPrivate: boolean;
}

export function useRoomSocket(roomId: string | string[]) {
  // Normalize roomId to a single string in case Next.js provides an array
  const roomIdStr = Array.isArray(roomId) ? roomId[0] : roomId;
  const [players, setPlayers] = useState<{ id: string }[]>([]);
  const [confirmedPlayers, setConfirmedPlayers] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [roomInfo, setRoomInfo] = useState<RoomInfo | null>(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const { data: session, status } = useSession();
  const socketRef = useRef<ReturnType<typeof getCodingWarSocket> | null>(null);
  const router = useRouter();
  const currentPathname = usePathname();

  useEffect(() => {
    if (status !== "authenticated" || !session?.accessToken) return;
    const socket = getCodingWarSocket(session.accessToken);
    socketRef.current = socket;

    // Game/room state updates
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socket.on("gameState", (data: any) => {
      if (Array.isArray(data.players)) {
        setPlayers(data.players.map((id: string) => ({ id })));
      }
      if (data?.ready) {
        const confirmed = Object.entries(data.ready)
          .filter(([_, isReady]) => isReady)
          .map(([playerId]) => playerId);
        setConfirmedPlayers(confirmed);
      }
      if (data?.roomInfo) {
        setRoomInfo(data.roomInfo);
      }
    });

    // Private room flow
    socket.on("isPrivate", (data: { roomId: string; message: string }) => {
      setIsPrivate(true);
      setMessage(data.message);
    });

    // Errors
    socket.on("joinRoomError", (data: { message: string }) => {
      setError(data.message);
    });

    // Success: navigate to the room
    socket.on("joinRoomSuccess", ({ roomId }: { roomId: string }) => {
      setError(null);
      setIsPrivate(false);
      const targetUrl = `/games/coding-war/${roomId}`;
      if (currentPathname === targetUrl) router.refresh();
      else router.push(targetUrl);
    });

    return () => {
      socket.off("gameState");
      socket.off("isPrivate");
      socket.off("joinRoomError");
      socket.off("joinRoomSuccess");
    };
  }, [roomIdStr, status, session?.accessToken]);

  const handleJoinRoomById = () => {
    const input = document.querySelector(
      'input[name="roomId"]'
    ) as HTMLInputElement | null;
    const value = input?.value.trim() ?? "";
    if (value.length === 0) {
      setError("El campo no puede estar vacío");
      return;
    }
  socketRef.current?.emit("joinRoom", { roomId: value });
  };

  const handleJoinRoomByPassword = () => {
    const input = document.querySelector(
      'input[name="password"]'
    ) as HTMLInputElement | null;
    const password = input?.value.trim() ?? "";
    if (password.length === 0) {
      setError("El campo no puede estar vacío");
      return;
    }
  socketRef.current?.emit("joinRoom", { roomId: roomIdStr, password });
  };

  return {
    players,
    confirmedPlayers,
    error,
    roomInfo,
    isPrivate,
    message,
    handleJoinRoomById,
    handleJoinRoomByPassword,
  };
}
