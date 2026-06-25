// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { Clock } from "lucide-react";
// import { AuthLayout } from "@/components/layout/auth-layout";
// import { PageLoader, ErrorState, EmptyState } from "@/components/ui/states";
// import { ContestStatusBadge } from "@/components/ui/status-badge";
// import { useContests } from "@/hooks/useContests";
// import { useUserEntries } from "@/hooks/useEntries";
// import { useCurrentUser } from "@/hooks/useCurrentUser";
// import { useAuth } from "@/hooks/useAuth";
// import { formatUsdc, timeUntilDeadline, isDeadlinePassed, cn } from "@/lib/utils";
// import type { Contest, ContestStatus } from "@/types";

// // ─── Filter config ────────────────────────────────────────────────────────────

// type FilterKey = "all" | "open" | "live" | "settled";

// const FILTERS: { key: FilterKey; label: string }[] = [
//   { key: "all",     label: "All"      },
//   { key: "open",    label: "Open"     },
//   { key: "live",    label: "Live"     },
//   { key: "settled", label: "Settled"  },
// ];

// const FILTER_STATUSES: Record<FilterKey, ContestStatus[]> = {
//   all:     ["open", "locked", "scoring", "settled", "cancelled"],
//   open:    ["open"],
//   live:    ["locked", "scoring"],
//   settled: ["settled"],
// };

// function estimatedPool(c: Contest) {
//   const potential = parseFloat(c.entry_fee) * c.max_entries * (1 - (c.rake_pct ?? 10) / 100);
//   const actual    = parseFloat(c.entry_fee) * c.entry_count  * (1 - (c.rake_pct ?? 10) / 100);
//   return formatUsdc(Math.max(actual, potential * 0.25));
// }

// // ─── Page ─────────────────────────────────────────────────────────────────────

// export default function ContestsPage() {
//   const [filter, setFilter] = useState<FilterKey>("open");
//   const { authenticated, login } = useAuth();
//   const { data: currentUser } = useCurrentUser();
//   const { data: contests, isLoading, isError, refetch } = useContests();
//   const { data: entries } = useUserEntries(currentUser?.id);

//   // Map of contest_id → entry_id so entered contests show "View My Entry"
//   const enteredContestMap = new Map(
//     (entries ?? []).map((e) => [(e).contest_id as string, e.id])
//   );

//   const statuses = FILTER_STATUSES[filter];
//   const filtered = (contests ?? []).filter((c) => statuses.includes(c.status));

//   return (
//     <AuthLayout>
//       <div className="space-y-6">

//         {/* Header */}
//         <div>
//           <h1 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
//             Contest Lobby
//           </h1>
//           <p className="text-sm text-zinc-500 mt-1">
//             Pick a contest, build your squad, and compete for USDC.
//           </p>
//         </div>

//         {/* Filter tabs */}
//         <div className="flex gap-2 flex-wrap">
//           {FILTERS.map(({ key, label }) => {
//             const count = key === "all"
//               ? contests?.length
//               : (contests ?? []).filter((c) => FILTER_STATUSES[key].includes(c.status)).length;
//             return (
//               <button
//                 key={key}
//                 onClick={() => setFilter(key)}
//                 className={cn(
//                   "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all",
//                   filter === key
//                     ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
//                     : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
//                 )}
//               >
//                 {label}
//                 {count !== undefined && count > 0 && (
//                   <span className={cn(
//                     "rounded-full text-[10px] font-black px-1.5 py-0.5 leading-none",
//                     filter === key ? "bg-white/20 text-white" : "bg-white/10 text-zinc-500"
//                   )}>
//                     {count}
//                   </span>
//                 )}
//               </button>
//             );
//           })}
//         </div>

//         {/* Contest grid */}
//         {isLoading ? (
//           <PageLoader />
//         ) : isError ? (
//           <ErrorState onRetry={refetch} />
//         ) : filtered.length === 0 ? (
//           <EmptyState
//             title={`No ${filter === "all" ? "" : filter} contests`}
//             description={
//               filter === "open"
//                 ? "No contests are open for entry right now. Check back before the next matchweek."
//                 : filter === "live"
//                 ? "No contests are currently live. Open contests go live once the deadline passes."
//                 : "No settled contests yet."
//             }
//           />
//         ) : (
//           <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
//             {filtered.map((c) => (
//               <ContestCard
//                 key={c.id}
//                 contest={c}
//                 entryId={enteredContestMap.get(c.id)}
//                 onEnter={authenticated ? undefined : login}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </AuthLayout>
//   );
// }

