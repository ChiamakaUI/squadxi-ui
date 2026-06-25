"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Clock, Users, Trophy, Zap } from "lucide-react";
import { AuthLayout } from "@/components/layout/auth-layout";
import { ContestStatusBadge, FixtureStatusBadge } from "@/components/ui/status-badge";
import { PageLoader, ErrorState, EmptyState } from "@/components/ui/states";
import {
  useContest,
  useContestFixtures,
  useContestLeaderboard,
} from "@/hooks/useContests";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import {
  formatUsdc,
  timeUntilDeadline,
  isDeadlinePassed,
  formatDeadline,
  cn,
} from "@/lib/utils";
import type { Fixture, LeaderboardEntry } from "@/types";

type Tab = "fixtures" | "leaderboard";

export default function ContestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [tab, setTab] = useState<Tab>("fixtures");
  const { data: currentUser } = useCurrentUser();

  const { data: contest, isLoading, isError, refetch } = useContest(id);
  const { data: fixtures, isLoading: fixturesLoading } = useContestFixtures(id);
  const { data: leaderboard, isLoading: lbLoading } = useContestLeaderboard(id);

  if (isLoading) return <AuthLayout><PageLoader /></AuthLayout>;
  if (isError || !contest) return <AuthLayout><ErrorState onRetry={refetch} /></AuthLayout>;

  const canEnter = contest.status === "open" && !isDeadlinePassed(contest.deadline);
  const pool = formatUsdc(
    parseFloat(contest.entry_fee) * contest.entry_count * (1 - (contest.rake_pct ?? 10) / 100)
  );

  return (
    <AuthLayout>
      <div className="space-y-6 max-w-3xl">

        {/* Back */}
        <Link
          href="/contests"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors"
        >
          <ChevronLeft className="h-4 w-4" /> Contest Lobby
        </Link>

        {/* Hero */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden">
          <div className="h-0.5 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em]">
                  Matchweek {contest.matchweek}
                </p>
                <h1 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-1">
                  {contest.name}
                </h1>
              </div>
              <ContestStatusBadge status={contest.status} />
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              <HeroStat label="Est. Prize Pool" value={pool} accent />
              <HeroStat label="Entry Fee" value={formatUsdc(contest.entry_fee)} />
              <HeroStat label="Entries" value={`${contest.entry_count} / ${contest.max_entries}`} />
              <HeroStat
                label={isDeadlinePassed(contest.deadline) ? "Deadline" : "Closes in"}
                value={isDeadlinePassed(contest.deadline) ? "Passed" : timeUntilDeadline(contest.deadline)}
                sub={formatDeadline(contest.deadline)}
              />
            </div>

            {/* CTA */}
            {canEnter && (
              <Link
                href={`/contests/${contest.id}/enter`}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-6 py-3 text-sm font-bold text-white transition-colors shadow-lg shadow-emerald-500/20"
              >
                <Trophy className="h-4 w-4" />
                Enter — {formatUsdc(contest.entry_fee)}
              </Link>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/8">
          {(["fixtures", "leaderboard"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "px-5 py-3 text-sm font-bold capitalize transition-colors border-b-2 -mb-px",
                tab === t
                  ? "border-emerald-400 text-emerald-400"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === "fixtures" ? (
          fixturesLoading ? (
            <PageLoader />
          ) : (fixtures ?? []).length === 0 ? (
            <EmptyState title="No fixtures yet" description="Fixtures will appear here once they are confirmed." />
          ) : (
            <div className="space-y-2">
              {(fixtures ?? []).map((f) => <FixtureRow key={f.id} fixture={f} />)}
            </div>
          )
        ) : lbLoading ? (
          <PageLoader />
        ) : (leaderboard ?? []).length === 0 ? (
          <EmptyState title="No entries yet" description="Be the first to enter this contest." />
        ) : (
          <LeaderboardTable entries={leaderboard ?? []} currentUserId={currentUser?.id} />
        )}
      </div>
    </AuthLayout>
  );
}

// ─── Hero stat ────────────────────────────────────────────────────────────────

function HeroStat({
  label, value, sub, accent,
}: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className="rounded-xl bg-white/5 px-4 py-3">
      <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{label}</p>
      <p className={cn("font-display text-xl font-black leading-none mt-1", accent ? "text-emerald-400" : "text-white")}>
        {value}
      </p>
      {sub && <p className="text-[10px] text-zinc-600 mt-0.5">{sub}</p>}
    </div>
  );
}

// ─── Fixture row ──────────────────────────────────────────────────────────────

function FixtureRow({ fixture }: { fixture: Fixture }) {
  const isPlayed = fixture.status === "FT" || fixture.status === "HT";
  const isLive   = fixture.status === "LIVE";
  const kickoff  = new Date(fixture.kickoff).toLocaleString("en-GB", {
    weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
  });

  return (
    <div className={cn(
      "rounded-xl border px-4 py-3.5 transition-colors",
      isLive ? "border-emerald-500/30 bg-emerald-500/[0.04]" : "border-white/8 bg-white/[0.02]"
    )}>
      <div className="flex items-center gap-3">
        {/* Home */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <span className="text-sm font-semibold text-white text-right hidden sm:block truncate max-w-[130px]">
            {fixture.home_team}
          </span>
          <TeamBadge src={fixture.home_logo} name={fixture.home_team} />
        </div>

        {/* Score / time */}
        <div className="flex flex-col items-center min-w-[90px] shrink-0">
          {isPlayed || isLive ? (
            <div className="flex items-center gap-2">
              <span className={cn("font-display text-2xl font-black", isLive ? "text-emerald-400" : "text-white")}>
                {fixture.home_score}
              </span>
              <span className="text-zinc-600 font-bold">–</span>
              <span className={cn("font-display text-2xl font-black", isLive ? "text-emerald-400" : "text-white")}>
                {fixture.away_score}
              </span>
            </div>
          ) : (
            <span className="text-xs text-zinc-400 text-center">{kickoff}</span>
          )}
          <FixtureStatusBadge status={fixture.status} />
        </div>

        {/* Away */}
        <div className="flex items-center gap-2 flex-1 justify-start">
          <TeamBadge src={fixture.away_logo} name={fixture.away_team} />
          <span className="text-sm font-semibold text-white hidden sm:block truncate max-w-[130px]">
            {fixture.away_team}
          </span>
        </div>
      </div>

      {/* Mobile team names */}
      <div className="flex justify-between mt-1.5 sm:hidden">
        <span className="text-xs text-zinc-500 truncate max-w-[120px]">{fixture.home_team}</span>
        <span className="text-xs text-zinc-500 truncate max-w-[120px] text-right">{fixture.away_team}</span>
      </div>
    </div>
  );
}

function TeamBadge({ src, name }: { src: string; name: string }) {
  return (
    <div className="relative h-7 w-7 shrink-0">
      <Image src={src} alt={name} fill className="object-contain" unoptimized />
    </div>
  );
}

// ─── Leaderboard table ────────────────────────────────────────────────────────

const RANK_COLORS: Record<number, string> = { 1: "text-amber-400", 2: "text-zinc-300", 3: "text-orange-400" };

function LeaderboardTable({
  entries, currentUserId,
}: { entries: LeaderboardEntry[]; currentUserId?: string }) {
  return (
    <div className="rounded-2xl border border-white/8 overflow-hidden">
      <div className="grid grid-cols-[44px_1fr_auto] gap-3 px-5 py-2.5 bg-white/[0.03] text-[9px] font-black text-zinc-600 uppercase tracking-widest">
        <span>Rank</span><span>Manager</span><span>Points</span>
      </div>
      <div className="divide-y divide-white/5">
        {entries.map((entry) => {
          const isMe = entry.user_id === currentUserId;
          return (
            <div
              key={entry.entry_id}
              className={cn("grid grid-cols-[44px_1fr_auto] gap-3 px-5 py-3.5 items-center", isMe && "bg-emerald-500/5")}
            >
              <span className={cn("font-display text-lg font-black", RANK_COLORS[entry.rank] ?? "text-zinc-500")}>
                {entry.rank}
              </span>
              <div>
                <p className={cn("text-sm font-semibold", isMe ? "text-emerald-400" : "text-white")}>
                  {entry.display_name}
                  {isMe && <span className="ml-2 text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">you</span>}
                </p>
                <p className="text-[10px] text-zinc-600 font-mono mt-0.5">
                  {entry.wallet_address.slice(0, 4)}…{entry.wallet_address.slice(-4)}
                </p>
              </div>
              <span className="font-display text-xl font-black text-white tabular-nums">{entry.total_points}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}