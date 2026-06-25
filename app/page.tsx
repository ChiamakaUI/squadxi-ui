// "use client";

// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { Trophy, Zap, Shield, Users, ArrowRight, Check } from "lucide-react";
// import { useAuth } from "@/hooks/useAuth";
// import { useContests } from "@/hooks/useContests";
// import { ContestCard } from "@/components/contest/contest-card";
// import { Navbar } from "@/components/layout/navbar";

// export default function LandingPage() {
//   const { authenticated, login } = useAuth();
//   const router = useRouter();
//   const { data: contests } = useContests();

//   const openContests = contests?.filter((c) => c.status === "open").slice(0, 3) ?? [];

//   const handleCta = () => {
//     if (authenticated) {
//       router.push("/dashboard");
//     } else {
//       login();
//     }
//   };

//   return (
//     <div className="min-h-screen bg-zinc-950">
//       <Navbar />

//       {/* Hero */}
//       <section className="relative overflow-hidden px-4 pt-16 pb-20 sm:pt-24 sm:pb-28">
//         <div className="pointer-events-none absolute inset-0 flex items-start justify-center">
//           <div className="h-[400px] w-[700px] rounded-full bg-emerald-500/10 blur-[120px] -translate-y-1/4" />
//         </div>

//         <div className="relative mx-auto max-w-3xl text-center">
//           <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-400">
//             <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
//             Live on Solana Devnet
//           </div>

//           <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
//             Fantasy football,{" "}
//             <span className="text-emerald-400">paid in crypto</span>
//           </h1>

//           <p className="mx-auto mt-6 max-w-xl text-base text-zinc-400 sm:text-lg">
//             Build squads from real Premier League players, enter matchweek contests, and win USDC. Entry fees and prize payouts happen on-chain — no middlemen.
//           </p>

//           <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
//             <button
//               onClick={handleCta}
//               className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-6 py-3 text-base font-bold text-white transition-colors"
//             >
//               <Zap className="h-5 w-5" />
//               {authenticated ? "Go to Dashboard" : "Connect & Play"}
//             </button>
//             <Link
//               href="#how-it-works"
//               className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-zinc-700 hover:border-zinc-600 px-6 py-3 text-base font-medium text-zinc-300 hover:text-white transition-colors"
//             >
//               How it works <ArrowRight className="h-4 w-4" />
//             </Link>
//           </div>

//           <p className="mt-6 text-xs text-zinc-600">
//             Non-custodial · USDC on Solana · Verifiable on-chain
//           </p>
//         </div>
//       </section>

//       {/* Stats bar */}
//       <section className="border-y border-zinc-800 bg-zinc-900/50">
//         <div className="mx-auto max-w-4xl grid grid-cols-3 divide-x divide-zinc-800">
//           {[
//             { label: "Entry from", value: "$5 USDC" },
//             { label: "Salary cap", value: "$100" },
//             { label: "Squad size", value: "11 players" },
//           ].map(({ label, value }) => (
//             <div key={label} className="px-6 py-5 text-center">
//               <p className="text-xl font-bold text-white">{value}</p>
//               <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* How it works */}
//       <section id="how-it-works" className="px-4 py-20 sm:py-24">
//         <div className="mx-auto max-w-4xl">
//           <div className="text-center mb-12">
//             <h2 className="text-2xl sm:text-3xl font-bold text-white">How it works</h2>
//             <p className="text-zinc-400 mt-2 text-sm sm:text-base">
//               Three steps from wallet to winnings.
//             </p>
//           </div>

//           <div className="grid sm:grid-cols-3 gap-6">
//             {STEPS.map((step, i) => (
//               <div
//                 key={step.title}
//                 className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 relative"
//               >
//                 <div className="h-10 w-10 rounded-full bg-emerald-500/15 flex items-center justify-center mb-4">
//                   <step.icon className="h-5 w-5 text-emerald-400" />
//                 </div>
//                 <span className="absolute top-5 right-5 text-4xl font-black text-zinc-800 select-none">
//                   {i + 1}
//                 </span>
//                 <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
//                 <p className="text-sm text-zinc-400 leading-relaxed">{step.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Open contests preview */}
//       {openContests.length > 0 && (
//         <section className="px-4 pb-20 sm:pb-24">
//           <div className="mx-auto max-w-4xl">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-xl font-bold text-white">Open contests</h2>
//               <Link
//                 href="/dashboard"
//                 className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
//               >
//                 View all <ArrowRight className="h-3.5 w-3.5" />
//               </Link>
//             </div>
//             <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//               {openContests.map((c) => (
//                 <ContestCard key={c.id} contest={c} />
//               ))}
//             </div>
//           </div>
//         </section>
//       )}

