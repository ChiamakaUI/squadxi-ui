import Link from "next/link";
import { Users, Clock, DollarSign } from "lucide-react";
import type { Contest } from "@/types";
import { ContestStatusBadge } from "@/components/ui/status-badge";
import { formatUsdc, timeUntilDeadline, isDeadlinePassed } from "@/lib/utils";

export function ContestCard({ contest }: { contest: Contest }) {
  const deadlinePassed = isDeadlinePassed(contest.deadline);
  const entryPct = Math.round((contest.entry_count / contest.max_entries) * 100);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 flex flex-col gap-4 hover:border-zinc-700 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide">
            Matchweek {contest.matchweek}
          </p>
          <h3 className="text-white font-semibold mt-0.5 leading-tight">
            {contest.name}
          </h3>
        </div>
        <ContestStatusBadge status={contest.status} />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        <Stat
          icon={<DollarSign className="h-3.5 w-3.5" />}
          label="Entry"
          value={formatUsdc(contest.entry_fee)}
        />
        <Stat
          icon={<DollarSign className="h-3.5 w-3.5" />}
          label="Cap"
          value={formatUsdc(contest.salary_cap)}
        />
        <Stat
          icon={<Users className="h-3.5 w-3.5" />}
          label="Entries"
          value={`${contest.entry_count}/${contest.max_entries}`}
        />
      </div>

      {/* Entry fill bar */}
      <div className="space-y-1">
        <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{ width: `${entryPct}%` }}
          />
        </div>
        <p className="text-xs text-zinc-500">{entryPct}% filled</p>
      </div>

      {/* Deadline + CTA */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <Clock className="h-3.5 w-3.5" />
          {deadlinePassed ? (
            <span className="text-red-400">Deadline passed</span>
          ) : (
            <span>{timeUntilDeadline(contest.deadline)} left</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/contests/${contest.id}`}
            className="text-xs text-zinc-400 hover:text-white underline underline-offset-2"
          >
            Details
          </Link>
          {contest.status === "open" && !deadlinePassed && (
            <Link
              href={`/contests/${contest.id}/enter`}
              className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-600 transition-colors"
            >
              Enter {formatUsdc(contest.entry_fee)}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-zinc-800/60 px-2.5 py-2">
      <div className="flex items-center gap-1 text-zinc-500 mb-0.5">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="text-sm font-semibold text-white">{value}</p>
    </div>
  );
}