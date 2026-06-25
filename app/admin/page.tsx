"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { CreateContestForm, ContestActions, SyncTools } from "@/components/contest/contest-manager";
import { useContests } from "@/hooks/useContests";
import { PageLoader } from "@/components/ui/states";
import { Lock } from "lucide-react";

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const { data: contests, isLoading } = useContests();

  if (!unlocked) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-24 gap-5 max-w-sm mx-auto">
          <div className="h-14 w-14 rounded-full bg-zinc-800 flex items-center justify-center">
            <Lock className="h-6 w-6 text-zinc-400" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-white">Admin Access</h1>
            <p className="text-zinc-500 text-sm mt-1">Enter the admin API key to continue.</p>
          </div>
          <input
            type="password"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && adminKey && setUnlocked(true)}
            placeholder="x-admin-key"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800/60 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <button
            onClick={() => adminKey && setUnlocked(true)}
            disabled={!adminKey}
            className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-white text-sm font-bold py-3 transition-colors"
          >
            Unlock
          </button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8 max-w-2xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Admin</h1>
          <button
            onClick={() => { setUnlocked(false); setAdminKey(""); }}
            className="text-xs text-zinc-500 hover:text-zinc-300"
          >
            Lock
          </button>
        </div>

        <CreateContestForm adminKey={adminKey} />
        <SyncTools adminKey={adminKey} />

        {/* Contest list for actions */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">
            Manage Contests
          </h2>
          {isLoading ? (
            <PageLoader />
          ) : (
            contests?.map((c) => (
              <ContestActions key={c.id} contest={c} adminKey={adminKey} />
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}