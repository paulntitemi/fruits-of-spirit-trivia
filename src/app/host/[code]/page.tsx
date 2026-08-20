"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Leaderboard } from "@/components/Leaderboard";
import { QrCode } from "@/components/QrCode";
import { getRoom, type Room } from "@/lib/rooms";
import { useLeaderboard } from "@/lib/useLeaderboard";

export default function HostRoom() {
  const params = useParams<{ code: string }>();
  const code = (params.code ?? "").toUpperCase();

  const [room, setRoom] = useState<Room | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [joinUrl, setJoinUrl] = useState("");

  const groups = useLeaderboard(code);

  useEffect(() => {
    setJoinUrl(`${window.location.origin}/join?room=${code}`);
    getRoom(code)
      .then((r) => (r ? setRoom(r) : setNotFound(true)))
      .catch(() => setNotFound(true));
  }, [code]);

  if (notFound) {
    return (
      <main className="mx-auto flex min-h-[100dvh] max-w-md flex-col items-center justify-center px-6 text-center">
        <h1 className="display text-4xl">Room not found</h1>
        <p className="mt-3 text-ink-soft">
          The code <span className="font-bold">{code}</span> doesn’t match an
          active game.
        </p>
        <Link
          href="/host"
          className="ink press-sm mt-6 rounded-full bg-ink px-6 py-3 font-semibold text-[color:hsl(var(--paper))]"
        >
          Host a new game
        </Link>
      </main>
    );
  }

  const playing = groups.filter((g) => !g.finished).length;
  const finished = groups.filter((g) => g.finished).length;

  return (
    <main className="mx-auto min-h-[100dvh] max-w-3xl px-5 py-8 sm:px-8">
      <Link href="/host" className="label text-ink-soft hover:underline">
        ← New game
      </Link>

      {/* ── Join panel (centered, large QR for the room) ── */}
      <section className="anim-rise mt-4">
        <div className="ink rounded-lg bg-card p-6 text-center sm:p-10">
          <p className="label text-ink-soft">Scan to join</p>
          {joinUrl && (
            <div className="mx-auto mt-5 w-[clamp(240px,62vmin,460px)]">
              <QrCode value={joinUrl} />
            </div>
          )}
          <p className="label mt-7 text-ink-soft">or enter this code at /join</p>
          <p className="display mt-1 text-7xl tracking-[0.25em] sm:text-8xl">
            {code}
          </p>
          {room && (
            <p className="label mt-5 text-ink-soft">
              {room.question_ids.length} questions · {groups.length} group
              {groups.length === 1 ? "" : "s"}
            </p>
          )}
        </div>
      </section>

      {/* ── Live leaderboard ── */}
      <section className="mt-12">
        <div className="flex items-baseline justify-between">
          <h1 className="display text-5xl sm:text-6xl">Leaderboard</h1>
          <span className="label text-ink-soft">
            {playing} playing · {finished} done
          </span>
        </div>
        <div className="mt-6">
          <Leaderboard groups={groups} />
        </div>
      </section>
    </main>
  );
}
