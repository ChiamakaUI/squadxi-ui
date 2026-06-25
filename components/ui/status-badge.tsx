import { cn } from "@/lib/utils";
import type { ContestStatus, FixtureStatus, Position } from "@/types";

// ─── Contest status ───────────────────────────────────────────────────────────

const CONTEST_STATUS_STYLES: Record<ContestStatus, string> = {
  open: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  locked: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  scoring: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  settled: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
  cancelled: "bg-red-500/15 text-red-400 border-red-500/30",
};

const CONTEST_STATUS_LABELS: Record<ContestStatus, string> = {
  open: "Open",
  locked: "Locked",
  scoring: "Scoring",
  settled: "Settled",
  cancelled: "Cancelled",
};

export function ContestStatusBadge({ status }: { status: ContestStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        CONTEST_STATUS_STYLES[status]
      )}
    >
      {CONTEST_STATUS_LABELS[status]}
    </span>
  );
}

// ─── Fixture status ───────────────────────────────────────────────────────────

const FIXTURE_STATUS_STYLES: Record<FixtureStatus, string> = {
  NS: "bg-zinc-800 text-zinc-400",
  LIVE: "bg-emerald-500/20 text-emerald-400 animate-pulse",
  HT: "bg-amber-500/20 text-amber-400",
  FT: "bg-zinc-700 text-zinc-300",
  PST: "bg-zinc-800 text-zinc-500",
  CANC: "bg-red-500/20 text-red-400",
};

const FIXTURE_STATUS_LABELS: Record<FixtureStatus, string> = {
  NS: "Not Started",
  LIVE: "Live",
  HT: "Half Time",
  FT: "Full Time",
  PST: "Postponed",
  CANC: "Cancelled",
};

export function FixtureStatusBadge({ status }: { status: FixtureStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium",
        FIXTURE_STATUS_STYLES[status]
      )}
    >
      {FIXTURE_STATUS_LABELS[status]}
    </span>
  );
}

// ─── Position badge ───────────────────────────────────────────────────────────

const POSITION_STYLES: Record<Position, string> = {
  GK: "bg-amber-500/20 text-amber-400",
  DEF: "bg-sky-500/20 text-sky-400",
  MID: "bg-emerald-500/20 text-emerald-400",
  FWD: "bg-orange-500/20 text-orange-400",
};

export function PositionBadge({
  position,
  className,
}: {
  position: Position;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-1.5 py-0.5 text-xs font-bold",
        POSITION_STYLES[position],
        className
      )}
    >
      {position}
    </span>
  );
}