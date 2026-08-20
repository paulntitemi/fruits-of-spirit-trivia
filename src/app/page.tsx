"use client";

import { useEffect, useState } from "react";
import Orchard from "@/components/Orchard";
import QuizView, { type RoundResult } from "@/components/QuizView";
import ResultsView from "@/components/ResultsView";
import {
  loadProgress,
  mergeResult,
  saveProgress,
  type Progress,
} from "@/lib/progress";
import type { RoundId } from "@/lib/questions";
import {
  clearSession,
  loadSession,
  type QuizSession,
  saveSession,
} from "@/lib/session";

type Screen =
  | { name: "orchard" }
  | { name: "quiz"; round: RoundId; playToken: number }
  | { name: "results"; result: RoundResult; isNewBest: boolean };

export default function Home() {
  const [progress, setProgress] = useState<Progress>({});
  const [screen, setScreen] = useState<Screen>({ name: "orchard" });
  // Snapshot to resume when a quiz screen is restored after a refresh.
  const [resume, setResume] = useState<QuizSession | null>(null);

  // hydrate from localStorage after mount, restoring any in-progress session
  useEffect(() => {
    setProgress(loadProgress());
    const snap = loadSession();
    if (snap?.screen === "quiz") {
      setResume(snap.quiz);
      setScreen({
        name: "quiz",
        round: snap.quiz.round,
        playToken: snap.quiz.playToken,
      });
    } else if (snap?.screen === "results") {
      setScreen({
        name: "results",
        result: snap.result,
        isNewBest: snap.isNewBest,
      });
    }
  }, []);

  const startRound = (round: RoundId) => {
    setResume(null); // a fresh round should not reuse a restored snapshot
    setScreen({ name: "quiz", round, playToken: Date.now() });
  };

  const finishRound = (result: RoundResult) => {
    const prevBest = progress[result.round]?.bestPoints ?? 0;
    const isNewBest = result.points > prevBest;
    const next = mergeResult(
      progress,
      result.round,
      result.correct,
      result.total,
      result.points,
    );
    setProgress(next);
    saveProgress(next);
    saveSession({ screen: "results", result, isNewBest });
    setScreen({ name: "results", result, isNewBest });
  };

  const goHome = () => {
    clearSession();
    setScreen({ name: "orchard" });
  };

  if (screen.name === "quiz") {
    return (
      <QuizView
        key={screen.playToken}
        round={screen.round}
        playToken={screen.playToken}
        initial={resume}
        onProgress={(quiz) => saveSession({ screen: "quiz", quiz })}
        onFinish={finishRound}
        onQuit={goHome}
      />
    );
  }

  if (screen.name === "results") {
    return (
      <ResultsView
        result={screen.result}
        isNewBest={screen.isNewBest}
        onReplay={() => startRound(screen.result.round)}
        onHome={goHome}
      />
    );
  }

  return <Orchard progress={progress} onPick={startRound} />;
}
