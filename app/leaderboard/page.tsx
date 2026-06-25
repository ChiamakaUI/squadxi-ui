// "use client";

// import { useState } from "react";
// import { Trophy, ChevronDown } from "lucide-react";
// import { AuthLayout } from "@/components/layout/auth-layout";
// import { PageLoader, ErrorState, EmptyState } from "@/components/ui/states";
// import { ContestStatusBadge } from "@/components/ui/status-badge";
// import { useContests, useContestLeaderboard } from "@/hooks/useContests";
// import { useCurrentUser } from "@/hooks/useCurrentUser";
// import { cn } from "@/lib/utils";
// import type { Contest } from "@/types";

// const RANK_STYLES: Record<number, { text: string; bg: string }> = {
//   1: { text: "text-amber-400",  bg: "bg-amber-500/10"  },
//   2: { text: "text-zinc-300",   bg: "bg-zinc-700/20"   },
//   3: { text: "text-orange-400", bg: "bg-orange-500/10" },
// };

// export default function LeaderboardPage() {
//   const { data: currentUser } = useCurrentUser();
//   const { data: contests, isLoading: contestsLoading } = useContests();
//   const [selectedId, setSelectedId] = useState<string>("");
//   const [showSelector, setShowSelector] = useState(false);

//   const contestList = contests ?? [];
//   const selected    = contestList.find((c) => c.id === selectedId) ?? contestList[0];
//   const contestId   = selected?.id ?? "";

//   const { data: entries, isLoading: lbLoading, isError, refetch } = useContestLeaderboard(contestId);

//   const myEntry = entries?.find((e) => e.user_id === currentUser?.id);

//   return (
//     <AuthLayout>
//       <div className="space-y-6 max-w-3xl">

//         {/* Header */}
//         <div>
//           <h1 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
//             Rankings
//           </h1>
//           <p className="text-sm text-zinc-500 mt-1">
//             See how your squad stacks up against the competition.
//           </p>
//         </div>

//         {/* Contest selector */}
//         {contestsLoading ? (
//           <div className="h-12 rounded-xl bg-white/5 animate-pulse" />
//         ) : contestList.length === 0 ? null : (
//           <div className="relative">
//             <button
//               onClick={() => setShowSelector((v) => !v)}
//               className="w-full flex items-center justify-between gap-3 rounded-xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.04] px-4 py-3.5 text-left transition-colors"
//             >
//               <div className="min-w-0">
//                 {selected ? (
//                   <>
//                     <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">MW{selected.matchweek}</p>
//                     <p className="text-sm font-semibold text-white truncate">{selected.name}</p>
//                   </>
//                 ) : (
//                   <p className="text-sm text-zinc-500">Select a contest</p>
//                 )}
//               </div>
//               <div className="flex items-center gap-2 shrink-0">
//                 {selected && <ContestStatusBadge status={selected.status} />}
//                 <ChevronDown className={cn("h-4 w-4 text-zinc-500 transition-transform", showSelector && "rotate-180")} />
//               </div>
//             </button>

//             {showSelector && (
//               <div className="absolute top-full left-0 right-0 mt-1 rounded-xl border border-white/10 bg-[#0d0f14] shadow-2xl shadow-black/60 z-20 overflow-hidden max-h-64 overflow-y-auto">
//                 {contestList.map((c) => (
//                   <button
//                     key={c.id}
//                     onClick={() => { setSelectedId(c.id); setShowSelector(false); }}
//                     className={cn(
//                       "w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors border-b border-white/5 last:border-0",
//                       c.id === contestId && "bg-emerald-500/5"
//                     )}
//                   >
//                     <div className="min-w-0">
//                       <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">MW{c.matchweek}</p>
//                       <p className="text-sm font-medium text-white truncate">{c.name}</p>
//                     </div>
//                     <ContestStatusBadge status={c.status} />
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {/* My position callout */}
//         {myEntry && (
//           <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-5 py-4 flex items-center justify-between">
//             <div>
//               <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Your position</p>
//               <p className="font-display text-3xl font-black text-emerald-400 leading-none mt-0.5">
//                 #{myEntry.rank}
//               </p>
//             </div>
//             <div className="text-right">
//               <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Your points</p>
//               <p className="font-display text-3xl font-black text-white leading-none mt-0.5">
//                 {myEntry.total_points}
//               </p>
//             </div>
//             <div className="text-right">
//               <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Of</p>
//               <p className="font-display text-3xl font-black text-zinc-400 leading-none mt-0.5">
//                 {entries?.length}
//               </p>
//             </div>
//           </div>
//         )}

