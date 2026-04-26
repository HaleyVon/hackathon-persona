import { ClipboardCheck, Crosshair, LineChart, UsersRound } from "lucide-react";

const steps = [
  {
    icon: ClipboardCheck,
    step: "01",
    title: "설정",
    desc: "검토 타입, 제품 맥락, 비교할 안을 입력합니다.",
  },
  {
    icon: UsersRound,
    step: "02",
    title: "시뮬레이션",
    desc: "5,000명 한국어 페르소나 중 타깃 표본이 즉시 평가합니다.",
  },
  {
    icon: LineChart,
    step: "03",
    title: "분석",
    desc: "세그먼트별 반응, 평가축, 숨은 리스크를 분리합니다.",
  },
  {
    icon: Crosshair,
    step: "04",
    title: "인사이트",
    desc: "실행 가능한 재작성 방향과 다음 검증 대상을 제안합니다.",
  },
];

export default function ValueSection() {
  return (
    <section id="workflow" className="bg-white px-5 py-28 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="lg:sticky lg:top-10">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">How It Works</p>
            <h2 className="mt-4 max-w-md text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl">
              단 4단계로 인사이트를 얻으세요
            </h2>
            <p className="mt-6 max-w-md text-base font-medium leading-7 text-slate-500">
              제품팀이 매주 반복하는 고영향 의사결정을, 리서치 대기 없이 빠르게 구조화합니다.
            </p>
          </div>

          <div className="relative space-y-5">
            <div className="absolute bottom-8 left-7 top-8 hidden w-px bg-blue-100 sm:block" />
            {steps.map(({ icon: Icon, step, title, desc }) => (
              <article key={step} className="relative grid gap-5 rounded-xl border border-slate-200 bg-slate-50 p-6 sm:grid-cols-[3.5rem_1fr] sm:p-7">
                <div className="z-10 flex h-14 w-14 items-center justify-center rounded-full border border-blue-200 bg-white text-blue-600 shadow-sm">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-black text-blue-600">{step}</p>
                  <h3 className="mt-2 text-2xl font-black text-slate-950">{title}</h3>
                  <p className="mt-3 text-sm font-medium leading-7 text-slate-500">{desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
