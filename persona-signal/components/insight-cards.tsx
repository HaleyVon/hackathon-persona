import { SimulationSummary } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { getInputTypeCopy } from "@/lib/display";

interface Props {
  summary: SimulationSummary;
}

export default function InsightCards({ summary }: Props) {
  const inputType = summary.inputType ?? "copy";
  const labels = getInputTypeCopy(inputType);

  return (
    <div className="space-y-3">
      {/* 해석 문장 */}
      <div className="rounded-xl bg-slate-800 text-white px-4 py-3">
        <p className="text-xs text-slate-400 mb-1">해석 메모</p>
        <p className="text-sm leading-relaxed">{summary.oneParagraphInsight}</p>
      </div>

      {/* 세부 근거 카드 */}
      <div className="grid grid-cols-3 gap-3">
        <RiskCard
          title="리스크 근거"
          icon="⚡"
          color="red"
          items={summary.topConcerns.slice(0, 3)}
          emptyMsg="리스크 근거 없음"
        />
        <RiskCard
          title="유지할 강점"
          icon="✓"
          color="emerald"
          items={summary.topLikedPoints.slice(0, 3)}
          emptyMsg="강점 포인트 없음"
        />
        <RiskCard
          title={`수정 ${labels.short} 초안`}
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
