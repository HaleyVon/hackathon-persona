import { UnexpectedSignal } from "@/lib/types";

interface Props {
  signals?: UnexpectedSignal[];
}

const TONE = {
  info: "border-sky-200 bg-sky-50 text-sky-800",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  critical: "border-rose-200 bg-rose-50 text-rose-900",
} as const;

const LABEL = {
  info: "참고",
  warning: "확인 필요",
  critical: "우선 확인",
} as const;

export default function UnexpectedSignals({ signals }: Props) {
  if (!signals || signals.length === 0) return null;

  return (
    <div className="space-y-3">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-amber-700">놓치기 쉬운 신호</p>
        <p className="mt-1 text-sm leading-relaxed text-slate-600">
          평균 점수만 보면 지나칠 수 있는 의사결정 리스크입니다.
        </p>
      </div>
      <div className="grid gap-3 lg:grid-cols-3">
        {signals.map((signal) => (
          <div key={signal.code} className={`rounded-xl border px-4 py-4 ${TONE[signal.severity]}`}>
            <span className="inline-flex rounded-full bg-white/70 px-2 py-1 text-[11px] font-semibold">
              {LABEL[signal.severity]}
            </span>
            <p className="mt-3 text-sm font-bold leading-snug">{signal.title}</p>
            <p className="mt-2 text-xs leading-relaxed opacity-80">{signal.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
