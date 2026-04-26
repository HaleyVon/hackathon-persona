import { ArrowUpRight, BadgeCheck, CircleAlert, Layers3 } from "lucide-react";

const kpis = [
  { label: "A안 종합 점수", value: "3.8 / 5", sub: "이해도 높음", tone: "text-blue-600" },
  { label: "B안 종합 점수", value: "3.2 / 5", sub: "혼란 리스크 감지", tone: "text-slate-800" },
  { label: "권장 안", value: "A안", sub: "세그먼트 6개 중 4개", tone: "text-slate-950" },
];

const insights = [
  "30대 직장인은 A안이 더 명확했지만, 구매 승인자는 보안 근거를 먼저 요구했습니다.",
  "이해도는 높지만 구매 의향이 낮은 세그먼트가 있어 신뢰 갭을 보강해야 합니다.",
  "비타깃 표본을 낮은 가중치로 반영해 평균이 지나치게 예뻐지는 문제를 줄였습니다.",
];

export default function PreviewSection() {
  return (
    <section className="border-y border-slate-200 bg-[#f8fafc] px-5 py-28 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 max-w-3xl">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">Sample Output</p>
            <h2 className="mt-5 max-w-3xl text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl">
              평균 점수 뒤에 숨은 출시 리스크까지 보여줍니다
            </h2>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-xl border border-slate-200 bg-white p-7 shadow-2xl shadow-slate-900/5">
            <div className="mb-7 flex flex-wrap items-start justify-between gap-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Decision Brief</p>
                <h3 className="mt-2 text-3xl font-black tracking-tight text-slate-950">A안으로 출시하되, 보안 근거를 보강하세요</h3>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-3 py-1.5 text-xs font-black text-white">
                <BadgeCheck className="h-4 w-4" />
                A안 권장
              </span>
            </div>

            <p className="max-w-3xl text-base font-semibold leading-8 text-slate-600">
              A안은 명확성과 신뢰도가 높아 첫 출시 후보로 적합합니다. 다만 B2B 구매 맥락에서는 데이터 보관,
              삭제, 접근 권한 근거가 부족하면 행동으로 이어지지 않을 수 있습니다.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {kpis.map(({ label, value, sub, tone }) => (
                <div key={label} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-bold text-slate-400">{label}</p>
                  <p className={`mt-2 text-2xl font-black tracking-tight ${tone}`}>{value}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">{sub}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-4">
              {insights.map((item, index) => (
                <div key={item} className="flex gap-3 rounded-lg border border-slate-200 bg-white p-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-black text-blue-600">
                    {index + 1}
                  </span>
                  <p className="text-sm font-semibold leading-6 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6">
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-7">
              <div className="mb-5 flex items-center gap-2 text-sm font-black text-amber-800">
                <CircleAlert className="h-5 w-5" />
                Unexpected Signals
              </div>
              <div className="space-y-4">
                {[
                  ["명확하지만 행동 안 함", "B안에서 이해도는 4.1인데 구매 의향은 2.8입니다. 신뢰 갭 가능성이 있습니다."],
                  ["구매자-사용자 불일치", "실사용자는 자동화를 좋아하지만 승인권자는 보안 통제 근거를 먼저 봅니다."],
                ].map(([title, desc]) => (
                  <div key={title} className="rounded-lg bg-white/70 p-4">
                    <p className="text-sm font-black text-slate-950">{title}</p>
                    <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-7">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Next Action</p>
                  <h3 className="mt-2 text-2xl font-black text-slate-950">수정 제안 3개 생성</h3>
                </div>
                <Layers3 className="h-6 w-6 text-blue-600" />
              </div>
              <button className="inline-flex w-full items-center justify-between rounded-lg bg-slate-950 px-4 py-3 text-sm font-black text-white" type="button">
                개선안 보기
                <ArrowUpRight className="h-4 w-4" />
              </button>
              <p className="mt-4 text-sm font-medium leading-6 text-slate-500">
                발견된 리스크를 반영해 카피, 가격 설명, 기능 우선순위를 바로 수정할 수 있게 제안합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