//         {/* Leaderboard */}
//         {!contestId ? (
//           <EmptyState title="No contests available" description="Check back once a contest has been created." />
//         ) : lbLoading ? (
//           <PageLoader />
//         ) : isError ? (
//           <ErrorState onRetry={refetch} />
//         ) : (entries ?? []).length === 0 ? (
//           <EmptyState title="No entries yet" description="Be the first to enter this contest." />
//         ) : (
//           <div className="rounded-2xl border border-white/8 overflow-hidden">
//             {/* Table header */}
//             <div className="grid grid-cols-[52px_1fr_auto] gap-4 px-5 py-3 bg-white/[0.03] text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em]">
//               <span>#</span><span>Manager</span><span>Points</span>
//             </div>

//             {/* Rows */}
//             <div className="divide-y divide-white/5">
//               {(entries ?? []).map((entry) => {
//                 const isMe = entry.user_id === currentUser?.id;
//                 const rankStyle = RANK_STYLES[entry.rank];
//                 return (
//                   <div
//                     key={entry.entry_id}
//                     className={cn("grid grid-cols-[52px_1fr_auto] gap-4 px-5 py-4 items-center", isMe && "bg-emerald-500/[0.04]")}
//                   >
//                     {/* Rank */}
//                     <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center font-display text-lg font-black", rankStyle ? rankStyle.bg : "bg-white/5", rankStyle ? rankStyle.text : "text-zinc-500")}>
//                       {entry.rank <= 3 ? <Trophy className="h-4 w-4" /> : entry.rank}
//                     </div>

//                     {/* Manager */}
//                     <div>
//                       <p className={cn("text-sm font-semibold", isMe ? "text-emerald-400" : "text-white")}>
//                         {entry.display_name}
//                         {isMe && (
//                           <span className="ml-2 text-[9px] font-black bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full uppercase tracking-widest">
//                             you
//                           </span>
//                         )}
//                       </p>
//                       <p className="text-[10px] text-zinc-600 font-mono mt-0.5">
//                         {entry.wallet_address.slice(0, 4)}…{entry.wallet_address.slice(-4)}
//                       </p>
//                     </div>

//                     {/* Points */}
//                     <span className={cn("font-display text-2xl font-black tabular-nums", isMe ? "text-emerald-400" : "text-white")}>
//                       {entry.total_points}
//                     </span>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}
//       </div>
//     </AuthLayout>
//   );
// }

"use client";

import { useState, useRef, useEffect } from "react";
import { AuthLayout } from "@/components/layout/auth-layout";
import { PageLoader } from "@/components/ui/states";
import { useContests, useContestLeaderboard } from "@/hooks/useContests";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { formatPoints, shortenAddress, cn } from "@/lib/utils";
import { ChevronDown, Trophy, Medal } from "lucide-react";
import type { Contest } from "@/types";

const STATUS_COLORS: Record<string, string> = {
  open:     "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  locked:   "text-amber-400  bg-amber-500/10  border-amber-500/20",
  scoring:  "text-sky-400    bg-sky-500/10    border-sky-500/20",
  settled:  "text-zinc-400   bg-white/5       border-white/10",
  cancelled:"text-red-400    bg-red-500/10    border-red-500/20",
};

