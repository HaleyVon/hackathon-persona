import {
  InputType,
  PersonaComparisonResult,
  RiskAxes,
  SegmentBreakdown,
  SegmentInsights,
  SimulationSummary,
  SummaryCautionSignal,
  SummaryConfidence,
  VariantReaction,
} from "./types";

type AxesKey = keyof RiskAxes;

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

const TYPE_AXES: Record<InputType, (keyof VariantReaction)[]> = {
  copy: [],
  pricing: ["perceivedValue", "affordability", "willingnessToPay"],
  feature: ["necessity", "urgency", "existingSolutionAwareness"],
  positioning: ["uniqueness", "toneFit", "audienceFit"],
};

function buildTypeAxes(
  results: PersonaComparisonResult[],
  side: "A" | "B",
  inputType: InputType
): Record<string, number> | undefined {
  const keys = TYPE_AXES[inputType];
  if (keys.length === 0) return undefined;
  const out: Record<string, number> = {};
  let hasAny = false;
  for (const key of keys) {
    const vals = results
      .map((r) => (side === "A" ? r.reactionA : r.reactionB)[key as keyof VariantReaction])
      .filter((v): v is number => typeof v === "number");
    if (vals.length > 0) {
      out[key] = Math.round((vals.reduce((s, v) => s + v, 0) / vals.length) * 10) / 10;
      hasAny = true;
    }
  }
  return hasAny ? out : undefined;
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function stddev(values: number[]): number {
  if (values.length <= 1) return 0;
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance = values.reduce((sum, value) => sum + ((value - mean) ** 2), 0) / values.length;
  return Math.sqrt(variance);
}

function buildCautionSignals(params: {
  results: PersonaComparisonResult[];
  decisionMode: "compare" | "review";
  winner: "A" | "B" | "Tie";
  avgScoreA: number;
  avgScoreB: number;
  riskAxesA?: RiskAxes;
  riskAxesB?: RiskAxes;
  productDescription?: string;
  targetCustomer?: string;
  usageContext?: string;
}): SummaryCautionSignal[] {
  const {
    results,
    decisionMode,
    winner,
    avgScoreA,
    avgScoreB,
    riskAxesA,
    riskAxesB,
    productDescription = "",
    targetCustomer = "",
    usageContext = "",
  } = params;

  const cautions: SummaryCautionSignal[] = [];
  const sampleSize = results.length;
  const trimmedDescription = productDescription.trim();
  const trimmedTarget = targetCustomer.trim();
  const trimmedUsage = usageContext.trim();

  if (sampleSize <= 3) {
    cautions.push({
      code: "small_sample",
      label: "표본 적음",
      description: `현재 해석은 ${sampleSize}명 표본 기준입니다. 배포 전 더 넓은 타깃이나 실제 유저 확인이 필요합니다.`,
      severity: "critical",
    });
  } else if (sampleSize <= 5) {
    cautions.push({
      code: "small_sample",
      label: "표본 제한",
      description: `현재 해석은 ${sampleSize}명 표본 기준입니다. 방향성 확인에는 쓸 수 있지만 확정 판단으로 보기엔 좁습니다.`,
      severity: "warning",
    });
  }

  if (trimmedUsage.length < 8 || trimmedDescription.length < 20 || trimmedTarget.length < 6) {
    cautions.push({
      code: "missing_context",
      label: "맥락 부족",
      description: "제품 설명, 주 타깃, 사용 맥락이 짧으면 결과가 일반론에 가까워질 수 있습니다.",
      severity: "warning",
    });
  }

  if (decisionMode === "review") {
    const intentSpread = stddev(results.map((result) => result.reactionA.purchaseIntent));
    if (intentSpread >= 1) {
      cautions.push({
        code: "mixed_reactions",
        label: "의견 분산 큼",
        description: "같은 안을 두고도 페르소나별 반응 차이가 큽니다. 특정 세그먼트에서만 먹힐 가능성을 따로 확인해야 합니다.",
        severity: "warning",
      });
    }

    if (riskAxesA && (riskAxesA.trust < 3 || riskAxesA.confusionRisk > 3 || riskAxesA.resistance > 3)) {
      cautions.push({
        code: "residual_risk",
        label: "핵심 리스크 남음",
        description: "현재 안은 이해/신뢰/거부감 중 한 축에서 여전히 위험 신호가 있습니다. 표현 다듬기 없이 바로 배포하기엔 이릅니다.",
        severity: "critical",
      });
    }

    return cautions;
  }

  const scoreGap = Math.abs(avgScoreA - avgScoreB);
  if (winner === "Tie" || scoreGap < 0.4) {
    cautions.push({
      code: "close_call",
      label: "근소한 차이",
      description: "두 안의 차이가 작습니다. 현재 결과는 승자 확정보다 리스크 비교에 더 가깝게 읽어야 합니다.",
      severity: "warning",
    });
  }

  const winnerSupport =
    winner === "Tie"
      ? 0.5
      : results.filter((result) => result.preferredVariant === winner).length / results.length;
  if (winnerSupport < 0.7) {
    cautions.push({
      code: "mixed_reactions",
      label: "세그먼트 엇갈림",
      description: "전체 승자가 있더라도 세그먼트별 선호는 갈립니다. 일괄 배포 전에 누구에게 먼저 검증할지 정하는 편이 안전합니다.",
      severity: "warning",
    });
  }

  const selectedAxes = winner === "B" ? riskAxesB : riskAxesA;
  if (
    selectedAxes &&
    (selectedAxes.trust < 3 || selectedAxes.confusionRisk > 3 || selectedAxes.resistance > 3)
  ) {
    cautions.push({
      code: "residual_risk",
      label: "추천안도 보완 필요",
      description: "상대적으로 더 나은 안이지만 그대로 배포하면 신뢰 저하나 오해 리스크가 남습니다. 수정 후 다시 보는 편이 맞습니다.",
      severity: "critical",
    });
  }

  return cautions;
}

function buildConfidence(params: {
  cautionSignals: SummaryCautionSignal[];
  resultsCount: number;
  decisionMode: "compare" | "review";
  avgScoreA: number;
  avgScoreB: number;
}): SummaryConfidence {
  const { cautionSignals, resultsCount, decisionMode, avgScoreA, avgScoreB } = params;
  let score = 72;

  if (resultsCount >= 8) score += 8;
  else if (resultsCount <= 3) score -= 8;

  if (decisionMode === "compare" && Math.abs(avgScoreA - avgScoreB) >= 0.7) {
    score += 8;
  }

  for (const caution of cautionSignals) {
    if (caution.severity === "critical") score -= 18;
    else if (caution.severity === "warning") score -= 10;
    else score -= 4;
  }

  if (cautionSignals.length === 0) score += 8;

  const clamped = Math.max(18, Math.min(92, score));
  const level = clamped >= 72 ? "high" : clamped >= 48 ? "medium" : "low";

  if (level === "high") {
    return {
      level,
      label: "해석 안정적",
      description: `표본 ${resultsCount}명 기준으로 큰 경고 신호가 적습니다. 그래도 이 결과는 정답 예측이 아니라 출시 전 리스크 탐지용 신호로 읽는 편이 맞습니다.`,
    };
  }

  if (level === "medium") {
    return {
      level,
      label: "해석 주의",
      description: cautionSignals.length > 0
        ? `${cautionSignals[0].label} 신호가 있어 결과를 그대로 확정안으로 보기보다는 수정 방향을 잡는 근거로 쓰는 편이 좋습니다.`
        : `표본 ${resultsCount}명 기준의 방향성 신호입니다. 실제 배포 전 추가 검증을 권장합니다.`,
    };
  }

  return {
    level,
    label: "해석 불확실",
    description: cautionSignals.length > 0
      ? `${cautionSignals
        .slice(0, 2)
        .map((signal) => signal.label)
        .join(", ")} 신호가 겹칩니다. 이번 결과는 승패 판단보다 위험 포인트 탐지용으로만 사용하는 편이 안전합니다.`
      : "반응 신호가 약하거나 엇갈립니다. 실제 유저 확인 없이 강한 결론을 내리기 어렵습니다.",
  };
}

function avgOptional(values: Array<number | undefined>): number | undefined {
  const defined = values.filter((value): value is number => value !== undefined);
  if (!defined.length) return undefined;
  return round1(defined.reduce((sum, value) => sum + value, 0) / defined.length);
}

function riskSignal(params: {
  trust?: number;
  resistance?: number;
  confusion?: number;
  intent?: number;
}): number {
  const trust = params.trust ?? 3;
  const resistance = params.resistance ?? 3;
  const confusion = params.confusion ?? 3;
  const intent = params.intent ?? 3;
  return ((6 - trust) * 1.2) + resistance + confusion + ((6 - intent) * 0.8);
}

function describeVariant(variant?: "A" | "B" | "Tie"): string {
  if (variant === "A") return "A안";
  if (variant === "B") return "B안";
  return "두 안";
}

function segmentWinner(preferA: number, preferB: number): "A" | "B" | "Tie" {
  if (preferA > preferB) return "A";
  if (preferB > preferA) return "B";
  return "Tie";
}

function buildSegmentInsights(
  breakdown: SegmentBreakdown[],
  winner: "A" | "B" | "Tie"
): SegmentInsights | undefined {
  if (!breakdown.length) return undefined;

  const chosenVariant = winner === "Tie" ? undefined : winner;

  const resistant = [...breakdown]
    .sort((left, right) => {
      const leftRisk = riskSignal({
        trust: chosenVariant === "B" ? left.avgTrustB : left.avgTrustA,
        resistance: chosenVariant === "B" ? left.avgResistanceB : left.avgResistanceA,
        confusion: chosenVariant === "B" ? left.avgConfusionB : left.avgConfusionA,
        intent: chosenVariant === "B" ? left.avgScoreB : left.avgScoreA,
      });
      const rightRisk = riskSignal({
        trust: chosenVariant === "B" ? right.avgTrustB : right.avgTrustA,
        resistance: chosenVariant === "B" ? right.avgResistanceB : right.avgResistanceA,
        confusion: chosenVariant === "B" ? right.avgConfusionB : right.avgConfusionA,
        intent: chosenVariant === "B" ? right.avgScoreB : right.avgScoreA,
      });
      return rightRisk - leftRisk;
    })[0];

  const nicheCandidates = breakdown.filter((segment) => segment.total >= 2 && segment.winner && segment.winner !== "Tie");
  const niche = [...nicheCandidates]
    .sort((left, right) => {
      const leftSkew = Math.abs(left.preferA - left.preferB) / left.total;
      const rightSkew = Math.abs(right.preferA - right.preferB) / right.total;
      const leftBoost = left.winner !== winner && left.winner !== "Tie" ? 0.35 : 0;
      const rightBoost = right.winner !== winner && right.winner !== "Tie" ? 0.35 : 0;
      return (rightSkew + rightBoost + right.total * 0.03) - (leftSkew + leftBoost + left.total * 0.03);
    })[0];

  const splitCandidates = breakdown.filter((segment) => segment.total >= 2 && Math.abs(segment.preferA - segment.preferB) <= 1);
  const testFirstSource =
    [...splitCandidates].sort((left, right) => right.total - left.total)[0]
    ?? [...breakdown]
      .sort((left, right) => {
        const leftContrast = Math.abs((left.avgScoreA ?? 3) - (left.avgScoreB ?? 3));
        const rightContrast = Math.abs((right.avgScoreA ?? 3) - (right.avgScoreB ?? 3));
        return rightContrast - leftContrast;
      })[0];

  return {
    resistant: resistant && chosenVariant
      ? {
          label: resistant.label,
          preferredVariant: chosenVariant,
          title: `${resistant.label}에서 ${describeVariant(chosenVariant)} 거부 신호가 가장 큽니다`,
          description: `신뢰 ${((chosenVariant === "B" ? resistant.avgTrustB : resistant.avgTrustA) ?? 3).toFixed(1)}/5, 혼란 ${((chosenVariant === "B" ? resistant.avgConfusionB : resistant.avgConfusionA) ?? 3).toFixed(1)}/5 수준입니다. 이 세그먼트는 배포 시 가장 먼저 이탈할 가능성이 큽니다.`,
        }
      : resistant
        ? {
            label: resistant.label,
            preferredVariant: resistant.winner,
            title: `${resistant.label}는 어느 안에도 확신을 주지 못합니다`,
            description: "전체 결론이 애매할 때 가장 먼저 흔들리는 세그먼트입니다. 표현을 더 구체화하지 않으면 실제 반응도 갈릴 가능성이 큽니다.",
          }
        : undefined,
    niche: niche
      ? {
          label: niche.label,
          preferredVariant: niche.winner,
          title: `${niche.label}에서는 ${describeVariant(niche.winner)} 반응이 유독 강합니다`,
          description: niche.winner !== winner && niche.winner !== "Tie"
            ? `전체 결론과 달리 이 세그먼트는 ${describeVariant(niche.winner)}를 더 선호합니다. 전면 rollout 전에 별도 타깃 메시지로 분리할 여지가 있습니다.`
            : `이 세그먼트는 ${describeVariant(niche.winner)}에 특히 선명하게 반응합니다. 초기 타깃이나 사례 확보용 세그먼트로 쓰기 좋습니다.`,
        }
      : undefined,
    testFirst: testFirstSource
      ? {
          label: testFirstSource.label,
          preferredVariant: testFirstSource.winner,
          title: `${testFirstSource.label}를 먼저 검증하는 편이 학습 효율이 높습니다`,
          description: Math.abs(testFirstSource.preferA - testFirstSource.preferB) <= 1
            ? "이 세그먼트는 선호가 갈려 있어 다음 실험에서 가장 많은 학습을 줍니다. 문구 수정안이나 가격 기준점을 먼저 이 그룹에 확인하는 편이 좋습니다."
            : `이 세그먼트는 반응 차이가 비교적 선명합니다. 현재 가설을 빠르게 검증하려면 이 그룹을 첫 인터뷰/테스트 대상으로 두는 편이 효율적입니다.`,
        }
      : undefined,
  };
}

export function buildSummary(
  results: PersonaComparisonResult[],
  insights: {
    topLikedPoints: string[];
    topConcerns: string[];
    recommendedCopies: string[];
    oneParagraphInsight: string;
  },
  inputType: InputType = "copy",
  decisionMode: "compare" | "review" = "compare",
  context: {
    productDescription?: string;
    targetCustomer?: string;
    usageContext?: string;
  } = {}
): SimulationSummary {
  const isReview = decisionMode === "review";
  const avgScoreA =
    results.reduce((s, r) => s + r.reactionA.purchaseIntent, 0) / results.length;
  const rawAvgScoreB =
    results.reduce((s, r) => s + r.reactionB.purchaseIntent, 0) / results.length;
  const avgScoreB = isReview ? avgScoreA : rawAvgScoreB;

  const winner: "A" | "B" | "Tie" =
    isReview
      ? "A"
      : avgScoreA > avgScoreB + 0.2 ? "A" : avgScoreB > avgScoreA + 0.2 ? "B" : "Tie";

  const riskAxesA = buildRiskAxes(results, "A");
  const riskAxesB = isReview ? undefined : buildRiskAxes(results, "B");
  const cautionSignals = buildCautionSignals({
    results,
    decisionMode,
    winner,
    avgScoreA,
    avgScoreB,
    riskAxesA,
    riskAxesB,
    ...context,
  });
  const confidence = buildConfidence({
    cautionSignals,
    resultsCount: results.length,
    decisionMode,
    avgScoreA,
    avgScoreB,
  });
  const segmentBreakdown = isReview ? [] : buildSegmentBreakdown(results);
  const segmentInsights = isReview ? undefined : buildSegmentInsights(segmentBreakdown, winner);

  return {
    winner,
    avgScoreA: round1(avgScoreA),
    avgScoreB: round1(avgScoreB),
    riskAxesA,
    riskAxesB,
    typeAxesA: buildTypeAxes(results, "A", inputType),
    typeAxesB: isReview ? undefined : buildTypeAxes(results, "B", inputType),
    segmentBreakdown,
    decisionMode,
    inputType,
    confidence,
    cautionSignals,
    segmentInsights,
    ...insights,
  };
}

function buildSegmentBreakdown(results: PersonaComparisonResult[]): SegmentBreakdown[] {
  const groups: Record<string, {
    preferA: number;
    preferB: number;
    tie: number;
    scoreA: number[];
    scoreB: number[];
    trustA: Array<number | undefined>;
    trustB: Array<number | undefined>;
    resistanceA: Array<number | undefined>;
    resistanceB: Array<number | undefined>;
    confusionA: Array<number | undefined>;
    confusionB: Array<number | undefined>;
  }> = {};

  for (const r of results) {
    const ageGroup = getAgeGroup(r.persona.age);
    const sex = r.persona.sex;
    const label = `${ageGroup} ${sex}`;

    if (!groups[label]) {
      groups[label] = {
        preferA: 0,
        preferB: 0,
        tie: 0,
        scoreA: [],
        scoreB: [],
        trustA: [],
        trustB: [],
        resistanceA: [],
        resistanceB: [],
        confusionA: [],
        confusionB: [],
      };
    }

    if (r.preferredVariant === "A") groups[label].preferA++;
    else if (r.preferredVariant === "B") groups[label].preferB++;
    else groups[label].tie++;

    groups[label].scoreA.push(r.reactionA.purchaseIntent);
    groups[label].scoreB.push(r.reactionB.purchaseIntent);
    groups[label].trustA.push(r.reactionA.trust);
    groups[label].trustB.push(r.reactionB.trust);
    groups[label].resistanceA.push(r.reactionA.resistance);
    groups[label].resistanceB.push(r.reactionB.resistance);
    groups[label].confusionA.push(r.reactionA.confusionRisk);
    groups[label].confusionB.push(r.reactionB.confusionRisk);
  }

  return Object.entries(groups)
    .map(([label, counts]) => ({
      label,
      total: counts.preferA + counts.preferB + counts.tie,
      preferA: counts.preferA,
      preferB: counts.preferB,
      tie: counts.tie,
      winner: segmentWinner(counts.preferA, counts.preferB),
      avgScoreA: avgOptional(counts.scoreA),
      avgScoreB: avgOptional(counts.scoreB),
      avgTrustA: avgOptional(counts.trustA),
      avgTrustB: avgOptional(counts.trustB),
      avgResistanceA: avgOptional(counts.resistanceA),
      avgResistanceB: avgOptional(counts.resistanceB),
      avgConfusionA: avgOptional(counts.confusionA),
      avgConfusionB: avgOptional(counts.confusionB),
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
