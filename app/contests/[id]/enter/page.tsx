// "use client";

// import { Suspense, useState, useEffect, useMemo, useCallback, useRef } from "react";
// import { useParams, useSearchParams, useRouter } from "next/navigation";
// import { AuthLayout } from "@/components/layout/auth-layout";
// import { PageLoader, ErrorState } from "@/components/ui/states";
// import { useContest } from "@/hooks/useContests";
// import { usePlayers } from "@/hooks/usePlayers";
// import { useSquadBuilder } from "@/hooks/useSquadBuilder";
// import { useSubmitEntry } from "@/hooks/useEntries";
// import { useAuth } from "@/hooks/useAuth";
// import { playersApi } from "@/lib/api";
// import { signEnterContestTx } from "@/lib/transactions";
// import { formatUsdc, cn } from "@/lib/utils";
// import {
//   Loader2, Search, X, Zap, CheckCircle2, AlertCircle,
// } from "lucide-react";
// import type { Player, Position } from "@/types";

// // ─── Suspense wrapper — required for useSearchParams in Next.js 14 ────────────

// export default function EnterContestPage() {
//   return (
//     <Suspense fallback={<AuthLayout><PageLoader /></AuthLayout>}>
//       <EnterContestPageInner />
//     </Suspense>
//   );
// }

// // ─── Inner page ───────────────────────────────────────────────────────────────

// const POSITIONS: Position[] = ["GK", "DEF", "MID", "FWD"] as const;

// function EnterContestPageInner() {
//   const { id } = useParams<{ id: string }>();
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const { getToken, solanaWallet } = useAuth();

//   const { data: contest, isLoading, isError, refetch } = useContest(id);
//   // salary_cap falls back to a large number before contest loads so hooks
//   // aren't called conditionally. The early return below prevents submission.
//   const squad = useSquadBuilder(
//     Number(contest?.salary_cap) || 100_000_000,
//     contest?.squad_size ?? 11
//   );
//   const submitEntry = useSubmitEntry();

//   // ── Player search ─────────────────────────────────────────────────────────
//   const [query, setQuery] = useState("");
//   const [posFilter, setPosFilter] = useState<Position | null>(null);
//   const { data: playerData } = usePlayers({ position: posFilter ?? undefined });
//   // Filter by name client-side — usePlayers doesn't have a search param
//   const players = (playerData?.players ?? []).filter((p) =>
//     !query || p.name.toLowerCase().includes(query.toLowerCase())
//   );

//   // ── Pre-select from ?players= ─────────────────────────────────────────────
//   const preselectedIds = useMemo(() => {
//     const raw = searchParams.get("players");
//     return raw ? raw.split(",").filter(Boolean) : [];
//   }, [searchParams]);

//   // useRef survives React Strict Mode's double-invocation; useState does not
//   const preselectStarted = useRef(false);
//   const [preselecting, setPreselecting] = useState(false);
//   const [preselectDone, setPreselectDone] = useState(false);

//   useEffect(() => {
//     if (preselectedIds.length === 0 || !contest) return;
//     if (preselectStarted.current) return; // skip strict-mode re-run
//     preselectStarted.current = true;

//     const run = async () => {
//       setPreselecting(true);
//       try {
//         const fetched = await Promise.all(
//           preselectedIds.map((pid) =>
//             playersApi.getById(pid).catch(() => null)
//           )
//         );
//         fetched.forEach((p) => {
//           // guard against duplicates in case the effect somehow runs twice
//           if (p && !squad.playerIds.includes(p.id)) squad.addPlayer(p);
//         });
//         setPreselectDone(true);
//       } finally {
//         setPreselecting(false);
//       }
//     };

//     run();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [contest?.id]);

//   // ── Submit ────────────────────────────────────────────────────────────────
//   const [submitState, setSubmitState] = useState<"idle" | "signing" | "confirming">("idle");
//   const [submitError, setSubmitError] = useState<string | null>(null);

//   const handleSubmit = async () => {
//     if (!squad.isValid || !contest || !solanaWallet) return;
//     setSubmitError(null);
//     setSubmitState("signing");
//     try {
//       const txSig = await signEnterContestTx(solanaWallet, contest.id);
//       // Privy modal closes here — immediately show "confirming" so the button
//       // never looks idle while the backend API call is in flight
//       setSubmitState("confirming");
//       await submitEntry.mutateAsync({
//         contestId: contest.id,
//         playerIds: squad.playerIds,
//         entryTx: txSig,
//       });
//       router.push("/squad");
//     } catch (e: any) {
//       setSubmitError(e.message ?? "Entry failed. Try again.");
//       setSubmitState("idle");
//     }
//   };

