// "use client";

// import Link from "next/link";
// import { ArrowRight, Trophy, TrendingUp, TrendingDown, Minus, Clock, Bot, Zap, Plus } from "lucide-react";
// import { AuthLayout } from "@/components/layout/auth-layout";
// import { PageLoader, EmptyState } from "@/components/ui/states";
// import { ContestStatusBadge } from "@/components/ui/status-badge";
// import { useContests } from "@/hooks/useContests";
// import { useUserEntries } from "@/hooks/useEntries";
// import { useCurrentUser } from "@/hooks/useCurrentUser";
// import { useAuth } from "@/hooks/useAuth";
// import { formatUsdc, timeUntilDeadline, isDeadlinePassed, cn } from "@/lib/utils";
// import type { Contest, UserEntry } from "@/types";

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// function greeting() {
//   const h = new Date().getHours();
//   if (h < 12) return "Good morning";
//   if (h < 17) return "Good afternoon";
//   return "Good evening";
// }

// function displayName(user: ReturnType<typeof useAuth>["user"]): string {
//   if (!user) return "Manager";
//   const google = (user as any)?.google?.name;
//   if (google) return google.split(" ")[0];
//   const email = (user as any)?.email?.address;
//   if (email) return email.split("@")[0];
//   return "Manager";
// }

// function estimatedPool(c: Contest) {
//   const potential = parseFloat(c.entry_fee) * c.max_entries * (1 - (c.rake_pct ?? 10) / 100);
//   return formatUsdc(Math.max(potential * 0.25, parseFloat(c.entry_fee) * c.entry_count * 0.9));
// }

// // ─── Page ─────────────────────────────────────────────────────────────────────

// export default function HomePage() {
//   const { user } = useAuth();
//   const { data: currentUser } = useCurrentUser();
//   const { data: contests, isLoading: contestsLoading } = useContests();
//   const { data: entries, isLoading: entriesLoading } = useUserEntries(currentUser?.id);

//   const openContests = contests?.filter((c) => c.status === "open") ?? [];
//   const activeEntries = entries?.filter(
//     (e) => e.contest_status === "open" || e.contest_status === "locked" || e.contest_status === "scoring"
//   ) ?? [];
//   const recentResults = entries?.filter((e) => e.contest_status === "settled").slice(0, 3) ?? [];

//   // Contests the user has already entered — hide from "Enter This Week"
//   const enteredContestIds = new Set(entries?.map((e) => e.contest_id) ?? []);
//   const unenteredContests = openContests.filter((c) => !enteredContestIds.has(c.id));

//   const name = displayName(user);

//   return (
//     <AuthLayout>
//       <div className="space-y-8">

//         {/* ── Greeting header ── */}
//         <div className="flex items-start justify-between gap-4">
//           <div>
//             <p className="text-sm text-zinc-500">{greeting()}</p>
//             <h1 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-white mt-0.5">
//               {name}
//             </h1>
//           </div>
//           <Link
//             href="/contests"
//             className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-4 py-2.5 text-sm font-bold text-white transition-colors"
//           >
//             <Plus className="h-4 w-4" />
//             Enter contest
//           </Link>
//         </div>

//         {/* ── Active entries ── */}
//         <section>
//           <SectionHeader title="My Active Contests" href="/squad" linkLabel="View all" />
//           {entriesLoading ? (
//             <PageLoader />
//           ) : activeEntries.length === 0 ? (
//             <EmptyState
//               title="No active entries"
//               description="You're not in any open contests this matchweek."
//               action={
//                 <Link
//                   href="/contests"
//                   className="mt-3 inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-5 py-2.5 text-sm font-bold text-white"
//                 >
//                   Browse contests <ArrowRight className="h-4 w-4" />
//                 </Link>
//               }
//             />
//           ) : (
//             <div className="grid gap-4 sm:grid-cols-2">
//               {activeEntries.slice(0, 4).map((entry) => (
//                 <ActiveEntryCard key={entry.id} entry={entry} />
//               ))}
//             </div>
//           )}
//         </section>

