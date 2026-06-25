"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Home,
  Trophy,
  Users2,
  BarChart3,
  Bot,
  Zap,
  User,
  LogOut,
  Clock,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useContests } from "@/hooks/useContests";
import { cn, shortenAddress, timeUntilDeadline, isDeadlinePassed } from "@/lib/utils";

// ─── Nav structure ────────────────────────────────────────────────────────────

const PLAY_NAV = [
  { href: "/home",        label: "Home",        icon: Home        },
  { href: "/contests",    label: "Contests",    icon: Trophy      },
  { href: "/squad",       label: "My Squad",    icon: Users2      },
  { href: "/leaderboard", label: "Rankings",    icon: BarChart3   },
];

const TOOL_NAV = [
  { href: "/assistant", label: "AI Assistant", icon: Bot  },
  { href: "/agent",     label: "Agent",        icon: Zap  },
];

const BOTTOM_NAV = [
  { href: "/home",        label: "Home",     icon: Home      },
  { href: "/contests",    label: "Contests", icon: Trophy    },
  { href: "/squad",       label: "Squad",    icon: Users2    },
  { href: "/leaderboard", label: "Rankings", icon: BarChart3 },
];

// ─── Layout ───────────────────────────────────────────────────────────────────

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const { authenticated, ready, logout, walletAddress } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (ready && !authenticated) router.replace("/");
  }, [ready, authenticated, router]);

  if (!ready || !authenticated) {
    return (
      <div className="min-h-screen bg-[#090912] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-800 border-t-emerald-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090912] flex">
      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-56 border-r border-white/5 bg-[#080a0d] z-40 overflow-y-auto">
        {/* Logo */}
        <div className="px-4 pt-5 pb-4 border-b border-white/5 shrink-0">
          <Link href="/home" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0">
              <Trophy className="h-4 w-4 text-white" />
            </div>
            <span className="font-display text-lg font-black uppercase tracking-wide text-white">
              Squad<span className="text-emerald-400">XI</span>
            </span>
          </Link>
        </div>

        {/* Matchweek badge */}
        <div className="px-4 py-3 border-b border-white/5 shrink-0">
          <MatchweekInfo />
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
          <NavSection label="Play">
            {PLAY_NAV.map((item) => (
              <NavItem
                key={item.href}
                {...item}
                active={
                  item.href === "/home"
                    ? pathname === "/home"
                    : pathname === item.href || pathname.startsWith(item.href + "/")
                }
              />
            ))}
          </NavSection>
          <NavSection label="Tools">
            {TOOL_NAV.map((item) => (
              <NavItem key={item.href} {...item} active={pathname === item.href} />
            ))}
          </NavSection>
        </nav>

        {/* Footer — profile + disconnect */}
        <div className="px-3 py-4 border-t border-white/5 shrink-0 space-y-1">
          <Link
            href="/profile"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all",
              pathname === "/profile"
                ? "bg-emerald-500/10 text-emerald-400"
                : "text-zinc-500 hover:text-white hover:bg-white/5"
            )}
          >
            <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
              <User className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold leading-none truncate">Profile</p>
              {walletAddress && (
                <p className="text-[9px] font-mono text-zinc-700 truncate mt-0.5">
                  {shortenAddress(walletAddress, 5)}
                </p>
              )}
            </div>
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-zinc-600 hover:text-red-400 hover:bg-red-500/5 transition-all text-xs font-medium"
          >
            <LogOut className="h-3.5 w-3.5 shrink-0" />
            Disconnect
          </button>
        </div>
      </aside>

      {/* ── Mobile top bar ── */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-50 h-14 border-b border-white/5 bg-[#080a0d]/95 backdrop-blur flex items-center justify-between px-4 shrink-0">
        <Link href="/home" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-emerald-500 flex items-center justify-center">
            <Trophy className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="font-display text-sm font-black uppercase tracking-wide text-white">
            Squad<span className="text-emerald-400">XI</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <MatchweekChip />
          <Link
            href="/profile"
            className={cn(
              "h-8 w-8 rounded-full flex items-center justify-center border transition-colors",
              pathname === "/profile"
                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                : "bg-white/5 border-white/10 text-zinc-500 hover:text-white hover:border-white/20"
            )}
          >
            <User className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* ── Main content ── */}
      <main className="flex-1 lg:ml-56 min-h-screen">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-[72px] lg:pt-8 pb-28 lg:pb-10">
          {children}
        </div>
      </main>

      {/* ── Mobile bottom nav ── */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 border-t border-white/8 bg-[#080a0d]/98 backdrop-blur">
        <div className="flex">
          {BOTTOM_NAV.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/home"
                ? pathname === "/home"
                : pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors",
                  active ? "text-emerald-400" : "text-zinc-600 active:text-zinc-400"
                )}
              >
                <Icon
                  className={cn("h-5 w-5 transition-transform", active && "scale-110")}
                />
                <span className="text-[9px] font-bold uppercase tracking-wider leading-none">
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
        {/* Safe area spacer */}
        <div className="h-safe-bottom bg-[#080a0d]/98" />
      </nav>
    </div>
  );
}

// ─── Sidebar helpers ──────────────────────────────────────────────────────────

function NavSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-600 px-3 mb-1.5">
        {label}
      </p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function NavItem({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
        active
          ? "bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-400 pl-[10px]"
          : "text-zinc-500 hover:text-white hover:bg-white/5 border-l-2 border-transparent"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {label}
    </Link>
  );
}

// ─── Matchweek display ────────────────────────────────────────────────────────

function MatchweekInfo() {
  const { data: contests } = useContests();
  const next = contests?.find((c) => c.status === "open");
  if (!next) return <p className="text-xs text-zinc-600">No open contests</p>;
  const passed = isDeadlinePassed(next.deadline);
  return (
    <div>
      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-600">
        Matchweek
      </p>
      <p className="font-display text-base font-black text-white mt-0.5">
        Week {next.matchweek}
      </p>
      {!passed && (
        <div className="flex items-center gap-1.5 mt-1">
          <Clock className="h-3 w-3 text-zinc-600 shrink-0" />
          <span className="text-[10px] text-zinc-500">
            {timeUntilDeadline(next.deadline)} left
          </span>
        </div>
      )}
    </div>
  );
}

function MatchweekChip() {
  const { data: contests } = useContests();
  const next = contests?.find((c) => c.status === "open");
  if (!next) return null;
  const passed = isDeadlinePassed(next.deadline);
  return (
    <div className="flex items-center gap-2 rounded-lg border border-white/8 bg-white/5 px-2.5 py-1.5">
      {!passed && (
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
      )}
      <span className="text-[11px] font-bold text-zinc-300">
        MW{next.matchweek}
        {!passed && (
          <span className="text-zinc-500 font-normal ml-1.5">
            {timeUntilDeadline(next.deadline)}
          </span>
        )}
      </span>
    </div>
  );
}