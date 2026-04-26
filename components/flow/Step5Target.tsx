"use client";
import { useState } from "react";
import { SimulationRequest } from "@/lib/types";
import {
  TARGET_PRESETS, SEX_OPTIONS, AGE_PRESETS,
  OCCUPATION_OPTIONS, PROVINCE_OPTIONS, MARITAL_OPTIONS,
} from "@/lib/constants";

interface Props {
  request: SimulationRequest;
  onChange: (v: SimulationRequest) => void;
  loading: boolean;
  onNext: () => void;
  onPrev: () => void;
}

export default function Step5Target({ request, onChange, loading, onNext, onPrev }: Props) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const setFilter = (patch: Partial<SimulationRequest["filters"]>) =>
    onChange({ ...request, filters: { ...request.filters, ...patch } });

  const toggle = (arr: string[], item: string) =>
    arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];

  const activePreset = TARGET_PRESETS.find((p) => {
    const f = p.filters;
    const vf = request.filters;
    return (
      JSON.stringify(f.sexes.sort()) === JSON.stringify([...vf.sexes].sort()) &&
      f.ageMin === vf.ageMin &&
      f.ageMax === vf.ageMax &&
      JSON.stringify(f.occupations.sort()) === JSON.stringify([...vf.occupations].sort()) &&
      JSON.stringify(f.provinces.sort()) === JSON.stringify([...vf.provinces].sort()) &&
      JSON.stringify((f.maritalStatuses ?? []).sort()) === JSON.stringify([...(vf.maritalStatuses ?? [])].sort())
    );
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-full px-6 py-12">
      <div className="w-full max-w-xl">
        <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-3">Step 5</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
          누구 관점으로 볼까요?
        </h2>
        <p className="text-sm text-slate-500 mb-8">타깃 페르소나 조건을 설정합니다.</p>

        {/* Presets */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-slate-500 mb-3">빠른 타깃 선택</label>
          <div className="flex flex-wrap gap-2">
            {TARGET_PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => setFilter(p.filters)}
                disabled={loading}
                title={p.description}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  activePreset?.id === p.id
                    ? "border-blue-500 bg-blue-600 text-white font-semibold"
                    : "border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          {activePreset && (
            <p className="text-xs text-blue-500 mt-2">{activePreset.description}</p>
          )}
        </div>

        {/* Advanced toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          disabled={loading}
          className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1.5 mb-4 transition-colors"
        >
          <span>{showAdvanced ? "▲" : "▼"}</span>
          세부 조정
        </button>

        {showAdvanced && (
          <div className="space-y-4 border-t border-slate-100 pt-4 bg-white rounded-2xl p-4 border border-slate-100">
            {/* 성별 */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2">성별</label>
              <div className="flex gap-2">
                {SEX_OPTIONS.map((s) => (
                  <Pill key={s} label={s} active={request.filters.sexes.includes(s)}
                    onClick={() => setFilter({ sexes: toggle(request.filters.sexes, s) })} disabled={loading} />
                ))}
                <Pill label="전체" active={request.filters.sexes.length === 0}
                  onClick={() => setFilter({ sexes: [] })} disabled={loading} />
              </div>
            </div>

            {/* 나이 */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2">나이 범위</label>
              <div className="flex items-center gap-2 mb-2">
                <input type="number" className="w-16 text-sm text-center border border-slate-200 rounded-lg px-2 py-1.5 outline-none"
                  value={request.filters.ageMin} onChange={(e) => setFilter({ ageMin: Number(e.target.value) })} disabled={loading} />
                <span className="text-slate-400 text-sm">~</span>
                <input type="number" className="w-16 text-sm text-center border border-slate-200 rounded-lg px-2 py-1.5 outline-none"
                  value={request.filters.ageMax} onChange={(e) => setFilter({ ageMax: Number(e.target.value) })} disabled={loading} />
                <span className="text-xs text-slate-400">세</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {AGE_PRESETS.map((ap) => (
                  <button key={ap.label} onClick={() => setFilter({ ageMin: ap.min, ageMax: ap.max })} disabled={loading}
                    className={`text-xs px-2 py-1 rounded-md border transition-colors ${
                      request.filters.ageMin === ap.min && request.filters.ageMax === ap.max
                        ? "border-slate-600 bg-slate-700 text-white" : "border-slate-200 text-slate-500 hover:border-slate-300"
                    }`}>
                    {ap.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 결혼 */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2">결혼 여부 <span className="font-normal text-slate-400">(미선택 시 전체)</span></label>
              <div className="flex gap-2">
                {MARITAL_OPTIONS.map((m) => (
                  <Pill key={m.value} label={m.label}
                    active={(request.filters.maritalStatuses ?? []).includes(m.value)}
                    onClick={() => setFilter({ maritalStatuses: toggle(request.filters.maritalStatuses ?? [], m.value) })}
                    disabled={loading} />
                ))}
              </div>
            </div>

            {/* 직종 */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2">직종 <span className="font-normal text-slate-400">(미선택 시 전체)</span></label>
              <div className="flex flex-wrap gap-1.5">
                {OCCUPATION_OPTIONS.map((o) => (
                  <Pill key={o} label={o} active={request.filters.occupations.includes(o)}
                    onClick={() => setFilter({ occupations: toggle(request.filters.occupations, o) })} disabled={loading} />
                ))}
              </div>
            </div>

            {/* 지역 */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2">지역 <span className="font-normal text-slate-400">(미선택 시 전체)</span></label>
              <div className="flex flex-wrap gap-1.5">
                {PROVINCE_OPTIONS.map((p) => (
                  <Pill key={p} label={p} active={request.filters.provinces.includes(p)}
                    onClick={() => setFilter({ provinces: toggle(request.filters.provinces, p) })} disabled={loading} />
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between">
          <button onClick={onPrev} disabled={loading} className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
            ← 이전
          </button>
          <button
            onClick={onNext}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            다음 →
          </button>
        </div>
      </div>
    </div>
  );
}

function Pill({ label, active, onClick, disabled }: { label: string; active: boolean; onClick: () => void; disabled: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
        active ? "border-slate-700 bg-slate-700 text-white" : "border-slate-200 text-slate-500 hover:border-slate-300"
      }`}
    >
      {label}
    </button>
  );
}
