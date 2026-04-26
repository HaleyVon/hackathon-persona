export default function ProblemSection() {
  return (
    <section id="problem-section" className="bg-slate-50 py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">The Problem</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
            좋은 아이디어인지 확신하기 어렵다면,
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              icon: "💬",
              title: "인터뷰는 시간이 너무 걸려요",
              desc: "고객 인터뷰 섭외, 일정 조율, 진행, 분석까지 최소 2주. 출시 일정은 안 기다려줍니다.",
            },
            {
              icon: "📊",
              title: "설문은 응답률이 낮고 느려요",
              desc: "응답 수 확보까지 1~2주. 응답자가 타깃인지도 불확실. 해석은 또 별개 작업입니다.",
            },
            {
              icon: "🤔",
              title: "팀 내 의견만으론 부족해요",
              desc: "내부 논의는 내부 편향을 재생산합니다. 실제 타깃 고객 관점이 없으면 논쟁이 끝나지 않습니다.",
            },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl border border-slate-100 p-6">
              <div className="text-3xl mb-4">{icon}</div>
              <h3 className="text-sm font-bold text-slate-800 mb-2">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-blue-50 border border-blue-100 p-6 text-center">
          <p className="text-base font-semibold text-blue-800">
            결국 팀은 <span className="text-blue-600">불확실한 채로 결정</span>하거나,
            검증을 포기하고 <span className="text-blue-600">직감에 의존</span>합니다.
          </p>
          <p className="mt-2 text-sm text-blue-600">
            Persona Signal은 이 공백을 메웁니다.
          </p>
        </div>
      </div>
    </section>
  );
}
