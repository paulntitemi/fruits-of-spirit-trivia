"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { getRoom, joinRoom, recallGroup, rememberGroup } from "@/lib/rooms";

function JoinForm() {
  const router = useRouter();
  const params = useSearchParams();

  const [code, setCode] = useState((params.get("room") ?? "").toUpperCase());
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // If this device already joined this room, jump straight back into the game.
  useEffect(() => {
    const c = (params.get("room") ?? "").toUpperCase();
    if (c && recallGroup(c)) router.replace(`/play/${c}`);
  }, [params, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    const cleanCode = code.trim().toUpperCase();
    const cleanName = name.trim();
    if (cleanCode.length < 4) return setError("Enter the 4-character room code.");
    if (!cleanName) return setError("Enter a group name or number.");

    setBusy(true);
    setError(null);
    try {
      const room = await getRoom(cleanCode);
      if (!room) {
        setError("No game found for that code.");
        setBusy(false);
        return;
      }
      const group = await joinRoom(cleanCode, cleanName);
      rememberGroup(cleanCode, group.id);
      router.push(`/play/${cleanCode}`);
    } catch {
      setError("Something went wrong joining the game. Try again.");
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-md flex-col justify-center px-6">
      <header className="anim-rise text-center">
        <p className="label text-ink-soft">Group Play</p>
        <h1 className="display mt-2 text-5xl">Join the Game</h1>
      </header>

      <form onSubmit={submit} className="anim-rise mt-8 space-y-4">
        <label className="block">
          <span className="label text-ink-soft">Room code</span>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            maxLength={4}
            autoCapitalize="characters"
            autoComplete="off"
            placeholder="ABCD"
            className="ink mt-1 w-full rounded-lg bg-card px-4 py-3 text-center text-2xl font-bold tracking-[0.3em] outline-none focus:bg-[color:var(--tone-wash)]"
          />
        </label>

        <label className="block">
          <span className="label text-ink-soft">Group name or number</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={24}
            placeholder="e.g. Team Joy"
            className="ink mt-1 w-full rounded-lg bg-card px-4 py-3 text-lg outline-none focus:bg-[color:var(--tone-wash)]"
          />
        </label>

        {error && (
          <p className="ink-sm rounded-lg bg-destructive px-4 py-3 text-center text-sm font-semibold text-white">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="press ink-lg w-full rounded-lg bg-ink py-4 text-lg font-bold text-[color:hsl(var(--paper))] disabled:opacity-60"
        >
          {busy ? "Joining…" : "Start playing →"}
        </button>
      </form>
    </main>
  );
}

export default function JoinPage() {
  return (
    <Suspense fallback={null}>
      <JoinForm />
    </Suspense>
  );
}
