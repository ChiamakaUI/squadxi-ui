"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { PlayerBrowser } from "@/components/players/player-browser";

export default function PlayersPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Players</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Browse all Premier League players and their fantasy prices.
          </p>
        </div>
        <div className="h-[calc(100vh-220px)]">
          <PlayerBrowser />
        </div>
      </div>
    </AppLayout>
  );
}