export default function TargetSection() {
  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Who It&apos;s For</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
            이런 분들이 쓰고 있습니다
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              role: "Product Manager",
              emoji: "🗂️",
              pain: "\"이 기능 정말 필요한지 확신이 없어요\"",
              use: "기능 아이디어 3개 중 어느 게 타깃에게 더 필요한지 빠르게 비교합니다.",
            },
            {
              role: "Marketer / Growth",
              emoji: "📢",
              pain: "\"어떤 카피로 가야 할지 팀 내 의견이 갈려요\"",
              use: "두 메시지 안을 넣고 세그먼트별 이해도·매력도를 보고 결정 근거를 만듭니다.",
            },
            {
              role: "Founder / CEO",
              emoji: "🚀",
              pain: "\"가격 설정이 맞는지 불안해요\"",
              use: "가격 플랜 2개를 비교하거나, 현재 가격의 저항 세그먼트를 파악합니다.",
            },
          ].map(({ role, emoji, pain, use }) => (
            <div key={role} className="rounded-2xl border border-slate-100 p-6">
              <div className="text-3xl mb-3">{emoji}</div>
              <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">{role}</div>
              <p className="text-sm font-medium text-slate-700 mb-3 italic">{pain}</p>
              <p className="text-sm text-slate-500 leading-relaxed">{use}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-slate-400">
            실제 인터뷰를 대체하지 않습니다. 인터뷰 전 가설 검증, 팀 내 논의 기준점 마련, 방향 탐색에 적합합니다.
          </p>
        </div>
      </div>
    </section>
  );
}