// // ─── Contest card ─────────────────────────────────────────────────────────────

// function ContestCard({
//   contest,
//   entryId,
//   onEnter,
// }: {
//   contest: Contest;
//   entryId?: string;
//   onEnter?: () => void;
// }) {
//   const passed   = isDeadlinePassed(contest.deadline);
//   const isOpen   = contest.status === "open" && !passed;
//   const isLive   = contest.status === "locked" || contest.status === "scoring";
//   const entered  = Boolean(entryId);
//   const left     = contest.max_entries - contest.entry_count;
//   const fillPct  = Math.round((contest.entry_count / contest.max_entries) * 100);

//   return (
//     <div
//       className={cn(
//         "group flex flex-col rounded-2xl border transition-all overflow-hidden",
//         isLive
//           ? "border-emerald-500/30 bg-emerald-500/[0.03] hover:border-emerald-500/50"
//           : "border-white/8 bg-white/[0.02] hover:border-white/15"
//       )}
//     >
//       {/* Top accent */}
//       <div
//         className={cn(
//           "h-0.5 w-full",
//           isLive
//             ? "bg-gradient-to-r from-emerald-600 to-emerald-400"
//             : isOpen
//             ? "bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent"
//             : "bg-white/5"
//         )}
//       />

//       {/* Prize pool */}
//       <div className="px-5 pt-5 pb-4 border-b border-white/5">
//         <div className="flex items-start justify-between gap-2">
//           <div>
//             <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-1">
//               Est. Prize Pool
//             </p>
//             <p className="font-display text-4xl font-black text-emerald-400 leading-none tracking-tight">
//               {estimatedPool(contest)}
//             </p>
//           </div>
//           <ContestStatusBadge status={contest.status} />
//         </div>
//       </div>

//       {/* Info */}
//       <div className="px-5 py-4 flex-1 space-y-4">
//         <div>
//           <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">
//             Matchweek {contest.matchweek}
//           </p>
//           <p className="mt-1 text-sm font-semibold text-white leading-snug">
//             {contest.name}
//           </p>
//         </div>

//         {/* Mini stats */}
//         <div className="grid grid-cols-3 gap-2">
//           <MiniStat label="Entry"   value={formatUsdc(contest.entry_fee)} />
//           <MiniStat label="Cap"     value={formatUsdc(contest.salary_cap)} />
//           <MiniStat label="Players" value={`${contest.squad_size}`} />
//         </div>

//         {/* Fill bar */}
//         <div className="space-y-1.5">
//           <div className="flex justify-between text-[10px]">
//             <span className="text-zinc-600">{contest.entry_count} entered</span>
//             <span className={cn("font-medium", left < 20 ? "text-amber-400" : "text-zinc-600")}>
//               {left} spots left
//             </span>
//           </div>
//           <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
//             <div
//               className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all"
//               style={{ width: `${fillPct}%` }}
//             />
//           </div>
//         </div>
//       </div>

//       {/* CTA */}
//       <div className="px-5 pb-5">
//         {!passed && (
//           <div className="flex items-center gap-1.5 mb-3">
//             <Clock className="h-3.5 w-3.5 text-zinc-600 shrink-0" />
//             <span className="text-xs text-zinc-500">
//               {timeUntilDeadline(contest.deadline)} remaining
//             </span>
//           </div>
//         )}

