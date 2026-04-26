export default function PreviewSection() {
  return (
    <section className="bg-slate-50 py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Sample Output</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
            이런 결과를 받아보실 수 있습니다
          </h2>
          <p className="mt-3 text-slate-500 text-base">실제 시뮬레이션 결과 예시입니다.</p>
        </div>

        {/* Decision Brief mock */}
        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm shadow-blue-50 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">의사결정 브리프</span>
            <span className="rounded-full bg-blue-100 text-blue-700 text-[11px] font-semibold px-2 py-0.5">A안 권장</span>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">
            <span className="font-semibold text-slate-900">A안이 더 명확하고 신뢰를 만듭니다.</span>{" "}
            B안은 매력적이지만 혼란 리스크가 높고, 30대 직장인 세그먼트에서 저항이 감지됩니다.
            즉시 수정할 방향: B안의 핵심 혜택을 A안의 신뢰 톤과 결합하세요.
          </p>
        </div>

        {/* KPI cards mock */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "A안 종합 점수", value: "3.8 / 5", sub: "이해도 높음", color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
            { label: "B안 종합 점수", value: "3.2 / 5", sub: "혼란 리스크 감지", color: "text-violet-600", bg: "bg-violet-50 border-violet-100" },
            { label: "권장 안", value: "A안", sub: "세그먼트 6개 중 4개", color: "text-slate-800", bg: "bg-slate-50 border-slate-200" },
          ].map(({ label, value, sub, color, bg }) => (
            <div key={label} className={`rounded-xl border p-4 ${bg}`}>
              <div className="text-xs text-slate-400 mb-1">{label}</div>
              <div className={`text-xl font-bold ${color}`}>{value}</div>
              <div className="text-xs text-slate-400 mt-0.5">{sub}</div>
            </div>
          ))}
        </div>

        {/* Unexpected signals mock */}
        <div className="bg-white rounded-2xl border border-amber-100 p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">놓치기 쉬운 신호</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          </div>
          <div className="space-y-2">
            {[
              { icon: "⚠", text: "명확하게 이해했지만 행동 안 함 — B안에서 이해도는 4.1인데 구매 의향은 2.8입니다. 신뢰 갭 가능성이 있습니다.", color: "text-amber-700 bg-amber-50" },
              { icon: "ℹ", text: "비타깃 표본 희석 — 관련도 'low' 페르소나가 30% 포함됐습니다. 실제 타깃만의 반응은 더 강할 수 있습니다.", color: "text-slate-600 bg-slate-50" },
            ].map(({ icon, text, color }) => (
              <div key={text} className={`rounded-lg px-3 py-2 text-xs leading-relaxed ${color}`}>
                {icon} {text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
