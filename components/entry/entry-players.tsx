import Image from "next/image";
import type { PlayerWithPoints } from "@/types";
import { PositionBadge } from "@/components/ui/status-badge";
import { formatUsdc, formatPoints, cn } from "@/lib/utils";

const POSITION_ORDER = ["GK", "DEF", "MID", "FWD"];

export function EntryPlayers({ players }: { players: PlayerWithPoints[] }) {
  const byPosition = POSITION_ORDER.map((pos) => ({
    pos,
    players: players.filter((p) => p.position === pos),
  })).filter((g) => g.players.length > 0);

  return (
    <div className="space-y-5">
      {byPosition.map(({ pos, players: posPlayers }) => (
        <div key={pos}>
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2">
            {pos}
          </p>
          <div className="space-y-1.5">
            {posPlayers.map((player) => (
              <PlayerPointsRow key={player.id} player={player} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function PlayerPointsRow({ player }: { player: PlayerWithPoints }) {
  const pts = player.points ?? 0;
  const positive = pts > 0;

  return (
    <div className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3">
      <div className="relative h-9 w-9 rounded-full overflow-hidden bg-zinc-800 shrink-0">
        <Image
          src={player.photo_url}
          alt={player.name}
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white truncate">{player.name}</span>
          <PositionBadge position={player.position} />
        </div>
        <p className="text-xs text-zinc-500">{player.team_name}</p>
      </div>

      <div className="text-right shrink-0">
        <p
          className={cn(
            "text-base font-bold tabular-nums",
            positive ? "text-emerald-400" : pts === 0 ? "text-zinc-500" : "text-red-400"
          )}
        >
          {formatPoints(pts)}
        </p>
        <p className="text-xs text-zinc-600">{formatUsdc(player.price)}</p>
      </div>
    </div>
  );
}