//       {/* Why SquadXI + scoring */}
//       <section className="px-4 pb-20 sm:pb-24">
//         <div className="mx-auto max-w-4xl">
//           <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 sm:p-10">
//             <div className="grid sm:grid-cols-2 gap-8 sm:gap-12">
//               <div>
//                 <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
//                   Why SquadXI?
//                 </h2>
//                 <ul className="space-y-3">
//                   {FEATURES.map((f) => (
//                     <li key={f} className="flex items-start gap-3">
//                       <Check className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
//                       <span className="text-sm text-zinc-300">{f}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//               <div>
//                 <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-4">
//                   Scoring system
//                 </h3>
//                 <div className="space-y-2">
//                   {SCORING.map(({ event, pts }) => (
//                     <div
//                       key={event}
//                       className="flex items-center justify-between rounded-lg bg-zinc-800/60 px-3 py-2"
//                     >
//                       <span className="text-xs text-zinc-400">{event}</span>
//                       <span
//                         className={`text-xs font-bold tabular-nums ${
//                           pts > 0 ? "text-emerald-400" : "text-red-400"
//                         }`}
//                       >
//                         {pts > 0 ? `+${pts}` : pts}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* CTA banner */}
//       <section className="px-4 pb-24">
//         <div className="mx-auto max-w-2xl text-center rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-8 py-12">
//           <Trophy className="h-10 w-10 text-emerald-400 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-white mb-2">Ready to compete?</h2>
//           <p className="text-zinc-400 text-sm mb-6">
//             Pick 11 players, stay under the cap, and take home USDC.
//           </p>
//           <button
//             onClick={handleCta}
//             className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-6 py-3 text-base font-bold text-white transition-colors"
//           >
//             <Zap className="h-5 w-5" />
//             {authenticated ? "Go to Dashboard" : "Get Started"}
//           </button>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="border-t border-zinc-800 px-4 py-8">
//         <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-600">
//           <div className="flex items-center gap-2">
//             <Trophy className="h-4 w-4 text-emerald-400" />
//             <span className="font-semibold text-zinc-400">SquadXI</span>
//           </div>
//           <p>Built on Solana · Powered by USDC · Premier League data via API-Football</p>
//         </div>
//       </footer>
//     </div>
//   );
// }

// const STEPS = [
//   {
//     icon: Zap,
//     title: "Connect your wallet",
//     description:
//       "Sign in with email or Google. Privy creates an embedded Solana wallet — no browser extension needed.",
//   },
//   {
//     icon: Users,
//     title: "Build your squad",
//     description:
//       "Pick 11 Premier League players under a $100 salary cap. One GK, defenders, midfielders, and forwards.",
//   },
//   {
//     icon: Trophy,
//     title: "Win USDC",
//     description:
//       "Earn points from real match stats. Top squads split the prize pool, paid directly to your wallet on-chain.",
//   },
// ];

// const FEATURES = [
//   "On-chain entry fees and prize payouts — fully transparent",
//   "Embedded wallet via Privy — no Phantom or MetaMask required",
//   "AI Squad Assistant to help you pick the right players",
//   "Autonomous AI Agent that enters contests on your behalf",
//   "Real Premier League player data updated each matchweek",
// ];

