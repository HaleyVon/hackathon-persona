"use client";
import { useState } from "react";
import { DEMO_SCENARIOS } from "@/data/demo-scenarios";

interface Props {
  selectedDemoId: string;
  onFillDemo: (id: string) => void;   // 폼 채우기 + Step 1로
  onDemoMode: (id: string) => void;   // 결과 바로 보기
}

export default function FlowDemoBar({ selectedDemoId, onFillDemo, onDemoMode }: Props) {
  const [open, setOpen] = useState(false);
  const [pendingId, setPendingId] = useState(selectedDemoId);

  const selectedScenario = DEMO_SCENARIOS.find((s) => s.id === pendingId);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {open && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-4 w-80">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            샘플 케이스 선택
          </p>

          {/* Scenario list */}
          <div className="space-y-1.5 max-h-64 overflow-y-auto mb-4">
            {DEMO_SCENARIOS.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => setPendingId(scenario.id)}
                className={`w-full text-left rounded-xl border px-3 py-2.5 transition-colors ${
                  pendingId === scenario.id
                    ? "border-blue-400 bg-blue-50"
                    : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className={`text-xs font-semibold ${pendingId === scenario.id ? "text-blue-800" : "text-slate-700"}`}>
                  {scenario.label}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 leading-tight">
                  {scenario.description}
                </div>
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100 pt-3 space-y-2">
            {/* Primary: fill + step 1 */}
            <button
              onClick={() => {
                onFillDemo(pendingId);
                setOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5"
            >
              ↩ Step 1부터 채워서 보기
            </button>

            {/* Secondary: jump to results */}
            <button
              onClick={() => {
                onDemoMode(pendingId);
                setOpen(false);
              }}
              className="w-full py-2 rounded-xl border border-amber-300 bg-amber-50 text-amber-700 text-xs font-semibold hover:bg-amber-100 transition-colors flex items-center justify-center gap-1.5"
            >
              ⚡ 결과 화면 바로 보기
            </button>
          </div>
        </div>
      )}

      {/* Trigger button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-slate-200 shadow-md text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
      >
        <span className="text-amber-500">📋</span>
        {selectedScenario ? (
          <span className="max-w-[120px] truncate">{selectedScenario.label}</span>
        ) : (
          "샘플 케이스"
        )}
        <span className="text-slate-300">{open ? "▲" : "▼"}</span>
      </button>
    </div>
  );
}
