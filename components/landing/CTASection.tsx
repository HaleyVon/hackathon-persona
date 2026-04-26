interface Props {
  onStart: () => void;
  onDemo: () => void;
}

export default function CTASection({ onStart, onDemo }: Props) {
  return (
    <section className="bg-slate-50 py-24 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
          지금 바로 시작하세요
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
          무료 데모 · 가입 불필요 · Data: NVIDIA Nemotron-Personas-Korea (CC BY 4.0)
        </p>
      </div>
    </section>
  );
}
