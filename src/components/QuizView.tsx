"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FruitIcon } from "@/components/FruitIcon";
import { FRUIT_MAP, HARVEST } from "@/lib/fruits";
import { buildRound, type Question, type RoundId } from "@/lib/questions";
import type { QuizSession } from "@/lib/session";

export interface RoundResult {
  round: RoundId;
  correct: number;
  total: number;
  points: number;
  maxStreak: number;
}

interface Props {
  round: RoundId;
  playToken: number;
  /** When present, resume this exact quiz instead of building a fresh round. */
  initial?: QuizSession | null;
  /** Reports a fresh snapshot on every meaningful state change (for refresh-resume). */
  onProgress?: (session: QuizSession) => void;
  onFinish: (result: RoundResult) => void;
  onQuit: () => void;
}

const SECONDS_PER_Q = 20;
const BASE_POINTS = 100;

function roundTheme(round: RoundId) {
  if (round === "harvest") {
    return { name: HARVEST.name, hex: HARVEST.hex, wash: HARVEST.wash };
  }
  const f = FRUIT_MAP[round];
  return { name: f.name, hex: f.hex, wash: f.wash };
}

export default function QuizView({
  round,
  playToken,
  initial,
  onProgress,
  onFinish,
  onQuit,
}: Props) {
  // Freeze the question order for the life of this mount: reuse the restored
  // order when resuming, otherwise build (and shuffle) a fresh round once.
  const questions = useMemo<Question[]>(
    () => initial?.questions ?? buildRound(round),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [round],
  );
  const theme = roundTheme(round);

  const [index, setIndex] = useState(initial?.index ?? 0);
  const [picked, setPicked] = useState<number | null>(initial?.picked ?? null);
  const [correct, setCorrect] = useState(initial?.correct ?? 0);
  const [points, setPoints] = useState(initial?.points ?? 0);
  const [streak, setStreak] = useState(initial?.streak ?? 0);
  const [maxStreak, setMaxStreak] = useState(initial?.maxStreak ?? 0);
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_Q);
  const [gained, setGained] = useState(initial?.gained ?? 0);

  // Persist a snapshot on every meaningful change so a refresh can resume here.
  useEffect(() => {
    onProgress?.({
      round,
      questions,
      index,
      picked,
      correct,
      points,
      streak,
      maxStreak,
      gained,
      playToken,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, picked, correct, points, streak, maxStreak, gained]);

  const q = questions[index];
  const revealed = picked !== null;
  const isLast = index === questions.length - 1;

  const lock = useCallback(
    (choice: number | null, secondsLeft: number) => {
      setPicked((prev) => {
        if (prev !== null) return prev; // already locked
        const hit = choice !== null && choice === q.answer;
        if (hit) {
          const nextStreak = streak + 1;
          const speedBonus = Math.round((secondsLeft / SECONDS_PER_Q) * 60);
          const streakBonus = (nextStreak - 1) * 25;
          const earned = BASE_POINTS + speedBonus + streakBonus;
          setGained(earned);
          setPoints((p) => p + earned);
          setCorrect((c) => c + 1);
          setStreak(nextStreak);
          setMaxStreak((m) => Math.max(m, nextStreak));
        } else {
          setGained(0);
          setStreak(0);
        }
        return choice === null ? -1 : choice; // -1 marks a timeout
      });
    },
    [q, streak],
  );

  // per-question countdown
  useEffect(() => {
    if (revealed) return;
    setTimeLeft(SECONDS_PER_Q);
    const started = Date.now();
    const timer = setInterval(() => {
      const elapsed = (Date.now() - started) / 1000;
      const left = Math.max(0, SECONDS_PER_Q - elapsed);
      setTimeLeft(left);
      if (left <= 0) {
        clearInterval(timer);
        lock(null, 0);
      }
    }, 100);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const advance = useCallback(() => {
    if (isLast) {
      onFinish({
        round,
        correct,
        total: questions.length,
        points,
        maxStreak,
      });
    } else {
      setPicked(null);
      setIndex((i) => i + 1);
    }
  }, [isLast, onFinish, round, correct, questions.length, points, maxStreak]);

  // keyboard: 1-4 to answer, Enter/Space to advance
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!revealed && ["1", "2", "3", "4"].includes(e.key)) {
        const idx = Number(e.key) - 1;
        if (idx < q.options.length) lock(idx, timeLeft);
      } else if (revealed && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        advance();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [revealed, q, timeLeft, lock, advance]);

  const timePct = (timeLeft / SECONDS_PER_Q) * 100;
  const progressPct = ((index + (revealed ? 1 : 0)) / questions.length) * 100;

  return (
    <main
      className="relative mx-auto flex min-h-[100dvh] max-w-3xl flex-col px-5 py-6 sm:px-8"
      style={
        {
          "--tone": theme.hex,
          "--tone-wash": theme.wash,
        } as React.CSSProperties
      }
    >
      {/* ── Top bar ── */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onQuit}
          className="ink-sm press-sm rounded-full bg-card px-4 py-2 text-sm font-semibold"
        >
          ← Quit
        </button>

        <div className="flex items-center gap-2">
          <span className="block h-9 w-9">
            <FruitIcon id={round} tone={theme.hex} />
          </span>
          <span className="display text-xl">{theme.name}</span>
        </div>

        <div className="ml-auto flex items-center gap-3">
          {streak >= 2 && (
            <span className="anim-pop ink-sm rounded-full bg-[color:var(--tone)] px-3 py-1 text-sm font-bold text-white">
              🔥 {streak} streak
            </span>
          )}
          <span className="display text-2xl tabular-nums">{points}</span>
        </div>
      </div>

      {/* ── Progress + timer ── */}
      <div className="mt-4 space-y-2">
        <div className="ink-sm h-4 overflow-hidden rounded-full bg-card p-0">
          <div
            className="h-full bg-ink transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="label text-ink-soft">
            Question {index + 1} of {questions.length}
          </span>
          <span className="label text-ink-soft tabular-nums">
            {revealed ? "—" : `${Math.ceil(timeLeft)}s`}
          </span>
        </div>
        {!revealed && (
          <div className="h-1.5 overflow-hidden rounded-full bg-[color:var(--tone-wash)]">
            <div
              className="h-full rounded-full bg-[color:var(--tone)]"
              style={{
                width: `${timePct}%`,
                transition: "width 120ms linear",
              }}
            />
          </div>
        )}
      </div>

      {/* ── Question ── */}
      <section key={index} className="anim-slide mt-8 flex-1">
        <h2 className="display text-3xl leading-tight sm:text-4xl">
          {q.prompt}
        </h2>

        <div className="mt-7 grid gap-3">
          {q.options.map((opt, i) => {
            const isAnswer = i === q.answer;
            const isPicked = picked === i;
            let stateClass =
              "bg-card hover:bg-[color:var(--tone-wash)]";
            if (revealed) {
              if (isAnswer) {
                stateClass = "bg-[color:var(--tone)] text-white";
              } else if (isPicked) {
                stateClass = "bg-destructive text-white anim-shake";
              } else {
                stateClass = "bg-card opacity-55";
              }
            }
            return (
              <button
                key={opt}
                type="button"
                disabled={revealed}
                onClick={() => lock(i, timeLeft)}
                className={`ink press-sm flex items-center gap-4 rounded-lg px-5 py-4 text-left text-lg font-medium ${stateClass}`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-ink text-sm font-bold ${
                    revealed && isAnswer
                      ? "bg-white text-ink"
                      : "bg-[color:var(--tone-wash)] text-ink"
                  }`}
                >
                  {i + 1}
                </span>
                <span className="flex-1">{opt}</span>
                {revealed && isAnswer && <span className="text-xl">✓</span>}
                {revealed && isPicked && !isAnswer && (
                  <span className="text-xl">✕</span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Verse reveal ── */}
        {revealed && (
          <div
            className="anim-rise ink mt-6 rounded-lg bg-[color:var(--tone-wash)] p-5"
            aria-live="polite"
          >
            <div className="flex items-center justify-between">
              <p className="label text-ink-soft">
                {picked === q.answer
                  ? gained > 0
                    ? `Correct · +${gained}`
                    : "Correct"
                  : picked === -1
                    ? "Time's up"
                    : "Not quite"}
              </p>
              <p className="label text-ink-soft">{q.reference}</p>
            </div>
            <p className="mt-2 text-base leading-relaxed">{q.note}</p>
          </div>
        )}
      </section>

      {/* ── Continue ── */}
      {revealed && (
        <div className="anim-rise sticky bottom-4 z-40 mt-6">
          <button
            type="button"
            onClick={advance}
            className="press ink-lg w-full rounded-lg bg-ink py-4 text-center text-lg font-bold text-[color:hsl(var(--paper))]"
          >
            {isLast ? "See your harvest →" : "Next question →"}
          </button>
        </div>
      )}
    </main>
  );
}
