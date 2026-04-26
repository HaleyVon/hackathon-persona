"use client";
import { useState } from "react";
import { SimulationRequest } from "@/lib/types";
import {
  PROVINCE_OPTIONS, SAMPLE_SIZE_OPTIONS, SEX_OPTIONS,
  OCCUPATION_OPTIONS, MARITAL_OPTIONS, TARGET_PRESETS, AGE_PRESETS,
} from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  value: SimulationRequest;
  onChange: (v: SimulationRequest) => void;
  loading: boolean;
}

export default function InputForm({ value, onChange, loading }: Props) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const set = (patch: Partial<SimulationRequest>) => onChange({ ...value, ...patch });
  const setFilter = (patch: Partial<SimulationRequest["filters"]>) =>
    set({ filters: { ...value.filters, ...patch } });

  const toggle = (arr: string[], item: string) =>
    arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];

  const activePreset = TARGET_PRESETS.find((p) => {
    const f = p.filters;
    const vf = value.filters;
    return (
      JSON.stringify(f.sexes.sort()) === JSON.stringify([...vf.sexes].sort()) &&
      f.ageMin === vf.ageMin &&
      f.ageMax === vf.ageMax &&
      JSON.stringify(f.occupations.sort()) === JSON.stringify([...vf.occupations].sort()) &&
      JSON.stringify(f.provinces.sort()) === JSON.stringify([...vf.provinces].sort()) &&
      JSON.stringify((f.maritalStatuses ?? []).sort()) === JSON.stringify([...(vf.maritalStatuses ?? [])].sort())
    );
  });

  function applyPreset(presetId: string) {
    const p = TARGET_PRESETS.find((x) => x.id === presetId);
    if (!p) return;
    setFilter(p.filters);
  }

  return (
    <div className="space-y-4">
      {/* 제품 설명 */}
      <Card className="border-slate-100">
        <CardContent className="pt-4 pb-4">
          <label className="block text-xs font-semibold text-slate-500 mb-2">
            제품 / 서비스 설명
          </label>
          <textarea
            className="w-full text-sm text-slate-700 bg-transparent resize-none outline-none placeholder:text-slate-300 leading-relaxed"
            rows={3}
            placeholder="예: AI가 회의록과 업무를 자동으로 정리해주는 팀 생산성 도구"
            value={value.productDescription}
            onChange={(e) => set({ productDescription: e.target.value })}
            disabled={loading}
          />
        </CardContent>
      </Card>

      {/* A/B 카피 */}
      <Card className="border-slate-100">
        <CardContent className="pt-4 pb-4 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-blue-500 mb-1.5">카피 A</label>
            <textarea
              className="w-full text-sm text-slate-700 bg-blue-50 rounded-lg px-3 py-2 resize-none outline-none placeholder:text-slate-300 leading-relaxed"
              rows={2}
              placeholder="첫 번째 카피를 입력하세요"
              value={value.variantA}
              onChange={(e) => set({ variantA: e.target.value })}
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-violet-500 mb-1.5">카피 B</label>
            <textarea
              className="w-full text-sm text-slate-700 bg-violet-50 rounded-lg px-3 py-2 resize-none outline-none placeholder:text-slate-300 leading-relaxed"
              rows={2}
              placeholder="두 번째 카피를 입력하세요"
              value={value.variantB}
              onChange={(e) => set({ variantB: e.target.value })}
              disabled={loading}
            />
          </div>
        </CardContent>
      </Card>

      {/* 타겟 설정 */}
      <Card className="border-slate-100">
        <CardContent className="pt-4 pb-4 space-y-4">
          {/* 프리셋 */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2">
              타겟 빠른 선택
            </label>
            <div className="flex flex-wrap gap-1.5">
              {TARGET_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => applyPreset(p.id)}
                  disabled={loading}
                  title={p.description}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
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
              <p className="text-xs text-blue-500 mt-1.5">{activePreset.description}</p>
            )}
          </div>

          {/* 세부 조정 토글 */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            disabled={loading}
            className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors"
          >
            <span>{showAdvanced ? "▲" : "▼"}</span>
            세부 조정
          </button>

          {showAdvanced && (
            <div className="space-y-4 pt-1 border-t border-slate-100">
              {/* 성별 */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2">성별</label>
                <div className="flex gap-2">
                  {SEX_OPTIONS.map((s) => (
                    <FilterPill
                      key={s} label={s}
                      active={value.filters.sexes.includes(s)}
                      onClick={() => setFilter({ sexes: toggle(value.filters.sexes, s) })}
                      disabled={loading}
                    />
                  ))}
                  <FilterPill
                    label="전체" active={value.filters.sexes.length === 0}
                    onClick={() => setFilter({ sexes: [] })}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* 나이 */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2">
                  나이 범위
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="number"
                    className="w-16 text-sm text-center border border-slate-200 rounded-lg px-2 py-1.5 outline-none"
                    value={value.filters.ageMin}
                    onChange={(e) => setFilter({ ageMin: Number(e.target.value) })}
                    disabled={loading}
                  />
                  <span className="text-slate-400 text-sm">~</span>
                  <input
                    type="number"
                    className="w-16 text-sm text-center border border-slate-200 rounded-lg px-2 py-1.5 outline-none"
                    value={value.filters.ageMax}
                    onChange={(e) => setFilter({ ageMax: Number(e.target.value) })}
                    disabled={loading}
                  />
                  <span className="text-xs text-slate-400">세</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {AGE_PRESETS.map((ap) => (
                    <button
                      key={ap.label}
                      onClick={() => setFilter({ ageMin: ap.min, ageMax: ap.max })}
                      disabled={loading}
                      className={`text-xs px-2 py-1 rounded-md border transition-colors ${
                        value.filters.ageMin === ap.min && value.filters.ageMax === ap.max
                          ? "border-slate-600 bg-slate-700 text-white"
                          : "border-slate-200 text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      {ap.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 결혼 여부 */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2">
                  결혼 여부 <span className="font-normal text-slate-400">(미선택 시 전체)</span>
                </label>
                <div className="flex gap-2">
                  {MARITAL_OPTIONS.map((m) => (
                    <FilterPill
                      key={m.value} label={m.label}
                      active={(value.filters.maritalStatuses ?? []).includes(m.value)}
                      onClick={() => setFilter({
                        maritalStatuses: toggle(value.filters.maritalStatuses ?? [], m.value),
                      })}
                      disabled={loading}
                    />
                  ))}
                </div>
              </div>

              {/* 직종 */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2">
                  직종 <span className="font-normal text-slate-400">(미선택 시 전체)</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {OCCUPATION_OPTIONS.map((o) => (
                    <FilterPill
                      key={o} label={o}
                      active={value.filters.occupations.includes(o)}
                      onClick={() => setFilter({ occupations: toggle(value.filters.occupations, o) })}
                      disabled={loading}
                    />
                  ))}
                </div>
              </div>

              {/* 지역 */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2">
                  지역 <span className="font-normal text-slate-400">(미선택 시 전체)</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {PROVINCE_OPTIONS.map((p) => (
                    <FilterPill
                      key={p} label={p}
                      active={value.filters.provinces.includes(p)}
                      onClick={() => setFilter({ provinces: toggle(value.filters.provinces, p) })}
                      disabled={loading}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 샘플 수 */}
      <Card className="border-slate-100">
        <CardContent className="pt-3 pb-3">
          <label className="block text-xs font-semibold text-slate-500 mb-2">
            샘플 페르소나 수
          </label>
          <div className="flex gap-2">
            {SAMPLE_SIZE_OPTIONS.map((n) => (
              <button
                key={n}
                onClick={() => set({ sampleSize: n })}
                disabled={loading}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                  value.sampleSize === n
                    ? "border-blue-500 bg-blue-50 text-blue-600 font-semibold"
                    : "border-slate-200 text-slate-500 hover:border-slate-300"
                }`}
              >
                {n}명
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-slate-400 text-center leading-relaxed">
        이 도구는 실제 설문을 대체하지 않습니다.
        <br />
        초기 가설 검증과 카피 방향 탐색을 돕는 AI 시뮬레이션입니다.
      </p>
    </div>
  );
}

function FilterPill({
  label, active, onClick, disabled,
}: {
  label: string; active: boolean; onClick: () => void; disabled: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
        active
          ? "border-slate-700 bg-slate-700 text-white"
          : "border-slate-200 text-slate-500 hover:border-slate-300"
      }`}
    >
      {label}
    </button>
  );
}
