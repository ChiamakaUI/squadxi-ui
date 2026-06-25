// "use client";

// import { useState } from "react";
// import { Bot, Zap, ZapOff, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
// import type { AgentStatus, AgentRule, AgentAction } from "@/types";
// import { useUpdateAgentSettings, useDeleteAgentRule } from "@/hooks/useAgent";
// import { formatUsdc, cn } from "@/lib/utils";

// // ─── Status overview ──────────────────────────────────────────────────────────

// export function AgentOverview({ status }: { status: AgentStatus }) {
//   const { budget, rules, recentActions } = status;
//   const updateSettings = useUpdateAgentSettings();

//   const toggleActive = () => {
//     updateSettings.mutate({ isActive: !budget.is_active });
//   };

//   return (
//     <div className="space-y-6">
//       {/* Budget card */}
//       <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 space-y-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <div
//               className={cn(
//                 "h-9 w-9 rounded-full flex items-center justify-center",
//                 budget.is_active
//                   ? "bg-emerald-500/15"
//                   : "bg-zinc-800"
//               )}
//             >
//               <Bot
//                 className={cn(
//                   "h-5 w-5",
//                   budget.is_active ? "text-emerald-400" : "text-zinc-500"
//                 )}
//               />
//             </div>
//             <div>
//               <p className="text-sm font-semibold text-white">AI Agent</p>
//               <p
//                 className={cn(
//                   "text-xs font-medium",
//                   budget.is_active ? "text-emerald-400" : "text-zinc-500"
//                 )}
//               >
//                 {budget.is_active ? "Active" : "Inactive"}
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={toggleActive}
//             disabled={updateSettings.isPending}
//             className={cn(
//               "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
//               budget.is_active
//                 ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
//                 : "bg-emerald-500 text-white hover:bg-emerald-600"
//             )}
//           >
//             {budget.is_active ? (
//               <><ZapOff className="h-3.5 w-3.5" /> Deactivate</>
//             ) : (
//               <><Zap className="h-3.5 w-3.5" /> Activate</>
//             )}
//           </button>
//         </div>

//         {/* Budget stats */}
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//           <BudgetStat label="Deposited" value={formatUsdc(budget.total_deposited)} />
//           <BudgetStat label="Spent" value={formatUsdc(budget.total_spent)} />
//           <BudgetStat label="Remaining" value={formatUsdc(budget.remaining)} highlight />
//           <BudgetStat label="Max / Contest" value={formatUsdc(budget.max_spend_per_contest)} />
//         </div>

//         {/* Spend bar */}
//         <div className="space-y-1">
//           <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
//             <div
//               className="h-full rounded-full bg-emerald-500 transition-all"
//               style={{
//                 width: `${Math.min(
//                   (parseFloat(budget.total_spent) / parseFloat(budget.total_deposited)) * 100,
//                   100
//                 )}%`,
//               }}
//             />
//           </div>
//           <p className="text-xs text-zinc-500">
//             {budget.max_contests_per_week} contests max / week
//           </p>
//         </div>
//       </div>

//       {/* Rules */}
//       <AgentRulesList rules={rules} budgetId={budget.id} />

//       {/* Recent actions */}
//       <AgentActionsList actions={recentActions} />
//     </div>
//   );
// }

// // ─── Rules ────────────────────────────────────────────────────────────────────

// function AgentRulesList({ rules, budgetId }: { rules: AgentRule[]; budgetId: string }) {
//   const deleteRule = useDeleteAgentRule();

//   return (
//     <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
//       <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
//         <h3 className="text-sm font-semibold text-white">Rules</h3>
//         <span className="text-xs text-zinc-500">{rules.length} active</span>
//       </div>

//       {rules.length === 0 ? (
//         <p className="text-xs text-zinc-500 text-center py-6">
//           No rules configured — agent uses defaults.
//         </p>
//       ) : (
//         <div className="divide-y divide-zinc-800/60">
//           {rules.map((rule) => (
//             <div
//               key={rule.id}
//               className="flex items-center justify-between px-5 py-3 gap-3"
//             >
//               <div>
//                 <p className="text-xs font-medium text-zinc-300 capitalize">
//                   {rule.rule_type.replace(/_/g, " ")}
//                 </p>
//                 <p className="text-xs text-zinc-500 font-mono mt-0.5">
//                   {JSON.stringify(rule.rule_value)}
//                 </p>
//               </div>
//               <button
//                 onClick={() =>
//                   deleteRule.mutate({ ruleId: rule.id, budgetId })
//                 }
//                 disabled={deleteRule.isPending}
//                 className="text-zinc-600 hover:text-red-400 transition-colors p-1"
//               >
//                 <Trash2 className="h-4 w-4" />
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// // ─── Actions ──────────────────────────────────────────────────────────────────

