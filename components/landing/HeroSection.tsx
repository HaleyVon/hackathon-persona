"use client";

import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  Gauge,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  UsersRound,
  Zap,
} from "lucide-react";

interface Props {
  onStart: () => void;
  onDemo: () => void;
}

const segments = [
  ["20대 대학생", "4.1", "3.2", "w-[86%]", "w-[58%]"],
  ["30대 직장인", "4.0", "2.6", "w-[80%]", "w-[42%]"],
  ["40대 자영업자", "3.6", "3.9", "w-[63%]", "w-[76%]"],
  ["주부", "3.7", "3.1", "w-[68%]", "w-[52%]"],
  ["기타 / 비타깃", "2.1", "1.8", "w-[36%]", "w-[28%]"],
];

const stats = [
  { icon: UsersRound, label: "5,000+", value: "Korean synthetic personas" },
  { icon: Clock3, label: "10 Seconds", value: "decision-ready insight" },
  { icon: ShieldCheck, label: "Interview-Free", value: "risk signal first" },
];

export default function HeroSection({ onStart, onDemo }: Props) {
  return (
    <section className="relative min-h-screen overflow-hidden border-b border-slate-200 bg-[#f8fafc] text-slate-950">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(180deg,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:72px_72px]" />
      <div className="absolute left-[37%] top-10 h-[760px] w-[760px] rounded-full border border-blue-500/15" />
      <div className="absolute left-[43%] top-28 h-[520px] w-[520px] rounded-full border border-blue-500/15" />
      <div className="absolute left-[49%] top-48 h-72 w-72 rounded-full border border-blue-500/15" />
      <div className="absolute left-[56%] top-[310px] hidden h-8 w-8 rounded-full bg-blue-600 shadow-[0_0_80px_rgba(37,99,235,0.55)] sm:block" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent" />

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <button type="button" onClick={onStart} className="flex items-center gap-3 text-left">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-black text-white shadow-lg shadow-blue-600/20">
            PS
          </span>
          <span className="text-base font-extrabold tracking-tight">Persona Signal</span>
        </button>
        <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-500 md:flex">
          <a href="#product" className="transition-colors hover:text-slate-950">Product</a>
          <a href="#signals" className="transition-colors hover:text-slate-950">Use Cases</a>
          <a href="#workflow" className="transition-colors hover:text-slate-950">How It Works</a>
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onDemo}
            className="hidden rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:border-slate-300 sm:inline-flex"
          >
            View demo
          </button>
          <button
            type="button"
            onClick={onStart}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-black text-white shadow-xl shadow-blue-600/20 transition hover:bg-blue-700"
          >
            Start <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl items-center gap-10 px-5 pb-14 pt-8 sm:px-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-blue-700 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            AI Pre-validation Platform
          </div>
          <h1 className="max-w-3xl text-[clamp(3.25rem,7vw,6.9rem)] font-black uppercase leading-[0.9] tracking-normal text-slate-950">
            <span className="block">Validate</span>
            <span className="block">Before</span>
            <span className="block">You Build</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg font-medium leading-8 text-slate-600">
            카피, 가격, 기능안을 출시 전에 검증하세요.
            5,000명 합성 페르소나가 세그먼트별 반응과 숨은 리스크를 보여줍니다.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onStart}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-lg bg-blue-600 px-7 text-base font-black text-white shadow-2xl shadow-blue-600/25 transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              시뮬레이션 시작하기 <ArrowRight className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={onDemo}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-lg border border-amber-300 bg-white px-7 text-base font-black text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-400 hover:bg-amber-50"
            >
              <Zap className="h-5 w-5 text-amber-500" />
              데모 결과 바로 보기
            </button>
          </div>
          <div className="mt-9 grid max-w-2xl gap-4 sm:grid-cols-3">
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-200 bg-white text-blue-600 shadow-sm">
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-black text-slate-950">{label}</span>
                  <span className="block text-xs font-semibold text-slate-500">{value}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <ProductPanel />
      </div>
    </section>
  );
}