//         {/* ── Open contests ── */}
//         {unenteredContests.length > 0 && (
//           <section>
//             <SectionHeader title="Enter This Week" href="/contests" linkLabel="See all contests" />
//             {contestsLoading ? (
//               <PageLoader />
//             ) : (
//               <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//                 {unenteredContests.slice(0, 3).map((c) => (
//                   <OpenContestCard key={c.id} contest={c} />
//                 ))}
//               </div>
//             )}
//           </section>
//         )}

//         {/* ── Recent results ── */}
//         {recentResults.length > 0 && (
//           <section>
//             <SectionHeader title="Recent Results" href="/entries" linkLabel="Full history" />
//             <div className="grid gap-3 sm:grid-cols-3">
//               {recentResults.map((entry) => (
//                 <ResultCard key={entry.id} entry={entry} />
//               ))}
//             </div>
//           </section>
//         )}

//         {/* ── Quick tools ── */}
//         <section>
//           <SectionHeader title="Tools" />
//           <div className="grid gap-3 sm:grid-cols-2">
//             <Link
//               href="/assistant"
//               className="group rounded-2xl border border-white/8 bg-white/[0.02] hover:border-emerald-500/25 hover:bg-emerald-500/[0.03] p-5 transition-all flex items-center gap-4"
//             >
//               <div className="h-11 w-11 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0">
//                 <Bot className="h-5 w-5 text-emerald-400" />
//               </div>
//               <div className="min-w-0">
//                 <p className="font-display text-base font-black uppercase tracking-tight text-white">
//                   AI Assistant
//                 </p>
//                 <p className="text-xs text-zinc-500 mt-0.5">
//                   Get squad advice and player insights
//                 </p>
//               </div>
//               <ArrowRight className="h-4 w-4 text-zinc-600 shrink-0 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all ml-auto" />
//             </Link>
//             <Link
//               href="/agent"
//               className="group rounded-2xl border border-white/8 bg-white/[0.02] hover:border-emerald-500/25 hover:bg-emerald-500/[0.03] p-5 transition-all flex items-center gap-4"
//             >
//               <div className="h-11 w-11 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0">
//                 <Zap className="h-5 w-5 text-emerald-400" />
//               </div>
//               <div className="min-w-0">
//                 <p className="font-display text-base font-black uppercase tracking-tight text-white">
//                   AI Agent
//                 </p>
//                 <p className="text-xs text-zinc-500 mt-0.5">
//                   Auto-enter contests on your behalf
//                 </p>
//               </div>
//               <ArrowRight className="h-4 w-4 text-zinc-600 shrink-0 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all ml-auto" />
//             </Link>
//           </div>
//         </section>

//       </div>
//     </AuthLayout>
//   );
// }

// // ─── Active entry card ────────────────────────────────────────────────────────

// function ActiveEntryCard({ entry }: { entry: UserEntry }) {
//   const isLive = entry.contest_status === "scoring";

//   return (
//     <Link href={`/entries/${entry.id}?contestId=`} className="group block">
//       <div className="rounded-2xl border border-white/8 bg-white/[0.02] hover:border-emerald-500/30 hover:bg-white/[0.04] transition-all overflow-hidden">
//         {/* Top accent line */}
//         <div className={cn("h-0.5 w-full", isLive ? "bg-gradient-to-r from-emerald-500 to-emerald-400" : "bg-white/5")} />

//         <div className="p-5">
//           {/* Header */}
//           <div className="flex items-start justify-between gap-2 mb-4">
//             <div>
//               <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em]">
//                 Matchweek {entry.matchweek}
//               </p>
//               <p className="text-sm font-semibold text-white mt-0.5 leading-snug">
//                 {entry.contest_name}
//               </p>
//             </div>
//             {isLive ? (
//               <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-1 shrink-0">
//                 <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
//                 <span className="text-[9px] font-black text-emerald-400 uppercase tracking-wider">Live</span>
//               </div>
//             ) : (
//               <ContestStatusBadge status={entry.contest_status} />
//             )}
//           </div>

