"use client";

import { useState, useCallback } from "react";
import { Search } from "lucide-react";
import { usePlayers, usePlayerSearch } from "@/hooks/usePlayers";
import { PlayerCard } from "./player-card";
import { PageLoader, ErrorState } from "@/components/ui/states";
import type { Player, Position } from "@/types";
import { cn } from "@/lib/utils";

const POSITIONS: { label: string; value: Position | "" }[] = [
  { label: "All", value: "" },
  { label: "GK", value: "GK" },
  { label: "DEF", value: "DEF" },
  { label: "MID", value: "MID" },
  { label: "FWD", value: "FWD" },
];

interface PlayerBrowserProps {
  onAdd?: (player: Player) => void;
  onRemove?: (playerId: string) => void;
  squadPlayerIds?: string[];
  cantAddFn?: (player: Player) => string | undefined;
}

export function PlayerBrowser({
  onAdd,
  onRemove,
  squadPlayerIds = [],
  cantAddFn,
}: PlayerBrowserProps) {
  const [query, setQuery] = useState("");
  const [position, setPosition] = useState<Position | "">("");
  const [offset, setOffset] = useState(0);
  const PAGE_SIZE = 20;

  const isSearching = query.trim().length >= 2;

  const searchResult = usePlayerSearch(query);
  const listResult = usePlayers({
    position: position || undefined,
    limit: PAGE_SIZE,
    offset,
  });

  const { data, isLoading, isError, refetch } = isSearching
    ? searchResult
    : listResult;

  const players: Player[] = isSearching
    ? (Array.isArray(data) ? data : [])
    : (data && "players" in data ? data.players : []);

  const total = isSearching ? players.length : (data && "total" in data ? data.total : 0);

  const handlePositionChange = useCallback((pos: Position | "") => {
    setPosition(pos);
    setOffset(0);
  }, []);

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Search players…"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOffset(0); }}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-800/60 pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>

      {/* Position filter */}
      {!isSearching && (
        <div className="flex gap-1.5 flex-wrap">
          {POSITIONS.map((pos) => (
            <button
              key={pos.value}
              onClick={() => handlePositionChange(pos.value as Position | "")}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                position === pos.value
                  ? "bg-emerald-500 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
              )}
            >
              {pos.label}
            </button>
          ))}
        </div>
      )}

      {/* Player list */}
      <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
        {isLoading ? (
          <PageLoader />
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : players.length === 0 ? (
          <p className="text-center text-zinc-500 text-sm py-8">No players found</p>
        ) : (
          players.map((player) => {
            const inSquad = squadPlayerIds.includes(player.id);
            const cantAddReason = cantAddFn?.(player);
            return (
              <PlayerCard
                key={player.id}
                player={player}
                onAdd={onAdd}
                onRemove={onRemove}
                inSquad={inSquad}
                cantAddReason={cantAddReason}
                compact
              />
            );
          })
        )}
      </div>

      {/* Pagination (list mode only) */}
      {!isSearching && total > PAGE_SIZE && (
        <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
          <button
            disabled={offset === 0}
            onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
            className="text-xs text-zinc-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          <span className="text-xs text-zinc-500">
            {offset + 1}–{Math.min(offset + PAGE_SIZE, total)} of {total}
          </span>
          <button
            disabled={offset + PAGE_SIZE >= total}
            onClick={() => setOffset(offset + PAGE_SIZE)}
            className="text-xs text-zinc-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}