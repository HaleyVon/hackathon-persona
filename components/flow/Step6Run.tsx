import { SimulationRequest } from "@/lib/types";
import { SAMPLE_SIZE_OPTIONS, SAMPLE_SIZE_LABELS } from "@/lib/constants";

interface Props {
  request: SimulationRequest;
  onChange: (v: SimulationRequest) => void;
  loading: boolean;
  onNext: () => void;
  onPrev: () => void;
  onRun: () => void;
  error: string | null;
}

export default function Step6Run({ request, onChange, loading, onPrev, onRun, error }: Props) {
  const isReview = request.decisionMode === "review";

  return (
    <div className="flex flex-col items-center justify-center min-h-full px-6 py-12">
      <div className="w-full max-w-xl">
        <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-3">Step 6</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
          준비됐습니다
        </h2>
        <p className="text-sm text-slate-500 mb-10">
          샘플 수를 선택하고 시뮬레이션을 실행하세요.
        </p>

        {/* Summary card */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-6 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">모드</span>
            <span className="font-semibold text-slate-700">{isReview ? "단일 검토" : "A/B 비교"}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">검토 유형</span>
            <span className="font-semibold text-slate-700 capitalize">{request.inputType}</span>
          </div>
          <div className="flex items-start justify-between text-sm gap-4">
            <span className="text-slate-400 shrink-0">A안</span>
            <span className="font-medium text-slate-700 text-right line-clamp-2">{request.variantA || "—"}</span>
          </div>
          {!isReview && (
            <div className="flex items-start justify-between text-sm gap-4">
              <span className="text-slate-400 shrink-0">B안</span>
              <span className="font-medium text-slate-700 text-right line-clamp-2">{request.variantB || "—"}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">타깃</span>
            <span className="font-semibold text-slate-700">
              {request.filters.sexes.length > 0 ? request.filters.sexes.join("/") : "전체"} ·{" "}
              {request.filters.ageMin}~{request.filters.ageMax}세
            </span>
          </div>
        </div>

        {/* Sample size */}
        <div className="mb-8">
          <label className="block text-xs font-semibold text-slate-500 mb-3">
            샘플 페르소나 수
          </label>
          <div className="flex gap-2">
            {SAMPLE_SIZE_OPTIONS.map((n) => (
              <button
                key={n}
                onClick={() => onChange({ ...request, sampleSize: n })}
                disabled={loading}
                className={`flex-1 py-2.5 rounded-xl border text-xs transition-colors ${
                  request.sampleSize === n
                    ? "border-blue-500 bg-blue-50 text-blue-600 font-semibold"
                    : "border-slate-200 text-slate-500 hover:border-slate-300"
                }`}
              >
                <div>{n}명</div>
                <div className={`text-[10px] mt-0.5 ${request.sampleSize === n ? "text-blue-400" : "text-slate-400"}`}>
                  {SAMPLE_SIZE_LABELS[n]}
                </div>
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-400">
            10명으로 시작하고, 중요한 안건은 20명 이상을 추천합니다.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            ⚠ {error}
          </div>
        )}

        <div className="flex items-center justify-between">
          <button onClick={onPrev} disabled={loading} className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
            ← 이전
          </button>
          <button
            onClick={onRun}
            disabled={loading}
            className="px-8 py-3.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-blue-100"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                시뮬레이션 중...
              </>
            ) : (
              "▶ 시뮬레이션 실행"
            )}
          </button>
        </div>

        <p className="mt-6 text-xs text-slate-400 text-center leading-relaxed">
          이 도구는 실제 설문을 대체하지 않습니다.
          <br />초기 가설 검증과 방향 탐색을 돕는 AI 시뮬레이션입니다.
        </p>
      </div>
    </div>
  );
}
