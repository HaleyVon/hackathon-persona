export default function ValueSection() {
  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">How It Works</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
            3분 안에, 이런 걸 알 수 있습니다
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {[
            {
              badge: "카피 / 메시지",
              badgeColor: "bg-indigo-50 text-indigo-600 border-indigo-100",
              title: "어떤 메시지가 더 설득력 있나요?",
              desc: "두 카피 안을 넣으면, 타깃 세그먼트별로 이해도·매력도·신뢰도·저항감을 비교합니다.",
              detail: "\"30대 직장인은 A안이 더 명확했지만, 40대 자영업자는 B안에 더 끌렸습니다.\"",
            },
            {
              badge: "가격 / 플랜",
              badgeColor: "bg-emerald-50 text-emerald-600 border-emerald-100",
              title: "이 가격이 납득될까요?",
              desc: "두 플랜 구조나 가격대를 비교하거나, 단일 가격의 수용도를 세그먼트별로 측정합니다.",
              detail: "\"월 9,900원은 20대에게 부담 없지만, 주부층에서 가격 저항이 감지됩니다.\"",
            },
            {
              badge: "기능 필요성",
              badgeColor: "bg-amber-50 text-amber-600 border-amber-100",
              title: "이 기능이 진짜 필요할까요?",
              desc: "기능 아이디어 하나를 넣으면, 타깃이 얼마나 필요하다고 느끼는지 긴급도와 대안 인식을 측정합니다.",
              detail: "\"기능 아이디어 자체는 좋지만, 기존 엑셀로 충분하다는 반응이 3명 중 1명입니다.\"",
            },
            {
              badge: "놓치기 쉬운 신호",
              badgeColor: "bg-rose-50 text-rose-600 border-rose-100",
              title: "숨겨진 리스크를 먼저 발견하세요",
              desc: "명확하게 이해했지만 행동하지 않는 세그먼트, 결제자-사용자 불일치, 신뢰 갭 같은 신호를 자동으로 감지합니다.",
              detail: "\"이해도는 높은데 구매 의향이 낮은 세그먼트가 있습니다. 신뢰 문제일 수 있습니다.\"",
            },
          ].map(({ badge, badgeColor, title, desc, detail }) => (
            <div key={title} className="rounded-2xl border border-slate-100 p-6 hover:border-slate-200 transition-colors">
              <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full border mb-4 ${badgeColor}`}>
                {badge}
              </span>
              <h3 className="text-base font-bold text-slate-800 mb-2">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-3">{desc}</p>
              <p className="text-xs text-slate-400 italic leading-relaxed bg-slate-50 rounded-lg px-3 py-2">
                {detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
