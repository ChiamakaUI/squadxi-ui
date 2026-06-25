"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trophy } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function PublicNavbar() {
  const { authenticated, login } = useAuth();
  const router = useRouter();

  const handleConnect = () => {
    if (authenticated) {
      router.push("/home");
    } else {
      login();
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#090912]/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500">
              <Trophy className="h-4 w-4 text-white" />
            </div>
            <span className="font-display text-xl font-black tracking-wide text-white uppercase">
              Squad<span className="text-emerald-400">XI</span>
            </span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <Link
              href="/contests"
              className="hidden sm:block text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Browse Contests
            </Link>

            <button
              onClick={handleConnect}
              className="rounded-lg bg-emerald-500 hover:bg-emerald-400 px-4 py-2 text-sm font-bold text-white transition-colors"
            >
              {authenticated ? "Go to Dashboard →" : "Connect & Play"}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}