"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FruitIcon } from "@/components/FruitIcon";
import { FRUITS, HARVEST } from "@/lib/fruits";
import type { RoundId } from "@/lib/questions";
import { createRoom } from "@/lib/rooms";

export default function HostSetup() {
  const router = useRouter();
  const [busy, setBusy] = useState<RoundId | null>(null);
  const [error, setError] = useState<string | null>(null);

  const host = async (round: RoundId) => {
    if (busy) return;
    setBusy(round);
    setError(null);
    try {
      const room = await createRoom(round);
      router.push(`/host/${room.code}`);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Could not create the room. Try again.",
      );
      setBusy(null);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
      <Link
        href="/"
        className="ink-sm press-sm rounded-full bg-card px-4 py-2 text-sm font-semibold"
      >
        ← Home
      </Link>

      <header className="anim-rise mt-8 text-center">
        <p className="label text-ink-soft">Group Play</p>
        <h1 className="display mt-2 text-5xl sm:text-6xl">Host a Game</h1>
        <p className="mx-auto mt-4 max-w-lg text-ink-soft">
          Pick a round. Everyone gets the <em>same</em> questions, races on their
          own phone, and the leaderboard updates live.
        </p>
      </header>

      {error && (
        <p className="ink-sm mt-6 rounded-lg bg-destructive px-4 py-3 text-center text-sm font-semibold text-white">
          {error}
        </p>
      )}

      <section className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {FRUITS.map((fruit) => (
          <RoundButton
            key={fruit.id}
            id={fruit.id}
            name={fruit.name}
            hex={fruit.hex}
            wash={fruit.wash}
            busy={busy === fruit.id}
            disabled={!!busy}
            onClick={() => host(fruit.id)}
          />
        ))}
      </section>

      <section className="mt-4">
        <RoundButton
          id="harvest"
          name="Full Harvest"
          subtitle="12 mixed questions"
          hex={HARVEST.hex}
          wash={HARVEST.wash}
          wide
          busy={busy === "harvest"}
          disabled={!!busy}
          onClick={() => host("harvest")}
        />
      </section>
    </main>
  );
}

function RoundButton({
  id,
  name,
  subtitle,
  hex,
  wash,
  wide,
  busy,
  disabled,
  onClick,
}: {
  id: RoundId;
  name: string;
  subtitle?: string;
  hex: string;
  wash: string;
  wide?: boolean;
  busy: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`press ink group flex items-center gap-3 rounded-lg bg-[color:var(--tone-wash)] px-4 py-4 text-left disabled:opacity-60 ${
        wide ? "w-full" : "flex-col text-center"
      }`}
      style={{ ["--tone" as string]: hex, ["--tone-wash" as string]: wash }}
    >
      <span className={wide ? "block h-14 w-14 shrink-0" : "block h-16 w-16"}>
        <FruitIcon id={id} tone={hex} />
      </span>
      <span className={wide ? "" : "mt-1"}>
        <span className="display block text-xl">{busy ? "Creating…" : name}</span>
        {subtitle && <span className="label text-ink-soft">{subtitle}</span>}
      </span>
    </button>
  );
}
