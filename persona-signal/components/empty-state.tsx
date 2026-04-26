export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 py-16">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
        <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-slate-700 mb-2">
        시뮬레이션을 실행해보세요
      </h3>
      <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
        제품 맥락과 검토안을 입력하면<br />
        타깃 페르소나 관점에서 반응을 구조화해드립니다
      </p>
      <div className="mt-8 grid grid-cols-3 gap-4 w-full max-w-sm">
        {["페르소나 샘플링", "반응 시뮬레이션", "인사이트 집계"].map((step, i) => (
          <div key={step} className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-400">
              {i + 1}
            </div>
            <span className="text-xs text-slate-400 text-center leading-tight">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
