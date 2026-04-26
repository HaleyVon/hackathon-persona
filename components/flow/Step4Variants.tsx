import { SimulationRequest } from "@/lib/types";
import { INPUT_TYPE_OPTIONS } from "@/lib/constants";
import { getInputTypeCopy } from "@/lib/display";

interface Props {
  request: SimulationRequest;
  onChange: (v: SimulationRequest) => void;
  loading: boolean;
  onNext: () => void;
  onPrev: () => void;
}

const inputPlaceholders: Record<string, string> = {
  copy: "예: 회의록을 자동으로 정리해주는 AI 비서",
  pricing: "예: 월 9,900원 / 팀 멤버 무제한",
  feature: "예: 회의 종료 후 자동으로 할 일 목록 생성",
  positioning: "예: 팀을 위한 AI 생산성 도구",
};

export default function Step4Variants({ request, onChange, loading, onNext, onPrev }: Props) {
  const isReview = request.decisionMode === "review";
  const selectedType = INPUT_TYPE_OPTIONS.find((o) => o.value === request.inputType);
  const typeCopy = getInputTypeCopy(request.inputType);
  const placeholder = inputPlaceholders[request.inputType] ?? inputPlaceholders.copy;
  const canProceed = !!request.variantA && (isReview || !!request.variantB);

  return (
    <div className="flex flex-col items-center justify-center min-h-full px-6 py-12">
      <div className="w-full max-w-xl">
        <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-3">Step 4</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
          {isReview ? "검토할 내용을 입력하세요" : "비교할 두 안을 입력하세요"}
        </h2>
        {selectedType && (
          <p className="text-sm text-slate-500 mb-8">
            {selectedType.emoji} {selectedType.label} 유형으로 평가합니다.
          </p>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-blue-500 mb-2">
              {isReview ? typeCopy.review : typeCopy.compareA}
            </label>
            <textarea
              className="w-full text-sm text-slate-700 bg-blue-50 border-2 border-blue-200 rounded-xl px-4 py-3 resize-none outline-none placeholder:text-slate-300 leading-relaxed focus:border-blue-400 transition-colors"
              rows={3}
              placeholder={placeholder}
              value={request.variantA}
              onChange={(e) => onChange({ ...request, variantA: e.target.value })}
              disabled={loading}
            />
          </div>

          {!isReview && (
            <div>
              <label className="block text-xs font-bold text-violet-500 mb-2">{typeCopy.compareB}</label>
              <textarea
                className="w-full text-sm text-slate-700 bg-violet-50 border-2 border-violet-200 rounded-xl px-4 py-3 resize-none outline-none placeholder:text-slate-300 leading-relaxed focus:border-violet-400 transition-colors"
                rows={3}
                placeholder={placeholder}
                value={request.variantB}
                onChange={(e) => onChange({ ...request, variantB: e.target.value })}
                disabled={loading}
              />
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <button onClick={onPrev} disabled={loading} className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
            ← 이전
          </button>
          <button
            onClick={onNext}
            disabled={loading || !canProceed}
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-40"
          >
            다음 →
          </button>
        </div>
      </div>
    </div>
  );
}
