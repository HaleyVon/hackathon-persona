import { MessageCircle, SearchX, TimerReset } from "lucide-react";

const problems = [
  {
    icon: TimerReset,
    title: "인터뷰는 시간이 너무 걸려요",
    desc: "섭외부터 분석까지 최소 2주. 출시 직전의 메시지, 가격, 기능 결정은 그 속도를 기다려주지 않습니다.",
  },
  {
    icon: SearchX,
    title: "설문은 응답 품질이 낮고 느려요",
    desc: "응답 수를 모아도 타깃 적합도와 실제 행동 저항을 다시 해석해야 합니다.",
  },
  {
    icon: MessageCircle,
    title: "팀 내 의견만으론 부족해요",
    desc: "내부 논의는 내부 편향을 반복합니다. 고객 관점의 기준점이 없으면 결정이 늦어집니다.",
  },
];

export default function ProblemSection() {
  return (
    <section id="signals" className="border-b border-slate-200 bg-white px-5 py-28 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="max-w-md lg:sticky lg:top-10">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">The Problem</p>
            <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl">
              좋은 아이디어인지 확신하기 어려운 이유
            </h2>
            <p className="mt-5 text-base font-medium leading-7 text-slate-500">
              제품팀의 중요한 결정은 빠르게 내려야 하지만, 고객 신호는 항상 늦게 도착합니다.
            </p>
          </div>

          <div className="space-y-5">
            {problems.map(({ icon: Icon, title, desc }) => (
              <article key={title} className="grid gap-5 rounded-xl border border-slate-200 bg-slate-50 p-6 sm:grid-cols-[3.5rem_1fr] sm:p-7">
                <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-blue-200 bg-white text-blue-600 shadow-sm">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-950">{title}</h3>
                  <p className="mt-3 text-sm font-medium leading-7 text-slate-500">{desc}</p>
                </div>
              </article>
            ))}

            <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-7">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">The Solution</p>
              <p className="mt-4 text-2xl font-black leading-tight tracking-tight text-slate-950">
                Persona Signal은 결정 전에 고객 신호를 먼저 보여줍니다.
              </p>
              <p className="mt-4 text-sm font-semibold leading-7 text-blue-900/70">
                정답을 맞히는 도구가 아니라, 출시 후 막힐 가능성이 높은 지점을 먼저 드러내는 리스크 탐지 도구입니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
