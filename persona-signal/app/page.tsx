"use client";
import { useState } from "react";
import { SimulationRequest, SimulationResponse } from "@/lib/types";
import { DEMO_REQUEST } from "@/lib/constants";
import demoData from "@/data/demo-response.json";
import InputForm from "@/components/input-form";
import EmptyState from "@/components/empty-state";
import LoadingState from "@/components/loading-state";
import ResultSummary from "@/components/result-summary";
import ScoreChart from "@/components/score-chart";
import SegmentTable from "@/components/segment-table";
import InsightCards from "@/components/insight-cards";
import PersonaCard from "@/components/persona-card";

export default function Home() {
  const [request, setRequest] = useState<SimulationRequest>(DEMO_REQUEST);
  const [result, setResult] = useState<SimulationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRun() {
    if (!request.productDescription || !request.variantA || !request.variantB) {
      setError("제품 설명과 A/B 카피를 모두 입력해주세요.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "시뮬레이션 실패");
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  function handleDemo() {
    setRequest(DEMO_REQUEST);
    setError(null);
  }

  function handleDemoMode() {
    setRequest(DEMO_REQUEST);
    setResult(demoData as SimulationResponse);
    setError(null);
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 font-[var(--font-geist-sans)]">
      {/* Header */}
      <header className="h-14 border-b border-slate-200 bg-white px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">PS</span>
          </div>
          <div>
            <span className="font-bold text-slate-800 text-sm">Persona Signal</span>
            <span className="hidden sm:inline text-xs text-slate-400 ml-2">
              한국인 합성 페르소나 기반 AI 메시지 검증 도구
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDemoMode}
            disabled={loading}
            className="text-xs px-3 py-1.5 rounded-lg border border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors disabled:opacity-50 font-medium"
          >
            ⚡ 데모 모드
          </button>
          <button
            onClick={handleDemo}
            disabled={loading}
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            데모 데이터 채우기
          </button>
          <button
            onClick={handleRun}
            disabled={loading}
            className="text-xs px-4 py-1.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-1.5"
          >
            {loading ? (
              <>
                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                시뮬레이션 중...
              </>
            ) : (
              "▶ 시뮬레이션 실행"
            )}
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left — Input */}
        <div className="w-[38%] min-w-[320px] border-r border-slate-200 bg-white overflow-y-auto p-5">
          <InputForm value={request} onChange={setRequest} loading={loading} />
        </div>

        {/* Right — Results */}
        <div className="flex-1 overflow-y-auto p-5">
          {error && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 flex items-start gap-3">
              <span className="text-red-400 text-sm mt-0.5">⚠</span>
              <div>
                <p className="text-sm font-semibold text-red-700">시뮬레이션 실패</p>
                <p className="text-xs text-red-500 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {loading && <LoadingState />}
          {!loading && !result && !error && <EmptyState />}

          {!loading && result && (
            <div className="space-y-6">
              {/* KPI 카드 */}
              <ResultSummary
                summary={result.summary}
                variantA={request.variantA}
                variantB={request.variantB}
              />

              {/* 차트 */}
              <Section title="구매의향 비교">
                <ScoreChart
                  results={result.personas}
                  avgScoreA={result.summary.avgScoreA}
                  avgScoreB={result.summary.avgScoreB}
                />
              </Section>

              {/* 세그먼트 분화 — 와우 모먼트 */}
              {result.summary.segmentBreakdown.length > 0 && (
                <Section title="세그먼트별 선호도" highlight>
                  <SegmentTable breakdown={result.summary.segmentBreakdown} />
                </Section>
              )}

              {/* 인사이트 */}
              <Section title="AI 인사이트">
                <InsightCards summary={result.summary} />
              </Section>

              {/* 페르소나 카드 */}
              <Section title={`페르소나 반응 (${result.personas.length}명)`}>
                <div className="space-y-3">
                  {result.personas.map((r, i) => (
                    <PersonaCard key={i} result={r} index={i} />
                  ))}
                </div>
              </Section>

              {/* 데이터 출처 */}
              <p className="text-xs text-slate-300 text-center pb-4">
                데이터: NVIDIA Nemotron-Personas-Korea (CC BY 4.0) · 이 결과는 AI 시뮬레이션이며 실제 설문을 대체하지 않습니다
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({
  title, children, highlight,
}: {
  title: string; children: React.ReactNode; highlight?: boolean;
}) {
  return (
    <div className={`rounded-xl border p-4 bg-white ${highlight ? "border-blue-200 shadow-sm shadow-blue-50" : "border-slate-100"}`}>
      <h3 className={`text-xs font-bold mb-3 uppercase tracking-wider ${highlight ? "text-blue-600" : "text-slate-400"}`}>
        {title}
      </h3>
      {children}
    </div>
  );
}
