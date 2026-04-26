import { SimulationRequest, SimulationSummary } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import ImprovementGenerator from "@/components/improvement-generator";
import { formatRecommendationBadge, getInputTypeCopy, getSelectionLabel, getVariantLabel } from "@/lib/display";

interface Props {
  summary: SimulationSummary;
  request: SimulationRequest;
}

function topRisks(summary: SimulationSummary): string[] {
  return summary.topConcerns.slice(0, 2);
}

function pickRecommendation(summary: SimulationSummary, request: SimulationRequest) {
  const inputType = summary.inputType ?? request.inputType;
  const decisionMode = summary.decisionMode ?? request.decisionMode;
  const labels = getInputTypeCopy(inputType);

  if (decisionMode === "review") {
    const trust = summary.riskAxesA?.trust ?? 3;
    const confusion = summary.riskAxesA?.confusionRisk ?? 3;
    const needsRevision = trust < 3 || confusion > 3 || summary.avgScoreA < 3.4;

    return {
      badge: needsRevision ? "수정 후 재검토 권장" : "진행 가능",
      title: needsRevision
        ? `현재 ${labels.short}은 바로 확정보다 수정 후 다시 보는 편이 안전합니다.`
        : `현재 ${labels.short}은 큰 리스크 없이 다음 단계로 가져갈 수 있습니다.`,
      body: needsRevision
        ? `신뢰도 ${trust.toFixed(1)}/5, 혼란도 ${confusion.toFixed(1)}/5 기준으로 보면 표현을 더 구체화한 뒤 다시 검토하는 편이 낫습니다.`
        : `전반 반응은 양호합니다. 다만 실제 배포 전에는 표현을 조금 더 다듬어 명확성을 높이는 편이 좋습니다.`,
      selectedLabel: getSelectionLabel(inputType, decisionMode),
      selectedText: request.variantA,
      winner: "A" as const,
      tone: needsRevision ? "amber" : "emerald",
    };
  }

  if (summary.winner === "Tie") {
    return {
      badge: "새 안 재구성 권장",
      title: "두 안의 차이가 작습니다. 장점을 합쳐 새 안을 만드는 편이 더 낫습니다.",
      body: "현재는 확실한 우세안보다 수정 방향을 읽는 것이 중요합니다. 공통 호감 포인트는 살리고, 혼란을 키운 표현은 제거하는 편이 좋습니다.",
      selectedLabel: "우선 검토할 원안",
      selectedText: request.variantA,
      winner: "Tie" as const,
      tone: "slate",
    };
  }

  const winner = summary.winner;
  const rival = winner === "A" ? "B" : "A";
  const trust = winner === "A" ? summary.riskAxesA?.trust ?? 3 : summary.riskAxesB?.trust ?? 3;
  const confusion = winner === "A" ? summary.riskAxesA?.confusionRisk ?? 3 : summary.riskAxesB?.confusionRisk ?? 3;

  return {
    badge: formatRecommendationBadge(inputType, winner),
    title: `우선은 ${getVariantLabel(inputType, winner)}로 진행하는 편이 더 안전합니다.`,
    body:
      trust < 3 || confusion > 3
        ? `${getVariantLabel(inputType, winner)}가 ${getVariantLabel(inputType, rival)}보다 낫지만 아직 신뢰나 명확성 보완이 필요합니다. 바로 확정하기보다 문구를 다듬은 뒤 후속 검증으로 가는 편이 좋습니다.`
        : `${getVariantLabel(inputType, winner)}가 더 명확하고 설득력 있게 받아들여졌습니다. 현재 단계에서는 이 안을 기준으로 세부 표현만 다듬는 편이 맞습니다.`,
    selectedLabel: getSelectionLabel(inputType, decisionMode),
    selectedText: winner === "A" ? request.variantA : request.variantB,
    winner,
    tone: winner === "A" ? "blue" : "violet",
  };
}