//   if (isLoading) return <AuthLayout><PageLoader /></AuthLayout>;
//   if (isError || !contest) return <AuthLayout><ErrorState onRetry={refetch} /></AuthLayout>;

//   const squadSize = contest.squad_size ?? 11;

//   return (
//     <AuthLayout>
//       <div className="space-y-4 max-w-4xl">
//         {/* Header */}
//         <div className="flex items-start justify-between gap-4 flex-wrap">
//           <div>
//             <h1 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
//               {contest.name}
//             </h1>
//             <p className="text-sm text-zinc-500 mt-1">
//               Entry fee: {formatUsdc(contest.entry_fee)} · Squad of {squadSize}
//             </p>
//           </div>
//           <div className="text-right">
//             <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Budget left</p>
//             <p className={cn(
//               "font-display text-2xl font-black",
//               squad.remainingBudget < 0 ? "text-red-400" : "text-emerald-400"
//             )}>
//               {formatUsdc(squad.remainingBudget)}
//             </p>
//           </div>
//         </div>

//         {/* Pre-selection banner */}
//         {preselectedIds.length > 0 && (
//           <div className={cn(
//             "rounded-xl border px-4 py-3 flex items-center gap-3",
//             preselecting
//               ? "border-white/10 bg-white/5"
//               : "border-emerald-500/20 bg-emerald-500/5"
//           )}>
//             {preselecting
//               ? <Loader2 className="h-4 w-4 text-zinc-400 animate-spin shrink-0" />
//               : <Zap className="h-4 w-4 text-emerald-400 shrink-0" />
//             }
//             <p className="text-sm text-zinc-400">
//               {preselecting
//                 ? "Pre-filling squad from your assistant recommendation…"
//                 : "Squad pre-filled from your AI assistant. Review and submit below."}
//             </p>
//           </div>
//         )}

//         <div className="grid lg:grid-cols-[1fr_320px] gap-4">
//           {/* ── Player browser ── */}
//           <div className="rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden">
//             {/* Search + position filters */}
//             <div className="p-4 border-b border-white/5 space-y-3">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
//                 <input
//                   type="text"
//                   value={query}
//                   onChange={(e) => setQuery(e.target.value)}
//                   placeholder="Search players…"
//                   className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-white/8 bg-white/5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
//                 />
//               </div>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => setPosFilter(null)}
//                   className={cn(
//                     "rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors",
//                     posFilter === null
//                       ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
//                       : "border-white/8 bg-white/5 text-zinc-500 hover:text-white"
//                   )}
//                 >
//                   All
//                 </button>
//                 {POSITIONS.map((pos) => (
//                   <button
//                     key={pos}
//                     onClick={() => setPosFilter(posFilter === pos ? null : pos)}
//                     className={cn(
//                       "rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors",
//                       posFilter === pos
//                         ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
//                         : "border-white/8 bg-white/5 text-zinc-500 hover:text-white"
//                     )}
//                   >
//                     {pos}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Player list */}
//             <div className="divide-y divide-white/5 max-h-[480px] overflow-y-auto">
//               {players.length === 0 ? (
//                 <p className="text-xs text-zinc-600 text-center py-8">
//                   {query ? "No players found." : "Loading players…"}
//                 </p>
//               ) : (
//                 players.map((player) => {
//                   const inSquad = squad.playerIds.includes(player.id);
//                   const canAddResult = squad.canAdd(player);
//                   const canAdd = typeof canAddResult === "object"
//                     ? canAddResult.ok
//                     : canAddResult;
//                   return (
//                     <PlayerRow
//                       key={player.id}
//                       player={player}
//                       inSquad={inSquad}
//                       canAdd={canAdd}
//                       onAdd={() => squad.addPlayer(player)}
//                       onRemove={() => squad.removePlayer(player.id)}
//                     />
//                   );
//                 })
//               )}
//             </div>
//           </div>

//           {/* ── Squad panel ── */}
//           <div className="space-y-3">
//             <div className="rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden">
//               <div className="px-4 py-3.5 border-b border-white/5 flex items-center justify-between">
//                 <p className="text-sm font-semibold text-white">Your Squad</p>
//                 <span className={cn(
//                   "text-xs font-bold",
//                   squad.playerIds.length === squadSize ? "text-emerald-400" : "text-zinc-500"
//                 )}>
//                   {squad.playerIds.length} / {squadSize}
//                 </span>
//               </div>

