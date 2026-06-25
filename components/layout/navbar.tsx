"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Trophy, Zap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn, shortenAddress } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/players", label: "Players" },
  { href: "/entries", label: "My Entries" },
  { href: "/assistant", label: "AI Assistant" },
  { href: "/agent", label: "Agent" },
];

export function Navbar() {
  const pathname = usePathname();
  const { authenticated, login, logout, walletAddress } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Trophy className="h-6 w-6 text-emerald-400" />
            <span className="text-lg font-bold tracking-tight text-white">
              Squad<span className="text-emerald-400">XI</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "text-emerald-400 bg-emerald-400/10"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth + mobile toggle */}
          <div className="flex items-center gap-3">
            {authenticated ? (
              <div className="hidden md:flex items-center gap-3">
                {walletAddress && (
                  <span className="text-xs text-zinc-500 font-mono">
                    {shortenAddress(walletAddress)}
                  </span>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={login}
                className="hidden md:flex bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                <Zap className="h-4 w-4 mr-1.5" />
                Connect
              </Button>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 text-zinc-400 hover:text-white"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-zinc-950 px-4 pb-4 pt-2 space-y-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                pathname === link.href
                  ? "text-emerald-400 bg-emerald-400/10"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-zinc-800">
            {authenticated ? (
              <div className="space-y-2">
                {walletAddress && (
                  <p className="text-xs text-zinc-500 font-mono px-3">
                    {shortenAddress(walletAddress)}
                  </p>
                )}
                <button
                  onClick={() => { logout(); setMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 text-sm text-zinc-400 hover:text-white"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={() => { login(); setMenuOpen(false); }}
                className="flex items-center gap-2 px-3 py-2 text-sm text-emerald-400 font-medium"
              >
                <Zap className="h-4 w-4" /> Connect wallet
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}