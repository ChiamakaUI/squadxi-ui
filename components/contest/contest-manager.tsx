"use client";

import { useState } from "react";
import { adminApi, syncApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { Contest } from "@/types";

// ─── Create contest form ──────────────────────────────────────────────────────

export function CreateContestForm({ adminKey }: { adminKey: string }) {
  const [form, setForm] = useState({
    name: "",
    matchweek: 1,
    league: "39",
    season: 2024,
    entryFeeUsdc: 5,
    rakePct: 10,
    maxEntries: 100,
    salaryCap: 100,
    squadSize: 11,
    deadlineDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await adminApi.createContest(form, adminKey);
      setResult(`Contest created: ${res.contestId}\nTx: ${res.onChainTx}`);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 space-y-5">
      <h3 className="text-sm font-semibold text-white">Create Contest</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Name">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Matchweek 1 — Premier League"
            className={INPUT}
          />
        </Field>
        <Field label="Deadline (UTC)">
          <input
            type="datetime-local"
            value={form.deadlineDate}
            onChange={(e) => setForm({ ...form, deadlineDate: new Date(e.target.value).toISOString() })}
            className={INPUT}
          />
        </Field>
        <Field label="Matchweek">
          <input
            type="number"
            value={form.matchweek}
            onChange={(e) => setForm({ ...form, matchweek: Number(e.target.value) })}
            className={INPUT}
          />
        </Field>
        <Field label="Season">
          <input
            type="number"
            value={form.season}
            onChange={(e) => setForm({ ...form, season: Number(e.target.value) })}
            className={INPUT}
          />
        </Field>
        <Field label="Entry Fee (USDC)">
          <input
            type="number"
            value={form.entryFeeUsdc}
            onChange={(e) => setForm({ ...form, entryFeeUsdc: Number(e.target.value) })}
            className={INPUT}
          />
        </Field>
        <Field label="Salary Cap">
          <input
            type="number"
            value={form.salaryCap}
            onChange={(e) => setForm({ ...form, salaryCap: Number(e.target.value) })}
            className={INPUT}
          />
        </Field>
        <Field label="Max Entries">
          <input
            type="number"
            value={form.maxEntries}
            onChange={(e) => setForm({ ...form, maxEntries: Number(e.target.value) })}
            className={INPUT}
          />
        </Field>
        <Field label="Rake %">
          <input
            type="number"
            value={form.rakePct}
            onChange={(e) => setForm({ ...form, rakePct: Number(e.target.value) })}
            className={INPUT}
          />
        </Field>
      </div>

      <button
        onClick={submit}
        disabled={loading || !form.name || !form.deadlineDate}
        className="w-full rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 transition-colors"
      >
        {loading ? "Creating…" : "Create Contest"}
      </button>

      {result && (
        <pre className="text-xs text-emerald-400 bg-zinc-800 rounded-lg p-3 whitespace-pre-wrap break-all">
          {result}
        </pre>
      )}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

// ─── Contest action buttons ───────────────────────────────────────────────────

const ACTIONS = [
  { label: "Lock", key: "lock", fn: adminApi.lockContest, danger: false },
  { label: "Score", key: "score", fn: adminApi.scoreContest, danger: false },
  { label: "Settle", key: "settle", fn: adminApi.settleContest, danger: false },
  { label: "Cancel", key: "cancel", fn: adminApi.cancelContest, danger: true },
] as const;

export function ContestActions({
  contest,
  adminKey,
}: {
  contest: Contest;
  adminKey: string;
}) {
  const [loading, setLoading] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, string>>({});

  const run = async (key: string, fn: (id: string, k: string) => Promise<unknown>) => {
    setLoading(key);
    try {
      await fn(contest.id, adminKey);
      setMessages((prev) => ({ ...prev, [key]: "Done ✓" }));
    } catch (e: any) {
      setMessages((prev) => ({ ...prev, [key]: `Error: ${e.message}` }));
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-sm font-semibold text-white">{contest.name}</h4>
          <p className="text-xs text-zinc-500 mt-0.5 capitalize">{contest.status}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {ACTIONS.map(({ label, key, fn, danger }) => (
          <button
            key={key}
            onClick={() => run(key, fn as any)}
            disabled={loading === key}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50",
              danger
                ? "bg-red-500/15 text-red-400 hover:bg-red-500/25"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            )}
          >
            {loading === key ? "…" : label}
          </button>
        ))}
      </div>
      {Object.entries(messages).map(([k, msg]) => (
        <p key={k} className="text-xs text-zinc-400">
          {k}: {msg}
        </p>
      ))}
    </div>
  );
}

// ─── Sync tools ───────────────────────────────────────────────────────────────

export function SyncTools({ adminKey }: { adminKey: string }) {
  const [league, setLeague] = useState(39);
  const [season, setSeason] = useState(2024);
  const [fixtureId, setFixtureId] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const run = async (key: string, fn: () => Promise<unknown>) => {
    setLoading(key);
    setMsg(null);
    try {
      await fn();
      setMsg(`${key}: Done ✓`);
    } catch (e: any) {
      setMsg(`${key}: Error — ${e.message}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 space-y-4">
      <h3 className="text-sm font-semibold text-white">Sync Tools</h3>
      <div className="flex gap-3 flex-wrap">
        <Field label="League ID">
          <input
            type="number"
            value={league}
            onChange={(e) => setLeague(Number(e.target.value))}
            className={cn(INPUT, "w-24")}
          />
        </Field>
        <Field label="Season">
          <input
            type="number"
            value={season}
            onChange={(e) => setSeason(Number(e.target.value))}
            className={cn(INPUT, "w-28")}
          />
        </Field>
      </div>
      <div className="flex gap-2 flex-wrap">
        <ActionBtn
          label="Seed Season"
          loading={loading === "seed"}
          onClick={() => run("seed", () => syncApi.seedSeason(league, season, adminKey))}
        />
        <ActionBtn
          label="Sync Fixtures"
          loading={loading === "fixtures"}
          onClick={() => run("fixtures", () => syncApi.syncFixtures(league, season, adminKey))}
        />
      </div>
      <div className="flex gap-3 items-end flex-wrap">
        <Field label="Fixture API ID">
          <input
            value={fixtureId}
            onChange={(e) => setFixtureId(e.target.value)}
            placeholder="1208021"
            className={cn(INPUT, "w-36")}
          />
        </Field>
        <ActionBtn
          label="Score Fixture"
          loading={loading === "scoreFixture"}
          onClick={() =>
            run("scoreFixture", () =>
              syncApi.scoreFixture(Number(fixtureId), adminKey)
            )
          }
        />
      </div>
      {msg && <p className="text-xs text-zinc-400">{msg}</p>}
    </div>
  );
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

const INPUT =
  "w-full rounded-lg border border-zinc-700 bg-zinc-800/60 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-zinc-400">{label}</label>
      {children}
    </div>
  );
}

function ActionBtn({
  label,
  loading,
  onClick,
}: {
  label: string;
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold px-3 py-2 transition-colors disabled:opacity-50"
    >
      {loading ? "…" : label}
    </button>
  );
}