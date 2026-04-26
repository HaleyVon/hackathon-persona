import { SimulationRequest, SimulationSummary } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { formatRecommendationBadge, getInputTypeCopy, getSelectionLabel, getVariantLabel, toDisplayRiskAxes } from "@/lib/display";

interface Props {
  summary: SimulationSummary;
  request: SimulationRequest;
}

type MetricTone = "blue" | "violet" | "emerald" | "amber";
type MetricChipData = {
  label: string;
  value: string;
  tone: MetricTone;
};

const AXIS_LABELS = {
  clarity: "명확성",
  trust: "신뢰도",
  acceptance: "수용도",
  appeal: "매력도",
  comprehension: "이해도",
} as const;

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
    title: `${getVariantLabel(inputType, winner)}로 진행하는 편이 더 안전합니다.`,
    body:
      trust < 3 || confusion > 3
        ? `${getVariantLabel(inputType, winner)}가 ${getVariantLabel(inputType, rival)}보다 낫지만 일부 보완이 필요합니다.`
        : `${getVariantLabel(inputType, winner)}가 더 명확하고 설득력 있게 받아들여집니다.`,
    selectedLabel: getSelectionLabel(inputType, decisionMode),
    selectedText: winner === "A" ? request.variantA : request.variantB,
    winner,
    tone: winner === "A" ? "blue" : "violet",
  };
}

function buildVerdictLine(summary: SimulationSummary, request: SimulationRequest): string {
  const inputType = summary.inputType ?? request.inputType;
  const decisionMode = summary.decisionMode ?? request.decisionMode;
  const axesA = summary.riskAxesA ? toDisplayRiskAxes(summary.riskAxesA) : undefined;
  const axesB = summary.riskAxesB ? toDisplayRiskAxes(summary.riskAxesB) : undefined;
  const keys = ["clarity", "trust", "acceptance", "appeal", "comprehension"] as const;

  if (!axesA) {
    return summary.oneParagraphInsight || "현재 결과는 출시 전 리스크를 빠르게 확인하기 위한 판단 신호입니다.";
  }

  if (decisionMode === "review" || !axesB) {
    const ranked = keys
      .map((key) => ({ key, value: axesA[key] }))
      .sort((a, b) => b.value - a.value);
    return `가장 강한 신호는 ${AXIS_LABELS[ranked[0].key]}이고, 먼저 보완할 지점은 ${AXIS_LABELS[ranked[ranked.length - 1].key]}입니다.`;
  }

  if (summary.winner === "Tie") {
    return "두 안의 우열은 작습니다. 장점을 합쳐 새 안을 만들고, 가장 약한 지표를 먼저 보완하는 편이 낫습니다.";
  }

  const winner = summary.winner;
  const rival = winner === "A" ? "B" : "A";
  const winnerAxes = winner === "A" ? axesA : axesB;
  const rivalAxes = winner === "A" ? axesB : axesA;
  const deltas = keys
    .map((key) => ({ key, delta: winnerAxes[key] - rivalAxes[key] }))
    .sort((a, b) => b.delta - a.delta);
  const winnerStrengths = deltas.filter((item) => item.delta > 0.15).slice(0, 2);
  const rivalStrength = deltas.filter((item) => item.delta < -0.15).sort((a, b) => a.delta - b.delta)[0];
  const strongest = winnerStrengths.length > 0
    ? winnerStrengths.map((item) => AXIS_LABELS[item.key]).join("과 ")
    : "전반 반응";
  const rivalClause = rivalStrength
    ? `${getVariantLabel(inputType, rival)}은 ${AXIS_LABELS[rivalStrength.key]}에서 일부 강점이 있지만`
    : `${getVariantLabel(inputType, rival)}은 뚜렷한 우세 지표가 약하고`;

  return `${getVariantLabel(inputType, winner)}은 ${strongest}에서 우세했고, ${rivalClause} 행동으로 이어지는 설득력은 약했습니다.`;
}

