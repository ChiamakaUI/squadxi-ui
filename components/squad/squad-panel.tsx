"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";
import type { Player, Position } from "@/types";
import { PlayerCard } from "@/components/players/player-card";
import { formatUsdc, cn } from "@/lib/utils";

const POSITION_ORDER: Position[] = ["GK", "DEF", "MID", "FWD"];

interface SquadPanelProps {
  squad: Player[];
  totalCost: number;
  remainingBudget: number;
  salaryCap: number;
  isValid: boolean;
  validationErrors: string[];
  onRemove: (playerId: string) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export function SquadPanel({
  squad,
  totalCost,
  remainingBudget,
  salaryCap,
  isValid,
  validationErrors,
  onRemove,
  onSubmit,
  isSubmitting = false,
}: SquadPanelProps) {
  const capPct = Math.min((totalCost / salaryCap) * 100, 100);
  const overBudget = remainingBudget < 0;

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Cap bar */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 space-y-3">
        <div className="flex justify-between items-baseline">
          <span className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
            Salary Cap
          </span>
          <span
            className={cn(
              "text-sm font-bold",
              overBudget ? "text-red-400" : "text-white"
            )}
          >
            {formatUsdc(totalCost)}{" "}
            <span className="text-zinc-500 font-normal">
              / {formatUsdc(salaryCap)}
            </span>
          </span>
        </div>
        <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-300",
              overBudget ? "bg-red-500" : capPct > 85 ? "bg-amber-500" : "bg-emerald-500"
            )}
            style={{ width: `${capPct}%` }}
          />
        </div>
        <p
          className={cn(
            "text-xs",
            overBudget ? "text-red-400" : "text-zinc-500"
          )}
        >
          {overBudget
            ? `${formatUsdc(Math.abs(remainingBudget))} over budget`
            : `${formatUsdc(remainingBudget)} remaining`}
        </p>
      </div>

      {/* Players by position */}
      <div className="flex-1 overflow-y-auto space-y-4 min-h-0">
        {POSITION_ORDER.map((pos) => {
          const posPlayers = squad.filter((p) => p.position === pos);
          return (
            <div key={pos}>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-1.5 px-1">
                {pos} ({posPlayers.length})
              </p>
              {posPlayers.length === 0 ? (
                <div className="rounded-lg border border-dashed border-zinc-800 px-4 py-3 text-center">
                  <span className="text-xs text-zinc-600">Add {pos}</span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {posPlayers.map((p) => (
                    <PlayerCard
                      key={p.id}
                      player={p}
                      onRemove={onRemove}
                      inSquad
                      compact
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Validation + submit */}
      <div className="space-y-3 pt-2 border-t border-zinc-800">
        {validationErrors.length > 0 && (
          <div className="rounded-lg bg-zinc-800/60 p-3 space-y-1">
            {validationErrors.map((err) => (
              <div key={err} className="flex items-center gap-2">
                <AlertCircle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span className="text-xs text-zinc-400">{err}</span>
              </div>
            ))}
          </div>
        )}

        {isValid && (
          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            Squad ready to submit
          </div>
        )}

        <button
          onClick={onSubmit}
          disabled={!isValid || isSubmitting}
          className={cn(
            "w-full rounded-xl py-3 text-sm font-bold transition-all",
            isValid
              ? "bg-emerald-500 hover:bg-emerald-600 text-white"
              : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
          )}
        >
          {isSubmitting ? "Submitting…" : "Submit Entry"}
        </button>
      </div>
    </div>
  );
}