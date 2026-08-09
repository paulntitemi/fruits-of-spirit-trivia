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

type Screen =
  | { name: "orchard" }
  | { name: "quiz"; round: RoundId; playToken: number }
  | { name: "results"; result: RoundResult; isNewBest: boolean };

export default function Home() {
  const [progress, setProgress] = useState<Progress>({});
  const [screen, setScreen] = useState<Screen>({ name: "orchard" });

  // hydrate from localStorage after mount
  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const startRound = (round: RoundId) => {
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
    setScreen({ name: "results", result, isNewBest });
  };

  const goHome = () => setScreen({ name: "orchard" });

  if (screen.name === "quiz") {
    return (
      <QuizView
        key={screen.playToken}
        round={screen.round}
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
