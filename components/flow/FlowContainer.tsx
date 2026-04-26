"use client";
import { useState } from "react";
import { SimulationRequest } from "@/lib/types";
import Step1Mode from "@/components/flow/Step1Mode";
import Step2Type from "@/components/flow/Step2Type";
import Step3Context from "@/components/flow/Step3Context";
import Step4Variants from "@/components/flow/Step4Variants";
import Step5Target from "@/components/flow/Step5Target";
import Step6Run from "@/components/flow/Step6Run";
import FlowDemoBar from "@/components/flow/FlowDemoBar";

const STEPS = ["모드 선택", "검토 유형", "제품 맥락", "검토 내용", "타깃 설정", "실행"];
const TOTAL = STEPS.length;
// header(56px) + progress-bar(2px) = 58px
const STEP_HEIGHT = "calc(100vh - 58px)";

interface Props {
  request: SimulationRequest;
  onChange: (v: SimulationRequest) => void;
  loading: boolean;
  error: string | null;
  selectedDemoId: string;
  onDemoSelect: (id: string) => void;
  onDemoMode: () => void;
  onRun: () => void;
  onBack: () => void;
}

export default function FlowContainer({
  request, onChange, loading, error,
  selectedDemoId, onDemoSelect, onDemoMode, onRun, onBack,
}: Props) {
  const [step, setStep] = useState(0);

  const prev = () => setStep((s) => Math.max(0, s - 1));
  const next = () => setStep((s) => Math.min(TOTAL - 1, s + 1));

  const stepProps = { request, onChange, loading, onNext: next, onPrev: prev };

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden font-[var(--font-geist-sans)]">
      {/* Header */}
      <header className="h-14 border-b border-slate-200 bg-white px-6 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="text-slate-400 hover:text-slate-600 transition-colors text-lg"
            aria-label="뒤로"
          >
            ←
          </button>
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">PS</span>
          </div>
          <span className="font-bold text-slate-800 text-sm">Persona Signal</span>
        </div>

        {/* Progress steps */}
        <div className="hidden sm:flex items-center gap-1.5">
          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <button
                onClick={() => !loading && setStep(i)}
                disabled={loading}
                className={`flex items-center gap-1.5 text-xs transition-colors ${
                  i === step ? "text-blue-600 font-semibold"
                  : i < step ? "text-slate-400 hover:text-slate-600"
                  : "text-slate-300"
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                  i === step ? "bg-blue-600 text-white"
                  : i < step ? "bg-slate-200 text-slate-500"
                  : "bg-slate-100 text-slate-300"
                }`}>
                  {i < step ? "✓" : i + 1}
                </span>
                <span className="hidden lg:inline">{label}</span>
              </button>
              {i < TOTAL - 1 && <span className="text-slate-200 text-xs">›</span>}
            </div>
          ))}
        </div>

        {/* Mobile indicator */}
        <div className="sm:hidden text-xs text-slate-500 font-medium">
          {step + 1} / {TOTAL}
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-0.5 bg-slate-100 shrink-0">
        <div
          className="h-full bg-blue-500 transition-all duration-500"
          style={{ width: `${((step + 1) / TOTAL) * 100}%` }}
        />
      </div>

      {/* Slide viewport */}
      <div className="overflow-hidden" style={{ height: STEP_HEIGHT }}>
        <div
          className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{ transform: `translateY(calc(-${step} * ${STEP_HEIGHT}))` }}
        >
          {/* Each step: exact viewport-minus-header height, scrollable internally */}
          <div style={{ height: STEP_HEIGHT }} className="overflow-y-auto shrink-0">
            <Step1Mode {...stepProps} />
          </div>
          <div style={{ height: STEP_HEIGHT }} className="overflow-y-auto shrink-0">
            <Step2Type {...stepProps} />
          </div>
          <div style={{ height: STEP_HEIGHT }} className="overflow-y-auto shrink-0">
            <Step3Context {...stepProps} />
          </div>
          <div style={{ height: STEP_HEIGHT }} className="overflow-y-auto shrink-0">
            <Step4Variants {...stepProps} />
          </div>
          <div style={{ height: STEP_HEIGHT }} className="overflow-y-auto shrink-0">
            <Step5Target {...stepProps} />
          </div>
          <div style={{ height: STEP_HEIGHT }} className="overflow-y-auto shrink-0">
            <Step6Run {...stepProps} error={error} onRun={onRun} />
          </div>
        </div>
      </div>

      {/* Floating demo bar */}
      <FlowDemoBar
        selectedDemoId={selectedDemoId}
        onDemoSelect={onDemoSelect}
        onDemoMode={onDemoMode}
      />
    </div>
  );
}
