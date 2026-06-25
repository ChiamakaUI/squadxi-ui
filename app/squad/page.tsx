// "use client";

// import Link from "next/link";
// import { Plus, Trophy, Clock, ChevronRight } from "lucide-react";
// import { AuthLayout } from "@/components/layout/auth-layout";
// import { PageLoader, EmptyState } from "@/components/ui/states";
// import { ContestStatusBadge } from "@/components/ui/status-badge";
// import { useUserEntries } from "@/hooks/useEntries";
// import { useCurrentUser } from "@/hooks/useCurrentUser";
// import { formatUsdc, cn } from "@/lib/utils";
// import type { UserEntry, ContestStatus } from "@/types";

// // ─── Position color strip ─────────────────────────────────────────────────────
// // Shows placeholder position slots since we don't load per-player data on this view

// const FORMATION_SLOTS = [
//   { position: "GK",  count: 1, color: "bg-amber-500"   },
//   { position: "DEF", count: 3, color: "bg-sky-500"      },
//   { position: "MID", count: 4, color: "bg-emerald-500"  },
//   { position: "FWD", count: 3, color: "bg-orange-500"   },
// ];

// function PositionStrip() {
//   return (
//     <div className="flex items-center gap-1 flex-wrap">
//       {FORMATION_SLOTS.map(({ position, count, color }) =>
//         Array.from({ length: count }).map((_, i) => (
//           <div
//             key={`${position}-${i}`}
//             className={cn("h-4 w-4 rounded-sm flex items-center justify-center", color + "/80")}
//           >
//             <span className="text-[6px] font-black text-white/90 leading-none">{position[0]}</span>
//           </div>
//         ))
//       )}
//     </div>
//   );
// }

// // ─── Status helpers ───────────────────────────────────────────────────────────

// const STATUS_RANK: Record<ContestStatus, number> = {
//   scoring: 0,
//   locked: 1,
//   open: 2,
//   settled: 3,
//   cancelled: 4,
// };

// function groupByMatchweek(entries: UserEntry[]) {
//   const map: Record<number, UserEntry[]> = {};
//   for (const entry of entries) {
//     if (!map[entry.matchweek]) map[entry.matchweek] = [];
//     map[entry.matchweek].push(entry);
//   }
//   // Sort within each matchweek by status priority
//   for (const mw of Object.keys(map)) {
//     map[Number(mw)].sort((a, b) => STATUS_RANK[a.contest_status] - STATUS_RANK[b.contest_status]);
//   }
//   // Return descending matchweek order
//   return Object.entries(map)
//     .sort(([a], [b]) => Number(b) - Number(a))
//     .map(([mw, entries]) => ({ matchweek: Number(mw), entries }));
// }

// // ─── Page ─────────────────────────────────────────────────────────────────────

// export default function SquadPage() {
//   const { data: currentUser } = useCurrentUser();
//   const { data: entries, isLoading } = useUserEntries(currentUser?.id);

//   const groups = groupByMatchweek(entries ?? []);
//   const hasAny = (entries?.length ?? 0) > 0;

//   return (
//     <AuthLayout>
//       <div className="space-y-8">

//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
//               My Squad
//             </h1>
//             <p className="text-sm text-zinc-500 mt-1">
//               {hasAny
//                 ? `${entries!.length} entr${entries!.length === 1 ? "y" : "ies"} across ${groups.length} matchweek${groups.length === 1 ? "" : "s"}`
//                 : "No entries yet"}
//             </p>
//           </div>
//           <Link
//             href="/contests"
//             className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-4 py-2.5 text-sm font-bold text-white transition-colors"
//           >
//             <Plus className="h-4 w-4" />
//             Enter contest
//           </Link>
//         </div>

//         {/* Content */}
//         {isLoading ? (
//           <PageLoader />
//         ) : !hasAny ? (
//           <EmptyState
//             title="No squads yet"
//             description="Enter a matchweek contest to build your first squad."
//             action={
//               <Link
//                 href="/contests"
//                 className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-5 py-3 text-sm font-bold text-white"
//               >
//                 Browse contests <ChevronRight className="h-4 w-4" />
//               </Link>
//             }
//           />
//         ) : (
//           <div className="space-y-10">
//             {groups.map(({ matchweek, entries: mwEntries }) => (
//               <MatchweekGroup
//                 key={matchweek}
//                 matchweek={matchweek}
//                 entries={mwEntries}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </AuthLayout>
//   );
// }