export default function LeaderboardPage() {
  const { data: contests, isLoading: contestsLoading } = useContests();
  const { data: currentUser } = useCurrentUser();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Auto-select first contest once loaded
  useEffect(() => {
    if (contests?.length && !selectedId) {
      setSelectedId(contests[0].id);
    }
  }, [contests, selectedId]);

  // Close dropdown on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const selectedContest = contests?.find((c) => c.id === selectedId) ?? null;

  const {
    data: leaderboard,
    isLoading: lbLoading,
    isError: lbError,
  } = useContestLeaderboard(selectedId ?? "");

  return (
    <AuthLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
            Rankings
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            See how your squad stacks up against the competition.
          </p>
        </div>

        {/* Contest selector */}
        {contestsLoading ? (
          <div className="h-14 rounded-2xl bg-white/5 animate-pulse" />
        ) : !contests?.length ? (
          <p className="text-sm text-zinc-500">No contests available yet.</p>
        ) : (
          <div ref={dropdownRef} className="relative">
            {/* Trigger */}
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="w-full flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-white/[0.02] px-5 py-4 text-left hover:bg-white/[0.04] transition-colors"
            >
              {selectedContest ? (
                <ContestOption contest={selectedContest} />
              ) : (
                <span className="text-zinc-500 text-sm">Select a contest</span>
              )}
              <ChevronDown className={cn(
                "h-4 w-4 text-zinc-500 shrink-0 transition-transform",
                dropdownOpen && "rotate-180"
              )} />
            </button>

            {/* Dropdown list */}
            {dropdownOpen && (
              <div className="absolute top-full mt-2 left-0 right-0 z-20 rounded-2xl border border-white/8 bg-[#0f1117] shadow-2xl overflow-hidden">
                {contests.map((contest) => (
                  <button
                    key={contest.id}
                    onClick={() => {
                      setSelectedId(contest.id);
                      setDropdownOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-white/5 transition-colors",
                      contest.id === selectedId && "bg-white/[0.04]"
                    )}
                  >
                    <ContestOption contest={contest} />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Leaderboard */}
        {selectedId && (
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden">
            <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
              <Trophy className="h-4 w-4 text-zinc-500" />
              <p className="text-sm font-semibold text-white">
                {selectedContest?.name ?? "Leaderboard"}
              </p>
            </div>

            {lbLoading ? (
              <div className="py-12"><PageLoader /></div>
            ) : lbError ? (
              <div className="text-center py-12">
                <p className="text-sm text-zinc-500">
                  Leaderboard isn't available yet for this contest.
                </p>
                <p className="text-xs text-zinc-600 mt-1">
                  Rankings appear once the contest is scored after matchday.
                </p>
              </div>
            ) : !leaderboard?.length ? (
              <div className="text-center py-12">
                <Trophy className="h-8 w-8 text-zinc-700 mx-auto mb-3" />
                <p className="text-sm text-zinc-500">No entries yet.</p>
                <p className="text-xs text-zinc-600 mt-1">
                  Be the first to enter this contest.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {leaderboard.map((entry, i) => {
                  const isCurrentUser = currentUser && entry.user_id === currentUser.id;
                  const rank = entry.rank ?? i + 1;
                  return (
                    <div
                      key={entry.entry_id}
                      className={cn(
                        "flex items-center gap-4 px-5 py-4 transition-colors",
                        isCurrentUser && "bg-emerald-500/5"
                      )}
                    >
                      {/* Rank */}
                      <div className="w-8 shrink-0 text-center">
                        {rank === 1 ? (
                          <Trophy className="h-5 w-5 text-amber-400 mx-auto" />
                        ) : rank === 2 ? (
                          <Medal className="h-5 w-5 text-zinc-400 mx-auto" />
                        ) : rank === 3 ? (
                          <Medal className="h-5 w-5 text-amber-700 mx-auto" />
                        ) : (
                          <span className="text-sm font-bold text-zinc-500">
                            {rank}
                          </span>
                        )}
                      </div>

                      {/* Player */}
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "text-sm font-semibold truncate",
                          isCurrentUser ? "text-emerald-400" : "text-white"
                        )}>
                          {entry.display_name ?? shortenAddress(entry.wallet_address, 6)}
                          {isCurrentUser && (
                            <span className="ml-2 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                              You
                            </span>
                          )}
                        </p>
                        <p className="text-[10px] font-mono text-zinc-600 mt-0.5">
                          {shortenAddress(entry.wallet_address, 5)}
                        </p>
                      </div>

                      {/* Points */}
                      <div className="text-right shrink-0">
                        <p className={cn(
                          "font-display text-xl font-black",
                          rank <= 3 ? "text-white" : "text-zinc-300"
                        )}>
                          {entry.total_points ?? 0}
                        </p>
                        <p className="text-[10px] text-zinc-600">pts</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </AuthLayout>
  );
}

// ─── Contest option (used in both trigger and dropdown) ───────────────────────
// Plain div — no button inside, so no nested interactive elements

function ContestOption({ contest }: { contest: Contest }) {
  return (
    <div className="flex items-center justify-between gap-3 flex-1 min-w-0">
      <div className="min-w-0">
        <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">
          MW{contest.matchweek}
        </p>
        <p className="text-sm font-semibold text-white truncate">{contest.name}</p>
      </div>
      {/* Status label — plain span, NOT a button */}
      <span className={cn(
        "shrink-0 text-[10px] font-bold uppercase tracking-widest rounded-full border px-2.5 py-1",
        STATUS_COLORS[contest.status] ?? STATUS_COLORS.open
      )}>
        {contest.status}
      </span>
    </div>
  );
}