// const ACTION_STYLES: Record<string, string> = {
//   submit_entry: "text-emerald-400",
//   skipped_contest: "text-zinc-500",
//   payment_failed: "text-red-400",
//   payment_confirmed: "text-emerald-400",
//   evaluate_contest: "text-sky-400",
//   build_squad: "text-amber-400",
// };

// function AgentActionsList({ actions }: { actions: AgentAction[] }) {
//   const [expanded, setExpanded] = useState<string | null>(null);

//   return (
//     <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
//       <div className="px-5 py-4 border-b border-zinc-800">
//         <h3 className="text-sm font-semibold text-white">Recent Actions</h3>
//       </div>

//       {actions.length === 0 ? (
//         <p className="text-xs text-zinc-500 text-center py-6">No actions yet.</p>
//       ) : (
//         <div className="divide-y divide-zinc-800/60">
//           {actions.map((action) => (
//             <div key={action.id} className="px-5 py-3">
//               <button
//                 className="w-full flex items-center justify-between gap-3 text-left"
//                 onClick={() =>
//                   setExpanded(expanded === action.id ? null : action.id)
//                 }
//               >
//                 <div className="flex items-center gap-3 min-w-0">
//                   <span
//                     className={cn(
//                       "text-xs font-semibold capitalize shrink-0",
//                       ACTION_STYLES[action.action_type] ?? "text-zinc-400"
//                     )}
//                   >
//                     {action.action_type.replace(/_/g, " ")}
//                   </span>
//                   <span className="text-xs text-zinc-400 truncate">
//                     {action.contest_name}
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2 shrink-0">
//                   {action.amount && (
//                     <span className="text-xs font-medium text-white">
//                       {formatUsdc(action.amount)}
//                     </span>
//                   )}
//                   {expanded === action.id ? (
//                     <ChevronUp className="h-3.5 w-3.5 text-zinc-500" />
//                   ) : (
//                     <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />
//                   )}
//                 </div>
//               </button>

//               {expanded === action.id && (
//                 <p className="mt-2 text-xs text-zinc-500 leading-relaxed">
//                   {action.reasoning}
//                 </p>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// function BudgetStat({
//   label,
//   value,
//   highlight,
// }: {
//   label: string;
//   value: string;
//   highlight?: boolean;
// }) {
//   return (
//     <div className="rounded-lg bg-zinc-800/60 px-3 py-2.5">
//       <p className="text-xs text-zinc-500 mb-0.5">{label}</p>
//       <p className={cn("text-sm font-bold", highlight ? "text-emerald-400" : "text-white")}>
//         {value}
//       </p>
//     </div>
//   );
// }

"use client";

import { useState, useMemo } from "react";
import {
  Bot, Zap, Shield, Trophy, Trash2, Plus, ChevronDown, ChevronUp,
  ToggleLeft, ToggleRight, Loader2, Activity, DollarSign, TrendingUp,
  Check,
} from "lucide-react";
import type { AgentStatus, AgentRule, AgentAction, AgentRuleType } from "@/types";
import {
  useUpdateAgentSettings,
  useAddAgentRule,
  useDeleteAgentRule,
} from "@/hooks/useAgent";
import { useAuth } from "@/hooks/useAuth";
import { signDepositTx } from "@/lib/transactions";
import { formatUsdc, cn } from "@/lib/utils";

// ─── Rule display helpers ─────────────────────────────────────────────────────

const RULE_TYPE_LABELS: Record<string, string> = {
  league:              "Leagues",
  min_entries:         "Min entries",
  max_entries:         "Max entries",
  max_entry_fee:       "Max entry fee",
  preferred_positions: "Preferred positions",
  avoid_teams:         "Avoid teams",
  risk_level:          "Playing style",
};

const LEAGUE_NAMES: Record<string, string> = {
  "39":  "Premier League",
  "140": "La Liga",
  "135": "Serie A",
  "78":  "Bundesliga",
  "61":  "Ligue 1",
};

