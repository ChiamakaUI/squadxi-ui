"use client";

import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Trophy, TrendingUp, TrendingDown } from "lucide-react";
import { AuthLayout } from "@/components/layout/auth-layout";
import { PositionBadge } from "@/components/ui/status-badge";
import { PageLoader, ErrorState } from "@/components/ui/states";
import { useEntryPlayers } from "@/hooks/useEntries";
import { formatUsdc, cn } from "@/lib/utils";
import type { PlayerWithPoints, Position } from "@/types";

const POSITION_ORDER: Position[] = ["GK", "DEF", "MID", "FWD"];

const POS_ACCENT: Record<Position, string> = {
  GK: "text-amber-400 border-amber-500/30 bg-amber-500/5",
  DEF: "text-sky-400 border-sky-500/30 bg-sky-500/5",
  MID: "text-emerald-400 border-emerald-500/30 bg-emerald-500/5",
  FWD: "text-orange-400 border-orange-500/30 bg-orange-500/5",
};

const SCORING_QUICK = [
  { event: "Goal (FWD/MID)", pts: 6 }, { event: "Goal (DEF/GK)", pts: 8 },
  { event: "Assist", pts: 3 }, { event: "Clean sheet (DEF/GK)", pts: 4 },
  { event: "Penalty save (GK)", pts: 5 }, { event: "Mins ≥ 60", pts: 2 },
  { event: "Yellow card", pts: -1 }, { event: "Red card", pts: -3 },
];

export default function EntryDetailPage() {
  const { id }     = useParams<{ id: string }>();
  const params     = useSearchParams();
  const contestId  = params.get("contestId") ?? "";

  const { data: players, isLoading, isError, refetch } = useEntryPlayers(id, contestId);

  const totalPoints = players?.reduce((s, p) => s + (p.points ?? 0), 0) ?? 0;
  const topScorer   = players?.reduce((best, p) => (p.points ?? 0) > (best?.points ?? 0) ? p : best, players?.[0]);

  return (
    <AuthLayout>
      <div className="space-y-6 max-w-2xl">
        {/* Back */}
        <Link href="/squad" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors">
          <ChevronLeft className="h-4 w-4" /> My Squad
        </Link>

        {/* Header */}
        {isLoading ? (
          <PageLoader />
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : (
          <>
            <div className="rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden">
              <div className="h-0.5 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
              <div className="p-6 sm:p-8">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Total Points</p>
                    <p className="font-display text-6xl sm:text-7xl font-black text-white leading-none mt-1">
                      {totalPoints}
                    </p>
                    <p className="text-xs text-zinc-600 mt-2">
                      Entry {id.slice(0, 8)}…
                    </p>
                  </div>
                  {topScorer && (
                    <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 flex flex-col justify-center">
                      <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Top scorer</p>
                      <p className="text-xs font-bold text-white truncate">{topScorer.name}</p>
                      <p className="font-display text-2xl font-black text-emerald-400 leading-none mt-1">
                        {topScorer.points ?? 0}<span className="text-sm font-normal text-zinc-500 ml-1">pts</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Scoring reference */}
            <details className="group rounded-xl border border-white/8 bg-white/[0.02]">
              <summary className="px-5 py-3.5 text-sm font-semibold text-zinc-400 cursor-pointer flex items-center justify-between list-none hover:text-white transition-colors">
                <span className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-emerald-400" />
                  Scoring reference
                </span>
                <span className="text-zinc-600 group-open:rotate-180 transition-transform text-xs">▾</span>
              </summary>
              <div className="px-5 pb-4 grid grid-cols-2 gap-x-6 gap-y-2">
                {SCORING_QUICK.map(({ event, pts }) => (
                  <div key={event} className="flex justify-between text-xs">
                    <span className="text-zinc-500">{event}</span>
                    <span className={pts > 0 ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
                      {pts > 0 ? `+${pts}` : pts}
                    </span>
                  </div>
                ))}
              </div>
            </details>

            {/* Players by position */}
            <div className="space-y-6">
              {POSITION_ORDER.map((pos) => {
                const posPlayers = players?.filter((p) => p.position === pos) ?? [];
                if (posPlayers.length === 0) return null;
                return (
                  <div key={pos}>
                    <p className={cn("inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[10px] font-black uppercase tracking-widest mb-3", POS_ACCENT[pos])}>
                      {pos}
                    </p>
                    <div className="space-y-2">
                      {posPlayers.map((player) => (
                        <PlayerPointsRow key={player.id} player={player} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </AuthLayout>
  );
}

function PlayerPointsRow({ player }: { player: PlayerWithPoints }) {
  const pts      = player.points ?? 0;
  const positive = pts > 0;
  const zero     = pts === 0;

  return (
    <div className="flex items-center gap-3.5 rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3.5 hover:bg-white/[0.04] transition-colors">
      {/* Photo */}
      <div className="relative h-10 w-10 rounded-full overflow-hidden bg-white/10 shrink-0">
        <Image src={player.photo_url} alt={player.name} fill className="object-cover" unoptimized />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white truncate">{player.name}</span>
          <PositionBadge position={player.position} />
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <p className="text-[10px] text-zinc-600">{player.team_name}</p>
          <span className="text-zinc-800">·</span>
          <p className="text-[10px] text-zinc-600">{formatUsdc(player.price)}</p>
        </div>
      </div>

      {/* Points */}
      <div className="text-right shrink-0">
        <div className="flex items-center gap-1.5 justify-end">
          {positive ? (
            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
          ) : !zero ? (
            <TrendingDown className="h-3.5 w-3.5 text-red-500" />
          ) : null}
          <span className={cn(
            "font-display text-2xl font-black tabular-nums leading-none",
            positive ? "text-emerald-400" : zero ? "text-zinc-600" : "text-red-400"
          )}>
            {positive ? `+${pts}` : pts}
          </span>
        </div>
        <p className="text-[9px] text-zinc-700 uppercase tracking-wider mt-0.5">pts</p>
      </div>
    </div>
  );
}