// const SCORING = [
//   { event: "Goal (FWD/MID)", pts: 6 },
//   { event: "Goal (DEF/GK)", pts: 8 },
//   { event: "Assist", pts: 3 },
//   { event: "Clean sheet (DEF/GK)", pts: 4 },
//   { event: "Clean sheet (MID)", pts: 1 },
//   { event: "Penalty save (GK)", pts: 5 },
//   { event: "Yellow card", pts: -1 },
//   { event: "Red card", pts: -3 },
// ];

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useContests } from "@/hooks/useContests";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { formatUsdc, timeUntilDeadline, isDeadlinePassed } from "@/lib/utils";
import type { Contest } from "@/types";
import { Shield, Zap, Trophy, ArrowRight, Clock, TrendingUp, Lock } from "lucide-react";

type Position = "GK" | "DEF" | "MID" | "FWD";
interface SlotPlayer { position: Position; name: string; pts: number; price: string; }

const DEMO_SQUAD: { row: SlotPlayer[] }[] = [
  { row: [{ position: "FWD", name: "Salah", pts: 18, price: "12.5" }, { position: "FWD", name: "Haaland", pts: 14, price: "14.0" }, { position: "FWD", name: "Watkins", pts: 9, price: "8.5" }] },
  { row: [{ position: "MID", name: "Palmer", pts: 12, price: "10.5" }, { position: "MID", name: "Saka", pts: 8, price: "9.0" }, { position: "MID", name: "Mbeumo", pts: 11, price: "7.5" }, { position: "MID", name: "Andreas", pts: 6, price: "6.0" }] },
  { row: [{ position: "DEF", name: "Trent", pts: 9, price: "7.5" }, { position: "DEF", name: "Mykolenko", pts: 6, price: "5.5" }, { position: "DEF", name: "Porro", pts: 7, price: "6.0" }] },
  { row: [{ position: "GK", name: "Flekken", pts: 6, price: "5.0" }] },
];

const POS_STYLES: Record<Position, { top: string; text: string; border: string }> = {
  GK:  { top: "from-amber-500 to-amber-800",   text: "text-amber-400",   border: "border-amber-500/30" },
  DEF: { top: "from-sky-500 to-sky-800",        text: "text-sky-400",     border: "border-sky-500/30"   },
  MID: { top: "from-emerald-500 to-emerald-800",text: "text-emerald-400", border: "border-emerald-500/30"},
  FWD: { top: "from-orange-500 to-orange-800",  text: "text-orange-400",  border: "border-orange-500/30" },
};

function estimatedPool(c: Contest) {
  const potential = parseFloat(c.entry_fee) * c.max_entries * (1 - (c.rake_pct ?? 10) / 100);
  const actual    = parseFloat(c.entry_fee) * c.entry_count * (1 - (c.rake_pct ?? 10) / 100);
  return formatUsdc(Math.max(actual, potential * 0.25));
}
function spotsLeft(c: Contest) { return c.max_entries - c.entry_count; }

