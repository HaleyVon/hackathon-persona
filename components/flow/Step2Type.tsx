import { SimulationRequest } from "@/lib/types";
import { MVP_INPUT_TYPE_OPTIONS } from "@/lib/constants";

interface Props {
  request: SimulationRequest;
  onChange: (v: SimulationRequest) => void;
  loading: boolean;
  onNext: () => void;
  onPrev: () => void;
}

export default function Step2Type({ request, onChange, loading, onNext, onPrev }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-full px-6 py-12">
      <div className="w-full max-w-xl">
        <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-3">Step 2</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
          무엇을 검토할 건가요?
        </h2>
        <p className="text-sm text-slate-500 mb-10">
          검토 유형에 따라 평가 축이 달라집니다.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {MVP_INPUT_TYPE_OPTIONS.map((t) => (
            <button
              key={t.value}
              onClick={() => {
                onChange({ ...request, inputType: t.value });
                setTimeout(onNext, 200);
              }}
              disabled={loading}
              className={`rounded-2xl border-2 p-5 text-left transition-all ${
                request.inputType === t.value
                  ? "border-indigo-400 bg-indigo-50"
                  : "border-slate-200 bg-white hover:border-indigo-200 hover:bg-indigo-50/40"
              }`}
            >
              <div className="text-2xl mb-2">{t.emoji}</div>
              <div className={`font-bold text-sm mb-1 ${request.inputType === t.value ? "text-indigo-700" : "text-slate-700"}`}>
                {t.label}
              </div>
              <div className="text-xs text-slate-400 leading-tight">{t.description}</div>
            </button>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-between">
          <button
            onClick={onPrev}
            disabled={loading}
            className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
          >
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
