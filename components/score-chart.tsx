"use client";

import { DecisionMode, InputType, PersonaComparisonResult } from "@/lib/types";
import ReviewDistributionChart from "./review-distribution-chart";
import ScoreDumbbellChart from "./score-dumbbell-chart";

interface Props {
  results: PersonaComparisonResult[];
  decisionMode?: DecisionMode;
  inputType?: InputType;
}

export default function ScoreChart({
  results,
  decisionMode = "compare",
  inputType = "copy",
}: Props) {
  if (decisionMode === "review") {
    return <ReviewDistributionChart results={results} />;
  }

  return <ScoreDumbbellChart results={results} inputType={inputType} />;
}
