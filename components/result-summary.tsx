import { SimulationSummary } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { getVariantLabel, toDisplayRiskAxes } from "@/lib/display";

interface Props {
  summary: SimulationSummary;
  variantA: string;
  variantB: string;
}

export default function ResultSummary({ summary, variantA, variantB }: Props) {
  const inputType = summary.inputType ?? "copy";
  const decisionMode = summary.decisionMode ?? "compare";

  if (!summary.riskAxesA) {
    return null;
  }

  const axesA = toDisplayRiskAxes(summary.riskAxesA);
  const axesB = summary.riskAxesB ? toDisplayRiskAxes(summary.riskAxesB) : undefined;
  const topConcern = summary.topConcerns[0];
  const topLike = summary.topLikedPoints[0];

  if (decisionMode === "review" || !axesB) {
    return (
      <div className="grid gap-3 lg:grid-cols-4">
        <MetricCard
          title="전반 반응"
          value={`${summary.avgScoreA.toFixed(1)}/5`}
          body={buildReviewOverallInsight(summary.avgScoreA, topLike, topConcern)}
          tone="blue"
          detail={variantA}
        />
        <MetricCard
          title="명확성"
          value={`${axesA.clarity.toFixed(1)}/5`}
          body={buildReviewClarityInsight(axesA.clarity, topConcern)}
          tone={axesA.clarity >= 3.5 ? "emerald" : "amber"}
        />
        <MetricCard
          title="신뢰도"
          value={`${axesA.trust.toFixed(1)}/5`}
          body={buildReviewTrustInsight(axesA.trust, topConcern)}
          tone={axesA.trust >= 3.5 ? "emerald" : "amber"}
        />
        <MetricCard
          title="수용도"
          value={`${axesA.acceptance.toFixed(1)}/5`}
          body={buildReviewAcceptanceInsight(axesA.acceptance, topLike, topConcern)}
          tone={axesA.acceptance >= 3.5 ? "emerald" : "amber"}
        />
      </div>
    );
  }

  const clarityWinner = axesA.clarity >= axesB.clarity ? "A" : "B";
  const trustWinner = axesA.trust >= axesB.trust ? "A" : "B";
  const acceptanceWinner = axesA.acceptance >= axesB.acceptance ? "A" : "B";
  const selectedBody = (side: "A" | "B") => side === "A" ? variantA : variantB;

  return (
    <div className="grid gap-3 lg:grid-cols-4">
      <MetricCard
        title="추천안"
        value={getVariantLabel(inputType, summary.winner === "B" ? "B" : "A")}
        body={summary.winner === "Tie" ? "두 안의 장점을 섞어 새 안을 만드는 편이 낫습니다." : "현재 결과에서 가장 안정적으로 반응한 안입니다."}
        tone="blue"
        detail={summary.winner === "Tie" ? `${variantA} / ${variantB}` : summary.winner === "B" ? selectedBody("B") : selectedBody("A")}
      />
      <MetricCard
        title="명확성 우세"
        value={`${getVariantLabel(inputType, clarityWinner)} · ${(clarityWinner === "A" ? axesA.clarity : axesB.clarity).toFixed(1)}/5`}
        body={buildCompareMetricInsight({
          metric: "clarity",
          winner: clarityWinner,
          winnerValue: clarityWinner === "A" ? axesA.clarity : axesB.clarity,
          loserValue: clarityWinner === "A" ? axesB.clarity : axesA.clarity,
          inputType,
          topConcern,
          topLike,
        })}
        tone={clarityWinner === "A" ? "blue" : "violet"}
      />
      <MetricCard
        title="신뢰도 우세"
        value={`${getVariantLabel(inputType, trustWinner)} · ${(trustWinner === "A" ? axesA.trust : axesB.trust).toFixed(1)}/5`}
        body={buildCompareMetricInsight({
          metric: "trust",
          winner: trustWinner,
          winnerValue: trustWinner === "A" ? axesA.trust : axesB.trust,
          loserValue: trustWinner === "A" ? axesB.trust : axesA.trust,
          inputType,
          topConcern,
          topLike,
        })}
        tone={trustWinner === "A" ? "blue" : "violet"}
      />
      <MetricCard
        title="수용도 우세"
        value={`${getVariantLabel(inputType, acceptanceWinner)} · ${(acceptanceWinner === "A" ? axesA.acceptance : axesB.acceptance).toFixed(1)}/5`}
        body={buildCompareMetricInsight({
          metric: "acceptance",
          winner: acceptanceWinner,
          winnerValue: acceptanceWinner === "A" ? axesA.acceptance : axesB.acceptance,
          loserValue: acceptanceWinner === "A" ? axesB.acceptance : axesA.acceptance,
          inputType,
          topConcern,
          topLike,
        })}
        tone={acceptanceWinner === "A" ? "blue" : "violet"}
      />
    </div>
  );
}

function buildReviewOverallInsight(score: number, topLike?: string, topConcern?: string): string {
  if (score >= 4) {
    return topLike
      ? `전반 반응이 강합니다. 특히 "${topLike}" 같은 포인트가 실제 호감 이유로 반복됐습니다.`
      : "전반 반응이 강합니다. 큰 수정 없이 다음 검증 단계로 가져갈 수 있습니다.";
  }
  if (score >= 3) {
    return topConcern
      ? `반응은 보통 이상이지만 "${topConcern}" 같은 걸림돌 때문에 확신이 약해집니다.`
      : "반응은 나쁘지 않지만 표현을 조금 더 다듬어야 확신이 생기는 상태입니다.";
  }
  return topConcern
    ? `현재 반응은 약합니다. 특히 "${topConcern}"가 핵심 이탈 포인트로 보입니다.`
    : "현재 반응은 약합니다. 핵심 가치 전달 방식부터 다시 손봐야 합니다.";
}

