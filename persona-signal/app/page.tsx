"use client";
import { useState } from "react";
import { SimulationRequest, SimulationResponse } from "@/lib/types";
import { DEFAULT_DEMO_SCENARIO, DEMO_SCENARIOS } from "@/data/demo-scenarios";
import InputForm from "@/components/input-form";
import EmptyState from "@/components/empty-state";
import LoadingState from "@/components/loading-state";
import ResultSummary from "@/components/result-summary";
import ScoreChart from "@/components/score-chart";
import SegmentTable from "@/components/segment-table";
import InsightCards from "@/components/insight-cards";
import PersonaCard from "@/components/persona-card";
import RiskRadar from "@/components/risk-radar";
import TypeResultModule from "@/components/type-result-module";
import DecisionBrief from "@/components/decision-brief";
import UnexpectedSignals from "@/components/unexpected-signals";

export default function Home() {
  const [request, setRequest] = useState<SimulationRequest>(DEFAULT_DEMO_SCENARIO.request);
  const [result, setResult] = useState<SimulationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDemoId, setSelectedDemoId] = useState(DEFAULT_DEMO_SCENARIO.id);
  const [demoMode, setDemoMode] = useState(false);

  async function handleRun() {
    const isReview = request.decisionMode === "review";
    if (!request.productDescription || !request.targetCustomer || !request.variantA) {
      setError("제품 설명, 주 타깃 고객, 검토 내용을 입력해주세요.");
      return;
    }
    if (!isReview && !request.variantB) {
      setError("A/B 비교 모드에서는 두 번째 안도 입력해주세요.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    setDemoMode(false);
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
    setRequest(DEFAULT_DEMO_SCENARIO.request);
    setSelectedDemoId(DEFAULT_DEMO_SCENARIO.id);
    setDemoMode(false);
    setResult(null);
    setError(null);
  }

  function handleDemoMode() {
    const scenario = DEMO_SCENARIOS.find((item) => item.id === selectedDemoId) ?? DEFAULT_DEMO_SCENARIO;
    setDemoMode(true);
    setRequest(scenario.request);
    setResult(scenario.response);
    setError(null);
  }

  function handleDemoScenarioSelect(id: string) {
    const scenario = DEMO_SCENARIOS.find((item) => item.id === id);
    if (!scenario) return;
    setSelectedDemoId(id);
    setRequest(scenario.request);
    if (demoMode) {
      setResult(scenario.response);
    }
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
              타깃 페르소나 기반 pre-validation tool
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
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">데모 케이스</p>
                <p className="text-sm text-amber-900">메시지·가격·기능 케이스를 바로 불러와 결과를 비교할 수 있습니다.</p>
              </div>
              {demoMode && (
                <span className="rounded-full bg-amber-200 px-2 py-1 text-[11px] font-semibold text-amber-800">
                  Demo On
                </span>
              )}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {DEMO_SCENARIOS.map((scenario) => (
                <button
                  key={scenario.id}
                  onClick={() => handleDemoScenarioSelect(scenario.id)}
                  disabled={loading}
                  className={`rounded-xl border px-3 py-2 text-left transition-colors ${
                    selectedDemoId === scenario.id
                      ? "border-amber-400 bg-white text-amber-900"
                      : "border-amber-200 bg-white/70 text-slate-600 hover:border-amber-300"
                  }`}
                >
                  <div className="text-xs font-semibold">{scenario.label}</div>
                  <div className="mt-1 text-[11px] leading-tight text-slate-400">{scenario.description}</div>
                </button>
              ))}
            </div>
          </div>
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
              <DecisionBrief summary={result.summary} request={request} />

              {/* KPI 카드 */}
              <ResultSummary
                summary={result.summary}
                variantA={request.variantA}
                variantB={request.variantB}
              />

              {result.summary.unexpectedSignals && result.summary.unexpectedSignals.length > 0 && (
                <Section title="놓치기 쉬운 신호" highlight>
                  <UnexpectedSignals signals={result.summary.unexpectedSignals} />
                </Section>
              )}

              {/* 타입별 추가 모듈 */}
              {result.summary.typeAxesA && (
                <Section title="타입별 심층 해석" highlight>
                  <TypeResultModule
                    inputType={result.summary.inputType ?? "copy"}
                    axesA={result.summary.typeAxesA}
                    axesB={result.summary.typeAxesB}
                  />
                </Section>
              )}

              {/* 세그먼트 차이 */}
              {result.summary.segmentBreakdown.length > 0 && (
                <Section title="세그먼트별 차이" highlight>
                  <SegmentTable
                    breakdown={result.summary.segmentBreakdown}
                    insights={result.summary.segmentInsights}
                    winner={result.summary.winner}
                  />
                </Section>
              )}

              {/* 리스크 레이더 */}
              {result.summary.riskAxesA && (
                <Section title={result.summary.riskAxesB ? "공통 평가축 비교" : "공통 평가축 분석"}>
                  <RiskRadar
                    axesA={result.summary.riskAxesA}
                    axesB={result.summary.riskAxesB}
                    inputType={result.summary.inputType ?? "copy"}
                  />
                </Section>
              )}

              {/* 차트 */}
              <Section title={result.summary.decisionMode === "review" ? "반응 분포" : "페르소나별 차이"}>
                <ScoreChart
                  results={result.personas}
                  decisionMode={result.summary.decisionMode}
                  inputType={result.summary.inputType ?? "copy"}
                />
              </Section>

              {/* 세부 인사이트 */}
              <Section title="세부 인사이트">
                <InsightCards summary={result.summary} />
              </Section>

              {/* 페르소나 카드 */}
              <Section title={`페르소나 반응 (${result.personas.length}명)`}>
                <div className="space-y-3">
                  {result.personas.map((r, i) => (
                    <PersonaCard
                      key={i}
                      result={r}
                      index={i}
                      decisionMode={result.summary.decisionMode}
                      inputType={result.summary.inputType ?? "copy"}
                    />
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
