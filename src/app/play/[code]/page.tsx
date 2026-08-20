"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Leaderboard } from "@/components/Leaderboard";
import QuizView, { type RoundResult } from "@/components/QuizView";
import { getQuestionsByIds } from "@/lib/questions";
import {
  forgetGroup,
  getGroup,
  getRoom,
  type Group,
  recallGroup,
  type Room,
  updateGroupScore,
} from "@/lib/rooms";
import type { QuizSession } from "@/lib/session";
import { useLeaderboard } from "@/lib/useLeaderboard";

type Phase =
  | { name: "loading" }
  | { name: "error"; message: string }
  | { name: "playing"; room: Room; group: Group }
  | { name: "finished"; room: Room; group: Group };

export default function PlayPage() {
  const params = useParams<{ code: string }>();
  const router = useRouter();
  const code = (params.code ?? "").toUpperCase();

  const [phase, setPhase] = useState<Phase>({ name: "loading" });

  useEffect(() => {
    const groupId = recallGroup(code);
    if (!groupId) {
      router.replace(`/join?room=${code}`);
      return;
    }
    (async () => {
      try {
        const [room, group] = await Promise.all([
          getRoom(code),
          getGroup(groupId),
        ]);
        if (!room || !group) {
          forgetGroup(code);
          router.replace(`/join?room=${code}`);
          return;
        }
        const done =
          group.finished || group.answered >= room.question_ids.length;
        setPhase(
          done
            ? { name: "finished", room, group }
            : { name: "playing", room, group },
        );
      } catch {
        setPhase({
          name: "error",
          message: "Couldn’t load the game. Check your connection and retry.",
        });
      }
    })();
  }, [code, router]);

  if (phase.name === "loading") {
    return <CenterNote>Loading game…</CenterNote>;
  }
  if (phase.name === "error") {
    return <CenterNote>{phase.message}</CenterNote>;
  }
  if (phase.name === "finished") {
    return <FinishedView code={code} group={phase.group} />;
  }

  return (
    <PlayingView
      code={code}
      room={phase.room}
      group={phase.group}
      onFinished={(group) =>
        setPhase({ name: "finished", room: phase.room, group })
      }
    />
  );
}

function PlayingView({
  code,
  room,
  group,
  onFinished,
}: {
  code: string;
  room: Room;
  group: Group;
  onFinished: (group: Group) => void;
}) {
  const router = useRouter();
  const initial = useMemo<QuizSession>(
    () => ({
      round: room.round,
      questions: getQuestionsByIds(room.question_ids),
      index: group.answered,
      picked: null,
      correct: 0,
      points: group.score,
      streak: 0,
      maxStreak: 0,
      gained: 0,
      playToken: 1,
    }),
    [room, group],
  );

  const pushProgress = useCallback(
    (s: QuizSession) => {
      // Fire-and-forget; a dropped update is corrected by the next one.
      void updateGroupScore(group.id, s.points, s.index, false);
    },
    [group.id],
  );

  const finish = useCallback(
    (result: RoundResult) => {
      void updateGroupScore(group.id, result.points, result.total, true);
      onFinished({
        ...group,
        score: result.points,
        answered: result.total,
        finished: true,
      });
    },
    [group, onFinished],
  );

  return (
    <>
      <QuizView
        round={room.round}
        playToken={initial.playToken}
        initial={initial}
        onProgress={pushProgress}
        onFinish={finish}
        onQuit={() => router.push("/")}
      />
      <LiveStandings code={code} meId={group.id} />
    </>
  );
}

function FinishedView({ code, group }: { code: string; group: Group }) {
  const groups = useLeaderboard(code);
  const rank = groups.findIndex((g) => g.id === group.id);
  const me = groups.find((g) => g.id === group.id) ?? group;

  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-md flex-col justify-center px-6 py-10">
      <header className="anim-rise text-center">
        <p className="label text-ink-soft">{me.name}</p>
        <h1 className="display mt-2 text-5xl">
          {rank === 0 ? "In the lead! 🥇" : "Round complete"}
        </h1>
        <p className="display mt-3 text-3xl text-ink-soft">
          {me.score.toLocaleString()} points
          {rank >= 0 && ` · #${rank + 1} of ${groups.length}`}
        </p>
        <p className="label mt-2 text-ink-soft">
          Standings keep updating as other groups finish.
        </p>
      </header>

      <section className="anim-rise mt-8">
        <Leaderboard groups={groups} highlightId={group.id} />
      </section>

      <Link
        href="/"
        className="press ink-sm mt-8 rounded-full bg-card px-5 py-3 text-center text-sm font-semibold"
      >
        ← Back to home
      </Link>
    </main>
  );
}

function LiveStandings({ code, meId }: { code: string; meId: string }) {
  const groups = useLeaderboard(code);
  const [open, setOpen] = useState(false);
  const rank = groups.findIndex((g) => g.id === meId);

  return (
    <div className="fixed bottom-3 left-3 z-50 max-w-[15rem]">
      {open && (
        <div className="ink anim-rise mb-2 max-h-[55vh] overflow-y-auto rounded-lg bg-card p-3">
          <Leaderboard groups={groups} highlightId={meId} compact />
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="ink-sm press-sm flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-bold text-[color:hsl(var(--paper))]"
      >
        🏆 {rank >= 0 ? `#${rank + 1} of ${groups.length}` : "Standings"}
        <span className="opacity-70">{open ? "▾" : "▸"}</span>
      </button>
    </div>
  );
}

function CenterNote({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-md flex-col items-center justify-center px-6 text-center">
      <p className="display text-2xl text-ink-soft">{children}</p>
    </main>
  );
}
