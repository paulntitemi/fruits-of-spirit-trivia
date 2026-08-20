"use client";

import type { Group } from "@/lib/rooms";

interface Props {
  groups: Group[];
  highlightId?: string | null;
  /** compact = tighter rows for the in-game phone widget */
  compact?: boolean;
}

const MEDALS = ["🥇", "🥈", "🥉"];

export function Leaderboard({ groups, highlightId, compact }: Props) {
  if (groups.length === 0) {
    return (
      <p className="label text-center text-ink-soft">
        Waiting for the first group to join…
      </p>
    );
  }

  return (
    <ol className={compact ? "space-y-1.5" : "space-y-3"}>
      {groups.map((g, i) => {
        const mine = g.id === highlightId;
        return (
          <li
            key={g.id}
            className={`ink${compact ? "-sm" : ""} flex items-center gap-3 rounded-lg px-4 ${
              compact ? "py-2" : "py-3.5"
            } ${
              mine
                ? "bg-ink text-[color:hsl(var(--paper))]"
                : i === 0
                  ? "bg-[color:var(--tone-wash,#f6ede0)]"
                  : "bg-card"
            }`}
          >
            <span
              className={`display shrink-0 tabular-nums ${
                compact ? "w-6 text-lg" : "w-9 text-2xl"
              }`}
            >
              {MEDALS[i] ?? i + 1}
            </span>
            <span
              className={`display flex-1 truncate ${compact ? "text-lg" : "text-2xl"}`}
            >
              {g.name}
              {g.finished && (
                <span className="label ml-2 align-middle opacity-70">done</span>
              )}
            </span>
            <span
              className={`display shrink-0 tabular-nums ${
                compact ? "text-lg" : "text-2xl"
              }`}
            >
              {g.score.toLocaleString()}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
