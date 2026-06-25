import Link from "next/link";
import { Trophy } from "lucide-react";
import type { UserEntry } from "@/types";
import { ContestStatusBadge } from "@/components/ui/status-badge";
import { formatUsdc, cn } from "@/lib/utils";

export function EntryCard({ entry }: { entry: UserEntry }) {
  return (
    <Link href={`/entries/${entry.id}`}>
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 hover:border-zinc-700 transition-colors">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <p className="text-xs text-zinc-500">Matchweek {entry.matchweek}</p>
            <h3 className="text-white font-semibold mt-0.5 leading-tight">
              {entry.contest_name}
            </h3>
          </div>
          <ContestStatusBadge status={entry.contest_status} />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <StatBlock label="Points" value={entry.total_points.toString()} highlight />
          <StatBlock
            label="Rank"
            value={entry.rank ? `#${entry.rank}` : "—"}
          />
          <StatBlock label="Entry Fee" value={formatUsdc(entry.entry_fee)} />
        </div>

        {entry.rank && entry.rank <= 3 && (
          <div className="mt-3 flex items-center gap-2 text-amber-400 text-xs font-medium">
            <Trophy className="h-4 w-4" />
            Top 3 finish!
          </div>
        )}
      </div>
    </Link>
  );
}

function StatBlock({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-lg bg-zinc-800/60 px-3 py-2.5">
      <p className="text-xs text-zinc-500 mb-0.5">{label}</p>
      <p className={cn("text-lg font-bold", highlight ? "text-emerald-400" : "text-white")}>
        {value}
      </p>
    </div>
  );
}