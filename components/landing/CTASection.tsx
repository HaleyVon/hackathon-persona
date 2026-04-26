"use client";

import { ArrowRight, Zap } from "lucide-react";

interface Props {
  onStart: () => void;
  onDemo: () => void;
}

export default function CTASection({ onStart, onDemo }: Props) {
  return (
    <section className="relative overflow-hidden bg-blue-600 px-5 py-32 text-white sm:px-8 lg:py-40">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="absolute -bottom-96 left-1/2 h-[760px] w-[760px] -translate-x-1/2 rounded-full border border-white/15" />
      <div className="absolute -bottom-72 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full border border-white/15" />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
        <div>
          <p className="mb-5 inline-flex rounded-full bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-blue-600">
            Get Started
          </p>
          <h2 className="text-5xl font-black leading-tight tracking-tight sm:text-6xl">
            <span className="block">지금 바로</span>
            <span className="block">시작하세요</span>
          </h2>
          <p className="mx-auto mt-7 max-w-2xl text-lg font-medium leading-8 text-blue-50">
            카피, 가격, 기능 아이디어를 입력하면 한국인 5,000명 페르소나가
            세그먼트별 반응과 리스크를 알려드립니다.
          </p>
        </div>

        <div className="mt-12 grid w-full max-w-xl gap-3 sm:grid-cols-2">
          <button
            onClick={onStart}
            className="inline-flex h-16 items-center justify-center gap-2 rounded-lg bg-white px-6 text-base font-black text-blue-600 shadow-2xl shadow-blue-950/20 transition hover:-translate-y-0.5"
            type="button"
          >
            시뮬레이션 시작하기 <ArrowRight className="h-5 w-5" />
          </button>
          <button
            onClick={onDemo}
            className="inline-flex h-16 items-center justify-center gap-2 rounded-lg border border-amber-300 bg-blue-600 px-6 text-base font-black text-white transition hover:-translate-y-0.5 hover:bg-blue-700"
            type="button"
          >
            <Zap className="h-5 w-5 text-amber-300" />
            데모 결과 바로 보기
          </button>
          <p className="sm:col-span-2 text-center text-xs font-semibold text-blue-100">
            무료 데모 · 가입 불필요 · Data: NVIDIA Nemotron-Personas-Korea (CC BY 4.0)
          </p>
        </div>
      </div>
    </section>
  );
}
