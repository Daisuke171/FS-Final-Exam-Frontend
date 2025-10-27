"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { getTuringSocket } from "@/app/socket";
import PlayersInRoom from "@/components/game/turing-detective/general/PlayersInRoom";
import CustomButtonOne from "@/components/game/turing-detective/buttons/CustomButtonOne";
import LoaderCard from "@/components/game/turing-detective/cards/LoaderCard";
import CountdownCard from "@/components/game/turing-detective/cards/CountdownCard";
import { useSession } from "next-auth/react";

interface GameStateData {
  players: string[];
  ready: Record<string, boolean>;
}

export default function ResultPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const roomId = String(params.roomId || "");
  const search = useSearchParams();
  const winner = search.get("winner") || "draw";
  const p1 = search.get("p1") || "0.00";
  const p2 = search.get("p2") || "0.00";

  // Room state for readiness panel
  const [players, setPlayers] = useState<string[]>([]);
  const [confirmed, setConfirmed] = useState<string[]>([]);
  const [playerId, setPlayerId] = useState<string | undefined>(undefined);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [countDown, setCountDown] = useState<number | null>(null);
  const [isReady, setIsReady] = useState(false);
  const countDownHandledRef = useRef(false);

  useEffect(() => {
    const s = getTuringSocket(session?.accessToken);
    const onGS = (data: Partial<GameStateData>) => {
      if (Array.isArray(data.players)) setPlayers(data.players);
      if (data?.ready) {
        const conf = Object.entries(data.ready)
          .filter(([, v]) => v)
          .map(([k]) => k);
        setConfirmed(conf);
        // Keep our toggle in sync if server changed it elsewhere
        if (s.id) setIsReady(conf.includes(s.id));
      }
      if (!playerId && s.id) setPlayerId(s.id);
    };
    const onCountDown = (n: number) => {
      setCountDown(n);
      // mirror room-component: go to match at 0
      if (n === 0 && !countDownHandledRef.current) {
        countDownHandledRef.current = true;
        setIsRedirecting(true);
        router.push(`/games/turing-detective/${roomId}/match`);
      }
    };
    s.on("gameState", onGS);
    s.on("countDown", onCountDown);
    // Ask for current state so we can show readiness right away
    if (roomId) s.emit("requestGameState", { roomId });
    return () => {
      s.off("gameState", onGS);
      s.off("countDown", onCountDown);
    };
  }, [roomId, playerId, router, session?.accessToken]);

  const handleReplayToggle = () => {
    const s = getTuringSocket(session?.accessToken);
    const next = !isReady;
    setIsReady(next);
    s.emit("confirmReady", { roomId, ready: next });
  };

  const playersForList = useMemo(
    () => players.map((id) => ({ id })),
    [players]
  );

  if (countDown !== null && countDown > 0) {
    // Show the big 3-2-1 visual timer centered while waiting to auto-redirect to match
    return (
      <div className="min-h-screen w-full flex items-center justify-center px-4 pt-[calc(75px+2.5rem)]">
        <CountdownCard countDown={countDown} />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 pt-[calc(75px+2.5rem)]">
      <div className="max-w-3xl w-full bg-gradient-to-br from-black/60 to-black/30 border border-white/10 rounded-2xl p-6 text-center">
        <h1 className="text-3xl font-semibold text-indigo-300 mb-2">
          Match Result
        </h1>
        <p className="text-white/70 mb-6">
          Room: <span className="text-indigo-400">{roomId}</span>
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-black/40 border border-white/10 rounded-lg p-4">
            <div className="text-white/60 text-sm">Player 1</div>
            <div className="text-green-400 text-2xl font-semibold">{p1}</div>
          </div>
          <div className="bg-black/40 border border-white/10 rounded-lg p-4">
            <div className="text-white/60 text-sm">Player 2</div>
            <div className="text-green-400 text-2xl font-semibold">{p2}</div>
          </div>
        </div>

        <div className="mb-8">
          <span className="px-4 py-2 rounded-lg border border-amber-500 text-amber-300 bg-black/40 inline-block">
            {winner === "draw" ? "It's a draw!" : `${winner} wins`}
          </span>
        </div>

        {/* Inline readiness panel (stay here, don't route to room) */}
        <div className="bg-black/30 border border-white/10 rounded-xl p-4 mb-6 text-left">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white/80 font-medium">
              Ready up for a rematch
            </h2>
            <CustomButtonOne
              text={isReady ? "Cancel" : "Replay"}
              action={handleReplayToggle}
              icon={isReady ? "mage:user-cross" : "mage:user-check"}
            />
          </div>
          <PlayersInRoom
            players={playersForList}
            confirmedPlayers={confirmed}
            playerId={playerId}
            label
          />
        </div>

        <div className="flex items-center justify-center gap-3">
          <Link
            href={`/games/turing-detective/${roomId}`}
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition border border-white/10"
          >
            Go to Room
          </Link>
        </div>
        {isRedirecting && (
          <div className="mt-4">
            <LoaderCard />
          </div>
        )}
      </div>
    </div>
  );
}
