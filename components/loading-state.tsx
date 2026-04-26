"use client";
import { useEffect, useState } from "react";

const STEPS = [
  "타겟 조건에 맞는 페르소나를 찾는 중...",
  "선택한 안건에 대한 반응을 시뮬레이션하는 중...",
  "결과를 집계하는 중...",
];

export default function LoadingState() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 2500);
    const t2 = setTimeout(() => setStep(2), 7000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8">
      {/* 스켈레톤 카드 3개 */}
      <div className="w-full max-w-lg space-y-3 px-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-xl bg-slate-100 animate-pulse" />
        ))}
      </div>

      {/* 진행 상태 */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-500 ${
                i <= step ? "bg-blue-500 scale-110" : "bg-slate-200"
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-slate-500 animate-pulse">{STEPS[step]}</p>
      </div>
    </div>
  );
}
