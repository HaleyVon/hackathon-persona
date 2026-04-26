import { SimulationSummary } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  summary: SimulationSummary;
}

export default function InsightCards({ summary }: Props) {
  return (
    <div className="space-y-3">
      {/* 핵심 리스크 인사이트 */}
      <div className="rounded-xl bg-slate-800 text-white px-4 py-3">
        <p className="text-xs text-slate-400 mb-1">리스크 인사이트</p>
        <p className="text-sm leading-relaxed">{summary.oneParagraphInsight}</p>
      </div>

      {/* 3개 리스크 카드 */}
      <div className="grid grid-cols-3 gap-3">
        <RiskCard
          title="혼란 유발 표현"
          icon="⚡"
          color="red"
          items={summary.topConcerns.slice(0, 3)}
          emptyMsg="혼란 포인트 없음"
        />
        <RiskCard
          title="공통 호감 요소"
          icon="✓"
          color="emerald"
          items={summary.topLikedPoints.slice(0, 3)}
          emptyMsg="호감 포인트 없음"
        />
        <RiskCard
          title="개선 방향 제안"
          icon="→"
          color="blue"
          items={summary.recommendedCopies.slice(0, 3)}
          emptyMsg="제안 없음"
        />
      </div>
    </div>
  );
}

function RiskCard({
  title, icon, color, items, emptyMsg,
}: {
  title: string;
  icon: string;
  color: "red" | "emerald" | "blue";
  items: string[];
  emptyMsg: string;
}) {
  const colorMap = {
    red:     { icon: "text-red-500",     label: "text-red-600" },
    emerald: { icon: "text-emerald-500", label: "text-emerald-600" },
    blue:    { icon: "text-blue-500",    label: "text-blue-600" },
  };
  const c = colorMap[color];

  return (
    <Card className="border-slate-100">
      <CardContent className="pt-3 pb-3">
        <p className={`text-xs font-semibold mb-2 flex items-center gap-1 ${c.label}`}>
          <span className={c.icon}>{icon}</span> {title}
        </p>
        <ul className="space-y-1">
          {items.length > 0 ? items.map((item, i) => (
            <li key={i} className="text-xs text-slate-600 leading-relaxed flex gap-1.5">
              <span className="text-slate-300 shrink-0 mt-0.5">·</span>
              <span>{item}</span>
            </li>
          )) : (
            <li className="text-xs text-slate-300">{emptyMsg}</li>
          )}
        </ul>
      </CardContent>
    </Card>
  );
}