//           {/* Stats row */}
//           <div className="grid grid-cols-3 gap-2">
//             <StatBox label="Points" value={entry.total_points.toString()} highlight />
//             <StatBox label="Rank" value={entry.rank ? `#${entry.rank}` : "—"} />
//             <StatBox label="Entry" value={formatUsdc(entry.entry_fee)} />
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// }

// // ─── Open contest card ────────────────────────────────────────────────────────

// function OpenContestCard({ contest }: { contest: Contest }) {
//   const passed = isDeadlinePassed(contest.deadline);
//   const left = contest.max_entries - contest.entry_count;
//   const fillPct = Math.round((contest.entry_count / contest.max_entries) * 100);

//   return (
//     <div className="rounded-2xl border border-white/8 bg-white/[0.02] hover:border-emerald-500/25 transition-all overflow-hidden flex flex-col">
//       {/* Prize pool top */}
//       <div className="relative px-5 pt-4 pb-3 border-b border-white/5">
//         <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
//         <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Est. prize pool</p>
//         <p className="font-display text-3xl font-black text-emerald-400 leading-none mt-1">
//           {estimatedPool(contest)}
//         </p>
//       </div>

//       <div className="px-5 py-3 flex-1">
//         <p className="text-xs font-semibold text-white">{contest.name}</p>
//         <div className="mt-2 flex items-center gap-3 text-[10px] text-zinc-500">
//           <span>{formatUsdc(contest.entry_fee)} entry</span>
//           <span>·</span>
//           <span>{left} spots left</span>
//         </div>
//         <div className="mt-2 h-1 rounded-full bg-white/5 overflow-hidden">
//           <div className="h-full rounded-full bg-emerald-500/60" style={{ width: `${fillPct}%` }} />
//         </div>
//       </div>

//       <div className="px-5 pb-4">
//         {!passed && (
//           <div className="flex items-center gap-1.5 mb-2">
//             <Clock className="h-3 w-3 text-zinc-600" />
//             <span className="text-[10px] text-zinc-500">{timeUntilDeadline(contest.deadline)} left</span>
//           </div>
//         )}
//         <Link
//           href={`/contests/${contest.id}/enter`}
//           className="block w-full text-center rounded-xl bg-emerald-500 hover:bg-emerald-400 py-2 text-xs font-bold text-white transition-colors"
//         >
//           Enter — {formatUsdc(contest.entry_fee)}
//         </Link>
//       </div>
//     </div>
//   );
// }

// // ─── Result card ──────────────────────────────────────────────────────────────

// function ResultCard({ entry }: { entry: UserEntry }) {
//   const isTop3 = entry.rank && entry.rank <= 3;

//   return (
//     <Link href={`/entries/${entry.id}`}>
//       <div className={cn(
//         "rounded-xl border p-4 hover:opacity-80 transition-opacity",
//         isTop3 ? "border-amber-500/30 bg-amber-500/5" : "border-white/8 bg-white/[0.02]"
//       )}>
//         {isTop3 && (
//           <div className="flex items-center gap-1.5 mb-2">
//             <Trophy className="h-3.5 w-3.5 text-amber-400" />
//             <span className="text-[9px] font-black text-amber-400 uppercase tracking-wider">Top 3 Finish</span>
//           </div>
//         )}
//         <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">MW{entry.matchweek}</p>
//         <p className="text-xs text-zinc-400 mt-0.5 truncate">{entry.contest_name}</p>
//         <div className="flex items-end justify-between mt-3">
//           <div>
//             <p className="font-display text-2xl font-black text-white leading-none">{entry.total_points}</p>
//             <p className="text-[9px] text-zinc-600 uppercase tracking-wider mt-0.5">pts</p>
//           </div>
//           {entry.rank && (
//             <div className="text-right">
//               <p className={cn("font-display text-lg font-black leading-none", isTop3 ? "text-amber-400" : "text-zinc-400")}>
//                 #{entry.rank}
//               </p>
//               <p className="text-[9px] text-zinc-600 uppercase tracking-wider mt-0.5">rank</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </Link>
//   );
// }