//         {isOpen ? (
//           entered ? (
//             // User already entered — show their entry, no re-entry
//             <Link
//               href={`/entries/${entryId}`}
//               className="block w-full text-center rounded-xl border border-emerald-500/40 bg-emerald-500/10 py-3 text-sm font-bold text-emerald-400 hover:bg-emerald-500/15 transition-colors"
//             >
//               ✓ Entered — View my squad
//             </Link>
//           ) : onEnter ? (
//             <button
//               onClick={onEnter}
//               className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 py-3 text-sm font-bold text-white transition-colors"
//             >
//               Connect to Enter
//             </button>
//           ) : (
//             <Link
//               href={`/contests/${contest.id}/enter`}
//               className="block w-full text-center rounded-xl bg-emerald-500 hover:bg-emerald-400 py-3 text-sm font-bold text-white transition-colors"
//             >
//               Enter — {formatUsdc(contest.entry_fee)}
//             </Link>
//           )
//         ) : (
//           <Link
//             href={`/contests/${contest.id}`}
//             className="block w-full text-center rounded-xl border border-white/10 hover:border-white/20 py-3 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
//           >
//             {contest.status === "settled" ? "View Results" : "View Contest"}
//           </Link>
//         )}
//       </div>
//     </div>
//   );
// }

// function MiniStat({ label, value }: { label: string; value: string }) {
//   return (
//     <div className="rounded-lg bg-white/5 px-2 py-2 text-center">
//       <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">{label}</p>
//       <p className="text-sm font-bold text-white mt-0.5">{value}</p>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, Users, Trophy, Filter } from "lucide-react";
import { AuthLayout } from "@/components/layout/auth-layout";
import { PageLoader, ErrorState, EmptyState } from "@/components/ui/states";
import { ContestStatusBadge } from "@/components/ui/status-badge";
import { useContests } from "@/hooks/useContests";
import { useUserEntries } from "@/hooks/useEntries";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAuth } from "@/hooks/useAuth";
import { formatUsdc, timeUntilDeadline, isDeadlinePassed, cn } from "@/lib/utils";
import type { Contest, ContestStatus } from "@/types";

// ─── Filter config ────────────────────────────────────────────────────────────

type FilterKey = "all" | "open" | "live" | "settled";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all",     label: "All"      },
  { key: "open",    label: "Open"     },
  { key: "live",    label: "Live"     },
  { key: "settled", label: "Settled"  },
];

const FILTER_STATUSES: Record<FilterKey, ContestStatus[]> = {
  all:     ["open", "locked", "scoring", "settled", "cancelled"],
  open:    ["open"],
  live:    ["locked", "scoring"],
  settled: ["settled"],
};

function estimatedPool(c: Contest) {
  const potential = parseFloat(c.entry_fee) * c.max_entries * (1 - (c.rake_pct ?? 10) / 100);
  const actual    = parseFloat(c.entry_fee) * c.entry_count  * (1 - (c.rake_pct ?? 10) / 100);
  return formatUsdc(Math.max(actual, potential * 0.25));
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContestsPage() {
  const [filter, setFilter] = useState<FilterKey>("open");
  const { authenticated, login } = useAuth();
  const { data: currentUser } = useCurrentUser();
  const { data: contests, isLoading, isError, refetch } = useContests();
  const { data: entries } = useUserEntries(currentUser?.id);

  // Map of contest_id → entry_id so entered contests show "View My Entry"
  const enteredContestMap = new Map(
    (entries ?? []).map((e) => [(e as any).contest_id as string, e.id])
  );

  const statuses = FILTER_STATUSES[filter];
  const filtered = (contests ?? []).filter((c) => statuses.includes(c.status));

  return (
    <AuthLayout>
      <div className="space-y-6">

        {/* Header */}
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
            Contest Lobby
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Pick a contest, build your squad, and compete for USDC.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map(({ key, label }) => {
            const count = key === "all"
              ? contests?.length
              : (contests ?? []).filter((c) => FILTER_STATUSES[key].includes(c.status)).length;
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all",
                  filter === key
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                    : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
                )}
              >
                {label}
                {count !== undefined && count > 0 && (
                  <span className={cn(
                    "rounded-full text-[10px] font-black px-1.5 py-0.5 leading-none",
                    filter === key ? "bg-white/20 text-white" : "bg-white/10 text-zinc-500"
                  )}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Contest grid */}
        {isLoading ? (
          <PageLoader />
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title={`No ${filter === "all" ? "" : filter} contests`}
            description={
              filter === "open"
                ? "No contests are open for entry right now. Check back before the next matchweek."
                : filter === "live"
                ? "No contests are currently live. Open contests go live once the deadline passes."
                : "No settled contests yet."
            }
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => (
              <ContestCard
                key={c.id}
                contest={c}
                entryId={enteredContestMap.get(c.id)}
                onEnter={authenticated ? undefined : login}
              />
            ))}
          </div>
        )}
      </div>
    </AuthLayout>
  );
}