// // ─── Matchweek group ──────────────────────────────────────────────────────────

// function MatchweekGroup({
//   matchweek,
//   entries,
// }: {
//   matchweek: number;
//   entries: UserEntry[];
// }) {
//   const hasActive = entries.some(
//     (e) => e.contest_status === "open" || e.contest_status === "locked" || e.contest_status === "scoring"
//   );

//   return (
//     <div>
//       {/* Matchweek divider */}
//       <div className="flex items-center gap-4 mb-4">
//         <div className="flex items-center gap-2.5">
//           {hasActive && (
//             <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse-dot" />
//           )}
//           <h2 className="font-display text-sm font-black uppercase tracking-[0.15em] text-zinc-400">
//             Matchweek {matchweek}
//           </h2>
//         </div>
//         <span className="h-px flex-1 bg-white/5" />
//         <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">
//           {entries.length} {entries.length === 1 ? "entry" : "entries"}
//         </span>
//       </div>

//       <div className="grid gap-4 sm:grid-cols-2">
//         {entries.map((entry) => (
//           <SquadCard key={entry.id} entry={entry} />
//         ))}
//       </div>
//     </div>
//   );
// }

// // ─── Squad card ───────────────────────────────────────────────────────────────

// function SquadCard({ entry }: { entry: UserEntry }) {
//   const isLive = entry.contest_status === "scoring";
//   const isActive = entry.contest_status === "open" || entry.contest_status === "locked" || isLive;
//   const isSettled = entry.contest_status === "settled";
//   const isWinner = isSettled && entry.rank && entry.rank <= 3;

//   return (
//     <Link href={`/entries/${entry.id}`}>
//       <div
//         className={cn(
//           "group rounded-2xl border transition-all overflow-hidden hover:scale-[1.01]",
//           isWinner
//             ? "border-amber-500/40 bg-amber-500/5 hover:border-amber-500/60"
//             : isLive
//             ? "border-emerald-500/40 bg-emerald-500/5 hover:border-emerald-500/60"
//             : isActive
//             ? "border-white/10 bg-white/[0.02] hover:border-white/20"
//             : "border-white/5 bg-white/[0.015] hover:border-white/10"
//         )}
//       >
//         {/* Status strip at top */}
//         <div
//           className={cn(
//             "h-0.5 w-full",
//             isLive
//               ? "bg-gradient-to-r from-emerald-600 to-emerald-400"
//               : isWinner
//               ? "bg-gradient-to-r from-amber-600 to-amber-400"
//               : "bg-white/5"
//           )}
//         />

//         <div className="p-5">
//           {/* Top row */}
//           <div className="flex items-start justify-between gap-3 mb-4">
//             <div className="min-w-0">
//               <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em]">
//                 MW{entry.matchweek}
//               </p>
//               <p className="text-sm font-semibold text-white mt-0.5 leading-snug truncate">
//                 {entry.contest_name}
//               </p>
//             </div>
//             {isLive ? (
//               <div className="shrink-0 flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1">
//                 <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
//                 <span className="text-[9px] font-black text-emerald-400 uppercase tracking-wider">Live</span>
//               </div>
//             ) : (
//               <ContestStatusBadge status={entry.contest_status} />
//             )}
//           </div>

//           {/* Points + rank */}
//           <div className="grid grid-cols-3 gap-2 mb-4">
//             <StatCell label="Points" highlight>
//               <span className={cn("font-display text-3xl font-black leading-none", isLive ? "text-emerald-400" : "text-white")}>
//                 {entry.total_points}
//               </span>
//             </StatCell>
//             <StatCell label="Rank">
//               <span className={cn("font-display text-2xl font-black leading-none", isWinner ? "text-amber-400" : "text-zinc-300")}>
//                 {entry.rank ? `#${entry.rank}` : "—"}
//               </span>
//             </StatCell>
//             <StatCell label="Entry">
//               <span className="font-display text-lg font-black leading-none text-zinc-400">
//                 {formatUsdc(entry.entry_fee)}
//               </span>
//             </StatCell>
//           </div>