// // ─── Shared UI ────────────────────────────────────────────────────────────────

// function SectionHeader({
//   title,
//   href,
//   linkLabel,
// }: {
//   title: string;
//   href?: string;
//   linkLabel?: string;
// }) {
//   return (
//     <div className="flex items-center justify-between mb-4">
//       <h2 className="font-display text-xs font-black uppercase tracking-[0.2em] text-zinc-500">
//         {title}
//       </h2>
//       {href && linkLabel && (
//         <Link
//           href={href}
//           className="flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-emerald-400 transition-colors"
//         >
//           {linkLabel} <ArrowRight className="h-3.5 w-3.5" />
//         </Link>
//       )}
//     </div>
//   );
// }

// function StatBox({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
//   return (
//     <div className="rounded-lg bg-white/5 px-2.5 py-2.5 text-center">
//       <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">{label}</p>
//       <p className={cn("font-display text-xl font-black leading-none mt-1", highlight ? "text-emerald-400" : "text-white")}>
//         {value}
//       </p>
//     </div>
//   );
// }

"use client";

import Link from "next/link";
import { ArrowRight, Trophy, TrendingUp, TrendingDown, Minus, Clock, Bot, Zap, Plus } from "lucide-react";
import { AuthLayout } from "@/components/layout/auth-layout";
import { PageLoader, EmptyState } from "@/components/ui/states";
import { ContestStatusBadge } from "@/components/ui/status-badge";
import { useContests } from "@/hooks/useContests";
import { useUserEntries } from "@/hooks/useEntries";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAuth } from "@/hooks/useAuth";
import { formatUsdc, timeUntilDeadline, isDeadlinePassed, cn } from "@/lib/utils";
import type { Contest, UserEntry } from "@/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function displayName(user: ReturnType<typeof useAuth>["user"]): string {
  if (!user) return "Manager";
  const google = (user as any)?.google?.name;
  if (google) return google.split(" ")[0];
  const email = (user as any)?.email?.address;
  if (email) return email.split("@")[0];
  return "Manager";
}