function ProductPanel() {
  return (
    <div id="product" className="relative mx-auto w-full max-w-3xl">
      <div className="absolute -left-8 top-8 hidden w-72 rounded-xl border border-slate-200 bg-white/90 p-5 shadow-2xl shadow-slate-900/10 backdrop-blur md:block">
        <div className="mb-3 text-xs font-black uppercase tracking-wider text-slate-500">Decision Brief</div>
        <div className="mb-3 inline-flex rounded-full bg-blue-600 px-2.5 py-1 text-xs font-black text-white">A안 권장</div>
        <p className="text-sm font-semibold leading-6 text-slate-700">
          A안이 더 명확하고 신뢰를 만듭니다. B안은 매력적이지만 30대 직장인 세그먼트에서 저항이 감지됩니다.
        </p>
        <button className="mt-4 text-sm font-black text-blue-600" type="button">전체 요약 보기 →</button>
      </div>

      <div className="ml-auto grid w-full gap-4 lg:w-[86%]">
        <div className="grid grid-cols-3 gap-3">
          {[
            ["A안 종합 점수", "3.8", "이해도 높음"],
            ["B안 종합 점수", "3.2", "혼란 리스크 감지"],
            ["권장 안", "A안", "6개 세그먼트 중 4개"],
          ].map(([label, value, sub]) => (
            <div key={label} className="rounded-xl border border-slate-200 bg-white/90 p-4 shadow-xl shadow-slate-900/5 backdrop-blur">
              <p className="text-[11px] font-bold text-slate-400">{label}</p>
              <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                {value}
                {value.match(/^\d/) && <span className="text-base font-bold text-slate-400"> /5</span>}
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-500">{sub}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.12fr_0.88fr]">
          <div className="rounded-xl border border-slate-200 bg-white/95 p-5 shadow-2xl shadow-slate-900/10 backdrop-blur">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-blue-600">Segment Response</p>
                <h3 className="mt-1 text-lg font-black text-slate-950">세그먼트 비교</h3>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-blue-600" />A안</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-slate-300" />B안</span>
              </div>
            </div>
            <div className="space-y-3">
              {segments.map(([name, a, b, aw, bw]) => (
                <div key={name} className="grid grid-cols-[7.5rem_1fr_2.25rem_2.25rem] items-center gap-3 text-xs">
                  <span className="font-bold text-slate-600">{name}</span>
                  <span className="space-y-1.5">
                    <span className="block h-2 rounded-full bg-slate-100">
                      <span className={`block h-2 rounded-full bg-blue-600 ${aw}`} />
                    </span>
                    <span className="block h-2 rounded-full bg-slate-100">
                      <span className={`block h-2 rounded-full bg-slate-300 ${bw}`} />
                    </span>
                  </span>
                  <span className="font-black text-slate-900">{a}</span>
                  <span className="font-bold text-slate-400">{b}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white/95 p-5 shadow-2xl shadow-slate-900/10 backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-black uppercase tracking-wider text-slate-500">Risk Profile</p>
              <Gauge className="h-4 w-4 text-blue-600" />
            </div>
            <div className="relative mx-auto aspect-square max-w-64">
              <div className="absolute inset-3 rounded-full border border-slate-200" />
              <div className="absolute inset-10 rounded-full border border-slate-200" />
              <div className="absolute inset-[4.25rem] rounded-full border border-slate-200" />
              <div className="absolute left-1/2 top-4 h-[calc(100%-2rem)] w-px -translate-x-1/2 bg-slate-200" />
              <div className="absolute left-4 top-1/2 h-px w-[calc(100%-2rem)] -translate-y-1/2 bg-slate-200" />
              <div className="absolute inset-[18%] rotate-12 rounded-[42%] border-2 border-blue-600 bg-blue-500/10" />
              <div className="absolute inset-[27%] -rotate-6 rounded-[42%] border-2 border-slate-400 bg-slate-400/10" />
              <div className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-bold text-slate-500">
              {["명확성", "신뢰도", "가치 인식", "수용도"].map((item) => (
                <span key={item} className="rounded-md bg-slate-50 px-2 py-1">{item}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="ml-auto w-full rounded-xl border border-amber-200 bg-amber-50/95 p-4 shadow-2xl shadow-amber-900/10 backdrop-blur lg:w-[72%]">
          <div className="mb-3 flex items-center gap-2 text-sm font-black text-amber-800">
            <TriangleAlert className="h-4 w-4" />
            놓치기 쉬운 신호
          </div>
          <div className="grid gap-2 text-xs font-semibold leading-5 text-amber-900 sm:grid-cols-2">
            <p className="rounded-lg bg-white/60 p-3">명확하지만 행동 안 함: 구매 의향은 2.8입니다.</p>
            <p className="rounded-lg bg-white/60 p-3">비타깃 표본 희석: 관련도 low 페르소나 30% 포함.</p>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-8 left-4 hidden items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-xs font-black text-blue-700 shadow-xl shadow-blue-900/10 md:flex">
        <CheckCircle2 className="h-4 w-4" />
        Signals ready for product review
      </div>
      <div className="absolute -right-4 top-1/2 hidden rounded-full border border-slate-200 bg-white p-3 text-blue-600 shadow-xl shadow-blue-900/10 lg:block">
        <BarChart3 className="h-5 w-5" />
      </div>
    </div>
  );
}