function buildReviewClarityInsight(score: number, topConcern?: string): string {
  if (score >= 4) {
    return "페르소나들이 이 안을 빠르게 이해했습니다. 무엇을 주는지 설명이 비교적 선명합니다.";
  }
  if (score >= 3) {
    return topConcern
      ? `기본 메시지는 전달되지만 "${topConcern}"처럼 해석이 갈릴 여지가 남습니다.`
      : "핵심 뜻은 전달되지만 한 번에 꽂히는 정도는 아직 약합니다.";
  }
  return topConcern
    ? `명확성이 낮습니다. 페르소나들은 "${topConcern}" 같은 지점에서 바로 멈췄습니다.`
    : "명확성이 낮습니다. 기능이나 효익을 더 직접적으로 써야 합니다.";
}

function buildReviewTrustInsight(score: number, topConcern?: string): string {
  if (score >= 4) {
    return "과장보다 실제 효용으로 읽혀 신뢰 저항이 비교적 적었습니다.";
  }
  if (score >= 3) {
    return topConcern
      ? `"${topConcern}" 같은 의문이 남아 있어 완전히 믿고 넘어가진 못하는 상태입니다.`
      : "납득은 되지만 근거나 구체성이 더 있으면 신뢰가 올라갈 수 있습니다.";
  }
  return topConcern
    ? `신뢰도가 낮습니다. 특히 "${topConcern}"가 과장이나 불확실성으로 읽혔습니다.`
    : "신뢰도가 낮습니다. 근거, 보안, 실제 결과를 더 직접적으로 제시해야 합니다.";
}

function buildReviewAcceptanceInsight(score: number, topLike?: string, topConcern?: string): string {
  if (score >= 4) {
    return topLike
      ? `"${topLike}" 같은 이유로 거부감 없이 받아들여졌습니다.`
      : "거부감 없이 받아들여지는 편입니다. 다음은 선택 이유를 더 강하게 만드는 단계입니다.";
  }
  if (score >= 3) {
    return topConcern
      ? `"${topConcern}" 때문에 일부 페르소나는 아직 바로 받아들이지 못했습니다.`
      : "크게 거슬리진 않지만 당장 행동을 유도할 정도의 확신은 부족합니다.";
  }
  return topConcern
    ? `수용도가 낮습니다. "${topConcern}" 때문에 처음부터 밀어내는 반응이 나왔습니다.`
    : "수용도가 낮습니다. 표현의 부담감이나 복잡도를 줄여야 합니다.";
}

function buildCompareMetricInsight({
  metric,
  winner,
  winnerValue,
  loserValue,
  inputType,
  topConcern,
  topLike,
}: {
  metric: "clarity" | "trust" | "acceptance";
  winner: "A" | "B";
  winnerValue: number;
  loserValue: number;
  inputType: "copy" | "pricing" | "feature" | "positioning";
  topConcern?: string;
  topLike?: string;
}) {
  const delta = (winnerValue - loserValue).toFixed(1);
  const label = getVariantLabel(inputType, winner);

  if (metric === "clarity") {
    return winnerValue >= 4
      ? `${label}가 ${delta}점 더 선명합니다. 페르소나들이 무엇을 말하는지 더 빨리 이해했습니다.`
      : topConcern
        ? `${label}가 상대적으로 낫지만 "${topConcern}" 같은 해석 문제는 여전히 남습니다.`
        : `${label}가 조금 더 명확하지만 둘 다 더 직접적인 표현 보강이 필요합니다.`;
  }

  if (metric === "trust") {
    return winnerValue >= 4
      ? `${label}가 ${delta}점 더 믿을 만하게 읽혔습니다. 과장보다 실제 효용으로 받아들여졌습니다.`
      : topConcern
        ? `${label}가 상대적으로 낫지만 "${topConcern}" 같은 불신 포인트는 계속 관리해야 합니다.`
        : `${label}가 더 낫지만 신뢰를 확실히 끌어올릴 근거나 사례가 더 필요합니다.`;
  }

  return winnerValue >= 4
    ? topLike
      ? `${label}가 ${delta}점 더 부드럽게 받아들여졌습니다. 특히 "${topLike}" 같은 포인트가 잘 먹혔습니다.`
      : `${label}가 ${delta}점 더 거부감 없이 받아들여졌습니다.`
    : topConcern
      ? `${label}가 상대적으로 낫지만 "${topConcern}" 때문에 여전히 수용 장벽이 남습니다.`
      : `${label}가 더 낫지만 즉시 받아들이게 만들 정도로 편안하진 않습니다.`;
}

function MetricCard({
  title,
  value,
  body,
  tone,
  detail,
}: {
  title: string;
  value: string;
  body: string;
  tone: "blue" | "violet" | "emerald" | "amber";
  detail?: string;
}) {
  const tones = {
    blue: "border-blue-100 bg-blue-50/60 text-blue-700",
    violet: "border-violet-100 bg-violet-50/60 text-violet-700",
    emerald: "border-emerald-100 bg-emerald-50/60 text-emerald-700",
    amber: "border-amber-100 bg-amber-50/60 text-amber-700",
  } as const;

  return (
    <Card className={tones[tone]}>
      <CardContent className="pt-4 pb-4">
        <p className="text-xs text-slate-400 mb-1">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        <p className="mt-2 text-xs leading-relaxed text-slate-500">{body}</p>
        {detail && (
          <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-slate-500">{detail}</p>
        )}
      </CardContent>
    </Card>
  );
}
