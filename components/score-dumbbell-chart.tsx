"use client";

import { PersonaComparisonResult } from "@/lib/types";
import { getVariantLabel } from "@/lib/display";

interface Props {
  results: PersonaComparisonResult[];
  inputType?: "copy" | "pricing" | "feature" | "positioning";
}

export default function ScoreDumbbellChart({ results, inputType = "copy" }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-slate-400 mb-1">페르소나별 선호 차이</p>
        <p className="text-sm text-slate-600 leading-relaxed">
          한 줄이 한 명의 반응입니다. 오른쪽으로 갈수록 긍정적이며, 두 점의 거리가 클수록 두 안의 체감 차이가 큽니다.
        </p>
      </div>

      <div className="rounded-xl border border-slate-100 px-4 py-4">
        <div className="mb-4 grid grid-cols-[120px_1fr] items-center gap-3">
          <div />
          <div className="grid grid-cols-5 text-[11px] text-slate-400">
            {[1, 2, 3, 4, 5].map((score) => (
              <span key={score} className="text-center">{score}</span>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {results.map((result, index) => {
            const left = ((result.reactionA.purchaseIntent - 1) / 4) * 100;
            const right = ((result.reactionB.purchaseIntent - 1) / 4) * 100;
            const start = Math.min(left, right);
            const width = Math.abs(left - right);

            return (
              <div key={`${result.persona.id}-${index}`} className="grid grid-cols-[120px_1fr] items-center gap-3">
                <div>
                  <p className="text-xs font-semibold text-slate-700">{result.persona.age}세 {result.persona.sex}</p>
                  <p className="text-[11px] text-slate-400">{result.persona.occupation}</p>
                </div>
                <div className="relative h-8">
                  <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-slate-200" />
                  <div
                    className="absolute top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-slate-300"
                    style={{ left: `${start}%`, width: `${Math.max(width, 1)}%` }}
                  />
                  <div
                    className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-blue-500 shadow-sm"
                    style={{ left: `${left}%` }}
                    title={`${getVariantLabel(inputType, "A")}: ${result.reactionA.purchaseIntent}/5`}
                  />
                  <div
                    className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-violet-500 shadow-sm"
                    style={{ left: `${right}%` }}
                    title={`${getVariantLabel(inputType, "B")}: ${result.reactionB.purchaseIntent}/5`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-4 text-[11px] text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-blue-500" />
            {getVariantLabel(inputType, "A")}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-violet-500" />
            {getVariantLabel(inputType, "B")}
          </span>
        </div>
      </div>
    </div>
  );
}
