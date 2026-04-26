interface Props {
  onStart: () => void;
  onDemo: () => void;
}

export default function CTASection({ onStart, onDemo }: Props) {
  return (
    <section className="bg-slate-50 py-24 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
          지금 바로 확인해보세요
        </h2>
        <p className="mt-4 text-base text-slate-500 leading-relaxed">
          카피, 가격, 기능 아이디어를 입력하면 한국인 5,000명 페르소나가
          <br className="hidden sm:block" />
          세그먼트별 반응과 리스크를 알려드립니다.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onStart}
            className="px-8 py-4 rounded-xl bg-blue-600 text-white font-bold text-base hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100 w-full sm:w-auto"
          >
            시뮬레이션 시작하기 →
          </button>
          <button
            onClick={onDemo}
            className="px-6 py-4 rounded-xl border border-amber-300 bg-amber-50 text-amber-700 font-semibold text-sm hover:bg-amber-100 transition-colors w-full sm:w-auto"
          >
            ⚡ 데모 결과 바로 보기
          </button>
        </div>

        <p className="mt-6 text-xs text-slate-400">
          무료 · 가입 불필요 · 데이터: NVIDIA Nemotron-Personas-Korea (CC BY 4.0)
        </p>

        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-wrap justify-center gap-6">
          {[
            { value: "5,000명", label: "한국인 페르소나" },
            { value: "5개 축", label: "평가 지표" },
            { value: "< 30초", label: "결과 대기 시간" },
            { value: "무료", label: "비용" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-lg font-bold text-slate-700">{value}</div>
              <div className="text-xs text-slate-400">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
