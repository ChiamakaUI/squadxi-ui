import Image from "next/image";
import type { Fixture } from "@/types";
import { FixtureStatusBadge } from "@/components/ui/status-badge";

export function FixturesList({ fixtures }: { fixtures: Fixture[] }) {
  return (
    <div className="space-y-2">
      {fixtures.map((fixture) => (
        <FixtureRow key={fixture.id} fixture={fixture} />
      ))}
    </div>
  );
}

function FixtureRow({ fixture }: { fixture: Fixture }) {
  const isPlayed = fixture.status === "FT" || fixture.status === "HT";
  const isLive = fixture.status === "LIVE";
  const kickoff = new Date(fixture.kickoff).toLocaleString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-3">
      <div className="flex items-center gap-3">
        {/* Home team */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <span
            className="text-sm font-medium text-white text-right hidden sm:block truncate max-w-[120px]"
          >
            {fixture.home_team}
          </span>
          <TeamLogo src={fixture.home_logo} name={fixture.home_team} />
        </div>

        {/* Score / time */}
        <div className="flex flex-col items-center min-w-[80px]">
          {isPlayed || isLive ? (
            <div className="flex items-center gap-2">
              <span
                className={`text-xl font-bold ${isLive ? "text-emerald-400" : "text-white"}`}
              >
                {fixture.home_score}
              </span>
              <span className="text-zinc-600">–</span>
              <span
                className={`text-xl font-bold ${isLive ? "text-emerald-400" : "text-white"}`}
              >
                {fixture.away_score}
              </span>
            </div>
          ) : (
            <span className="text-sm text-zinc-400">{kickoff}</span>
          )}
          <FixtureStatusBadge status={fixture.status} />
        </div>

        {/* Away team */}
        <div className="flex items-center gap-2 flex-1 justify-start">
          <TeamLogo src={fixture.away_logo} name={fixture.away_team} />
          <span
            className="text-sm font-medium text-white hidden sm:block truncate max-w-[120px]"
          >
            {fixture.away_team}
          </span>
        </div>
      </div>

      {/* Mobile team names */}
      <div className="flex justify-between mt-1.5 sm:hidden">
        <span className="text-xs text-zinc-400 truncate max-w-[120px]">
          {fixture.home_team}
        </span>
        <span className="text-xs text-zinc-400 truncate max-w-[120px] text-right">
          {fixture.away_team}
        </span>
      </div>
    </div>
  );
}

function TeamLogo({ src, name }: { src: string; name: string }) {
  return (
    <div className="relative h-7 w-7 shrink-0">
      <Image
        src={src}
        alt={name}
        fill
        className="object-contain"
        unoptimized
      />
    </div>
  );
}