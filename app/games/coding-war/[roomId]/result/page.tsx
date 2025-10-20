"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

export default function ResultPage() {
  const params = useParams();
  const roomId = String(params.roomId || "");
  const search = useSearchParams();
  const winner = search.get("winner") || "draw";
  const p1 = search.get("p1") || "0.00";
  const p2 = search.get("p2") || "0.00";

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4">
      <div className="max-w-xl w-full bg-gradient-to-br from-black/60 to-black/30 border border-white/10 rounded-2xl p-6 text-center">
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

        <div className="flex items-center justify-center gap-3">
          <Link
            href={`/games/coding-war/${roomId}/match`}
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition border border-indigo-500"
          >
            Replay
          </Link>
          <Link
            href={`/games/coding-war/${roomId}`}
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition border border-white/10"
          >
            Go to Room
          </Link>
        </div>
      </div>
    </div>
  );
}
