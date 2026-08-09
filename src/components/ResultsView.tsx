"use client";

import { FruitIcon } from "@/components/FruitIcon";
import { BLESSINGS, FRUIT_MAP, HARVEST } from "@/lib/fruits";
import type { RoundResult } from "@/components/QuizView";

interface Props {
  result: RoundResult;
  isNewBest: boolean;
  onReplay: () => void;
  onHome: () => void;
}

function roundTheme(round: RoundResult["round"]) {
  if (round === "harvest") {
    return { name: HARVEST.name, hex: HARVEST.hex, wash: HARVEST.wash, verse: HARVEST.verse, reference: HARVEST.reference };
  }
  const f = FRUIT_MAP[round];
  return { name: f.name, hex: f.hex, wash: f.wash, verse: f.verse, reference: f.reference };
}

export default function ResultsView({
  result,
  isNewBest,
  onReplay,
  onHome,
}: Props) {
  const { correct, total, points, maxStreak, round } = result;
  const theme = roundTheme(round);
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  const perfect = correct === total && total > 0;
  const blessing =
    BLESSINGS.find((b) => pct >= b.min) ?? BLESSINGS[BLESSINGS.length - 1];

  // score ring geometry
  const R = 70;
  const CIRC = 2 * Math.PI * R;
  const offset = CIRC - (pct / 100) * CIRC;

  return (
    <main
      className="relative mx-auto flex min-h-[100dvh] max-w-2xl flex-col items-center justify-center px-5 py-12 text-center"
      style={
        {
          "--tone": theme.hex,
          "--tone-wash": theme.wash,
        } as React.CSSProperties
      }
    >
      <p className="label anim-rise text-ink-soft">
        {theme.name} · {perfect ? "Perfect round" : "Round complete"}
      </p>

      {perfect && (
        <p className="anim-pop ink-sm mt-3 rotate-[-2deg] rounded-full bg-[color:var(--tone)] px-5 py-2 text-sm font-bold uppercase tracking-widest text-white">
          🌳 Tree Ripened!
        </p>
      )}

      {/* ── Score ring ── */}
      <div className="anim-pop relative mt-6 h-56 w-56">
        <svg viewBox="0 0 180 180" className="h-full w-full -rotate-90">
          <circle
            cx="90"
            cy="90"
            r={R}
            fill="none"
            stroke="hsl(var(--paper-deep))"
            strokeWidth="14"
          />
          <circle
            cx="90"
            cy="90"
            r={R}
            fill="none"
            stroke="var(--tone)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            style={
              {
                "--circ": CIRC,
                "--offset": offset,
                animation: "ringGrow 900ms cubic-bezier(0.2,0.8,0.25,1) both",
                strokeDashoffset: offset,
              } as React.CSSProperties
            }
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="display text-6xl leading-none">{pct}%</span>
          <span className="label mt-1 text-ink-soft">
            {correct} of {total}
          </span>
        </div>
      </div>

      {/* ── Stat pills ── */}
      <div className="anim-rise mt-8 flex flex-wrap items-center justify-center gap-3">
        <Pill value={points.toLocaleString()} label="Points" />
        <Pill value={`${maxStreak}`} label="Best Streak" />
        {isNewBest && <Pill value="NEW" label="Personal Best" highlight />}
      </div>

      {/* ── Blessing ── */}
      <div className="anim-rise ink mt-9 w-full rounded-lg bg-[color:var(--tone-wash)] p-6">
        <div className="mx-auto mb-3 h-16 w-16">
          <FruitIcon id={round} tone={theme.hex} />
        </div>
        <h2 className="display text-3xl sm:text-4xl">{blessing.title}</h2>
        <p className="mt-2 text-base text-ink-soft">{blessing.line}</p>
        <p className="display mt-5 text-lg italic">“{theme.verse}”</p>
        <p className="label mt-2 text-ink-soft">{theme.reference}</p>
      </div>

      {/* ── Actions ── */}
      <div className="anim-rise mt-8 flex w-full flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onReplay}
          className="press ink-lg flex-1 rounded-lg bg-card py-4 text-lg font-bold"
        >
          ↻ Play again
        </button>
        <button
          type="button"
          onClick={onHome}
          className="press ink-lg flex-1 rounded-lg bg-ink py-4 text-lg font-bold text-[color:hsl(var(--paper))]"
        >
          Back to orchard →
        </button>
      </div>
    </main>
  );
}

function Pill({
  value,
  label,
  highlight,
}: {
  value: string;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`ink-sm rounded-full px-5 py-2.5 ${
        highlight ? "bg-[color:var(--tone)] text-white" : "bg-card"
      }`}
    >
      <span className="display text-xl leading-none">{value}</span>
      <span
        className={`label ml-2 ${highlight ? "text-white/80" : "text-ink-soft"}`}
      >
        {label}
      </span>
    </div>
  );
}
