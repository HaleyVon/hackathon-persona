import { PersonaComparisonResult, RiskAxes, SegmentBreakdown, SimulationSummary } from "./types";

type AxesKey = keyof RiskAxes;
const AXES: AxesKey[] = ["comprehension", "trust", "appeal", "resistance", "confusionRisk"];

function avgAxis(results: PersonaComparisonResult[], side: "A" | "B", axis: AxesKey): number {
  const vals = results
    .map((r) => (side === "A" ? r.reactionA : r.reactionB)[axis])
    .filter((v): v is number => v !== undefined);
  if (vals.length === 0) return 0;
  return Math.round((vals.reduce((s, v) => s + v, 0) / vals.length) * 10) / 10;
}

function buildRiskAxes(results: PersonaComparisonResult[], side: "A" | "B"): RiskAxes | undefined {
  const hasData = results.some((r) => {
    const rx = side === "A" ? r.reactionA : r.reactionB;
    return rx.trust !== undefined || rx.confusionRisk !== undefined;
  });
  if (!hasData) return undefined;
  return {
    comprehension: avgAxis(results, side, "comprehension"),
    trust: avgAxis(results, side, "trust"),
    appeal: avgAxis(results, side, "appeal"),
    resistance: avgAxis(results, side, "resistance"),
    confusionRisk: avgAxis(results, side, "confusionRisk"),
  };
}

export function buildSummary(
  results: PersonaComparisonResult[],
  insights: {
    topLikedPoints: string[];
    topConcerns: string[];
    recommendedCopies: string[];
    oneParagraphInsight: string;
  }
): SimulationSummary {
  const avgScoreA =
    results.reduce((s, r) => s + r.reactionA.purchaseIntent, 0) / results.length;
  const avgScoreB =
    results.reduce((s, r) => s + r.reactionB.purchaseIntent, 0) / results.length;

  const winner: "A" | "B" | "Tie" =
    avgScoreA > avgScoreB + 0.2 ? "A" : avgScoreB > avgScoreA + 0.2 ? "B" : "Tie";

  return {
    winner,
    avgScoreA: Math.round(avgScoreA * 10) / 10,
    avgScoreB: Math.round(avgScoreB * 10) / 10,
    riskAxesA: buildRiskAxes(results, "A"),
    riskAxesB: buildRiskAxes(results, "B"),
    segmentBreakdown: buildSegmentBreakdown(results),
    ...insights,
  };
}

function buildSegmentBreakdown(results: PersonaComparisonResult[]): SegmentBreakdown[] {
  const groups: Record<string, { preferA: number; preferB: number; tie: number }> = {};

  for (const r of results) {
    const ageGroup = getAgeGroup(r.persona.age);
    const sex = r.persona.sex;
    const label = `${ageGroup} ${sex}`;

    if (!groups[label]) groups[label] = { preferA: 0, preferB: 0, tie: 0 };

    if (r.preferredVariant === "A") groups[label].preferA++;
    else if (r.preferredVariant === "B") groups[label].preferB++;
    else groups[label].tie++;
  }

  return Object.entries(groups)
    .map(([label, counts]) => ({
      label,
      ...counts,
      total: counts.preferA + counts.preferB + counts.tie,
    }))
    .sort((a, b) => b.total - a.total);
}

function getAgeGroup(age: number): string {
  if (age < 30) return "20대";
  if (age < 40) return "30대";
  if (age < 50) return "40대";
  if (age < 60) return "50대";
  return "60대+";
}