function buildMetricChips(summary: SimulationSummary, request: SimulationRequest): MetricChipData[] {
  const inputType = summary.inputType ?? request.inputType;
  const decisionMode = summary.decisionMode ?? request.decisionMode;
  const axesA = summary.riskAxesA ? toDisplayRiskAxes(summary.riskAxesA) : undefined;
  const axesB = summary.riskAxesB ? toDisplayRiskAxes(summary.riskAxesB) : undefined;

  if (!axesA) return [];

  const metrics = [
    { key: "clarity", label: "명확성" },
    { key: "trust", label: "신뢰도" },
    { key: "acceptance", label: "수용도" },
  ] as const;

  if (decisionMode === "review" || !axesB) {
    return metrics.map(({ key, label }) => ({
      label,
      value: `${axesA[key].toFixed(1)}/5`,
      tone: axesA[key] >= 3.5 ? "emerald" : "amber",
    }));
  }

  return metrics.map(({ key, label }) => {
    const winner = axesA[key] >= axesB[key] ? "A" : "B";
    const delta = Math.abs(axesA[key] - axesB[key]);
    return {
      label,
      value: `${getVariantLabel(inputType, winner)} 우세 +${delta.toFixed(1)}`,
      tone: winner === "A" ? "blue" : "violet",
    };
  });
}

export default function DecisionBrief({ summary, request }: Props) {
  const rec = pickRecommendation(summary, request);
  const verdictLine = buildVerdictLine(summary, request);
  const actions = summary.recommendedCopies.slice(0, 3);
  const confidence = summary.confidence;
  const cautionSignals = summary.cautionSignals ?? [];
  const metricChips = buildMetricChips(summary, request);

  const toneMap = {
    blue: {
      accent: "border-cyan-600",
      badge: "bg-slate-950 text-white",
      title: "text-slate-950",
    },
    violet: {
      accent: "border-indigo-600",
      badge: "bg-slate-950 text-white",
      title: "text-slate-950",
    },
    emerald: {
      accent: "border-slate-950",
      badge: "bg-slate-950 text-white",
      title: "text-slate-950",
    },
    amber: {
      accent: "border-amber-500",
      badge: "bg-amber-500 text-white",
      title: "text-slate-950",
    },
    slate: {
      accent: "border-slate-500",
      badge: "bg-slate-700 text-white",
      title: "text-slate-950",
    },
  } as const;
  const tone = toneMap[rec.tone as keyof typeof toneMap];
  const confidenceTone = confidence?.level === "high"
    ? "bg-white text-slate-700 border-slate-300"
    : confidence?.level === "medium"
      ? "bg-white text-slate-700 border-slate-300"
      : "bg-amber-50 text-amber-800 border-amber-200";

  return (
    <Card className={`border-slate-200 bg-white shadow-sm ${tone.accent} border-l-4`}>
      <CardContent className="space-y-6 px-6 pt-6 pb-6 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">Decision memo</p>
            <p className="mt-1 text-xs font-medium text-slate-500">Persona-based pre-validation result</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold ${tone.badge}`}>
              {rec.badge}
            </span>
            {confidence && (
              <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold ${confidenceTone}`}>
                {confidence.label}
              </span>
            )}
            {cautionSignals.slice(0, 2).map((signal) => (
              <span
                key={signal.code}
                className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-800"
                title={signal.description}
              >
                {signal.label}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h2 className={`text-3xl font-bold leading-tight sm:text-4xl ${tone.title}`}>{rec.title}</h2>
          <p className="max-w-4xl text-lg font-semibold leading-relaxed text-slate-700">{verdictLine}</p>
        </div>

        <div className="grid gap-6 border-y border-slate-200 py-5 lg:grid-cols-[1.4fr_0.8fr]">
          <div>
            <p className="mb-2 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">{rec.selectedLabel}</p>
            <p className="text-xl font-semibold leading-relaxed text-slate-900">{rec.selectedText}</p>
          </div>
          <div className="lg:border-l lg:border-slate-200 lg:pl-6">
            <p className="mb-2 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Revision priority</p>
            <p className="text-base font-semibold leading-relaxed text-slate-800">
              {actions[0] ?? "현재 결과에서는 뚜렷한 수정 방향이 충분히 정리되지 않았습니다."}
            </p>
          </div>
        </div>

        {metricChips.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {metricChips.map((chip) => (
              <MetricChip key={chip.label} label={chip.label} value={chip.value} tone={chip.tone} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MetricChip({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: MetricTone;
}) {
  const tones = {
    blue: "border-cyan-200 bg-white text-cyan-800",
    violet: "border-indigo-200 bg-white text-indigo-800",
    emerald: "border-slate-200 bg-white text-slate-800",
    amber: "border-amber-200 bg-amber-50 text-amber-800",
  } as const;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-semibold shadow-sm ${tones[tone]}`}>
      <span className="text-slate-500">{label}</span>
      <span>{value}</span>
    </span>
  );
}
