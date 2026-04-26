"use client";
import { useState } from "react";
import { SimulationRequest, SimulationResponse } from "@/lib/types";
import { DEFAULT_DEMO_SCENARIO, DEMO_SCENARIOS } from "@/data/demo-scenarios";

// Landing
import HeroSection from "@/components/landing/HeroSection";
import ProblemSection from "@/components/landing/ProblemSection";
import ValueSection from "@/components/landing/ValueSection";
import PreviewSection from "@/components/landing/PreviewSection";
import TargetSection from "@/components/landing/TargetSection";
import CTASection from "@/components/landing/CTASection";

// Flow
import FlowContainer from "@/components/flow/FlowContainer";

// Results
import ResultSummary from "@/components/result-summary";
import ScoreChart from "@/components/score-chart";
import SegmentTable from "@/components/segment-table";
import InsightCards from "@/components/insight-cards";
import PersonaCard from "@/components/persona-card";
import RiskRadar from "@/components/risk-radar";
import TypeResultModule from "@/components/type-result-module";
import DecisionBrief from "@/components/decision-brief";
import UnexpectedSignals from "@/components/unexpected-signals";
import LoadingState from "@/components/loading-state";

type Phase = "landing" | "flow" | "results";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("landing");
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
      setPhase("results");
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  function handleDemoMode() {
    const scenario = DEMO_SCENARIOS.find((item) => item.id === selectedDemoId) ?? DEFAULT_DEMO_SCENARIO;
    setDemoMode(true);
    setRequest(scenario.request);
    setResult(scenario.response);
    setError(null);
    setPhase("results");
  }

  function handleDemoScenarioSelect(id: string) {
    const scenario = DEMO_SCENARIOS.find((item) => item.id === id);
    if (!scenario) return;
    setSelectedDemoId(id);
    setRequest(scenario.request);
    if (demoMode) setResult(scenario.response);
  }

  function handleBackToFlow() {
    setPhase("flow");
    setResult(null);
    setError(null);
    setDemoMode(false);
  }

  // --- Landing Phase ---
  if (phase === "landing") {
    return (
      <div className="bg-white">
        <HeroSection onStart={() => setPhase("flow")} onDemo={handleDemoMode} />
        <ProblemSection />
        <ValueSection />
        <PreviewSection />
        <TargetSection />
        <CTASection onStart={() => setPhase("flow")} onDemo={handleDemoMode} />
      </div>
    );
  }

  // --- Flow Phase ---
  if (phase === "flow") {
    return (
      <FlowContainer
        request={request}
        onChange={setRequest}
        loading={loading}
        error={error}
        selectedDemoId={selectedDemoId}
        onDemoSelect={handleDemoScenarioSelect}
        onDemoMode={handleDemoMode}
        onRun={handleRun}
        onBack={() => setPhase("landing")}
      />
    );
  }

  // --- Results Phase ---
  return (
    <div className="min-h-screen bg-slate-50 font-[var(--font-geist-sans)]">
      <header className="h-14 border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">PS</span>
          </div>
          <span className="font-bold text-slate-800 text-sm">Persona Signal</span>
          {demoMode && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
              Demo
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleBackToFlow}
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
          >
            ← 다시 설정
          </button>
          <button
            onClick={handleDemoMode}
            className="text-xs px-3 py-1.5 rounded-lg border border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors font-medium"
          >
            ⚡ 데모 모드
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {loading && <LoadingState />}

        {!loading && result && (
          <div className="space-y-6">
            <DecisionBrief summary={result.summary} request={request} />
            <ResultSummary summary={result.summary} variantA={request.variantA} variantB={request.variantB} />

            {result.summary.unexpectedSignals && result.summary.unexpectedSignals.length > 0 && (
              <Section title="놓치기 쉬운 신호" highlight>
                <UnexpectedSignals signals={result.summary.unexpectedSignals} />
              </Section>
            )}

            {result.summary.typeAxesA && (
              <Section title="타입별 심층 해석" highlight>
                <TypeResultModule
                  inputType={result.summary.inputType ?? "copy"}
                  axesA={result.summary.typeAxesA}
                  axesB={result.summary.typeAxesB}
                />
              </Section>
            )}

            {result.summary.segmentBreakdown.length > 0 && (
              <Section title="세그먼트별 차이" highlight>
                <SegmentTable
                  breakdown={result.summary.segmentBreakdown}
                  insights={result.summary.segmentInsights}
                  winner={result.summary.winner}
                />
              </Section>
            )}

            {result.summary.riskAxesA && (
              <Section title={result.summary.riskAxesB ? "공통 평가축 비교" : "공통 평가축 분석"}>
                <RiskRadar
                  axesA={result.summary.riskAxesA}
                  axesB={result.summary.riskAxesB}
                  inputType={result.summary.inputType ?? "copy"}
                />
              </Section>
            )}

            <Section title={result.summary.decisionMode === "review" ? "반응 분포" : "페르소나별 차이"}>
              <ScoreChart
                results={result.personas}
                decisionMode={result.summary.decisionMode}
                inputType={result.summary.inputType ?? "copy"}
              />
            </Section>

            <Section title="세부 인사이트">
              <InsightCards summary={result.summary} />
            </Section>

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

            <p className="text-xs text-slate-300 text-center pb-4">
              데이터: NVIDIA Nemotron-Personas-Korea (CC BY 4.0) · 이 결과는 AI 시뮬레이션이며 실제 설문을 대체하지 않습니다
            </p>
          </div>
        )}
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
