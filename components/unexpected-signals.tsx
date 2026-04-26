import { UnexpectedSignal } from "@/lib/types";

interface Props {
  signals?: UnexpectedSignal[];
}

const TONE = {
  info: "border-sky-200 bg-sky-100 text-sky-800",
  warning: "border-amber-200 bg-amber-100 text-amber-900",
  critical: "border-rose-200 bg-rose-100 text-rose-900",
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
    <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
          놓치기 쉬운 신호
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
        <p className="mt-2 text-sm leading-relaxed text-amber-950">
          {lead.description}
        </p>
      )}
    </div>
  );
}
