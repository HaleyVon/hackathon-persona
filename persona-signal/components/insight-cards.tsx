import { SimulationSummary } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  summary: SimulationSummary;
}

const CARDS = [
  {
    key: "topLikedPoints" as const,
    title: "왜 좋아했는가",
    icon: "👍",
    color: "emerald",
  },
  {
    key: "topConcerns" as const,
    title: "왜 망설였는가",
    icon: "⚠️",
    color: "amber",
  },
  {
    key: "recommendedCopies" as const,
    title: "카피 개선 제안",
    icon: "✏️",
    color: "blue",
  },
] as const;

export default function InsightCards({ summary }: Props) {
  return (
    <div className="space-y-3">
      {/* 전체 인사이트 */}
      <div className="rounded-xl bg-slate-800 text-white px-4 py-3">
        <p className="text-xs text-slate-400 mb-1">전체 인사이트</p>
        <p className="text-sm leading-relaxed">{summary.oneParagraphInsight}</p>
      </div>

      {/* 3개 카드 */}
      <div className="grid grid-cols-3 gap-3">
        {CARDS.map(({ key, title, icon }) => (
          <Card key={key} className="border-slate-100">
            <CardContent className="pt-3 pb-3">
              <p className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1">
                <span>{icon}</span> {title}
              </p>
              <ul className="space-y-1">
                {(summary[key] ?? []).slice(0, 3).map((item, i) => (
                  <li key={i} className="text-xs text-slate-600 leading-relaxed flex gap-1.5">
                    <span className="text-slate-300 shrink-0 mt-0.5">·</span>
                    <span>{item}</span>
                  </li>
                ))}
                {!(summary[key]?.length) && (
                  <li className="text-xs text-slate-300">데이터 없음</li>
                )}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