export default function DecisionBrief({ summary, request }: Props) {
  const rec = pickRecommendation(summary, request);
  const risks = topRisks(summary);
  const actions = summary.recommendedCopies.slice(0, 3);
  const confidence = summary.confidence;
  const cautionSignals = summary.cautionSignals ?? [];
  const relevanceMix = summary.relevanceMix;

  const toneMap = {
    blue: {
      shell: "border-blue-200 bg-blue-50/60",
      badge: "bg-blue-600 text-white",
      title: "text-blue-700",
    },
    violet: {
      shell: "border-violet-200 bg-violet-50/60",
      badge: "bg-violet-600 text-white",
      title: "text-violet-700",
    },
    emerald: {
      shell: "border-emerald-200 bg-emerald-50/60",
      badge: "bg-emerald-600 text-white",
      title: "text-emerald-700",
    },
    amber: {
      shell: "border-amber-200 bg-amber-50/60",
      badge: "bg-amber-500 text-white",
      title: "text-amber-700",
    },
    slate: {
      shell: "border-slate-200 bg-slate-50",
      badge: "bg-slate-700 text-white",
      title: "text-slate-700",
    },
  } as const;
  const tone = toneMap[rec.tone as keyof typeof toneMap];
  const confidenceTone = confidence?.level === "high"
    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
    : confidence?.level === "medium"
      ? "bg-amber-100 text-amber-700 border-amber-200"
      : "bg-rose-100 text-rose-700 border-rose-200";

  return (
    <div className="space-y-4">
      <Card className={tone.shell}>
        <CardContent className="pt-5 pb-5 space-y-4">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <span className={`inline-flex text-[11px] font-bold px-2.5 py-1 rounded-full ${tone.badge}`}>
                {rec.badge}
              </span>
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                리스크 탐지용 결과
              </span>
              {confidence && (
                <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${confidenceTone}`}>
                  {confidence.label}
                </span>
              )}
            </div>
            <h2 className={`text-2xl font-bold ${tone.title}`}>{rec.title}</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{rec.body}</p>
          </div>

          <div className="rounded-2xl border border-white bg-white/90 px-5 py-5 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">{rec.selectedLabel}</p>
            <p className="text-lg font-semibold leading-relaxed text-slate-800">{rec.selectedText}</p>
          </div>

          <div className="grid gap-3 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-xl border border-white bg-white/80 px-4 py-3">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">해석 가이드</p>
              <p className="text-sm text-slate-700 leading-relaxed">
                {confidence?.description ?? "이 결과는 정답 예측이 아니라 출시 전 리스크를 먼저 드러내기 위한 신호입니다."}
              </p>
              {relevanceMix && (
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  타깃 적합도 분포: high {relevanceMix.high.toFixed(0)}% · medium {relevanceMix.medium.toFixed(0)}% · low {relevanceMix.low.toFixed(0)}%
                </p>
              )}
            </div>
            <div className="rounded-xl border border-white bg-white/80 px-4 py-3">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">바로 적용할 수정 방향</p>
              <ul className="space-y-2">
                {actions.length > 0 ? actions.map((action, index) => (
                  <li key={index} className="text-sm text-slate-700 leading-relaxed">
                    {action}
                  </li>
                )) : (
                  <li className="text-sm text-slate-400">수정 방향이 아직 충분히 정리되지 않았습니다.</li>
                )}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <ImprovementGenerator
        productDescription={request.productDescription}
        targetCustomer={request.targetCustomer}
        marketType={request.marketType}
        usageContext={request.usageContext}
        inputType={request.inputType}
        decisionMode={request.decisionMode}
        variantA={request.variantA}
        variantB={request.variantB}
        winner={summary.winner}
        topConcerns={summary.topConcerns}
        recommendedCopies={summary.recommendedCopies}
        oneParagraphInsight={summary.oneParagraphInsight}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Card className="border-red-100">
          <CardContent className="pt-4 pb-4">
            <p className="text-xs font-semibold text-red-600 mb-2">가장 큰 우려 포인트</p>
            <ul className="space-y-2">
              {risks.length > 0 ? risks.map((risk, index) => (
                <li key={index} className="text-sm text-slate-700 leading-relaxed">
                  {risk}
                </li>
              )) : (
                <li className="text-sm text-slate-400">뚜렷한 우려 포인트가 없습니다.</li>
              )}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-slate-100">
          <CardContent className="pt-4 pb-4">
            <p className="text-xs font-semibold text-slate-600 mb-2">주의해서 읽을 점</p>
            <ul className="space-y-2">
              {cautionSignals.length > 0 ? cautionSignals.slice(0, 3).map((signal) => (
                <li key={signal.code} className="text-sm text-slate-700 leading-relaxed">
                  <span className="font-semibold">{signal.label}</span> · {signal.description}
                </li>
              )) : (
                <li className="text-sm text-slate-400">현재 결과에서는 큰 경고 신호가 적습니다.</li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