//               <div className="p-3 space-y-3">
//                 {POSITIONS.map((pos) => {
//                   const posPlayers = squad.byPosition(pos) ?? [];
//                   if (posPlayers.length === 0) return null;
//                   return (
//                     <div key={pos}>
//                       <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1.5">
//                         {pos}
//                       </p>
//                       <div className="space-y-1">
//                         {posPlayers.map((p) => (
//                           <div key={p.id} className="flex items-center justify-between gap-2 rounded-lg bg-white/5 px-3 py-2">
//                             <div className="min-w-0">
//                               <p className="text-xs font-semibold text-white truncate">{p.name}</p>
//                               <p className="text-[10px] text-zinc-500">{p.team_name}</p>
//                             </div>
//                             <div className="flex items-center gap-2 shrink-0">
//                               <span className="text-xs font-bold text-emerald-400">
//                                 {formatUsdc(p.price)}
//                               </span>
//                               <button
//                                 onClick={() => squad.removePlayer(p.id)}
//                                 className="text-zinc-600 hover:text-red-400 transition-colors"
//                               >
//                                 <X className="h-3.5 w-3.5" />
//                               </button>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   );
//                 })}

//                 {squad.playerIds.length === 0 && (
//                   <p className="text-xs text-zinc-600 text-center py-4">
//                     Select players from the list to build your squad.
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Validation */}
//             {squad.validationErrors.length > 0 && (
//               <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2.5 space-y-1">
//                 {squad.validationErrors.map((e, i) => (
//                   <div key={i} className="flex items-start gap-2">
//                     <AlertCircle className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" />
//                     <p className="text-xs text-red-400">{e}</p>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {submitError && (
//               <p className="text-xs text-red-400">{submitError}</p>
//             )}

//             <button
//               onClick={handleSubmit}
//               disabled={!squad.isValid || submitState !== "idle" || preselecting}
//               className={cn(
//                 "w-full rounded-xl py-3.5 text-sm font-bold transition-all inline-flex items-center justify-center gap-2",
//                 squad.isValid && submitState === "idle" && !preselecting
//                   ? "bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20"
//                   : "bg-white/5 text-zinc-600 cursor-not-allowed"
//               )}
//             >
//               {submitState === "signing" ? (
//                 <><Loader2 className="h-4 w-4 animate-spin" /> Waiting for approval…</>
//               ) : submitState === "confirming" ? (
//                 <><Loader2 className="h-4 w-4 animate-spin" /> Confirming entry…</>
//               ) : squad.isValid ? (
//                 <><CheckCircle2 className="h-4 w-4" /> Submit entry · {formatUsdc(contest.entry_fee)}</>
//               ) : (
//                 `Submit entry · ${formatUsdc(contest.entry_fee)}`
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     </AuthLayout>
//   );
// }

// // ─── Player row ───────────────────────────────────────────────────────────────

// function PlayerRow({
//   player, inSquad, canAdd, onAdd, onRemove,
// }: {
//   player: Player;
//   inSquad: boolean;
//   canAdd: boolean;
//   onAdd: () => void;
//   onRemove: () => void;
// }) {
//   return (
//     <div className={cn(
//       "flex items-center gap-3 px-4 py-3 transition-colors",
//       inSquad ? "bg-emerald-500/5" : "hover:bg-white/[0.02]"
//     )}>
//       <span className={cn(
//         "text-[9px] font-black w-7 text-center rounded px-1 py-0.5 shrink-0",
//         player.position === "GK"  ? "bg-amber-500/20  text-amber-400"  :
//         player.position === "DEF" ? "bg-sky-500/20    text-sky-400"    :
//         player.position === "MID" ? "bg-emerald-500/20 text-emerald-400" :
//                                     "bg-red-500/20    text-red-400"
//       )}>
//         {player.position}
//       </span>

//       <div className="flex-1 min-w-0">
//         <p className="text-sm font-semibold text-white truncate">{player.name}</p>
//         <p className="text-[10px] text-zinc-500 truncate">{player.team_name}</p>
//       </div>

//       <span className="text-xs font-bold text-zinc-300 shrink-0">
//         {formatUsdc(player.price)}
//       </span>