export default function LandingPage() {
  const { authenticated, login } = useAuth();
  const router = useRouter();
  const { data: contests } = useContests();
  const open = contests?.filter((c) => c.status === "open") ?? [];
  const next = open[0];
  const handleCta = () => (authenticated ? router.push("/home") : login());

  return (
    <div className="min-h-screen bg-[#090912] text-white overflow-x-hidden">
      <PublicNavbar />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 bottom-0 h-[65%]">
            <div className="absolute inset-0 bg-gradient-to-t from-[#051309] via-[#06150b] to-transparent" />
            <div className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.013) 0px, rgba(255,255,255,0.013) 1px, transparent 1px, transparent 46px)" }} />
            <div className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.013) 0px, rgba(255,255,255,0.013) 1px, transparent 1px, transparent 46px)" }} />
          </div>
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-[#090912] to-transparent" />
          <div className="absolute left-1/3 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[700px] rounded-full bg-emerald-500/[0.08] blur-[120px]" />
          <div className="absolute right-1/4 top-1/3 h-[300px] w-[400px] rounded-full bg-emerald-700/[0.06] blur-[80px]" />
          <div className="absolute top-16 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-16 lg:py-0">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* LEFT */}
            <div>
              <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse-dot" />
                <span className="text-xs font-bold text-emerald-400 tracking-widest uppercase">
                  {open.length > 0 ? `MW${next?.matchweek} · ${open.length} Contest${open.length > 1 ? "s" : ""} Open` : "Fantasy Football on Solana"}
                </span>
              </div>

              <h1 className="font-display font-black leading-[0.88] uppercase tracking-tight">
                <span className="block text-[64px] sm:text-[84px] lg:text-[96px] xl:text-[112px] text-white">Pick 11.</span>
                <span className="block text-[64px] sm:text-[84px] lg:text-[96px] xl:text-[112px] text-emerald-400 italic">Win USDC.</span>
              </h1>

              <p className="mt-6 text-base sm:text-lg text-zinc-400 leading-relaxed max-w-md">
                Build squads from real Premier League players, enter matchweek contests, and take home USDC — paid on-chain, no middlemen.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button onClick={handleCta} className="group inline-flex items-center justify-center gap-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 px-7 py-4 text-base font-bold text-white transition-all shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40">
                  <Trophy className="h-5 w-5" />
                  {authenticated ? "Go to Dashboard" : "Enter This Week"}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <Link href="#how-to-play" className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 hover:border-zinc-500 px-7 py-4 text-base font-medium text-zinc-400 hover:text-white transition-colors">
                  How it works
                </Link>
              </div>

              {next && !isDeadlinePassed(next.deadline) && (
                <div className="mt-6 inline-flex items-center gap-2 rounded-lg border border-white/8 bg-white/[0.04] px-4 py-2.5">
                  <Clock className="h-4 w-4 text-zinc-500 shrink-0" />
                  <span className="text-sm text-zinc-400">MW{next.matchweek} closes in <span className="text-white font-semibold">{timeUntilDeadline(next.deadline)}</span></span>
                </div>
              )}
            </div>

            {/* RIGHT — squad */}
            <div className="flex justify-center lg:justify-end">
              <SquadViz />
            </div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      {open.length > 0 && <Ticker contests={open} />}

      {/* STATS BAR */}
      <section className="border-y border-white/5 bg-white/[0.02]">
        <div className="mx-auto max-w-4xl grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/5">
          {[{ label: "Entry from", value: "$5" }, { label: "Salary cap", value: "$100" }, { label: "Squad size", value: "11" }, { label: "Prize currency", value: "USDC" }].map(({ label, value }) => (
            <div key={label} className="py-7 text-center px-4">
              <p className="font-display text-4xl sm:text-5xl font-black text-white leading-none">{value}</p>
              <p className="mt-1.5 text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CONTEST LOBBY */}
      {open.length > 0 && (
        <section className="py-20 sm:py-28 px-4">
          <div className="mx-auto max-w-5xl">
            <SectionLabel>This week&apos;s contests</SectionLabel>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {open.slice(0, 3).map((c) => <LobbyCard key={c.id} contest={c} onEnter={handleCta} />)}
            </div>
            {open.length > 3 && (
              <div className="mt-6 text-center">
                <Link href="/contests" className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-400 hover:text-emerald-300">
                  View all {open.length} contests <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* HOW TO PLAY */}
      <section id="how-to-play" className="py-20 sm:py-28 px-4 border-t border-white/5">
        <div className="mx-auto max-w-5xl">
          <SectionLabel>3 steps to the prize</SectionLabel>
          <div className="mt-10 grid sm:grid-cols-3 gap-5">
            {HOW_TO_PLAY.map((step, i) => (
              <div key={step.title} className="relative group rounded-2xl border border-white/8 bg-white/[0.02] p-6 hover:border-emerald-500/20 hover:bg-white/[0.04] transition-all overflow-hidden">
                <span className="absolute -bottom-4 -right-2 font-display text-[100px] font-black text-white/[0.03] select-none leading-none group-hover:text-emerald-500/[0.06] transition-colors">{i + 1}</span>
                <div className="relative">
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/15">
                    <step.icon className="h-6 w-6 text-emerald-400" />
                  </div>
                  <h3 className="font-display text-2xl font-black uppercase tracking-tight text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SCORING + ON-CHAIN */}
      <section className="py-20 sm:py-28 px-4 border-t border-white/5">
        <div className="mx-auto max-w-5xl grid lg:grid-cols-2 gap-10 lg:gap-16">
          <div>
            <SectionLabel>How points work</SectionLabel>
            <div className="mt-8 rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden divide-y divide-white/5">
              {SCORING.map(({ event, pos, pts }) => (
                <div key={`${event}${pos}`} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <span className="text-sm text-zinc-300">{event}</span>
                    {pos && <span className="ml-2 text-[9px] font-bold text-zinc-600 uppercase tracking-wider">{pos}</span>}
                  </div>
                  <span className={`font-display text-2xl font-black tabular-nums leading-none ${pts > 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {pts > 0 ? `+${pts}` : pts}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <SectionLabel>Why on-chain?</SectionLabel>
            <div className="mt-8 space-y-4">
              {WHY.map((item) => (
                <div key={item.title} className="group rounded-2xl border border-white/8 bg-white/[0.02] p-5 hover:border-emerald-500/25 hover:bg-emerald-500/[0.03] transition-all">
                  <div className="flex gap-4 items-start">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0">
                      <item.icon className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-display text-lg font-black uppercase tracking-tight text-white">{item.title}</p>
                      <p className="mt-1.5 text-sm text-zinc-500 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-20 px-4 border-t border-white/5">
        <div className="mx-auto max-w-3xl">
          <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-[#061a0e] to-[#090912] px-8 py-16 text-center">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 h-48 w-80 bg-emerald-500/15 blur-3xl rounded-full" />
            </div>
            <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "repeating-linear-gradient(90deg, white 0px, white 1px, transparent 1px, transparent 60px)" }} />
            <div className="relative">
              <Trophy className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
              <h2 className="font-display text-4xl sm:text-6xl font-black uppercase tracking-tight text-white">Ready to compete?</h2>
              <p className="mt-4 text-zinc-400 max-w-md mx-auto">Pick your 11, stay under the cap, and take your shot at the prize pool.</p>
              <button onClick={handleCta} className="mt-8 inline-flex items-center gap-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-8 py-4 text-base font-bold text-white transition-all shadow-xl shadow-emerald-500/20">
                <Trophy className="h-5 w-5" />
                {authenticated ? "Go to Dashboard" : "Get Started — It's Free"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 px-4 py-8">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-emerald-500 flex items-center justify-center">
              <Trophy className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-display text-sm font-black uppercase tracking-wide text-zinc-400">Squad<span className="text-emerald-400">XI</span></span>
          </div>
          <p className="text-xs text-zinc-700 text-center">Built on Solana · Powered by USDC · Premier League data via API-Football</p>
          <div className="flex gap-5 text-xs text-zinc-700">
            <Link href="/contests" className="hover:text-zinc-400 transition-colors">Contests</Link>
            <Link href="#how-to-play" className="hover:text-zinc-400 transition-colors">How it works</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Squad visualization ──────────────────────────────────────────────────────

function SquadViz() {
  return (
    <div className="relative">
      {/* Floating overlays */}
      <div className="absolute -top-5 -left-8 z-20 hidden sm:block animate-[float_4s_ease-in-out_infinite]">
        <div className="rounded-xl border border-emerald-500/30 bg-[#090912]/95 backdrop-blur px-3.5 py-3 shadow-2xl shadow-black/60">
          <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Total pts</p>
          <p className="font-display text-3xl font-black text-emerald-400 leading-none mt-0.5">99</p>
        </div>
      </div>
      <div className="absolute -top-5 -right-6 z-20 hidden sm:block">
        <div className="rounded-xl border border-amber-500/30 bg-[#090912]/95 backdrop-blur px-3.5 py-3 shadow-2xl shadow-black/60">
          <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Rank</p>
          <p className="font-display text-3xl font-black text-amber-400 leading-none mt-0.5">#1</p>
        </div>
      </div>
      <div className="absolute -bottom-5 -right-6 z-20 hidden sm:block">
        <div className="rounded-xl border border-sky-500/30 bg-[#090912]/95 backdrop-blur px-3.5 py-3 shadow-2xl shadow-black/60 flex items-center gap-2.5">
          <TrendingUp className="h-4 w-4 text-sky-400" />
          <div>
            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Live</p>
            <p className="font-display text-sm font-black text-sky-400 leading-none">↑ 3 spots</p>
          </div>
        </div>
      </div>

      {/* Pitch card */}
      <div className="relative w-[290px] sm:w-[320px] rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-black/70">
        {/* Pitch stripes */}
        <div className="absolute inset-0" style={{ background: "repeating-linear-gradient(180deg, rgba(4,28,14,0.97) 0px, rgba(4,28,14,0.97) 38px, rgba(3,21,10,0.97) 38px, rgba(3,21,10,0.97) 76px)" }} />
        {/* Pitch lines SVG */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.1]" viewBox="0 0 320 510" fill="none" preserveAspectRatio="none">
          <rect x="8" y="8" width="304" height="494" stroke="white" strokeWidth="1.5" />
          <line x1="8" y1="255" x2="312" y2="255" stroke="white" strokeWidth="1.5" />
          <circle cx="160" cy="255" r="52" stroke="white" strokeWidth="1.5" />
          <circle cx="160" cy="255" r="3" fill="white" />
          <rect x="76" y="8" width="168" height="76" stroke="white" strokeWidth="1" />
          <rect x="76" y="426" width="168" height="76" stroke="white" strokeWidth="1" />
        </svg>
        {/* Edge fades */}
        <div className="absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-[#090912]/50 to-transparent z-10" />
        <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-[#090912]/50 to-transparent z-10" />

        {/* Player cards in formation */}
        <div className="relative z-10 flex flex-col gap-1.5 px-2.5 py-3">
          {DEMO_SQUAD.map((group, gi) => (
            <div key={gi} className="flex justify-center gap-1">
              {group.row.map((p, pi) => <PCard key={`${gi}-${pi}`} player={p} />)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PCard({ player }: { player: SlotPlayer }) {
  const s = POS_STYLES[player.position];
  return (
    <div className={`w-[68px] rounded-lg border ${s.border} overflow-hidden flex flex-col shadow-lg`}>
      <div className={`bg-gradient-to-b ${s.top} h-7 flex items-center justify-between px-1.5`}>
        <span className="text-[8px] font-black text-white/90 uppercase">{player.position}</span>
        <span className="text-[7px] font-bold text-white/50">${player.price}</span>
      </div>
      <div className="bg-[#0c1a0f] px-1.5 py-1.5">
        <p className="text-[9px] font-bold text-white truncate leading-none">{player.name}</p>
        <p className={`text-[11px] font-black ${s.text} mt-0.5 leading-none`}>{player.pts}pts</p>
      </div>
    </div>
  );
}

// ─── Ticker ───────────────────────────────────────────────────────────────────

function Ticker({ contests }: { contests: Contest[] }) {
  const items = [...contests, ...contests, ...contests];
  return (
    <div className="overflow-hidden border-y border-white/5 bg-emerald-950/20 py-3">
      <div className="flex animate-marquee gap-0 will-change-transform">
        {items.map((c, i) => {
          const left = spotsLeft(c);
          return (
            <div key={`${c.id}-${i}`} className="inline-flex items-center gap-3 px-6 border-r border-white/10 shrink-0">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
              <span className="text-[11px] font-black text-zinc-300 uppercase tracking-widest whitespace-nowrap">MW{c.matchweek}</span>
              <span className="text-[11px] font-bold text-emerald-400 whitespace-nowrap">{estimatedPool(c)} pool</span>
              <span className="text-zinc-700">·</span>
              <span className="text-[11px] text-zinc-500 whitespace-nowrap">{formatUsdc(c.entry_fee)} entry</span>
              <span className="text-zinc-700">·</span>
              <Clock className="h-3 w-3 text-zinc-600 shrink-0" />
              <span className="text-[11px] text-zinc-500 whitespace-nowrap">{timeUntilDeadline(c.deadline)}</span>
              {left < 30 && <><span className="text-zinc-700">·</span><span className="text-[11px] font-bold text-amber-400 whitespace-nowrap">{left} spots left</span></>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Lobby card ───────────────────────────────────────────────────────────────

function LobbyCard({ contest, onEnter }: { contest: Contest; onEnter: () => void }) {
  const left = spotsLeft(contest);
  const fillPct = Math.round((contest.entry_count / contest.max_entries) * 100);
  const passed = isDeadlinePassed(contest.deadline);
  return (
    <div className="group flex flex-col rounded-2xl border border-white/8 bg-white/[0.02] hover:border-emerald-500/30 hover:bg-emerald-500/[0.03] transition-all overflow-hidden">
      <div className="relative px-5 pt-5 pb-4 border-b border-white/5">
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent" />
        <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-1">Est. Prize Pool</p>
        <p className="font-display text-5xl font-black text-emerald-400 leading-none tracking-tight">{estimatedPool(contest)}</p>
      </div>
      <div className="px-5 py-4 flex-1 space-y-4">
        <div>
          <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Matchweek {contest.matchweek}</p>
          <p className="mt-1 text-sm font-semibold text-white leading-snug">{contest.name}</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[{ label: "Entry", value: formatUsdc(contest.entry_fee) }, { label: "Cap", value: formatUsdc(contest.salary_cap) }, { label: "Size", value: `${contest.squad_size}` }].map(({ label, value }) => (
            <div key={label} className="rounded-lg bg-white/5 px-2 py-2 text-center">
              <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">{label}</p>
              <p className="text-sm font-bold text-white mt-0.5">{value}</p>
            </div>
          ))}
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] text-zinc-600">
            <span>{contest.entry_count} entered</span>
            <span className={left < 20 ? "text-amber-400 font-bold" : ""}>{left} spots left</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all" style={{ width: `${fillPct}%` }} />
          </div>
        </div>
      </div>
      <div className="px-5 pb-5">
        <div className="mb-3 flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 text-zinc-600 shrink-0" />
          <span className={`text-xs font-medium ${passed ? "text-red-400" : "text-zinc-400"}`}>{passed ? "Deadline passed" : `${timeUntilDeadline(contest.deadline)} remaining`}</span>
        </div>
        {!passed
          ? <button onClick={onEnter} className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] py-3 text-sm font-bold text-white transition-all">Enter — {formatUsdc(contest.entry_fee)}</button>
          : <Link href={`/contests/${contest.id}`} className="block w-full rounded-xl border border-white/10 py-3 text-center text-sm font-medium text-zinc-400 hover:text-white">View Results</Link>
        }
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-white/8" />
      <span className="font-display text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">{children}</span>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-white/8" />
    </div>
  );
}

const HOW_TO_PLAY = [
  { icon: Zap, title: "Connect", description: "Sign in with email or Google. Privy creates an embedded Solana wallet — no browser extension or seed phrases needed." },
  { icon: Trophy, title: "Build your squad", description: "Pick 11 Premier League players under a $100 salary cap. Use the AI assistant to find the best value picks for the matchweek." },
  { icon: TrendingUp, title: "Win USDC", description: "Earn points from real match stats. Top squads split the prize pool, paid directly to your wallet via Solana smart contract." },
];

const SCORING = [
  { event: "Goal", pos: "FWD/MID", pts: 6 },
  { event: "Goal", pos: "DEF/GK", pts: 8 },
  { event: "Assist", pos: null, pts: 3 },
  { event: "Clean sheet", pos: "DEF/GK", pts: 4 },
  { event: "Clean sheet", pos: "MID", pts: 1 },
  { event: "Penalty save", pos: "GK", pts: 5 },
  { event: "Mins ≥ 60", pos: null, pts: 2 },
  { event: "Mins < 60", pos: null, pts: 1 },
  { event: "Yellow card", pos: null, pts: -1 },
  { event: "Red card", pos: null, pts: -3 },
];

const WHY = [
  { icon: Shield, title: "Transparent prize pools", description: "Every entry fee goes into a Solana smart contract. The pool is public, verifiable, and locked until the contest settles." },
  { icon: Zap, title: "Instant payouts", description: "No 3–5 day waits. When the contest settles, USDC moves directly to winners via on-chain transaction." },
  { icon: Lock, title: "Non-custodial", description: "SquadXI never holds your funds. Entry fees go to the contest escrow contract, prizes come straight back to your wallet." },
];