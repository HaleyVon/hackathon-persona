"use client";
import { useState } from "react";
import { PersonaComparisonResult, SimulationRequest, SimulationResponse, SimulationSummary } from "@/lib/types";
import { DEFAULT_DEMO_SCENARIO, DEMO_SCENARIOS } from "@/data/demo-scenarios";
import { DISPLAY_AXIS_LABELS, getVariantLabel, toDisplayRiskAxes } from "@/lib/display";

// Landing
import HeroSection from "@/components/landing/HeroSection";
import ProblemSection from "@/components/landing/ProblemSection";
import ValueSection from "@/components/landing/ValueSection";
import PreviewSection from "@/components/landing/PreviewSection";
import TargetSection from "@/components/landing/TargetSection";
import CTASection from "@/components/landing/CTASection";
import FooterSection from "@/components/landing/FooterSection";

// Flow
import FlowContainer from "@/components/flow/FlowContainer";

// Results
import ScoreChart from "@/components/score-chart";
import SegmentTable, { SegmentInsightCards } from "@/components/segment-table";
import PersonaCard from "@/components/persona-card";
import RiskRadar from "@/components/risk-radar";
import TypeResultModule from "@/components/type-result-module";
import DecisionBrief from "@/components/decision-brief";
import UnexpectedSignals from "@/components/unexpected-signals";
import ImprovementGenerator from "@/components/improvement-generator";
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

  function handleDemoMode(id?: string) {
    const scenarioId = id ?? selectedDemoId;
    const scenario = DEMO_SCENARIOS.find((item) => item.id === scenarioId) ?? DEFAULT_DEMO_SCENARIO;
    setDemoMode(true);
    setSelectedDemoId(scenarioId);
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
      <div className="bg-white font-[var(--font-geist-sans)]">
        <HeroSection onStart={() => setPhase("flow")} onDemo={handleDemoMode} />
        <ProblemSection />
        <ValueSection />
        <PreviewSection />
        <TargetSection />
        <CTASection onStart={() => setPhase("flow")} onDemo={handleDemoMode} />
        <FooterSection />
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
    <div className="min-h-screen bg-[#f7f5ef] font-[var(--font-geist-sans)] text-slate-950">
      <header className="h-14 border-b border-slate-200 bg-white/90 px-6 flex items-center justify-between sticky top-0 z-10 backdrop-blur">
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
            onClick={() => handleDemoMode()}
            className="text-xs px-3 py-1.5 rounded-lg border border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors font-medium"
          >
            ⚡ 데모 모드
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {loading && <LoadingState />}

        {!loading && result && (
          <div className="space-y-6">
            <DecisionBrief summary={result.summary} request={request} />

            {result.summary.unexpectedSignals && result.summary.unexpectedSignals.length > 0 && (
              <UnexpectedSignals signals={result.summary.unexpectedSignals} />
            )}

            <CollapsibleSection title="근거 분석" defaultOpen>
              <div className="space-y-4">
                {result.summary.riskAxesA && (
                  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          {result.summary.riskAxesB ? "공통 평가축 비교" : "공통 평가축 분석"}
                        </p>
                        <h3 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                          핵심 판단 지표
                        </h3>
                      </div>
                      <p className="text-sm font-medium text-slate-500">
                        명확성·신뢰도·수용도가 클수록 실행 리스크가 낮습니다.
                      </p>
                    </div>
                    <RiskRadar
                      axesA={result.summary.riskAxesA}
                      axesB={result.summary.riskAxesB}
                      inputType={result.summary.inputType ?? "copy"}
                    />
                    <EvidenceHighlights summary={result.summary} request={request} />
                  </div>
                )}

                <SegmentInsightCards insights={result.summary.segmentInsights} />

                <div className={`grid gap-4 ${result.summary.segmentBreakdown.length > 0 ? "lg:grid-cols-2" : ""}`}>
                  {result.summary.segmentBreakdown.length > 0 && (
                    <SegmentTable
                      breakdown={result.summary.segmentBreakdown}
                      insights={result.summary.segmentInsights}
                      winner={result.summary.winner}
                      showInsightCards={false}
                    />
                  )}
                  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                      {result.summary.decisionMode === "review" ? "반응 분포" : "페르소나별 차이"}
                    </p>
                    <ScoreChart
                      results={result.personas}
                      decisionMode={result.summary.decisionMode}
                      inputType={result.summary.inputType ?? "copy"}
                    />
                  </div>
                </div>

                {result.summary.typeAxesA && (
                  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                      타입별 심층 해석
                    </p>
                    <TypeResultModule
                      inputType={result.summary.inputType ?? "copy"}
                      axesA={result.summary.typeAxesA}
                      axesB={result.summary.typeAxesB}
                    />
                  </div>
                )}
              </div>
            </CollapsibleSection>

            <Section title="개선안 생성">
              <ImprovementGenerator
                productDescription={request.productDescription}
                targetCustomer={request.targetCustomer}
                marketType={request.marketType}
                usageContext={request.usageContext}
                inputType={request.inputType}
                decisionMode={request.decisionMode}
                variantA={request.variantA}
                variantB={request.variantB}
                winner={result.summary.winner}
                topConcerns={result.summary.topConcerns}
                recommendedCopies={result.summary.recommendedCopies}
                oneParagraphInsight={result.summary.oneParagraphInsight}
              />
            </Section>

            <PersonaRawSection result={result} />

            <p className="text-xs text-slate-300 text-center pb-4">
              데이터: NVIDIA Nemotron-Personas-Korea (CC BY 4.0) · 이 결과는 AI 시뮬레이션이며 실제 설문을 대체하지 않습니다
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const EVIDENCE_AXIS_KEYS = ["clarity", "trust", "acceptance", "appeal", "comprehension"] as const;

function buildEvidenceHighlights(summary: SimulationSummary, request: SimulationRequest): string[] {
  const inputType = summary.inputType ?? request.inputType;
  const decisionMode = summary.decisionMode ?? request.decisionMode;
  const axesA = summary.riskAxesA ? toDisplayRiskAxes(summary.riskAxesA) : undefined;
  const axesB = summary.riskAxesB ? toDisplayRiskAxes(summary.riskAxesB) : undefined;

  if (!axesA) return [];

  if (decisionMode === "review" || !axesB) {
    const ranked = EVIDENCE_AXIS_KEYS
      .map((key) => ({ key, value: axesA[key] }))
      .sort((a, b) => b.value - a.value);
    return [
      `가장 강한 지표는 ${DISPLAY_AXIS_LABELS[ranked[0].key]} ${ranked[0].value.toFixed(1)}/5입니다.`,
      `보완 우선순위는 ${DISPLAY_AXIS_LABELS[ranked[ranked.length - 1].key]} ${ranked[ranked.length - 1].value.toFixed(1)}/5입니다.`,
      `주요 우려: ${summary.topConcerns[0] ?? "추가 맥락 확인이 필요합니다."}`,
    ];
  }

  if (summary.winner === "Tie") {
    const gaps = EVIDENCE_AXIS_KEYS
      .map((key) => ({
        key,
        gap: Math.abs(axesA[key] - axesB[key]),
        leader: axesA[key] >= axesB[key] ? "A" as const : "B" as const,
      }))
      .sort((a, b) => b.gap - a.gap);
    return [
      `가장 차이가 난 지표는 ${DISPLAY_AXIS_LABELS[gaps[0].key]}이며 ${getVariantLabel(inputType, gaps[0].leader)}가 +${gaps[0].gap.toFixed(1)} 앞섭니다.`,
      "전체 우열은 작아 두 안의 강점을 합친 재구성이 더 안전합니다.",
      `주요 우려: ${summary.topConcerns[0] ?? "명확한 우세안이 약합니다."}`,
    ];
  }

  const winner = summary.winner;
  const rival = winner === "A" ? "B" : "A";
  const winnerAxes = winner === "A" ? axesA : axesB;
  const rivalAxes = winner === "A" ? axesB : axesA;
  const deltas = EVIDENCE_AXIS_KEYS
    .map((key) => ({ key, delta: winnerAxes[key] - rivalAxes[key] }))
    .sort((a, b) => b.delta - a.delta);
  const strongest = deltas[0];
  const rivalStrongest = [...deltas].sort((a, b) => a.delta - b.delta)[0];

  return [
    `${getVariantLabel(inputType, winner)}은 ${DISPLAY_AXIS_LABELS[strongest.key]} +${Math.max(strongest.delta, 0).toFixed(1)}로 가장 크게 앞섭니다.`,
    rivalStrongest.delta < -0.15
      ? `${getVariantLabel(inputType, rival)}은 ${DISPLAY_AXIS_LABELS[rivalStrongest.key]} 우세가 있지만 최종 행동 설득력은 약합니다.`
      : `${getVariantLabel(inputType, rival)}은 뚜렷하게 앞선 지표가 약합니다.`,
    `주요 우려: ${summary.topConcerns[0] ?? "후속 검증에서 구매·사용 맥락을 더 확인해야 합니다."}`,
  ];
}

function EvidenceHighlights({
  summary,
  request,
}: {
  summary: SimulationSummary;
  request: SimulationRequest;
}) {
  const highlights = buildEvidenceHighlights(summary, request);
  if (highlights.length === 0) return null;

  return (
    <div className="mt-5 grid gap-3 md:grid-cols-3">
      {highlights.map((item, index) => (
        <div key={item} className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <p className="mb-1 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
            Evidence {index + 1}
          </p>
          <p className="text-sm font-semibold leading-relaxed text-slate-800">{item}</p>
        </div>
      ))}
    </div>
  );
}

function PersonaRawSection({ result }: { result: SimulationResponse }) {
  const [open, setOpen] = useState(false);
  const inputType = result.summary.inputType ?? "copy";
  const decisionMode = result.summary.decisionMode ?? "compare";
  const teasers = pickPersonaTeasers(result.personas, result.summary.winner);

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <span>
          <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            페르소나 원문 반응 {result.personas.length}명
          </span>
          <span className="mt-0.5 block text-xs text-slate-400">
            대표 반응 2개만 먼저 보고, 필요할 때 전체 원문을 펼칩니다.
          </span>
        </span>
        <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-slate-400">
          {open ? "접기" : "전체 펼치기"}
          <span className="text-sm leading-none">{open ? "▲" : "▼"}</span>
        </span>
      </button>

      <div className="border-t border-slate-200 px-4 py-4">
        {!open && (
          <div className="grid gap-3 md:grid-cols-2">
            {teasers.map((item) => (
              <PersonaTeaser
                key={item.index}
                result={item.result}
                index={item.index}
                decisionMode={decisionMode}
                inputType={inputType}
              />
            ))}
          </div>
        )}

        {open && (
          <div className="space-y-3">
            {result.personas.map((r, i) => (
              <PersonaCard
                key={i}
                result={r}
                index={i}
                decisionMode={decisionMode}
                inputType={inputType}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function pickPersonaTeasers(
  personas: PersonaComparisonResult[],
  winner: SimulationSummary["winner"]
): Array<{ result: PersonaComparisonResult; index: number }> {
  if (personas.length <= 2) {
    return personas.map((result, index) => ({ result, index }));
  }

  const preferred = winner === "Tie"
    ? personas.findIndex((item) => item.preferredVariant === "Tie")
    : personas.findIndex((item) => item.preferredVariant === winner);
  const opposing = winner === "Tie"
    ? personas.findIndex((item) => item.preferredVariant !== "Tie")
    : personas.findIndex((item) => item.preferredVariant !== winner);

  const indexes = [preferred, opposing]
    .filter((index) => index >= 0)
    .filter((index, position, arr) => arr.indexOf(index) === position);

  while (indexes.length < 2 && indexes.length < personas.length) {
    const next = indexes.length;
    if (!indexes.includes(next)) indexes.push(next);
    else indexes.push(next + 1);
  }

  return indexes.slice(0, 2).map((index) => ({ result: personas[index], index }));
}

function PersonaTeaser({
  result,
  index,
  decisionMode,
  inputType,
}: {
  result: PersonaComparisonResult;
  index: number;
  decisionMode: NonNullable<SimulationSummary["decisionMode"]>;
  inputType: NonNullable<SimulationSummary["inputType"]>;
}) {
  const { persona, relevance, preferredVariant, preferenceReason, reactionA, reactionB } = result;
  const isReview = decisionMode === "review";
  const quote = isReview
    ? reactionA.oneSentenceReaction
    : preferredVariant === "B"
      ? reactionB.oneSentenceReaction
      : reactionA.oneSentenceReaction;
  const badge = isReview
    ? "단일 검토"
    : preferredVariant === "Tie"
      ? "동률"
      : `${getVariantLabel(inputType, preferredVariant)} 선호`;

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-400">P{index + 1}</span>
        <span className="text-sm font-bold text-slate-700">
          {persona.age}세 {persona.sex}
        </span>
        <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-500">
          {persona.occupation}
        </span>
        <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-500">
          적합도 {relevance.level}
        </span>
      </div>
      <p className="mb-2 text-xs font-bold text-slate-500">{badge}</p>
      <p className="text-sm font-semibold leading-relaxed text-slate-800">&quot;{quote || preferenceReason}&quot;</p>
      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500">{preferenceReason}</p>
    </div>
  );
}

function CollapsibleSection({
  title,
  children,
  defaultOpen,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</span>
        <span className="text-xs font-semibold text-slate-400">{open ? "접기" : "펼치기"}</span>
      </button>
      {open && <div className="border-t border-slate-200 p-4">{children}</div>}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-[11px] font-black mb-3 uppercase tracking-[0.18em] text-slate-400">
        {title}
      </h3>
      {children}
    </div>
  );
}