//       <button
//         onClick={inSquad ? onRemove : onAdd}
//         disabled={!inSquad && !canAdd}
//         className={cn(
//           "h-7 w-7 rounded-lg flex items-center justify-center text-xs font-black transition-colors shrink-0",
//           inSquad
//             ? "bg-emerald-500/20 text-emerald-400 hover:bg-red-500/20 hover:text-red-400"
//             : canAdd
//             ? "bg-white/10 text-zinc-400 hover:bg-emerald-500/20 hover:text-emerald-400"
//             : "bg-white/5 text-zinc-700 cursor-not-allowed"
//         )}
//       >
//         {inSquad ? <X className="h-3.5 w-3.5" /> : "+"}
//       </button>
//     </div>
//   );
// }

"use client";

import { Suspense, useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AuthLayout } from "@/components/layout/auth-layout";
import { PageLoader, ErrorState } from "@/components/ui/states";
import { useContest } from "@/hooks/useContests";
import { usePlayers } from "@/hooks/usePlayers";
import { useSquadBuilder } from "@/hooks/useSquadBuilder";
import { useSubmitEntry, useUserEntries } from "@/hooks/useEntries";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAuth } from "@/hooks/useAuth";
import { playersApi } from "@/lib/api";
import { signEnterContestTx } from "@/lib/transactions";
import { getConnection, entryReceiptPdaFromId } from "@/lib/solana";
import { PublicKey } from "@solana/web3.js";
import { formatUsdc, cn } from "@/lib/utils";
import {
  Loader2, Search, X, Zap, CheckCircle2, AlertCircle, Trophy,
} from "lucide-react";
import type { Player, Position } from "@/types";

/**
 * Detects an on-chain AlreadyEntered error (SquadXIError index 3).
 * @solana/kit formats Anchor custom errors as "Custom program error: #N"
 * where N is the 0-based index in the SquadXIError enum.
 * AlreadyEntered is at index 3 → shows as "#3".
 */
function isAlreadyEnteredError(e: unknown): boolean {
  const msg   = (e as any)?.message ?? "";
  const cause = (e as any)?.cause?.message ?? "";
  return (
    msg.includes("#3") ||
    cause.includes("#3") ||
    msg.toLowerCase().includes("alreadyentered") ||
    cause.toLowerCase().includes("alreadyentered")
  );
}

// ─── Suspense wrapper — required for useSearchParams in Next.js 14 ────────────

export default function EnterContestPage() {
  return (
    <Suspense fallback={<AuthLayout><PageLoader /></AuthLayout>}>
      <EnterContestPageInner />
    </Suspense>
  );
}

// ─── Inner page ───────────────────────────────────────────────────────────────

const POSITIONS: Position[] = ["GK", "DEF", "MID", "FWD"] as const;

