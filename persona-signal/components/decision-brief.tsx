import { SimulationSummary } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  summary: SimulationSummary;
  variantA: string;
  variantB: string;
}

function topRisks(summary: SimulationSummary): string[] {
  return summary.topConcerns.slice(0, 2);
}

function recommendation(summary: SimulationSummary, variantA: string, variantB: string) {
  const mode = summary.decisionMode ?? "compare";

  if (mode === "review") {
    const trust = summary.riskAxesA?.trust ?? 3;
    const confusion = summary.riskAxesA?.confusionRisk ?? 3;
    const needsRevision = trust < 3 || confusion > 3 || summary.avgScoreA < 3.4;
    return {
      badge: needsRevision ? "수정 후 검토 권장" : "진행 가능",
      title: needsRevision ? "현재 안은 수정 후 다시 검토하는 편이 안전합니다." : "현재 안은 큰 리스크 없이 진행 가능합니다.",
      body: needsRevision
        ? `신뢰도 ${trust.toFixed(1)}/5, 혼란도 ${confusion.toFixed(1)}/5 기준으로 보면 바로 배포하기보다 문구를 다듬는 편이 낫습니다.`
        : `사용 의향 ${summary.avgScoreA.toFixed(1)}/5 기준으로 전반 반응은 양호합니다. 다만 실제 배포 전 표현을 한 번 더 다듬는 것이 좋습니다.`,
      selectedCopy: variantA,
      tone: needsRevision ? "amber" : "emerald",
    };
  }

  const winner = summary.winner;
  const trustA = summary.riskAxesA?.trust ?? 3;
  const trustB = summary.riskAxesB?.trust ?? 3;
  const confusionA = summary.riskAxesA?.confusionRisk ?? 3;
  const confusionB = summary.riskAxesB?.confusionRisk ?? 3;
  const selectedCopy = winner === "A" ? variantA : variantB;

  if (winner === "Tie") {
    return {
      badge: "추가 검증 필요",
      title: "두 안의 차이가 작아 한 번 더 정제하거나 좁은 타깃 검증이 필요합니다.",
      body: "현재 점수 차이만으로는 명확한 우위를 말하기 어렵습니다. 가장 큰 혼란 포인트를 먼저 줄인 뒤 다시 비교하는 편이 낫습니다.",
      selectedCopy: `${variantA} / ${variantB}`,
      tone: "slate",
    };
  }

  const winnerTrust = winner === "A" ? trustA : trustB;
  const winnerConfusion = winner === "A" ? confusionA : confusionB;
  const rival = winner === "A" ? "B" : "A";

  return {
    badge: `카피 ${winner} 추천`,
    title: `우선은 카피 ${winner}로 진행하는 편이 더 안전합니다.`,
    body:
      winnerTrust < 3 || winnerConfusion > 3
        ? `카피 ${winner}가 더 낫지만 신뢰/혼란 리스크가 아직 남아 있습니다. 카피 ${rival} 대비 우세하더라도 바로 확정하기보다 표현을 다듬는 것이 좋습니다.`
        : `카피 ${winner}는 카피 ${rival}보다 이해도와 설득력이 안정적입니다. 현재 단계에서는 이 안을 기준안으로 삼고 후속 실험을 설계하는 편이 좋습니다.`,
    selectedCopy,
    tone: "blue",
  };
}

export default function DecisionBrief({ summary, variantA, variantB }: Props) {
  const rec = recommendation(summary, variantA, variantB);
  const risks = topRisks(summary);
  const actions = summary.recommendedCopies.slice(0, 3);

  const toneMap = {
    blue: {
      shell: "border-blue-200 bg-blue-50/60",
      badge: "bg-blue-600 text-white",
      title: "text-blue-700",
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

  return (
    <div className="space-y-4">
      <Card className={tone.shell}>
        <CardContent className="pt-5 pb-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <span className={`inline-flex text-[11px] font-bold px-2.5 py-1 rounded-full ${tone.badge}`}>
                {rec.badge}
              </span>
              <h2 className={`text-xl font-bold ${tone.title}`}>{rec.title}</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{rec.body}</p>
            </div>
          </div>
          <div className="mt-4 rounded-xl bg-white/80 border border-white px-4 py-3">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">기준안</p>
            <p className="text-sm text-slate-700 leading-relaxed">{rec.selectedCopy}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <Card className="border-red-100">
          <CardContent className="pt-4 pb-4">
            <p className="text-xs font-semibold text-red-600 mb-2">가장 큰 리스크</p>
            <ul className="space-y-2">
              {risks.length > 0 ? risks.map((risk, index) => (
                <li key={index} className="text-sm text-slate-700 leading-relaxed">
                  {risk}
                </li>
              )) : (
                <li className="text-sm text-slate-400">뚜렷한 리스크가 없습니다.</li>
              )}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-emerald-100">
          <CardContent className="pt-4 pb-4">
            <p className="text-xs font-semibold text-emerald-600 mb-2">공통 호감 포인트</p>
            <ul className="space-y-2">
              {summary.topLikedPoints.slice(0, 2).map((point, index) => (
                <li key={index} className="text-sm text-slate-700 leading-relaxed">
                  {point}
                </li>
              ))}
              {summary.topLikedPoints.length === 0 && (
                <li className="text-sm text-slate-400">공통 호감 포인트가 적습니다.</li>
              )}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-blue-100">
          <CardContent className="pt-4 pb-4">
            <p className="text-xs font-semibold text-blue-600 mb-2">바로 수정할 제안</p>
            <ul className="space-y-2">
              {actions.length > 0 ? actions.map((action, index) => (
                <li key={index} className="text-sm text-slate-700 leading-relaxed">
                  {action}
                </li>
              )) : (
                <li className="text-sm text-slate-400">수정 제안이 없습니다.</li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