function formatRuleValue(type: string, value: Record<string, unknown>): string {
  switch (type) {
    case "league":
      return ((value.leagues as string[]) ?? [])
        .map((id) => LEAGUE_NAMES[id] ?? id)
        .join(", ") || "—";
    case "risk_level":
      return String(value.level ?? "");
    case "max_entry_fee":
      return `Max ${formatUsdc(Number(value.max))}`;
    case "min_entries":
      return `At least ${value.min} entries`;
    case "max_entries":
      return `At most ${value.max} entries`;
    case "preferred_positions":
      return ((value.positions as string[]) ?? []).join(", ");
    case "avoid_teams":
      return ((value.teams as string[]) ?? []).join(", ");
    default:
      return JSON.stringify(value);
  }
}

// ─── Activity helpers ─────────────────────────────────────────────────────────

const ACTION_COLORS: Record<string, string> = {
  submit_entry:      "text-emerald-400",
  payment_confirmed: "text-emerald-400",
  skipped_contest:   "text-zinc-500",
  payment_failed:    "text-red-400",
  evaluate_contest:  "text-sky-400",
  build_squad:       "text-amber-400",
};

const ACTION_LABELS: Record<string, string> = {
  submit_entry:      "Entered",
  payment_confirmed: "Payment confirmed",
  payment_failed:    "Payment failed",
  skipped_contest:   "Skipped",
  evaluate_contest:  "Evaluated",
  build_squad:       "Built squad",
};

