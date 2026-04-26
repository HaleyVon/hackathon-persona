import { SegmentBreakdown } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

interface Props {
  breakdown: SegmentBreakdown[];
}

export default function SegmentTable({ breakdown }: Props) {
  if (!breakdown.length) return null;

  return (
    <div>
      <p className="text-xs text-slate-400 mb-3">세그먼트별 선호도</p>
      <div className="space-y-2">
        {breakdown.map((seg) => {
          const aRatio = seg.total > 0 ? seg.preferA / seg.total : 0;
          const bRatio = seg.total > 0 ? seg.preferB / seg.total : 0;
          const winner = seg.preferA > seg.preferB ? "A" : seg.preferB > seg.preferA ? "B" : null;

          return (
            <div key={seg.label} className="flex items-center gap-3">
              {/* 세그먼트 라벨 */}
              <span className="text-xs text-slate-600 w-20 shrink-0 font-medium">{seg.label}</span>

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
          );
        })}
      </div>
    </div>
  );
}
