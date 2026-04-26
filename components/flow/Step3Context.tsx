import { SimulationRequest } from "@/lib/types";
import { MARKET_TYPE_OPTIONS } from "@/lib/constants";

interface Props {
  request: SimulationRequest;
  onChange: (v: SimulationRequest) => void;
  loading: boolean;
  onNext: () => void;
  onPrev: () => void;
}

export default function Step3Context({ request, onChange, loading, onNext, onPrev }: Props) {
  const set = (patch: Partial<SimulationRequest>) => onChange({ ...request, ...patch });

  return (
    <div className="flex flex-col items-center justify-center min-h-full px-6 py-12">
      <div className="w-full max-w-xl">
        <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-3">Step 3</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
          제품 맥락을 알려주세요
        </h2>
        <p className="text-sm text-slate-500 mb-8">
          페르소나가 어떤 맥락에서 반응하는지 설정합니다.
        </p>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              제품 / 서비스 설명 <span className="text-red-400">*</span>
            </label>
            <textarea
              className="w-full text-sm text-slate-700 bg-white border border-slate-200 rounded-xl px-4 py-3 resize-none outline-none placeholder:text-slate-300 leading-relaxed focus:border-blue-300 focus:ring-2 focus:ring-blue-50 transition-colors"
              rows={3}
              placeholder="예: AI가 회의록과 업무를 자동으로 정리해주는 팀 생산성 도구"
              value={request.productDescription}
              onChange={(e) => set({ productDescription: e.target.value })}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              주 타깃 고객 <span className="text-red-400">*</span>
            </label>
            <input
              className="w-full text-sm text-slate-700 border border-slate-200 rounded-xl px-4 py-3 outline-none placeholder:text-slate-300 focus:border-blue-300 focus:ring-2 focus:ring-blue-50 transition-colors"
              placeholder="예: 업무 효율을 높이고 싶은 20~40대 팀 리더와 실무자"
              value={request.targetCustomer}
              onChange={(e) => set({ targetCustomer: e.target.value })}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">시장 유형</label>
            <div className="grid grid-cols-3 gap-2">
              {MARKET_TYPE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => set({ marketType: option.value })}
                  disabled={loading}
                  className={`rounded-xl border-2 px-3 py-2.5 text-left transition-all ${
                    request.marketType === option.value
                      ? "border-slate-700 bg-slate-800 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <div className="text-xs font-bold">{option.label}</div>
                  <div className={`text-[11px] mt-0.5 leading-tight ${request.marketType === option.value ? "text-slate-300" : "text-slate-400"}`}>
                    {option.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">사용 / 구매 맥락</label>
            <textarea
              className="w-full text-sm text-slate-700 bg-white border border-slate-200 rounded-xl px-4 py-3 resize-none outline-none placeholder:text-slate-300 leading-relaxed focus:border-blue-300 focus:ring-2 focus:ring-blue-50 transition-colors"
              rows={2}
              placeholder="예: 협업툴 도입을 검토 중이고, 회의 후 정리 비용을 줄일 수 있는지 판단하려는 상황"
              value={request.usageContext}
              onChange={(e) => set({ usageContext: e.target.value })}
              disabled={loading}
            />
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <button onClick={onPrev} disabled={loading} className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
            ← 이전
          </button>
          <button
            onClick={onNext}
            disabled={loading || !request.productDescription || !request.targetCustomer}
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-40"
          >
            다음 →
          </button>
        </div>
      </div>
    </div>
  );
}
