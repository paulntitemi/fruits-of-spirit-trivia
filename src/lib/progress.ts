import type { RoundId } from "./questions";

export interface RoundRecord {
  bestCorrect: number;
  total: number;
  bestPoints: number;
  plays: number;
}

export type Progress = Partial<Record<RoundId, RoundRecord>>;

const KEY = "fos-orchard-v1";

export function loadProgress(): Progress {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Progress) : {};
  } catch {
    return {};
  }
}

export function saveProgress(next: Progress) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable — progress simply won't persist */
  }
}

export function mergeResult(
  progress: Progress,
  round: RoundId,
  correct: number,
  total: number,
  points: number,
): Progress {
  const prev = progress[round];
  return {
    ...progress,
    [round]: {
      bestCorrect: Math.max(prev?.bestCorrect ?? 0, correct),
      total,
      bestPoints: Math.max(prev?.bestPoints ?? 0, points),
      plays: (prev?.plays ?? 0) + 1,
    },
  };
}

export function isRipe(record?: RoundRecord) {
  return !!record && record.total > 0 && record.bestCorrect === record.total;
}
