"use client";

import { useState } from "react";
import { ImprovementOption, InputType, MarketType } from "@/lib/types";

interface Props {
  productDescription: string;
  targetCustomer: string;
  marketType: MarketType;
  usageContext: string;
  inputType: InputType;
  decisionMode: "compare" | "review";
  variantA: string;
  variantB?: string;
  winner?: "A" | "B" | "Tie";
  topConcerns: string[];
  recommendedCopies: string[];
  oneParagraphInsight: string;
}

export default function ImprovementGenerator(props: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<ImprovementOption[] | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(props),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "개선안 생성 실패");
      setOptions(data.options ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "개선안 생성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/90 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-slate-700">피드백을 반영한 개선안 생성</p>
          <p className="text-xs text-slate-500">현재 결과의 우려 포인트를 반영해 실제로 쓸 수 있는 개선안을 3개 만듭니다.</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="shrink-0 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-50"
        >
          {loading ? "생성 중..." : "개선안 3개 생성"}
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600">
          {error}
        </div>
      )}

      {options && options.length > 0 && (
        <div className="grid gap-3 lg:grid-cols-3">
          {options.map((option, index) => (
            <div key={`${option.strategy}-${index}`} className="rounded-xl border border-slate-200 bg-white px-4 py-4">
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600">
                  {option.strategy}
                </span>
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-[11px] font-semibold ${
                    option.improved === false
                      ? "bg-amber-100 text-amber-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {option.improved === false ? "추가 보완 필요" : "원문 대비 개선"}
                </span>
              </div>
              <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-800">
                {option.content}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                {option.rationale}
              </p>
              {option.improvementDelta && (
                <div className="mt-3 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2">
                  <p className="text-[11px] font-semibold text-emerald-700">개선 포인트</p>
                  <p className="mt-1 text-xs leading-relaxed text-emerald-900">{option.improvementDelta}</p>
                </div>
              )}
              {option.remainingIssues && option.remainingIssues.length > 0 && (
                <div className="mt-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                  <p className="text-[11px] font-semibold text-slate-600">남은 이슈</p>
                  <ul className="mt-1 space-y-1">
                    {option.remainingIssues.slice(0, 2).map((issue, issueIndex) => (
                      <li key={issueIndex} className="text-xs leading-relaxed text-slate-500">
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
