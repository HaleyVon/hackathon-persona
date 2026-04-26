import { InputType } from "@/lib/types";

interface Props {
  inputType: InputType;
  axesA: Record<string, number>;
  axesB?: Record<string, number>;
}

const TYPE_CONFIG: Record<
  InputType,
  {
    title: string;
    axes: { key: string; label: string; lowLabel: string; highLabel: string; danger?: boolean }[];
  }
> = {
  copy: { title: "", axes: [] },
  pricing: {
    title: "가격/플랜 심층 분석",
    axes: [
      { key: "perceivedValue", label: "가격 대비 가치", lowLabel: "가치 없다", highLabel: "충분히 납득" },
      { key: "affordability", label: "지불 가능성", lowLabel: "못 낼 것 같다", highLabel: "낼 수 있다" },
      { key: "willingnessToPay", label: "지불 의향", lowLabel: "공짜도 안 씀", highLabel: "지금 결제하고 싶다" },
    ],
  },
  feature: {
    title: "기능/아이디어 심층 분석",
    axes: [
      { key: "necessity", label: "필요성", lowLabel: "없어도 무관", highLabel: "없으면 안 된다" },
      { key: "urgency", label: "긴급성", lowLabel: "나중에 생각", highLabel: "지금 당장 필요" },
      { key: "existingSolutionAwareness", label: "대안 인식", lowLabel: "이미 더 좋은 거 있음", highLabel: "이런 걸 찾고 있었다", danger: true },
    ],
  },
  positioning: {
    title: "포지셔닝/브랜드 심층 분석",
    axes: [
      { key: "uniqueness", label: "차별화", lowLabel: "다를 게 없다", highLabel: "확실히 다르다" },
      { key: "toneFit", label: "톤 적합성", lowLabel: "나와 안 맞는다", highLabel: "나를 위해 쓴 것 같다" },
      { key: "audienceFit", label: "타겟 적합성", lowLabel: "다른 사람 위한 것", highLabel: "정확히 나 같은 사람" },
    ],
  },
};

function AxisBar({
  label, valueA, valueB, lowLabel, highLabel,
}: {
  label: string; valueA: number; valueB?: number; lowLabel: string; highLabel: string;
}) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700">{label}</span>
        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="rounded-full border border-cyan-200 bg-white px-2 py-1 text-cyan-800">{valueB === undefined ? "현재안" : "A"} {valueA.toFixed(1)}</span>
          {valueB !== undefined && (
            <span className="rounded-full border border-indigo-200 bg-white px-2 py-1 text-indigo-800">B {valueB.toFixed(1)}</span>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-semibold text-cyan-800">
            <span>{valueB === undefined ? "현재안" : "A"}</span>
            <span>{valueA.toFixed(1)}/5</span>
          </div>
          <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-cyan-600 transition-all"
              style={{ width: `${((valueA - 1) / 4) * 100}%` }}
            />
          </div>
        </div>
        {valueB !== undefined && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-semibold text-indigo-800">
              <span>B</span>
              <span>{valueB.toFixed(1)}/5</span>
            </div>
            <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all"
                style={{ width: `${((valueB - 1) / 4) * 100}%` }}
              />
            </div>
          </div>
        )}
        {valueB === undefined && (
          <div
            className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-[11px] leading-relaxed text-slate-500"
          >
            이 축은 현재안 단독 기준으로 읽습니다.
          </div>
        )}
      </div>
      <div className="flex justify-between text-[11px] text-slate-500">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
}

export default function TypeResultModule({ inputType, axesA, axesB }: Props) {
  const config = TYPE_CONFIG[inputType];
  if (!config || config.axes.length === 0) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-[11px] font-black mb-4 uppercase tracking-[0.18em] text-slate-400">
        {config.title}
      </h3>
      <div className="space-y-4">
        {config.axes.map((axis) => {
          const valA = axesA[axis.key];
          const valB = axesB?.[axis.key];
          if (valA === undefined) return null;
          return (
            <AxisBar
              key={axis.key}
              label={axis.label}
              valueA={valA}
              valueB={valB}
              lowLabel={axis.lowLabel}
              highLabel={axis.highLabel}
            />
          );
        })}
      </div>

      {/* 해석 힌트 */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <TypeHint inputType={inputType} axesA={axesA} axesB={axesB} />
      </div>
    </div>
  );
}

function TypeHint({ inputType, axesA, axesB }: Props) {
  if (inputType === "pricing") {
    const wtp = axesA.willingnessToPay ?? 0;
    const wtpB = axesB?.willingnessToPay ?? 0;
    const better = axesB ? (wtp >= wtpB ? "A" : "B") : null;
    return (
      <p className="text-xs text-slate-400 leading-relaxed">
        지불 의향 {wtp.toFixed(1)}/5
        {better && ` — ${better}안이 결제 전환에 더 유리합니다.`}
        {wtp < 2.5 && " 전반적으로 가격 저항이 높습니다. 가치 증명 메시지가 필요합니다."}
      </p>
    );
  }
  if (inputType === "feature") {
    const necessity = axesA.necessity ?? 0;
    return (
      <p className="text-xs text-slate-400 leading-relaxed">
        필요성 {necessity.toFixed(1)}/5
        {necessity >= 4 && " — 강한 니즈 확인. MVP 우선순위 상위에 배치하세요."}
        {necessity < 3 && " — 필요성이 낮습니다. 핵심 사용 시나리오를 더 구체화하거나 타겟을 좁혀보세요."}
      </p>
    );
  }
  if (inputType === "positioning") {
    const uniqueness = axesA.uniqueness ?? 0;
    return (
      <p className="text-xs text-slate-400 leading-relaxed">
        차별화 {uniqueness.toFixed(1)}/5
        {uniqueness < 3 && " — 포지셔닝이 뚜렷하지 않습니다. 경쟁 브랜드와 명확히 구분되는 단 하나의 차이점을 강조하세요."}
        {uniqueness >= 4 && " — 차별화 메시지가 잘 전달되고 있습니다."}
      </p>
    );
  }
  return null;
}
