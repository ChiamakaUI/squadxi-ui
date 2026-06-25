import Image from "next/image";
import { Plus, Minus } from "lucide-react";
import type { Player } from "@/types";
import { PositionBadge } from "@/components/ui/status-badge";
import { formatUsdc, cn } from "@/lib/utils";

interface PlayerCardProps {
  player: Player;
  onAdd?: (player: Player) => void;
  onRemove?: (playerId: string) => void;
  inSquad?: boolean;
  cantAddReason?: string;
  compact?: boolean;
}

export function PlayerCard({
  player,
  onAdd,
  onRemove,
  inSquad = false,
  cantAddReason,
  compact = false,
}: PlayerCardProps) {
  const canAdd = !inSquad && !cantAddReason && !!onAdd;

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border bg-zinc-900 transition-colors",
        compact ? "px-3 py-2.5" : "px-4 py-3",
        inSquad
          ? "border-emerald-500/30 bg-emerald-500/5"
          : "border-zinc-800 hover:border-zinc-700"
      )}
    >
      {/* Photo */}
      <div className="relative shrink-0 h-10 w-10 rounded-full overflow-hidden bg-zinc-800">
        <Image
          src={player.photo_url}
          alt={player.name}
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white truncate">
            {player.name}
          </span>
          <PositionBadge position={player.position} />
        </div>
        <p className="text-xs text-zinc-500 truncate">{player.team_name}</p>
      </div>

      {/* Price + action */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-sm font-bold text-emerald-400">
          {formatUsdc(player.price)}
        </span>

        {inSquad && onRemove ? (
          <button
            onClick={() => onRemove(player.id)}
            className="flex items-center justify-center h-7 w-7 rounded-full bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
        ) : onAdd ? (
          <button
            onClick={() => canAdd && onAdd(player)}
            disabled={!canAdd}
            title={cantAddReason}
            className={cn(
              "flex items-center justify-center h-7 w-7 rounded-full transition-colors",
              canAdd
                ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"
                : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
            )}
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>
    </div>
  );
}