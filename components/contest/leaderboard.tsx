import { Trophy } from "lucide-react";
import type { LeaderboardEntry } from "@/types";
import { shortenAddress } from "@/lib/utils";
import { cn } from "@/lib/utils";

const RANK_STYLES: Record<number, string> = {
  1: "text-amber-400",
  2: "text-zinc-300",
  3: "text-orange-500",
};

export function Leaderboard({
  entries,
  currentUserId,
}: {
  entries: LeaderboardEntry[];
  currentUserId?: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-[40px_1fr_auto] gap-3 px-4 py-2.5 bg-zinc-800/60 text-xs font-medium text-zinc-500 uppercase tracking-wide">
        <span>#</span>
        <span>Player</span>
        <span>Points</span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-zinc-800/60">
        {entries.map((entry) => {
          const isMe = entry.user_id === currentUserId;
          return (
            <div
              key={entry.entry_id}
              className={cn(
                "grid grid-cols-[40px_1fr_auto] gap-3 px-4 py-3 items-center",
                isMe && "bg-emerald-500/5"
              )}
            >
              {/* Rank */}
              <span
                className={cn(
                  "text-sm font-bold",
                  RANK_STYLES[entry.rank] ?? "text-zinc-400"
                )}
              >
                {entry.rank <= 3 ? (
                  <Trophy className="h-4 w-4 inline" />
                ) : null}{" "}
                {entry.rank}
              </span>

              {/* Player info */}
              <div>
                <p className={cn("text-sm font-medium", isMe ? "text-emerald-400" : "text-white")}>
                  {entry.display_name}
                  {isMe && (
                    <span className="ml-2 text-xs bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full">
                      you
                    </span>
                  )}
                </p>
                <p className="text-xs text-zinc-500 font-mono">
                  {shortenAddress(entry.wallet_address)}
                </p>
              </div>

              {/* Points */}
              <span className="text-sm font-bold text-white tabular-nums">
                {entry.total_points}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}