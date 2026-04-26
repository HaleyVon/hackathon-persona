"use client";

import { PersonaComparisonResult } from "@/lib/types";

interface Props {
  results: PersonaComparisonResult[];
}

export default function ReviewDistributionChart({ results }: Props) {
  const total = results.length;
  const buckets = [1, 2, 3, 4, 5].map((score) => ({
    score,
    count: results.filter((result) => result.reactionA.purchaseIntent === score).length,
  }));
  const maxCount = Math.max(...buckets.map((bucket) => bucket.count), 1);
  const tone = {
    1: "bg-rose-500",
    2: "bg-orange-500",
    3: "bg-amber-500",
    4: "bg-lime-500",
    5: "bg-emerald-500",
  } as const;

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-slate-400 mb-1">반응 분포</p>
        <p className="text-sm text-slate-600 leading-relaxed">
          평균값보다 중요한 것은 분산입니다. 한쪽 점수대에 몰릴수록 메시지가 더 일관되게 받아들여졌다는 뜻입니다.
        </p>
      </div>

      <div className="rounded-xl border border-slate-100 px-4 py-4">
        <div className="mb-4 grid grid-cols-[72px_1fr_72px_72px] gap-3 text-[11px] font-semibold text-slate-400">
          <span>점수</span>
          <span>분포</span>
          <span className="text-right">인원</span>
          <span className="text-right">비율</span>
        </div>
        <div className="space-y-3">
          {buckets.map((bucket) => (
            <div key={bucket.score} className="grid grid-cols-[72px_1fr_72px_72px] items-center gap-3">
              <div className="flex items-center gap-2">
                <div
                  className={`h-3 w-3 rounded-full ${tone[bucket.score as keyof typeof tone]}`}
                />
                <span className="text-sm font-semibold text-slate-700">{bucket.score}점</span>
              </div>
              <div className="rounded-full bg-slate-100 px-1 py-1">
                <div
                  className={`h-8 rounded-full ${tone[bucket.score as keyof typeof tone]} flex items-center justify-end pr-3 text-sm font-bold text-white transition-all`}
                  style={{ width: `${Math.max((bucket.count / maxCount) * 100, bucket.count > 0 ? 18 : 0)}%` }}
                >
                  {bucket.count > 0 ? bucket.count : ""}
                </div>
              </div>
              <div className="text-right text-base font-bold text-slate-700">{bucket.count}명</div>
              <div className="text-right text-sm font-semibold text-slate-500">
                {total > 0 ? `${Math.round((bucket.count / total) * 100)}%` : "0%"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
