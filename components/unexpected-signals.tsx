import { UnexpectedSignal } from "@/lib/types";

interface Props {
  signals?: UnexpectedSignal[];
}

const TONE = {
  info: "border-slate-200 bg-white text-slate-700",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  critical: "border-amber-300 bg-amber-50 text-amber-950",
} as const;

const LABEL = {
  info: "참고",
  warning: "확인 필요",
  critical: "우선 확인",
} as const;

export default function UnexpectedSignals({ signals }: Props) {
  if (!signals || signals.length === 0) return null;

  const lead = signals.find((signal) => signal.severity === "critical")
    ?? signals.find((signal) => signal.severity === "warning")
    ?? signals[0];

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
          Risk watch
        </span>
        {signals.slice(0, 4).map((signal) => (
          <span
            key={signal.code}
            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${TONE[signal.severity]}`}
            title={signal.description}
          >
            {LABEL[signal.severity]} · {signal.title}
          </span>
        ))}
      </div>
      {lead && (
        <p className="mt-3 max-w-4xl text-sm font-medium leading-relaxed text-slate-700">
          {lead.description}
        </p>
      )}
    </div>
  );
}
