import { SegmentBreakdown, SegmentInsights } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

interface Props {
  breakdown: SegmentBreakdown[];
  insights?: SegmentInsights;
  winner?: "A" | "B" | "Tie";
}

export default function SegmentTable({ breakdown, insights, winner }: Props) {
  if (!breakdown.length) return null;

  const insightCards = [
    insights?.resistant && {
      key: "resistant",
      tone: "border-rose-100 bg-rose-50/70",
      title: "특히 거부하는 세그먼트",
      data: insights.resistant,
    },
    insights?.niche && {
      key: "niche",
      tone: "border-blue-100 bg-blue-50/70",
      title: "특히 잘 먹히는 세그먼트",
      data: insights.niche,
    },
    insights?.testFirst && {
      key: "testFirst",
      tone: "border-amber-100 bg-amber-50/70",
      title: "먼저 검증할 세그먼트",
      data: insights.testFirst,
    },
  ].filter(Boolean) as Array<{
    key: string;
    tone: string;
    title: string;
    data: NonNullable<SegmentInsights[keyof SegmentInsights]>;
  }>;

  const markerByLabel = new Map<string, string>();
  if (insights?.resistant) markerByLabel.set(insights.resistant.label, "거부 큼");
  if (insights?.niche && !markerByLabel.has(insights.niche.label)) markerByLabel.set(insights.niche.label, "반응 강함");
  if (insights?.testFirst && !markerByLabel.has(insights.testFirst.label)) markerByLabel.set(insights.testFirst.label, "먼저 검증");

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-slate-400 mb-1">세그먼트별 선호와 리스크 차이</p>
        <p className="text-sm text-slate-600 leading-relaxed">
          전체 결론이 같아도 세그먼트별로 반응은 다르게 나타납니다.
          {winner && winner !== "Tie" ? ` 특히 ${winner}안이 어디서 깨지고 어디서 강한지 확인하는 용도입니다.` : " 지금은 어느 세그먼트에서 판단이 갈리는지 먼저 보는 편이 맞습니다."}
        </p>
      </div>

      {insightCards.length > 0 && (
        <div className="grid gap-3 lg:grid-cols-3">
          {insightCards.map((card) => (
            <div key={card.key} className={`rounded-xl border px-4 py-3 ${card.tone}`}>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">{card.title}</p>
              <p className="text-sm font-semibold text-slate-700">{card.data.title}</p>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">{card.data.description}</p>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2">
        {breakdown.map((seg) => {
          const aRatio = seg.total > 0 ? seg.preferA / seg.total : 0;
          const bRatio = seg.total > 0 ? seg.preferB / seg.total : 0;
          const winner = seg.preferA > seg.preferB ? "A" : seg.preferB > seg.preferA ? "B" : null;
          const marker = markerByLabel.get(seg.label);

          return (
            <div key={seg.label} className="rounded-xl border border-slate-100 px-3 py-3">
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 shrink-0 font-medium">{seg.label}</span>
                  {marker && (
                    <Badge variant="secondary" className="bg-slate-100 text-slate-700 text-[10px] px-1.5 py-0">
                      {marker}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  {typeof seg.avgScoreA === "number" && <span>A {seg.avgScoreA.toFixed(1)}</span>}
                  {typeof seg.avgScoreB === "number" && <span>B {seg.avgScoreB.toFixed(1)}</span>}
                </div>
              </div>

              <div className="flex items-center gap-3">
              {/* 세그먼트 라벨 */}
              <span className="text-[11px] text-slate-400 w-14 shrink-0">선호</span>

              {/* 바 */}
              <div className="flex-1 flex h-5 rounded-full overflow-hidden bg-slate-100">
                {aRatio > 0 && (
                  <div
                    className="bg-blue-400 flex items-center justify-center text-white text-[10px] font-bold transition-all"
                    style={{ width: `${aRatio * 100}%` }}
                  >
                    {seg.preferA > 0 && `A`}
                  </div>
                )}
                {bRatio > 0 && (
                  <div
                    className="bg-violet-400 flex items-center justify-center text-white text-[10px] font-bold transition-all"
                    style={{ width: `${bRatio * 100}%` }}
                  >
                    {seg.preferB > 0 && `B`}
                  </div>
                )}
                {seg.tie > 0 && (
                  <div
                    className="bg-slate-300 flex items-center justify-center text-slate-600 text-[10px] transition-all"
                    style={{ width: `${(seg.tie / seg.total) * 100}%` }}
                  />
                )}
              </div>

              {/* 수치 */}
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-xs text-blue-600 font-medium">A:{seg.preferA}</span>
                <span className="text-xs text-slate-300">/</span>
                <span className="text-xs text-violet-600 font-medium">B:{seg.preferB}</span>
                {winner && (
                  <Badge
                    variant="secondary"
                    className={`text-[10px] px-1.5 py-0 ${
                      winner === "A" ? "bg-blue-100 text-blue-700" : "bg-violet-100 text-violet-700"
                    }`}
                  >
                    {winner} 선호
                  </Badge>
                )}
              </div>
            </div>
              <div className="mt-2 pl-[4.25rem] text-[11px] text-slate-500">
                {typeof seg.avgTrustA === "number" && typeof seg.avgTrustB === "number" && (
                  <span>
                    신뢰 A {seg.avgTrustA.toFixed(1)} / B {seg.avgTrustB.toFixed(1)}
                  </span>
                )}
                {typeof seg.avgConfusionA === "number" && typeof seg.avgConfusionB === "number" && (
                  <span className="ml-3">
                    혼란 A {seg.avgConfusionA.toFixed(1)} / B {seg.avgConfusionB.toFixed(1)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
