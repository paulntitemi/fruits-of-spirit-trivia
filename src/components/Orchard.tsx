"use client";

import Link from "next/link";
import { FRUITS, HARVEST, type Fruit } from "@/lib/fruits";
import { FruitIcon } from "@/components/FruitIcon";
import { isRipe, type Progress } from "@/lib/progress";
import type { RoundId } from "@/lib/questions";

interface Props {
  progress: Progress;
  onPick: (round: RoundId) => void;
}

const TILTS = ["-2deg", "1.5deg", "-1deg", "2deg", "-1.5deg", "1deg", "-2deg", "1.2deg", "-1.2deg"];

export default function Orchard({ progress, onPick }: Props) {
  const ripeCount = FRUITS.filter((f) => isRipe(progress[f.id])).length;
  const totalPoints = Object.values(progress).reduce(
    (sum, r) => sum + (r?.bestPoints ?? 0),
    0,
  );
  const totalPlays = Object.values(progress).reduce(
    (sum, r) => sum + (r?.plays ?? 0),
    0,
  );

  return (
    <main className="relative mx-auto max-w-6xl px-5 pb-24 pt-10 sm:px-8">
      {/* ── Hero ── */}
      <header className="anim-rise relative mb-14 text-center">
        <p className="label mb-4 text-ink-soft">Galatians 5 · Bible Trivia</p>
        <h1 className="display mx-auto max-w-3xl text-[15vw] leading-[0.85] sm:text-8xl">
          The Nine
        </h1>
        <p className="display mx-auto mt-1 max-w-3xl text-3xl text-ink-soft sm:text-4xl">
          Fruit of the Spirit
        </p>
        <p className="mx-auto mt-6 max-w-xl text-base text-ink-soft sm:text-lg">
          Nine orchards, nine virtues. Pick a fruit, answer its questions, and
          grow a harvest of what you know. Ripen every tree by scoring a perfect
          round.
        </p>

        {/* stats row */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Stat value={`${ripeCount}/9`} label="Trees Ripe" />
          <Stat value={totalPoints.toLocaleString()} label="Points Gathered" />
          <Stat value={totalPlays.toString()} label="Rounds Played" />
        </div>

        {/* group play */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/host"
            className="ink press-sm inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-[color:hsl(var(--paper))]"
          >
            Host group game →
          </Link>
          <Link
            href="/join"
            className="ink-sm press-sm inline-flex items-center gap-2 rounded-full bg-card px-6 py-3 text-sm font-semibold"
          >
            Join a game
          </Link>
        </div>
      </header>

      {/* ── Fruit grid ── */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-3">
        {FRUITS.map((fruit, i) => (
          <FruitCard
            key={fruit.id}
            fruit={fruit}
            tilt={TILTS[i % TILTS.length]}
            index={i}
            ripe={isRipe(progress[fruit.id])}
            best={progress[fruit.id]?.bestCorrect ?? 0}
            total={progress[fruit.id]?.total ?? 0}
            onPick={() => onPick(fruit.id)}
          />
        ))}
      </section>

      {/* ── Harvest / grand round ── */}
      <section className="mt-6">
        <button
          type="button"
          onClick={() => onPick("harvest")}
          className="press ink-lg group flex w-full flex-col items-center gap-5 rounded-lg bg-[color:var(--tone-wash)] px-6 py-8 text-center sm:flex-row sm:justify-between sm:text-left"
          style={
            {
              "--tone": HARVEST.hex,
              "--tone-wash": HARVEST.wash,
            } as React.CSSProperties
          }
        >
          <div className="flex items-center gap-5">
            <span className="anim-bob block h-20 w-20 shrink-0 sm:h-24 sm:w-24">
              <FruitIcon id="harvest" tone={HARVEST.hex} />
            </span>
            <div>
              <p className="label text-ink-soft">The Grand Round</p>
              <h2 className="display text-4xl sm:text-5xl">Full Harvest</h2>
              <p className="mt-1 max-w-md text-sm text-ink-soft">
                Twelve mixed questions from every tree. Bring it all in.
              </p>
            </div>
          </div>
          <span className="ink-sm press-sm inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-[color:hsl(var(--paper))]">
            Begin harvest →
          </span>
        </button>
      </section>

      <footer className="mt-16 text-center">
        <p className="label text-ink-soft">{HARVEST.reference}</p>
        <p className="display mx-auto mt-3 max-w-2xl text-xl text-ink-soft sm:text-2xl">
          “{HARVEST.verse}”
        </p>
      </footer>
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="ink-sm rounded-full bg-card px-5 py-2.5">
      <span className="display text-xl leading-none">{value}</span>
      <span className="label ml-2 text-ink-soft">{label}</span>
    </div>
  );
}

function FruitCard({
  fruit,
  tilt,
  index,
  ripe,
  best,
  total,
  onPick,
}: {
  fruit: Fruit;
  tilt: string;
  index: number;
  ripe: boolean;
  best: number;
  total: number;
  onPick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onPick}
      className="press ink group relative flex flex-col items-center gap-3 rounded-lg bg-[color:var(--tone-wash)] px-4 py-6 text-center anim-rise"
      style={
        {
          "--tone": fruit.hex,
          "--tone-wash": fruit.wash,
          animationDelay: `${index * 55}ms`,
        } as React.CSSProperties
      }
    >
      {ripe && (
        <span className="ink-sm absolute -right-2 -top-2 z-10 rotate-6 rounded-full bg-ink px-3 py-1 text-[0.6rem] font-bold uppercase tracking-widest text-[color:hsl(var(--paper))]">
          Ripe ✓
        </span>
      )}

      <span
        className="block h-20 w-20 shrink-0 sm:h-24 sm:w-24"
        style={{ ["--tilt" as string]: tilt }}
      >
        <span className="anim-bob block h-full w-full">
          <FruitIcon id={fruit.id} tone={fruit.hex} />
        </span>
      </span>

      <div>
        <h3 className="display text-2xl sm:text-3xl">{fruit.name}</h3>
        <p className="mt-0.5 text-xs italic text-ink-soft">
          {fruit.translit} · {fruit.produce}
        </p>
      </div>

      <span className="label text-ink-soft">
        {total > 0 ? `Best ${best}/${total}` : "Not planted yet"}
      </span>
    </button>
  );
}
