import { BadgeDollarSign, Megaphone, PanelsTopLeft } from "lucide-react";

const targets = [
  {
    icon: PanelsTopLeft,
    role: "Product Manager",
    question: "이 기능 정말 필요한가요?",
    use: "기능 우선순위와 nice-to-have 리스크를 세그먼트별로 빠르게 비교합니다.",
  },
  {
    icon: Megaphone,
    role: "Marketer / Growth",
    question: "어떤 카피로 가야 하나요?",
    use: "두 메시지 안의 이해도, 신뢰도, 행동 저항을 분리해 결정 근거를 만듭니다.",
  },
  {
    icon: BadgeDollarSign,
    role: "Founder / CEO",
    question: "이 가격이 납득될까요?",
    use: "가격 플랜의 체감가치와 지불 저항을 출시 전에 먼저 확인합니다.",
  },
];

export default function TargetSection() {
  return (
    <section className="bg-white px-5 py-28 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">Who It&apos;s For</p>
          <h2 className="mt-5 text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl">
            출시 전 의사결정이 필요한 모든 Product Maker를 위한 도구
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {targets.map(({ icon: Icon, role, question, use }) => (
            <article key={role} className="rounded-xl border border-slate-200 bg-slate-50 p-7 transition hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-slate-900/5">
              <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Icon className="h-6 w-6" />
              </div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">{role}</p>
              <h3 className="mt-5 text-2xl font-black leading-tight text-slate-950">{question}</h3>
              <p className="mt-5 text-sm font-medium leading-7 text-slate-500">{use}</p>
            </article>
          ))}
        </div>

        <p className="mt-10 max-w-3xl text-sm font-semibold leading-6 text-slate-400">
          실제 인터뷰를 대체하지 않습니다. 인터뷰 전 가설 검증, 팀 내 논의 기준점 마련, 방향 탐색에 가장 적합합니다.
        </p>
      </div>
    </section>
  );
}