function estimatedPool(c: Contest) {
  const potential = parseFloat(c.entry_fee) * c.max_entries * (1 - (c.rake_pct ?? 10) / 100);
  return formatUsdc(Math.max(potential * 0.25, parseFloat(c.entry_fee) * c.entry_count * 0.9));
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const { user } = useAuth();
  const { data: currentUser } = useCurrentUser();
  const { data: contests, isLoading: contestsLoading } = useContests();
  const { data: entries, isLoading: entriesLoading } = useUserEntries(currentUser?.id);

  const openContests = contests?.filter((c) => c.status === "open") ?? [];
  const activeEntries = entries?.filter(
    (e) => e.contest_status === "open" || e.contest_status === "locked" || e.contest_status === "scoring"
  ) ?? [];
  const recentResults = entries?.filter((e) => e.contest_status === "settled").slice(0, 3) ?? [];

  // Contests the user has already entered — hide from "Enter This Week"
  const enteredContestIds = new Set(entries?.map((e) => e.contest_id) ?? []);
  const unenteredContests = openContests.filter((c) => !enteredContestIds.has(c.id));

  const name = displayName(user);

  return (
    <AuthLayout>
      <div className="space-y-8">

        {/* ── Greeting header ── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-zinc-500">{greeting()}</p>
            <h1 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-white mt-0.5">
              {name}
            </h1>
          </div>
          <Link
            href="/contests"
            className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-4 py-2.5 text-sm font-bold text-white transition-colors"
          >
            <Plus className="h-4 w-4" />
            Enter contest
          </Link>
        </div>

        {/* ── Active entries ── */}
        <section>
          <SectionHeader title="My Active Contests" href="/squad" linkLabel="View all" />
          {entriesLoading ? (
            <PageLoader />
          ) : activeEntries.length === 0 ? (
            <EmptyState
              title="No active entries"
              description="You're not in any open contests this matchweek."
              action={
                <Link
                  href="/contests"
                  className="mt-3 inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-5 py-2.5 text-sm font-bold text-white"
                >
                  Browse contests <ArrowRight className="h-4 w-4" />
                </Link>
              }
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {activeEntries.slice(0, 4).map((entry) => (
                <ActiveEntryCard key={entry.id} entry={entry} />
              ))}
            </div>
          )}
        </section>

        {/* ── Open contests ── */}
        {unenteredContests.length > 0 && (
          <section>
            <SectionHeader title="Enter This Week" href="/contests" linkLabel="See all contests" />
            {contestsLoading ? (
              <PageLoader />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {unenteredContests.slice(0, 3).map((c) => (
                  <OpenContestCard key={c.id} contest={c} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── Recent results ── */}
        {recentResults.length > 0 && (
          <section>
            <SectionHeader title="Recent Results" href="/entries" linkLabel="Full history" />
            <div className="grid gap-3 sm:grid-cols-3">
              {recentResults.map((entry) => (
                <ResultCard key={entry.id} entry={entry} />
              ))}
            </div>
          </section>
        )}

        {/* ── Quick tools ── */}
        <section>
          <SectionHeader title="Tools" />
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/assistant"
              className="group rounded-2xl border border-white/8 bg-white/[0.02] hover:border-emerald-500/25 hover:bg-emerald-500/[0.03] p-5 transition-all flex items-center gap-4"
            >
              <div className="h-11 w-11 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0">
                <Bot className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="min-w-0">
                <p className="font-display text-base font-black uppercase tracking-tight text-white">
                  AI Assistant
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Get squad advice and player insights
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-zinc-600 shrink-0 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all ml-auto" />
            </Link>
            <Link
              href="/agent"
              className="group rounded-2xl border border-white/8 bg-white/[0.02] hover:border-emerald-500/25 hover:bg-emerald-500/[0.03] p-5 transition-all flex items-center gap-4"
            >
              <div className="h-11 w-11 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0">
                <Zap className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="min-w-0">
                <p className="font-display text-base font-black uppercase tracking-tight text-white">
                  AI Agent
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Auto-enter contests on your behalf
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-zinc-600 shrink-0 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all ml-auto" />
            </Link>
          </div>
        </section>

      </div>
    </AuthLayout>
  );
}

// ─── Active entry card ────────────────────────────────────────────────────────

function ActiveEntryCard({ entry }: { entry: UserEntry }) {
  const isLive = entry.contest_status === "scoring";

  return (
    <Link href={`/entries/${entry.id}?contestId=${(entry as any).contest_id ?? ""}`} className="group block">
      <div className="rounded-2xl border border-white/8 bg-white/[0.02] hover:border-emerald-500/30 hover:bg-white/[0.04] transition-all overflow-hidden">
        {/* Top accent line */}
        <div className={cn("h-0.5 w-full", isLive ? "bg-gradient-to-r from-emerald-500 to-emerald-400" : "bg-white/5")} />

        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-4">
            <div>
              <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em]">
                Matchweek {entry.matchweek}
              </p>
              <p className="text-sm font-semibold text-white mt-0.5 leading-snug">
                {entry.contest_name}
              </p>
            </div>
            {isLive ? (
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-1 shrink-0">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-wider">Live</span>
              </div>
            ) : (
              <ContestStatusBadge status={entry.contest_status} />
            )}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2">
            <StatBox label="Points" value={entry.total_points.toString()} highlight />
            <StatBox label="Rank" value={entry.rank ? `#${entry.rank}` : "—"} />
            <StatBox label="Entry" value={formatUsdc(entry.entry_fee)} />
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Open contest card ────────────────────────────────────────────────────────

function OpenContestCard({ contest }: { contest: Contest }) {
  const passed = isDeadlinePassed(contest.deadline);
  const left = contest.max_entries - contest.entry_count;
  const fillPct = Math.round((contest.entry_count / contest.max_entries) * 100);

  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.02] hover:border-emerald-500/25 transition-all overflow-hidden flex flex-col">
      {/* Prize pool top */}
      <div className="relative px-5 pt-4 pb-3 border-b border-white/5">
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
        <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Est. prize pool</p>
        <p className="font-display text-3xl font-black text-emerald-400 leading-none mt-1">
          {estimatedPool(contest)}
        </p>
      </div>

      <div className="px-5 py-3 flex-1">
        <p className="text-xs font-semibold text-white">{contest.name}</p>
        <div className="mt-2 flex items-center gap-3 text-[10px] text-zinc-500">
          <span>{formatUsdc(contest.entry_fee)} entry</span>
          <span>·</span>
          <span>{left} spots left</span>
        </div>
        <div className="mt-2 h-1 rounded-full bg-white/5 overflow-hidden">
          <div className="h-full rounded-full bg-emerald-500/60" style={{ width: `${fillPct}%` }} />
        </div>
      </div>

      <div className="px-5 pb-4">
        {!passed && (
          <div className="flex items-center gap-1.5 mb-2">
            <Clock className="h-3 w-3 text-zinc-600" />
            <span className="text-[10px] text-zinc-500">{timeUntilDeadline(contest.deadline)} left</span>
          </div>
        )}
        <Link
          href={`/contests/${contest.id}/enter`}
          className="block w-full text-center rounded-xl bg-emerald-500 hover:bg-emerald-400 py-2 text-xs font-bold text-white transition-colors"
        >
          Enter — {formatUsdc(contest.entry_fee)}
        </Link>
      </div>
    </div>
  );
}

// ─── Result card ──────────────────────────────────────────────────────────────

function ResultCard({ entry }: { entry: UserEntry }) {
  const isTop3 = entry.rank && entry.rank <= 3;

  return (
    <Link href={`/entries/${entry.id}`}>
      <div className={cn(
        "rounded-xl border p-4 hover:opacity-80 transition-opacity",
        isTop3 ? "border-amber-500/30 bg-amber-500/5" : "border-white/8 bg-white/[0.02]"
      )}>
        {isTop3 && (
          <div className="flex items-center gap-1.5 mb-2">
            <Trophy className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-[9px] font-black text-amber-400 uppercase tracking-wider">Top 3 Finish</span>
          </div>
        )}
        <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">MW{entry.matchweek}</p>
        <p className="text-xs text-zinc-400 mt-0.5 truncate">{entry.contest_name}</p>
        <div className="flex items-end justify-between mt-3">
          <div>
            <p className="font-display text-2xl font-black text-white leading-none">{entry.total_points}</p>
            <p className="text-[9px] text-zinc-600 uppercase tracking-wider mt-0.5">pts</p>
          </div>
          {entry.rank && (
            <div className="text-right">
              <p className={cn("font-display text-lg font-black leading-none", isTop3 ? "text-amber-400" : "text-zinc-400")}>
                #{entry.rank}
              </p>
              <p className="text-[9px] text-zinc-600 uppercase tracking-wider mt-0.5">rank</p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

// ─── Shared UI ────────────────────────────────────────────────────────────────

function SectionHeader({
  title,
  href,
  linkLabel,
}: {
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="font-display text-xs font-black uppercase tracking-[0.2em] text-zinc-500">
        {title}
      </h2>
      {href && linkLabel && (
        <Link
          href={href}
          className="flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-emerald-400 transition-colors"
        >
          {linkLabel} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}

function StatBox({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-lg bg-white/5 px-2.5 py-2.5 text-center">
      <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">{label}</p>
      <p className={cn("font-display text-xl font-black leading-none mt-1", highlight ? "text-emerald-400" : "text-white")}>
        {value}
      </p>
    </div>
  );
}