"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AuthLayout } from "@/components/layout/auth-layout";
import { AgentOverview } from "@/components/agent/overview";
import { PageLoader, ErrorState } from "@/components/ui/states";
import {
  useAgentStatus,
  useSetupAgent,
  useUpdateAgentSettings,
  useAddAgentRule,
} from "@/hooks/useAgent";
import { agentVaultPda } from "@/lib/solana";
import { useAuth } from "@/hooks/useAuth";
import { PublicKey } from "@solana/web3.js";
import {
  Bot,
  Zap,
  Shield,
  Trophy,
  ChevronRight,
  Check,
  Loader2,
} from "lucide-react";
import { cn, formatUsdc } from "@/lib/utils";
import {
  signInitializeAgentTx,
  signDepositTx,
  signActivateAgentTx,
} from "@/lib/transactions";

const STEPS = [
  { id: 1, label: "Configure" },
  { id: 2, label: "Deposit" },
  { id: 3, label: "Rules" },
  { id: 4, label: "Activate" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AgentPage() {
  const {
    data: agentStatus,
    isLoading,
    isError,
    error,
    refetch,
  } = useAgentStatus();
  const notConfigured =
    isError &&
    ((error as Error)?.message?.includes("No agent configured") ||
      (error as Error)?.message?.includes("404"));

  return (
    <AuthLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
            AI Agent
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Your agent watches open contests, builds squads, and enters on your
            behalf.
          </p>
        </div>

        {isLoading ? (
          <PageLoader />
        ) : notConfigured ? (
          <AgentSetupWizard />
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : agentStatus ? (
          <AgentOverview status={agentStatus} />
        ) : null}
      </div>
    </AuthLayout>
  );
}

// ─── Setup wizard ─────────────────────────────────────────────────────────────

const DEFAULT_RULES = [
  {
    key: "league",
    icon: Trophy,
    label: "Premier League only",
    description: "Agent only enters contests tied to PL fixtures.",
    value: { leagues: ["39"] },
    defaultOn: true,
  },
  {
    key: "risk_level",
    icon: Shield,
    label: "Moderate playing style",
    description:
      "Balanced squad selection — not the highest ceiling, not the safest floor.",
    value: { level: "moderate" },
    defaultOn: true,
  },
  {
    key: "min_entries",
    icon: Zap,
    label: "Skip low-entry contests",
    description: "Avoids contests with fewer than 5 entries.",
    value: { min: 5 },
    defaultOn: false,
  },
] as const;

function isAgentAlreadyInitializedError(e: unknown): boolean {
  const msg = (e as any)?.message ?? "";
  const logs = JSON.stringify((e as any)?.context?.logs ?? []);
  return (
    msg.includes("already in use") ||
    logs.includes("already in use") ||
    logs.includes("AlreadyInUse")
  );
}

function AgentSetupWizard() {
  const [step, setStep] = useState(1);
  const [maxSpend, setMaxSpend] = useState(5);
  const [maxContests, setMaxContests] = useState(3);
  const [depositAmount, setDepositAmount] = useState(25);
  const [budgetId, setBudgetId] = useState<string | null>(null);
  const [selectedRules, setSelectedRules] = useState<Set<string>>(
    new Set(DEFAULT_RULES.filter((r) => r.defaultOn).map((r) => r.key)),
  );
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { walletAddress, solanaWallet } = useAuth();
  const queryClient = useQueryClient();
  const setupAgent = useSetupAgent();
  const updateSettings = useUpdateAgentSettings();
  const addRule = useAddAgentRule();

  const toggleRule = (key: string) =>
    setSelectedRules((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  // Step 1 — initialise on-chain + call setup
  const handleSetup = async () => {
    if (!solanaWallet || !walletAddress) return;
    setErr(null);
    setLoading(true);
    try {
      const vaultPda = agentVaultPda(new PublicKey(walletAddress)).toBase58();

      try {
        await signInitializeAgentTx(solanaWallet, maxSpend, maxContests);
      } catch (txErr: any) {
        if (!isAgentAlreadyInitializedError(txErr)) {
          setErr(txErr.message ?? "Setup failed. Try again.");
          setLoading(false);
          return;
        }
        // AgentConfig PDA already exists on-chain — skip tx, just write DB
      }

      const budget = (await setupAgent.mutateAsync({
        maxSpendPerContest: maxSpend,
        maxContestsPerWeek: maxContests,
        vaultPda,
      })) as any;
      setBudgetId(budget?.id ?? null);
      setStep(2);
    } catch (e: any) {
      setErr(e.message ?? "Setup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2 — deposit USDC
  const handleDeposit = async () => {
    if (!solanaWallet) return;
    setErr(null);
    setLoading(true);
    try {
      const tx = await signDepositTx(solanaWallet, depositAmount);
      await updateSettings.mutateAsync({
        totalDeposited: depositAmount,
        depositTx: tx,
      });
      setStep(3);
    } catch (e: any) {
      setErr(e.message ?? "Deposit failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3 — save selected rules
  const handleSaveRules = async () => {
    setErr(null);
    setLoading(true);
    try {
      if (budgetId) {
        const rulesToAdd = DEFAULT_RULES.filter((r) =>
          selectedRules.has(r.key),
        );
        await Promise.all(
          rulesToAdd.map((r) =>
            addRule.mutateAsync({
              budgetId,
              ruleType: r.key as any,
              ruleValue: r.value as any,
            }),
          ),
        );
      }
      setStep(4);
    } catch (e: any) {
      setErr(e.message ?? "Saving rules failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 4 — activate
  const handleActivate = async () => {
    if (!solanaWallet) return;
    setErr(null);
    setLoading(true);
    try {
      await signActivateAgentTx(solanaWallet);
      await updateSettings.mutateAsync({ isActive: true });
      // Invalidate here — wizard is done, safe to switch to dashboard
      await queryClient.invalidateQueries({ queryKey: ["agent"] });
      window.location.reload();
    } catch (e: any) {
      setErr(e.message ?? "Activation failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <StepIndicator current={step} />

      {step === 1 && (
        <SetupCard
          title="Set your spending limits"
          description="Your agent will never spend more than these amounts. You can change them any time."
        >
          <div className="space-y-5">
            <SliderField
              label="Max spend per contest"
              value={maxSpend}
              min={1}
              max={50}
              step={1}
              format={(v) => formatUsdc(v)}
              onChange={setMaxSpend}
              hint="The most the agent will pay to enter a single contest."
            />
            <SliderField
              label="Max contests per week"
              value={maxContests}
              min={1}
              max={10}
              step={1}
              format={(v) => `${v} contest${v > 1 ? "s" : ""}`}
              onChange={setMaxContests}
              hint="The agent won't enter more than this many contests in a matchweek."
            />
            <SummaryBox>
              Maximum weekly exposure:{" "}
              <span className="text-white font-bold">
                {formatUsdc(maxSpend * maxContests)}
              </span>
            </SummaryBox>
            {err && <p className="text-xs text-red-400">{err}</p>}
            <ActionButton onClick={handleSetup} loading={loading}>
              Set up my agent <ChevronRight className="h-4 w-4" />
            </ActionButton>
          </div>
        </SetupCard>
      )}

      {step === 2 && (
        <SetupCard
          title="Fund your agent vault"
          description="Your agent draws from this vault to pay entry fees. You can top it up at any time."
        >
          <div className="space-y-5">
            <SliderField
              label="Initial deposit"
              value={depositAmount}
              min={5}
              max={500}
              step={5}
              format={(v) => formatUsdc(v)}
              onChange={setDepositAmount}
              hint={`Covers ${Math.floor(depositAmount / maxSpend)} contest entr${
                Math.floor(depositAmount / maxSpend) === 1 ? "y" : "ies"
              } at your current limit.`}
            />
            <div className="grid grid-cols-3 gap-2">
              {[25, 50, 100].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setDepositAmount(amt)}
                  className={cn(
                    "rounded-xl border py-2.5 text-sm font-bold transition-colors",
                    depositAmount === amt
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                      : "border-white/8 bg-white/5 text-zinc-400 hover:border-white/20 hover:text-white",
                  )}
                >
                  {formatUsdc(amt)}
                </button>
              ))}
            </div>
            <SummaryBox>
              Depositing{" "}
              <span className="text-white font-bold">
                {formatUsdc(depositAmount)}
              </span>{" "}
              USDC from your connected wallet.
            </SummaryBox>
            {err && <p className="text-xs text-red-400">{err}</p>}
            <ActionButton onClick={handleDeposit} loading={loading}>
              Deposit {formatUsdc(depositAmount)}{" "}
              <ChevronRight className="h-4 w-4" />
            </ActionButton>
            <button
              onClick={() => setStep(3)}
              className="w-full text-center text-xs text-zinc-600 hover:text-zinc-400 transition-colors py-1"
            >
              Skip for now — I'll deposit later
            </button>
          </div>
        </SetupCard>
      )}

      {step === 3 && (
        <SetupCard
          title="Add rules (optional)"
          description="Choose which defaults your agent should follow. You can edit these any time from the dashboard."
        >
          <div className="space-y-4">
            <div className="space-y-2">
              {DEFAULT_RULES.map((r) => {
                const on = selectedRules.has(r.key);
                return (
                  <button
                    key={r.key}
                    onClick={() => toggleRule(r.key)}
                    className={cn(
                      "w-full flex items-start gap-3 rounded-xl border px-4 py-3 text-left transition-all",
                      on
                        ? "border-emerald-500/40 bg-emerald-500/5"
                        : "border-white/8 bg-white/5 hover:border-white/15",
                    )}
                  >
                    <div
                      className={cn(
                        "h-5 w-5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors",
                        on
                          ? "bg-emerald-500 border-emerald-500"
                          : "border-white/20",
                      )}
                    >
                      {on && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <div className="min-w-0">
                      <p
                        className={cn(
                          "text-sm font-medium",
                          on ? "text-white" : "text-zinc-400",
                        )}
                      >
                        {r.label}
                      </p>
                      <p className="text-xs text-zinc-600 mt-0.5">
                        {r.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
            {err && <p className="text-xs text-red-400">{err}</p>}
            <ActionButton onClick={handleSaveRules} loading={loading}>
              Save and continue <ChevronRight className="h-4 w-4" />
            </ActionButton>
            <button
              onClick={() => setStep(4)}
              className="w-full text-center text-xs text-zinc-600 hover:text-zinc-400 transition-colors py-1"
            >
              Skip — use defaults
            </button>
          </div>
        </SetupCard>
      )}

      {step === 4 && (
        <SetupCard
          title="Ready to activate"
          description="Your agent is configured and funded. Activate it to start entering contests automatically."
        >
          <div className="space-y-5">
            <div className="rounded-xl bg-white/5 divide-y divide-white/5">
              <SummaryRow
                label="Max per contest"
                value={formatUsdc(maxSpend)}
              />
              <SummaryRow
                label="Max per week"
                value={`${maxContests} contest${maxContests > 1 ? "s" : ""}`}
              />
              <SummaryRow
                label="Weekly budget"
                value={formatUsdc(maxSpend * maxContests)}
              />
              <SummaryRow
                label="Vault funded"
                value={formatUsdc(depositAmount)}
                accent
              />
              <SummaryRow
                label="Rules"
                value={`${selectedRules.size} rule${selectedRules.size !== 1 ? "s" : ""} configured`}
              />
            </div>
            {err && <p className="text-xs text-red-400">{err}</p>}
            <ActionButton onClick={handleActivate} loading={loading}>
              <Zap className="h-4 w-4" /> Activate agent
            </ActionButton>
          </div>
        </SetupCard>
      )}
    </div>
  );
}

// ─── Shared wizard components ─────────────────────────────────────────────────

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, i) => {
        const done = current > step.id;
        const active = current === step.id;
        return (
          <div
            key={step.id}
            className="flex items-center flex-1 last:flex-none"
          >
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-xs font-black transition-all",
                  done
                    ? "bg-emerald-500 text-white"
                    : active
                      ? "bg-emerald-500/20 border border-emerald-500/50 text-emerald-400"
                      : "bg-white/5 border border-white/10 text-zinc-600",
                )}
              >
                {done ? <Check className="h-4 w-4" /> : step.id}
              </div>
              <span
                className={cn(
                  "text-[9px] font-bold uppercase tracking-widest",
                  active
                    ? "text-emerald-400"
                    : done
                      ? "text-zinc-400"
                      : "text-zinc-700",
                )}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-px mx-2 mb-4 transition-colors",
                  done ? "bg-emerald-500/50" : "bg-white/8",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function SetupCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden">
      <div className="h-0.5 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
      <div className="p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="font-display text-xl font-black uppercase tracking-tight text-white">
            {title}
          </h2>
          <p className="text-sm text-zinc-500 mt-1">{description}</p>
        </div>
        {children}
      </div>
    </div>
  );
}

function SliderField({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
  hint,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
  hint?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <label className="text-sm font-medium text-zinc-300">{label}</label>
        <span className="font-display text-xl font-black text-emerald-400">
          {format(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-emerald-500 cursor-pointer"
      />
      <div className="flex justify-between text-[10px] text-zinc-700">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
      {hint && <p className="text-xs text-zinc-600">{hint}</p>}
    </div>
  );
}

function SummaryBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-zinc-400">
      {children}
    </div>
  );
}

function SummaryRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex justify-between items-center px-4 py-3">
      <span className="text-sm text-zinc-400">{label}</span>
      <span
        className={cn(
          "text-sm font-bold",
          accent ? "text-emerald-400" : "text-white",
        )}
      >
        {value}
      </span>
    </div>
  );
}

function ActionButton({
  onClick,
  loading = false,
  children,
}: {
  onClick: () => void;
  loading?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed px-6 py-3.5 text-sm font-bold text-white transition-all shadow-lg shadow-emerald-500/20"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : children}
    </button>
  );
}