function EnterContestPageInner() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { getToken, solanaWallet, walletAddress } = useAuth();
  const { data: currentUser } = useCurrentUser();

  const { data: contest, isLoading, isError, refetch } = useContest(id);
  const { data: entries } = useUserEntries(currentUser?.id);

  // DB entry check — has backend already recorded this entry?
  const existingEntry = (entries ?? []).find(
    (e) => (e as any).contest_id === id
  );

  // On-chain receipt check — null=checking, false=not found, true=already paid
  const [receiptOnChain, setReceiptOnChain] = useState<boolean | null>(null);

  useEffect(() => {
    if (!walletAddress || walletAddress.startsWith("0x")) {
      setReceiptOnChain(false);
      return;
    }
    const check = async () => {
      try {
        const conn = getConnection();
        const pda  = entryReceiptPdaFromId(id, new PublicKey(walletAddress));
        const info = await conn.getAccountInfo(pda);
        setReceiptOnChain(!!info);
      } catch {
        setReceiptOnChain(false);
      }
    };
    check();
  }, [walletAddress, id]);

  // salary_cap falls back to a large number before contest loads so hooks
  // aren't called conditionally. The early return below prevents submission.
  const squad = useSquadBuilder(
    Number(contest?.salary_cap) || 100_000_000,
    contest?.squad_size ?? 11
  );
  const submitEntry = useSubmitEntry();

  // ── Player search ─────────────────────────────────────────────────────────
  const [query, setQuery] = useState("");
  const [posFilter, setPosFilter] = useState<Position | null>(null);
  const { data: playerData } = usePlayers({ position: posFilter ?? undefined, league: contest?.league,
  season: contest?.season ?? undefined, });
  // Filter by name client-side — usePlayers doesn't have a search param
  const players = (playerData?.players ?? []).filter((p) =>
    !query || p.name.toLowerCase().includes(query.toLowerCase())
  );

  // ── Pre-select from ?players= ─────────────────────────────────────────────
  const preselectedIds = useMemo(() => {
    const raw = searchParams.get("players");
    return raw ? raw.split(",").filter(Boolean) : [];
  }, [searchParams]);

  // useRef survives React Strict Mode's double-invocation; useState does not
  const preselectStarted = useRef(false);
  const [preselecting, setPreselecting] = useState(false);
  const [preselectDone, setPreselectDone] = useState(false);

  useEffect(() => {
    if (preselectedIds.length === 0 || !contest) return;
    if (preselectStarted.current) return; // skip strict-mode re-run
    preselectStarted.current = true;

    const run = async () => {
      setPreselecting(true);
      try {
        const fetched = await Promise.all(
          preselectedIds.map((pid) =>
            playersApi.getById(pid).catch(() => null)
          )
        );
        fetched.forEach((p) => {
          // guard against duplicates in case the effect somehow runs twice
          if (p && !squad.playerIds.includes(p.id)) squad.addPlayer(p);
        });
        setPreselectDone(true);
      } finally {
        setPreselecting(false);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contest?.id]);

  // ── Submit ────────────────────────────────────────────────────────────────
  const [submitState, setSubmitState] = useState<"idle" | "signing" | "confirming">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!squad.isValid || !contest || !solanaWallet) return;
    setSubmitError(null);
    setSubmitState("signing");

    // ── Step 1: sign the on-chain transaction ─────────────────────────────────
    let txSig: string | null = null;
    try {
      txSig = await signEnterContestTx(solanaWallet, contest.id);
    } catch (txErr: any) {
      if (isAlreadyEnteredError(txErr)) {
        // Payment went through in a prior attempt but the DB write failed.
        // Skip the transaction and let the backend recover from the on-chain receipt.
        txSig = null;
      } else {
        setSubmitError(txErr.message ?? "Transaction failed. Try again.");
        setSubmitState("idle");
        return;
      }
    }

    // ── Step 2: record the entry in the backend ───────────────────────────────
    setSubmitState("confirming");
    try {
      await submitEntry.mutateAsync({
        contestId: contest.id,
        playerIds: squad.playerIds,
        entryTx: txSig ?? undefined,
      });
      router.push("/squad");
    } catch (e: any) {
      setSubmitError(e.message ?? "Entry failed. Try again.");
      setSubmitState("idle");
    }
  };

  if (isLoading || receiptOnChain === null) return <AuthLayout><PageLoader /></AuthLayout>;
  if (isError || !contest) return <AuthLayout><ErrorState onRetry={refetch} /></AuthLayout>;

  // User already has a DB entry — nothing to do here
  if (existingEntry) {
    return (
      <AuthLayout>
        <div className="max-w-md mx-auto text-center space-y-4 pt-16">
          <div className="h-16 w-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto">
            <Trophy className="h-8 w-8 text-emerald-400" />
          </div>
          <h1 className="font-display text-2xl font-black uppercase text-white">Already entered</h1>
          <p className="text-sm text-zinc-500">
            You've already entered <span className="text-white font-medium">{contest.name}</span>.
          </p>
          <Link
            href={`/entries/${existingEntry.id}`}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-6 py-3 text-sm font-bold text-white transition-colors"
          >
            View my entry
          </Link>
        </div>
      </AuthLayout>
    );
  }

  // On-chain payment exists but no DB record — recover without Privy
  if (receiptOnChain && !existingEntry) {
    return (
      <AuthLayout>
        <RecoveryScreen
          contest={contest}
          playerIds={preselectedIds}
          onSuccess={() => router.push("/squad")}
        />
      </AuthLayout>
    );
  }

  const squadSize = contest.squad_size ?? 11;

  return (
    <AuthLayout>
      <div className="space-y-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
              {contest.name}
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              Entry fee: {formatUsdc(contest.entry_fee)} · Squad of {squadSize}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Budget left</p>
            <p className={cn(
              "font-display text-2xl font-black",
              squad.remainingBudget < 0 ? "text-red-400" : "text-emerald-400"
            )}>
              {formatUsdc(squad.remainingBudget)}
            </p>
          </div>
        </div>

        {/* Pre-selection banner */}
        {preselectedIds.length > 0 && (
          <div className={cn(
            "rounded-xl border px-4 py-3 flex items-center gap-3",
            preselecting
              ? "border-white/10 bg-white/5"
              : "border-emerald-500/20 bg-emerald-500/5"
          )}>
            {preselecting
              ? <Loader2 className="h-4 w-4 text-zinc-400 animate-spin shrink-0" />
              : <Zap className="h-4 w-4 text-emerald-400 shrink-0" />
            }
            <p className="text-sm text-zinc-400">
              {preselecting
                ? "Pre-filling squad from your assistant recommendation…"
                : "Squad pre-filled from your AI assistant. Review and submit below."}
            </p>
          </div>
        )}

        <div className="grid lg:grid-cols-[1fr_320px] gap-4">
          {/* ── Player browser ── */}
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden">
            {/* Search + position filters */}
            <div className="p-4 border-b border-white/5 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search players…"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-white/8 bg-white/5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPosFilter(null)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors",
                    posFilter === null
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                      : "border-white/8 bg-white/5 text-zinc-500 hover:text-white"
                  )}
                >
                  All
                </button>
                {POSITIONS.map((pos) => (
                  <button
                    key={pos}
                    onClick={() => setPosFilter(posFilter === pos ? null : pos)}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors",
                      posFilter === pos
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                        : "border-white/8 bg-white/5 text-zinc-500 hover:text-white"
                    )}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>

            {/* Player list */}
            <div className="divide-y divide-white/5 max-h-[480px] overflow-y-auto">
              {players.length === 0 ? (
                <p className="text-xs text-zinc-600 text-center py-8">
                  {query ? "No players found." : "Loading players…"}
                </p>
              ) : (
                players.map((player) => {
                  const inSquad = squad.playerIds.includes(player.id);
                  const canAddResult = squad.canAdd(player);
                  const canAdd = typeof canAddResult === "object"
                    ? canAddResult.ok
                    : canAddResult;
                  return (
                    <PlayerRow
                      key={player.id}
                      player={player}
                      inSquad={inSquad}
                      canAdd={canAdd}
                      onAdd={() => squad.addPlayer(player)}
                      onRemove={() => squad.removePlayer(player.id)}
                    />
                  );
                })
              )}
            </div>
          </div>

          {/* ── Squad panel ── */}
          <div className="space-y-3">
            <div className="rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden">
              <div className="px-4 py-3.5 border-b border-white/5 flex items-center justify-between">
                <p className="text-sm font-semibold text-white">Your Squad</p>
                <span className={cn(
                  "text-xs font-bold",
                  squad.playerIds.length === squadSize ? "text-emerald-400" : "text-zinc-500"
                )}>
                  {squad.playerIds.length} / {squadSize}
                </span>
              </div>

              <div className="p-3 space-y-3">
                {POSITIONS.map((pos) => {
                  const posPlayers = squad.byPosition(pos) ?? [];
                  if (posPlayers.length === 0) return null;
                  return (
                    <div key={pos}>
                      <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1.5">
                        {pos}
                      </p>
                      <div className="space-y-1">
                        {posPlayers.map((p) => (
                          <div key={p.id} className="flex items-center justify-between gap-2 rounded-lg bg-white/5 px-3 py-2">
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-white truncate">{p.name}</p>
                              <p className="text-[10px] text-zinc-500">{p.team_name}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-xs font-bold text-emerald-400">
                                {formatUsdc(p.price)}
                              </span>
                              <button
                                onClick={() => squad.removePlayer(p.id)}
                                className="text-zinc-600 hover:text-red-400 transition-colors"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {squad.playerIds.length === 0 && (
                  <p className="text-xs text-zinc-600 text-center py-4">
                    Select players from the list to build your squad.
                  </p>
                )}
              </div>
            </div>

            {/* Validation */}
            {squad.validationErrors.length > 0 && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2.5 space-y-1">
                {squad.validationErrors.map((e, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <AlertCircle className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-400">{e}</p>
                  </div>
                ))}
              </div>
            )}

            {submitError && (
              <p className="text-xs text-red-400">{submitError}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={!squad.isValid || submitState !== "idle" || preselecting}
              className={cn(
                "w-full rounded-xl py-3.5 text-sm font-bold transition-all inline-flex items-center justify-center gap-2",
                squad.isValid && submitState === "idle" && !preselecting
                  ? "bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20"
                  : "bg-white/5 text-zinc-600 cursor-not-allowed"
              )}
            >
              {submitState === "signing" ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Waiting for approval…</>
              ) : submitState === "confirming" ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Confirming entry…</>
              ) : squad.isValid ? (
                <><CheckCircle2 className="h-4 w-4" /> Submit entry · {formatUsdc(contest.entry_fee)}</>
              ) : (
                `Submit entry · ${formatUsdc(contest.entry_fee)}`
              )}
            </button>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

// ─── Player row ───────────────────────────────────────────────────────────────

function PlayerRow({
  player, inSquad, canAdd, onAdd, onRemove,
}: {
  player: Player;
  inSquad: boolean;
  canAdd: boolean;
  onAdd: () => void;
  onRemove: () => void;
}) {
  return (
    <div className={cn(
      "flex items-center gap-3 px-4 py-3 transition-colors",
      inSquad ? "bg-emerald-500/5" : "hover:bg-white/[0.02]"
    )}>
      <span className={cn(
        "text-[9px] font-black w-7 text-center rounded px-1 py-0.5 shrink-0",
        player.position === "GK"  ? "bg-amber-500/20  text-amber-400"  :
        player.position === "DEF" ? "bg-sky-500/20    text-sky-400"    :
        player.position === "MID" ? "bg-emerald-500/20 text-emerald-400" :
                                    "bg-red-500/20    text-red-400"
      )}>
        {player.position}
      </span>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{player.name}</p>
        <p className="text-[10px] text-zinc-500 truncate">{player.team_name}</p>
      </div>

      <span className="text-xs font-bold text-zinc-300 shrink-0">
        {formatUsdc(player.price)}
      </span>

      <button
        onClick={inSquad ? onRemove : onAdd}
        disabled={!inSquad && !canAdd}
        className={cn(
          "h-7 w-7 rounded-lg flex items-center justify-center text-xs font-black transition-colors shrink-0",
          inSquad
            ? "bg-emerald-500/20 text-emerald-400 hover:bg-red-500/20 hover:text-red-400"
            : canAdd
            ? "bg-white/10 text-zinc-400 hover:bg-emerald-500/20 hover:text-emerald-400"
            : "bg-white/5 text-zinc-700 cursor-not-allowed"
        )}
      >
        {inSquad ? <X className="h-3.5 w-3.5" /> : "+"}
      </button>
    </div>
  );
}

// ─── Recovery screen ─────────────────────────────────────────────────────────
// Shown when on-chain entry receipt exists but no DB record.
// Calls POST /api/entries directly — no Privy, no second payment.

function RecoveryScreen({
  contest,
  playerIds,
  onSuccess,
}: {
  contest: { id: string; name: string };
  playerIds: string[];
  onSuccess: () => void;
}) {
  const submitEntry = useSubmitEntry();
  const [recovering, setRecovering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRecover = async () => {
    setError(null);
    setRecovering(true);
    try {
      await submitEntry.mutateAsync({
        contestId: contest.id,
        playerIds,
        entryTx: null, // payment already on-chain, backend recovers from receipt
      });
      onSuccess();
    } catch (e: any) {
      setError(e.message ?? "Recovery failed. Try again.");
    } finally {
      setRecovering(false);
    }
  };

  return (
    <div className="max-w-md mx-auto text-center space-y-5 pt-16">
      <div className="h-16 w-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto">
        <CheckCircle2 className="h-8 w-8 text-emerald-400" />
      </div>
      <div>
        <h1 className="font-display text-2xl font-black uppercase text-white">
          Payment confirmed
        </h1>
        <p className="text-sm text-zinc-500 mt-2">
          Your payment for <span className="text-white font-medium">{contest.name}</span> went
          through but the entry wasn't recorded. No additional payment is needed.
        </p>
      </div>
      <div className="rounded-xl border border-white/8 bg-white/5 px-4 py-3 text-xs text-zinc-500">
        {playerIds.length} player{playerIds.length !== 1 ? "s" : ""} selected from your squad
        recommendation.
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      <button
        onClick={handleRecover}
        disabled={recovering || playerIds.length === 0}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 px-6 py-3.5 text-sm font-bold text-white transition-colors"
      >
        {recovering
          ? <><Loader2 className="h-4 w-4 animate-spin" /> Recording entry…</>
          : "Complete my entry — no payment needed"
        }
      </button>
    </div>
  );
}