//           {/* Position strip */}
//           <div className="flex items-center justify-between">
//             <PositionStrip />
//             <ChevronRight className="h-4 w-4 text-zinc-700 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all" />
//           </div>

//           {/* Winner badge */}
//           {isWinner && (
//             <div className="mt-3 flex items-center gap-1.5 text-amber-400">
//               <Trophy className="h-3.5 w-3.5" />
//               <span className="text-[10px] font-bold uppercase tracking-widest">
//                 Top {entry.rank} Finish
//               </span>
//             </div>
//           )}
//         </div>
//       </div>
//     </Link>
//   );
// }

// function StatCell({
//   label,
//   children,
//   highlight,
// }: {
//   label: string;
//   children: React.ReactNode;
//   highlight?: boolean;
// }) {
//   return (
//     <div className="rounded-lg bg-white/5 px-2.5 py-2.5 text-center">
//       <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest mb-1">{label}</p>
//       {children}
//     </div>
//   );
// }

"use client";

import Link from "next/link";
import { Plus, Trophy, Clock, ChevronRight } from "lucide-react";
import { AuthLayout } from "@/components/layout/auth-layout";
import { PageLoader, EmptyState } from "@/components/ui/states";
import { ContestStatusBadge } from "@/components/ui/status-badge";
import { useUserEntries } from "@/hooks/useEntries";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { formatUsdc, cn } from "@/lib/utils";
import type { UserEntry, ContestStatus } from "@/types";

// ─── Position color strip ─────────────────────────────────────────────────────
// Shows placeholder position slots since we don't load per-player data on this view

const FORMATION_SLOTS = [
  { position: "GK",  count: 1, color: "bg-amber-500"   },
  { position: "DEF", count: 3, color: "bg-sky-500"      },
  { position: "MID", count: 4, color: "bg-emerald-500"  },
  { position: "FWD", count: 3, color: "bg-orange-500"   },
];

function PositionStrip() {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {FORMATION_SLOTS.map(({ position, count, color }) =>
        Array.from({ length: count }).map((_, i) => (
          <div
            key={`${position}-${i}`}
            className={cn("h-4 w-4 rounded-sm flex items-center justify-center", color + "/80")}
          >
            <span className="text-[6px] font-black text-white/90 leading-none">{position[0]}</span>
          </div>
        ))
      )}
    </div>
  );
}

// ─── Status helpers ───────────────────────────────────────────────────────────

const STATUS_RANK: Record<ContestStatus, number> = {
  scoring: 0,
  locked: 1,
  open: 2,
  settled: 3,
  cancelled: 4,
};

function groupByMatchweek(entries: UserEntry[]) {
  const map: Record<number, UserEntry[]> = {};
  for (const entry of entries) {
    if (!map[entry.matchweek]) map[entry.matchweek] = [];
    map[entry.matchweek].push(entry);
  }
  // Sort within each matchweek by status priority
  for (const mw of Object.keys(map)) {
    map[Number(mw)].sort((a, b) => STATUS_RANK[a.contest_status] - STATUS_RANK[b.contest_status]);
  }
  // Return descending matchweek order
  return Object.entries(map)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([mw, entries]) => ({ matchweek: Number(mw), entries }));
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SquadPage() {
  const { data: currentUser } = useCurrentUser();
  const { data: entries, isLoading } = useUserEntries(currentUser?.id);

  const groups = groupByMatchweek(entries ?? []);
  const hasAny = (entries?.length ?? 0) > 0;

  return (
    <AuthLayout>
      <div className="space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
              My Squad
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              {hasAny
                ? `${entries!.length} entr${entries!.length === 1 ? "y" : "ies"} across ${groups.length} matchweek${groups.length === 1 ? "" : "s"}`
                : "No entries yet"}
            </p>
          </div>
          <Link
            href="/contests"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-4 py-2.5 text-sm font-bold text-white transition-colors"
          >
            <Plus className="h-4 w-4" />
            Enter contest
          </Link>
        </div>

        {/* Content */}
        {isLoading ? (
          <PageLoader />
        ) : !hasAny ? (
          <EmptyState
            title="No squads yet"
            description="Enter a matchweek contest to build your first squad."
            action={
              <Link
                href="/contests"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-5 py-3 text-sm font-bold text-white"
              >
                Browse contests <ChevronRight className="h-4 w-4" />
              </Link>
            }
          />
        ) : (
          <div className="space-y-10">
            {groups.map(({ matchweek, entries: mwEntries }) => (
              <MatchweekGroup
                key={matchweek}
                matchweek={matchweek}
                entries={mwEntries}
              />
            ))}
          </div>
        )}
      </div>
    </AuthLayout>
  );
}

