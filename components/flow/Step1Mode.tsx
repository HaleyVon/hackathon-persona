import { SimulationRequest } from "@/lib/types";
import { DECISION_MODE_OPTIONS } from "@/lib/constants";

interface Props {
  request: SimulationRequest;
  onChange: (v: SimulationRequest) => void;
  loading: boolean;
  onNext: () => void;
  onPrev: () => void;
}

export default function Step1Mode({ request, onChange, loading, onNext }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-full px-6 py-12">
      <div className="w-full max-w-xl">
        <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-3">Step 1</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
          무엇을 하시겠어요?
        </h2>
        <p className="text-sm text-slate-500 mb-10">
          두 안을 비교할지, 하나를 검토할지 선택해주세요.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          {DECISION_MODE_OPTIONS.map((m) => (
            <button
              key={m.value}
              onClick={() => {
                onChange({ ...request, decisionMode: m.value });
                setTimeout(onNext, 200);
              }}
              disabled={loading}
              className={`flex-1 rounded-2xl border-2 p-6 text-left transition-all ${
                request.decisionMode === m.value
                  ? "border-blue-500 bg-blue-600 text-white shadow-lg shadow-blue-100"
                  : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50"
              }`}
            >
              <div className="text-xl mb-2">
                {m.value === "compare" ? "⚖️" : "🔍"}
              </div>
              <div className="font-bold text-base mb-1">{m.label}</div>
              <div className={`text-sm ${request.decisionMode === m.value ? "text-blue-100" : "text-slate-400"}`}>
                {m.description}
              </div>
            </button>
          ))}
        </div>

        <div className="mt-10 flex justify-end">
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
