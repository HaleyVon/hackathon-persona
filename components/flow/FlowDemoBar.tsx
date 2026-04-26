"use client";
import { useState } from "react";
import { DEMO_SCENARIOS } from "@/data/demo-scenarios";

interface Props {
  selectedDemoId: string;
  onDemoSelect: (id: string) => void;
  onDemoMode: () => void;
}

export default function FlowDemoBar({ selectedDemoId, onDemoSelect, onDemoMode }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {open && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-4 w-72">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">데모 케이스 선택</p>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {DEMO_SCENARIOS.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => {
                  onDemoSelect(scenario.id);
                  setOpen(false);
                }}
                className={`w-full text-left rounded-xl border px-3 py-2.5 transition-colors ${
                  selectedDemoId === scenario.id
                    ? "border-amber-400 bg-amber-50"
                    : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className={`text-xs font-semibold ${selectedDemoId === scenario.id ? "text-amber-900" : "text-slate-700"}`}>
                  {scenario.label}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 leading-tight">{scenario.description}</div>
              </button>
            ))}
          </div>
          <button
            onClick={() => { onDemoMode(); setOpen(false); }}
            className="w-full mt-3 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 transition-colors"
          >
            ⚡ 이 케이스로 데모 실행
          </button>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-slate-200 shadow-md text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
      >
        <span className="text-amber-500">⚡</span>
        데모 케이스
        <span className="text-slate-300">{open ? "▲" : "▼"}</span>
      </button>
    </div>
  );
}