// ─── Matchweek group ──────────────────────────────────────────────────────────

function MatchweekGroup({
  matchweek,
  entries,
}: {
  matchweek: number;
  entries: UserEntry[];
}) {
  const hasActive = entries.some(
    (e) => e.contest_status === "open" || e.contest_status === "locked" || e.contest_status === "scoring"
  );

  return (
    <div>
      {/* Matchweek divider */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2.5">
          {hasActive && (
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse-dot" />
          )}
          <h2 className="font-display text-sm font-black uppercase tracking-[0.15em] text-zinc-400">
            Matchweek {matchweek}
          </h2>
        </div>
        <span className="h-px flex-1 bg-white/5" />
        <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">
          {entries.length} {entries.length === 1 ? "entry" : "entries"}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {entries.map((entry) => (
          <SquadCard key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
}

// ─── Squad card ───────────────────────────────────────────────────────────────

function SquadCard({ entry }: { entry: UserEntry }) {
  const isLive = entry.contest_status === "scoring";
  const isActive = entry.contest_status === "open" || entry.contest_status === "locked" || isLive;
  const isSettled = entry.contest_status === "settled";
  const isWinner = isSettled && entry.rank && entry.rank <= 3;

  return (
    <Link href={`/entries/${entry.id}?contestId=${(entry as any).contest_id ?? ""}`}>
      <div
        className={cn(
          "group rounded-2xl border transition-all overflow-hidden hover:scale-[1.01]",
          isWinner
            ? "border-amber-500/40 bg-amber-500/5 hover:border-amber-500/60"
            : isLive
            ? "border-emerald-500/40 bg-emerald-500/5 hover:border-emerald-500/60"
            : isActive
            ? "border-white/10 bg-white/[0.02] hover:border-white/20"
            : "border-white/5 bg-white/[0.015] hover:border-white/10"
        )}
      >
        {/* Status strip at top */}
        <div
          className={cn(
            "h-0.5 w-full",
            isLive
              ? "bg-gradient-to-r from-emerald-600 to-emerald-400"
              : isWinner
              ? "bg-gradient-to-r from-amber-600 to-amber-400"
              : "bg-white/5"
          )}
        />

        <div className="p-5">
          {/* Top row */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="min-w-0">
              <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em]">
                MW{entry.matchweek}
              </p>
              <p className="text-sm font-semibold text-white mt-0.5 leading-snug truncate">
                {entry.contest_name}
              </p>
            </div>
            {isLive ? (
              <div className="shrink-0 flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-wider">Live</span>
              </div>
            ) : (
              <ContestStatusBadge status={entry.contest_status} />
            )}
          </div>

          {/* Points + rank */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <StatCell label="Points" highlight>
              <span className={cn("font-display text-3xl font-black leading-none", isLive ? "text-emerald-400" : "text-white")}>
                {entry.total_points}
              </span>
            </StatCell>
            <StatCell label="Rank">
              <span className={cn("font-display text-2xl font-black leading-none", isWinner ? "text-amber-400" : "text-zinc-300")}>
                {entry.rank ? `#${entry.rank}` : "—"}
              </span>
            </StatCell>
            <StatCell label="Entry">
              <span className="font-display text-lg font-black leading-none text-zinc-400">
                {formatUsdc(entry.entry_fee)}
              </span>
            </StatCell>
          </div>

          {/* Position strip */}
          <div className="flex items-center justify-between">
            <PositionStrip />
            <ChevronRight className="h-4 w-4 text-zinc-700 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all" />
          </div>

          {/* Winner badge */}
          {isWinner && (
            <div className="mt-3 flex items-center gap-1.5 text-amber-400">
              <Trophy className="h-3.5 w-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Top {entry.rank} Finish
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

function StatCell({
  label,
  children,
  highlight,
}: {
  label: string;
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-lg bg-white/5 px-2.5 py-2.5 text-center">
      <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest mb-1">{label}</p>
      {children}
    </div>
  );
}