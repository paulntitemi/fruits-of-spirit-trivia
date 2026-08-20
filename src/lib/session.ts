import type { RoundResult } from "@/components/QuizView";
import type { Question, RoundId } from "./questions";

/**
 * A snapshot of an in-progress quiz, enough to rebuild the exact screen the
 * player was on. We persist the *questions array itself* (not just the round
 * id) because buildRound() reshuffles on every call — without the frozen order
 * a restored session wouldn't line up with what the player was answering.
 */
export interface QuizSession {
  round: RoundId;
  questions: Question[];
  index: number;
  picked: number | null;
  correct: number;
  points: number;
  streak: number;
  maxStreak: number;
  gained: number;
  playToken: number;
}

export type SessionSnapshot =
  | { screen: "quiz"; quiz: QuizSession }
  | { screen: "results"; result: RoundResult; isNewBest: boolean };

const KEY = "fos-session-v1";

export function loadSession(): SessionSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SessionSnapshot) : null;
  } catch {
    return null;
  }
}

export function saveSession(snapshot: SessionSnapshot) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(snapshot));
  } catch {
    /* storage unavailable — session simply won't survive a refresh */
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* nothing to do */
  }
}