function getWeekStart(): Date {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now);
  monday.setDate(diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AgentOverview({ status }: { status: AgentStatus }) {
  const { budget, rules, recentActions } = status;
  const updateSettings = useUpdateAgentSettings();
  const [toggling, setToggling] = useState(false);

  const weekStart = getWeekStart();
  const contestsThisWeek = useMemo(
    () =>
      recentActions.filter(
        (a) =>
          a.action_type === "submit_entry" &&
          new Date(a.created_at) >= weekStart
      ).length,
    [recentActions]
  );

  const toggleActive = async () => {
    setToggling(true);
    try {
      await updateSettings.mutateAsync({ isActive: !budget.is_active });
    } finally {
      setToggling(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* ── Status card ── */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden">
        <div className={cn(
          "h-0.5 w-full",
          budget.is_active
            ? "bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent"
            : "bg-white/5"
        )} />
        <div className="p-5">
          <div className="flex items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <div className={cn(
                "h-10 w-10 rounded-xl flex items-center justify-center",
                budget.is_active ? "bg-emerald-500/15" : "bg-white/5"
              )}>
                <Bot className={cn("h-5 w-5", budget.is_active ? "text-emerald-400" : "text-zinc-600")} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">AI Agent</p>
                <p className={cn("text-xs font-medium", budget.is_active ? "text-emerald-400" : "text-zinc-500")}>
                  {budget.is_active ? "Active" : "Paused"}
                </p>
              </div>
            </div>
            <button onClick={toggleActive} disabled={toggling} className="shrink-0">
              {toggling ? (
                <Loader2 className="h-8 w-8 text-zinc-500 animate-spin" />
              ) : budget.is_active ? (
                <ToggleRight className="h-9 w-9 text-emerald-400" />
              ) : (
                <ToggleLeft className="h-9 w-9 text-zinc-600" />
              )}
            </button>
          </div>

          {/* Budget stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <BudgetStat label="Remaining"   value={formatUsdc(budget.remaining)}           accent />
            <BudgetStat label="Deposited"   value={formatUsdc(budget.total_deposited)} />
            <BudgetStat label="Spent"       value={formatUsdc(budget.total_spent)} />
            <BudgetStat label="Max / Contest" value={formatUsdc(budget.max_spend_per_contest)} />
          </div>

          {/* Weekly progress */}
          <div className="mt-4 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500">This week</span>
              <span className={cn(
                "font-semibold",
                contestsThisWeek >= budget.max_contests_per_week ? "text-amber-400" : "text-zinc-300"
              )}>
                {contestsThisWeek} / {budget.max_contests_per_week} contests entered
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  contestsThisWeek >= budget.max_contests_per_week ? "bg-amber-500" : "bg-emerald-500"
                )}
                style={{ width: `${Math.min((contestsThisWeek / budget.max_contests_per_week) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Deposit section ── */}
      <DepositSection budgetId={budget.id} />

      {/* ── Rules section ── */}
      <RulesSection rules={rules} budgetId={budget.id} />

      {/* ── Activity feed ── */}
      <ActivitySection actions={recentActions} />
    </div>
  );
}

// ─── Deposit section ──────────────────────────────────────────────────────────

function DepositSection({ budgetId }: { budgetId: string }) {
  const [open, setOpen]       = useState(false);
  const [amount, setAmount]   = useState(25);
  const [loading, setLoading] = useState(false);
  const [err, setErr]         = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { solanaWallet } = useAuth();
  const updateSettings = useUpdateAgentSettings();

  const handleDeposit = async () => {
    if (!solanaWallet) { setErr("Wallet not ready."); return; }
    setErr(null);
    setLoading(true);
    try {
      const tx = await signDepositTx(solanaWallet, amount);
      await updateSettings.mutateAsync({ totalDeposited: amount, depositTx: tx });
      setSuccess(true);
      setTimeout(() => { setSuccess(false); setOpen(false); }, 2000);
    } catch (e: any) {
      setErr(e.message ?? "Deposit failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <DollarSign className="h-4 w-4 text-zinc-500" />
          <p className="text-sm font-semibold text-white">Fund Agent</p>
        </div>
        {open
          ? <ChevronUp className="h-4 w-4 text-zinc-500" />
          : <ChevronDown className="h-4 w-4 text-zinc-500" />
        }
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-4 border-t border-white/5">
          <p className="text-xs text-zinc-500 pt-4">
            Add USDC to your agent vault. The agent draws from this balance to pay contest entry fees.
          </p>

          {/* Quick amounts */}
          <div className="grid grid-cols-4 gap-2">
            {[10, 25, 50, 100].map((amt) => (
              <button
                key={amt}
                onClick={() => setAmount(amt)}
                className={cn(
                  "rounded-xl border py-2 text-sm font-bold transition-colors",
                  amount === amt
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                    : "border-white/8 bg-white/5 text-zinc-400 hover:border-white/20 hover:text-white"
                )}
              >
                ${amt}
              </button>
            ))}
          </div>

          {/* Custom amount */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-sm">$</span>
            <input
              type="number" min={1} value={amount}
              onChange={(e) => setAmount(Math.max(1, Number(e.target.value)))}
              className="w-full rounded-xl border border-white/8 bg-white/5 pl-8 pr-16 py-3 text-white font-bold text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-500">USDC</span>
          </div>

          {err && <p className="text-xs text-red-400">{err}</p>}

          <button
            onClick={handleDeposit}
            disabled={loading || success}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 py-3 text-sm font-bold text-white transition-all"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> :
             success  ? <><Check className="h-4 w-4" /> Deposited!</> :
                        `Deposit ${formatUsdc(amount)}`}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Rules section ────────────────────────────────────────────────────────────

const RULE_TYPE_OPTIONS: { value: AgentRuleType; label: string }[] = [
  { value: "league",              label: "Leagues"             },
  { value: "risk_level",          label: "Playing style"       },
  { value: "max_entry_fee",       label: "Max entry fee"       },
  { value: "min_entries",         label: "Min entries"         },
  { value: "max_entries",         label: "Max entries"         },
  { value: "preferred_positions", label: "Preferred positions" },
  { value: "avoid_teams",         label: "Avoid teams"         },
];

function RulesSection({ rules, budgetId }: { rules: AgentRule[]; budgetId: string }) {
  const [showAdd, setShowAdd]       = useState(false);
  const [ruleType, setRuleType]     = useState<AgentRuleType>("league");
  const [ruleValue, setRuleValue]   = useState<Record<string, unknown>>({ leagues: ["39"] });
  const [adding, setAdding]         = useState(false);
  const [err, setErr]               = useState<string | null>(null);

  const addRule    = useAddAgentRule();
  const deleteRule = useDeleteAgentRule();

  const handleAdd = async () => {
    setErr(null);
    setAdding(true);
    try {
      await addRule.mutateAsync({ budgetId, ruleType, ruleValue });
      setShowAdd(false);
      setRuleValue({ leagues: ["39"] });
      setRuleType("league");
    } catch (e: any) {
      setErr(e.message ?? "Failed to add rule.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <Shield className="h-4 w-4 text-zinc-500" />
          <p className="text-sm font-semibold text-white">Rules</p>
          <span className="text-xs font-bold text-zinc-600">{rules.length} active</span>
        </div>
        <button
          onClick={() => setShowAdd((v) => !v)}
          className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Add rule
        </button>
      </div>

      {/* Add rule form */}
      {showAdd && (
        <div className="px-5 py-4 border-b border-white/5 space-y-3">
          {/* Rule type selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-500">Rule type</label>
            <select
              value={ruleType}
              onChange={(e) => {
                const t = e.target.value as AgentRuleType;
                setRuleType(t);
                // Reset value to sensible default for this type
                setRuleValue(
                  t === "league"              ? { leagues: ["39"] } :
                  t === "risk_level"          ? { level: "moderate" } :
                  t === "max_entry_fee"       ? { max: 10 } :
                  t === "min_entries"         ? { min: 5 } :
                  t === "max_entries"         ? { max: 100 } :
                  t === "preferred_positions" ? { positions: ["FWD", "MID"] } :
                  t === "avoid_teams"         ? { teams: [] } :
                  {}
                );
              }}
              className="w-full rounded-xl border border-white/8 bg-white/5 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {RULE_TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value} className="bg-zinc-900">{o.label}</option>
              ))}
            </select>
          </div>

          {/* Dynamic value input */}
          <RuleValueInput type={ruleType} value={ruleValue} onChange={setRuleValue} />

          {err && <p className="text-xs text-red-400">{err}</p>}

          <div className="flex gap-2">
            <button
              onClick={handleAdd} disabled={adding}
              className="flex-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 py-2.5 text-xs font-bold text-white transition-colors"
            >
              {adding ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Save rule"}
            </button>
            <button
              onClick={() => setShowAdd(false)}
              className="px-4 rounded-xl border border-white/8 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Rules list */}
      {rules.length === 0 ? (
        <p className="text-xs text-zinc-600 text-center py-6">
          No rules configured — agent uses defaults.
        </p>
      ) : (
        <div className="divide-y divide-white/5">
          {rules.map((rule) => (
            <div key={rule.id} className="flex items-center justify-between px-5 py-3.5 gap-3">
              <div className="min-w-0">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  {RULE_TYPE_LABELS[rule.rule_type] ?? rule.rule_type}
                </p>
                <p className="text-sm text-white mt-0.5 capitalize">
                  {formatRuleValue(rule.rule_type, rule.rule_value as Record<string, unknown>)}
                </p>
              </div>
              <button
                onClick={() => deleteRule.mutate({ ruleId: rule.id, budgetId })}
                disabled={deleteRule.isPending}
                className="shrink-0 h-8 w-8 rounded-lg flex items-center justify-center text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RuleValueInput({
  type, value, onChange,
}: {
  type: AgentRuleType;
  value: Record<string, unknown>;
  onChange: (v: Record<string, unknown>) => void;
}) {
  const LEAGUES = [
    { id: "39",  name: "Premier League" },
    { id: "140", name: "La Liga"        },
    { id: "135", name: "Serie A"        },
    { id: "78",  name: "Bundesliga"     },
    { id: "61",  name: "Ligue 1"        },
  ];

  if (type === "league") {
    const selected = (value.leagues as string[]) ?? [];
    return (
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-zinc-500">Leagues</label>
        <div className="space-y-1.5">
          {LEAGUES.map((l) => {
            const on = selected.includes(l.id);
            return (
              <label key={l.id} className="flex items-center gap-2.5 cursor-pointer">
                <div className={cn(
                  "h-4 w-4 rounded border flex items-center justify-center transition-colors",
                  on ? "bg-emerald-500 border-emerald-500" : "border-white/20"
                )}>
                  {on && <Check className="h-2.5 w-2.5 text-white" />}
                </div>
                <input
                  type="checkbox" className="sr-only" checked={on}
                  onChange={() => {
                    const next = on
                      ? selected.filter((id) => id !== l.id)
                      : [...selected, l.id];
                    onChange({ leagues: next });
                  }}
                />
                <span className="text-sm text-zinc-300">{l.name}</span>
              </label>
            );
          })}
        </div>
      </div>
    );
  }

  if (type === "risk_level") {
    return (
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-zinc-500">Playing style</label>
        <div className="grid grid-cols-3 gap-2">
          {(["conservative", "moderate", "aggressive"] as const).map((level) => (
            <button
              key={level}
              onClick={() => onChange({ level })}
              className={cn(
                "rounded-xl border py-2.5 text-xs font-bold capitalize transition-colors",
                value.level === level
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                  : "border-white/8 bg-white/5 text-zinc-400 hover:text-white"
              )}
            >
              {level}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (type === "max_entry_fee" || type === "min_entries" || type === "max_entries") {
    const key  = type === "max_entry_fee" ? "max" : type === "min_entries" ? "min" : "max";
    const label = type === "max_entry_fee" ? "Max entry fee (USDC)"
                : type === "min_entries"   ? "Min entries in contest"
                :                            "Max entries in contest";
    return (
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-zinc-500">{label}</label>
        <input
          type="number" min={1} value={Number(value[key] ?? 0)}
          onChange={(e) => onChange({ [key]: Number(e.target.value) })}
          className="w-full rounded-xl border border-white/8 bg-white/5 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>
    );
  }

  if (type === "preferred_positions") {
    const selected = (value.positions as string[]) ?? [];
    return (
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-zinc-500">Prioritise these positions</label>
        <div className="grid grid-cols-4 gap-2">
          {(["GK", "DEF", "MID", "FWD"] as const).map((pos) => {
            const on = selected.includes(pos);
            return (
              <button
                key={pos}
                onClick={() => {
                  const next = on
                    ? selected.filter((p) => p !== pos)
                    : [...selected, pos];
                  onChange({ positions: next });
                }}
                className={cn(
                  "rounded-xl border py-2.5 text-xs font-black transition-colors",
                  on
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                    : "border-white/8 bg-white/5 text-zinc-400 hover:border-white/15 hover:text-white"
                )}
              >
                {pos}
              </button>
            );
          })}
        </div>
        <p className="text-[10px] text-zinc-600">
          The agent will prioritise players in these positions when building squads.
        </p>
      </div>
    );
  }

  if (type === "avoid_teams") {
    const teams = (value.teams as string[]) ?? [];
    return (
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-zinc-500">Teams to avoid</label>
        <input
          type="text"
          value={teams.join(", ")}
          onChange={(e) => {
            const next = e.target.value
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean);
            onChange({ teams: next });
          }}
          placeholder="e.g. Everton, Ipswich, Leicester"
          className="w-full rounded-xl border border-white/8 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
        <p className="text-[10px] text-zinc-600">
          Comma-separated. The agent won't pick players from these clubs.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-zinc-500">Value (JSON)</label>
      <input
        type="text" value={JSON.stringify(value)}
        onChange={(e) => { try { onChange(JSON.parse(e.target.value)); } catch {} }}
        className="w-full rounded-xl border border-white/8 bg-white/5 px-3 py-2.5 text-sm text-white font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
      />
    </div>
  );
}

// ─── Activity section ─────────────────────────────────────────────────────────

function ActivitySection({ actions }: { actions: AgentAction[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/5">
        <Activity className="h-4 w-4 text-zinc-500" />
        <p className="text-sm font-semibold text-white">Recent Activity</p>
      </div>

      {actions.length === 0 ? (
        <p className="text-xs text-zinc-600 text-center py-8">
          No activity yet — the agent will act before the next matchweek deadline.
        </p>
      ) : (
        <div className="divide-y divide-white/5">
          {actions.slice(0, 10).map((action) => {
            const color = ACTION_COLORS[action.action_type] ?? "text-zinc-400";
            const label = ACTION_LABELS[action.action_type] ?? action.action_type.replace(/_/g, " ");
            const date  = new Date(action.created_at).toLocaleDateString("en-GB", {
              day: "numeric", month: "short",
            });
            const isExpanded = expanded === action.id;
            return (
              <button
                key={action.id}
                onClick={() => setExpanded(isExpanded ? null : action.id)}
                className="w-full text-left px-5 py-3.5 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={cn("text-xs font-bold capitalize", color)}>{label}</span>
                      <span className="text-xs text-zinc-400 truncate">{action.contest_name}</span>
                    </div>
                    {isExpanded && action.reasoning && (
                      <p className="text-xs text-zinc-500 mt-2 leading-relaxed italic">
                        "{action.reasoning}"
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {action.amount && (
                      <span className="text-xs font-bold text-white">{formatUsdc(action.amount)}</span>
                    )}
                    <span className="text-[10px] text-zinc-700">{date}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Budget stat chip ─────────────────────────────────────────────────────────

function BudgetStat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl bg-white/5 px-3 py-2.5">
      <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{label}</p>
      <p className={cn("font-display text-lg font-black leading-none mt-1", accent ? "text-emerald-400" : "text-white")}>
        {value}
      </p>
    </div>
  );
}