// ─── Contest card ─────────────────────────────────────────────────────────────

function ContestCard({
  contest,
  entryId,
  onEnter,
}: {
  contest: Contest;
  entryId?: string;
  onEnter?: () => void;
}) {
  const passed   = isDeadlinePassed(contest.deadline);
  const isOpen   = contest.status === "open" && !passed;
  const isLive   = contest.status === "locked" || contest.status === "scoring";
  const entered  = Boolean(entryId);
  const left     = contest.max_entries - contest.entry_count;
  const fillPct  = Math.round((contest.entry_count / contest.max_entries) * 100);

  return (
    <div
      className={cn(
        "group flex flex-col rounded-2xl border transition-all overflow-hidden",
        isLive
          ? "border-emerald-500/30 bg-emerald-500/[0.03] hover:border-emerald-500/50"
          : "border-white/8 bg-white/[0.02] hover:border-white/15"
      )}
    >
      {/* Top accent */}
      <div
        className={cn(
          "h-0.5 w-full",
          isLive
            ? "bg-gradient-to-r from-emerald-600 to-emerald-400"
            : isOpen
            ? "bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent"
            : "bg-white/5"
        )}
      />

      {/* Prize pool */}
      <div className="px-5 pt-5 pb-4 border-b border-white/5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-1">
              Est. Prize Pool
            </p>
            <p className="font-display text-4xl font-black text-emerald-400 leading-none tracking-tight">
              {estimatedPool(contest)}
            </p>
          </div>
          <ContestStatusBadge status={contest.status} />
        </div>
      </div>

      {/* Info */}
      <div className="px-5 py-4 flex-1 space-y-4">
        <div>
          <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">
            Matchweek {contest.matchweek}
          </p>
          <p className="mt-1 text-sm font-semibold text-white leading-snug">
            {contest.name}
          </p>
        </div>

        {/* Mini stats */}
        <div className="grid grid-cols-3 gap-2">
          <MiniStat label="Entry"   value={formatUsdc(contest.entry_fee)} />
          <MiniStat label="Cap"     value={formatUsdc(contest.salary_cap)} />
          <MiniStat label="Players" value={`${contest.squad_size}`} />
        </div>

        {/* Fill bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px]">
            <span className="text-zinc-600">{contest.entry_count} entered</span>
            <span className={cn("font-medium", left < 20 ? "text-amber-400" : "text-zinc-600")}>
              {left} spots left
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all"
              style={{ width: `${fillPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-5 pb-5">
        {!passed && (
          <div className="flex items-center gap-1.5 mb-3">
            <Clock className="h-3.5 w-3.5 text-zinc-600 shrink-0" />
            <span className="text-xs text-zinc-500">
              {timeUntilDeadline(contest.deadline)} remaining
            </span>
          </div>
        )}

        {isOpen ? (
          entered ? (
            // User already entered — show their entry, no re-entry
            <Link
              href={`/entries/${entryId}?contestId=${contest.id}`}
              className="block w-full text-center rounded-xl border border-emerald-500/40 bg-emerald-500/10 py-3 text-sm font-bold text-emerald-400 hover:bg-emerald-500/15 transition-colors"
            >
              ✓ Entered — View my squad
            </Link>
          ) : onEnter ? (
            <button
              onClick={onEnter}
              className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 py-3 text-sm font-bold text-white transition-colors"
            >
              Connect to Enter
            </button>
          ) : (
            <Link
              href={`/contests/${contest.id}/enter`}
              className="block w-full text-center rounded-xl bg-emerald-500 hover:bg-emerald-400 py-3 text-sm font-bold text-white transition-colors"
            >
              Enter — {formatUsdc(contest.entry_fee)}
            </Link>
          )
        ) : (
          <Link
            href={`/contests/${contest.id}`}
            className="block w-full text-center rounded-xl border border-white/10 hover:border-white/20 py-3 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            {contest.status === "settled" ? "View Results" : "View Contest"}
          </Link>
        )}
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/5 px-2 py-2 text-center">
      <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">{label}</p>
      <p className="text-sm font-bold text-white mt-0.5">{value}</p>
    </div>
  );
}