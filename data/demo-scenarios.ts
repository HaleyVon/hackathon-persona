import baseResponse from "@/data/demo-response.json";
import { SimulationRequest, SimulationResponse } from "@/lib/types";

export type DemoScenario = {
  id: string;
  label: string;
  description: string;
  request: SimulationRequest;
  response: SimulationResponse;
};

function cloneResponse(): SimulationResponse {
  const cloned = JSON.parse(JSON.stringify(baseResponse)) as SimulationResponse;
  return {
    ...cloned,
    summary: {
      ...cloned.summary,
      relevanceMix: cloned.summary.relevanceMix ?? { high: 50, medium: 30, low: 20 },
    },
    personas: cloned.personas.map((persona) => ({
      ...persona,
      relevance: persona.relevance ?? { level: "medium", weight: 0.7, reason: "데모 데이터 기본값" },
    })),
  };
}

function duplicatePersonas(response: SimulationResponse, target = 10): SimulationResponse {
  const personas = [...response.personas];
  let cursor = 0;
  while (personas.length < target) {
    const base = response.personas[cursor % response.personas.length];
    personas.push({
      ...JSON.parse(JSON.stringify(base)),
      persona: { ...base.persona, id: Number(`${base.persona.id}${personas.length}`) },
    });
    cursor += 1;
  }
  return { ...response, personas };
}

function scenarioResponse(patch: Partial<SimulationResponse["summary"]>): SimulationResponse {
  const base = duplicatePersonas(cloneResponse());
  return { ...base, summary: { ...base.summary, ...patch } };
}

// ─────────────────────────────────────────────────────────
// Scenario 1: B2B SaaS 랜딩 — "보안이 막는 SaaS 랜딩"
// 스토리: 실사용자는 좋아하는데, 구매 승인자가 막는다
// 타깃: IT/기획/마케팅 직군, 25~42세, 서울/경기
// ─────────────────────────────────────────────────────────
const b2bMessageRequest: SimulationRequest = {
  productDescription:
    "B2B 영업팀과 CS팀이 고객 미팅 녹취나 콜 메모를 업로드하면 AI가 고객 요구사항, 다음 액션, 리스크 키워드를 정리해 CRM에 붙여주는 SaaS입니다. 베타 고객은 30~300명 규모의 B2B SaaS 회사이고, 데모 후 가장 자주 막히는 질문은 '고객 대화 데이터를 AI에 넣어도 되는가', '퇴사자나 외주 인력이 녹취를 볼 수 있는가'입니다. 마케팅팀은 AI 자동 요약으로 생산성 메시지를 크게 밀고 싶어하고, 세일즈팀은 보안 질문 때문에 계약 검토가 2주씩 늘어난다고 보고 있습니다.",
  targetCustomer:
    "Head of Sales, CS Lead, RevOps Manager처럼 고객 대화 데이터를 다루는 팀의 구매 검토자와 실제로 콜 메모를 남기는 AE/CSM",
  marketType: "B2B",
  usageContext:
    "랜딩 페이지 첫 화면의 헤드라인을 정하는 상황입니다. 목표 지표는 데모 신청 전환율이지만, 실제 병목은 데모 이후 보안 질의로 세일즈 사이클이 길어지는 문제입니다. 구매 검토자는 보안/권한/삭제 정책을 먼저 확인하고, 실제 사용자는 콜 종료 후 CRM 입력 시간을 줄이고 싶어합니다.",
  variantA: "고객 미팅을 자동 요약해 CRM 업데이트 시간을 절반으로 줄이세요",
  variantB: "민감한 고객 대화는 보호하고, 영업팀이 할 일만 CRM에 남깁니다",
  filters: {
    sexes: [],
    ageMin: 25,
    ageMax: 42,
    occupations: ["IT/개발", "기획", "마케팅"],
    provinces: ["서울", "경기"],
    maritalStatuses: [],
  },
  sampleSize: 10,
  decisionMode: "compare",
  inputType: "copy",
};

const b2bMessageResponse = scenarioResponse({
  decisionMode: "compare",
  inputType: "copy",
  winner: "B",
  avgScoreA: 3.3,
  avgScoreB: 4.2,
  riskAxesA: { comprehension: 4.2, trust: 2.5, appeal: 4.0, resistance: 2.4, confusionRisk: 2.8 },
  riskAxesB: { comprehension: 4.5, trust: 3.8, appeal: 3.8, resistance: 1.8, confusionRisk: 1.5 },
  topLikedPoints: [
    "B안은 세일즈 사이클을 늦추는 핵심 질문인 '고객 대화 보안'을 첫 문장부터 정면으로 다룹니다.",
    "CRM에 남길 것만 남긴다는 결과 중심 표현이 실사용자(AE/CSM)의 반복 업무와 바로 연결됩니다.",
    "민감한 고객 대화라는 표현이 구매 승인자의 검토 기준인 데이터 접근 범위를 직접 건드립니다.",
  ],
  topConcerns: [
    "A안은 생산성 개선은 매력적이지만 '고객 대화 데이터를 다룬다'는 민감도가 보이지 않아 보안팀에서 막힐 수 있습니다.",
    "B안도 읽기 전용 권한, 보관 기간, 삭제 정책 중 하나라도 없으면 계약 검토 2주 문제는 해결되지 않습니다.",
  ],
  recommendedCopies: [
    "고객 대화 원문은 보호하고, 영업팀에는 다음 액션과 리스크 키워드만 CRM에 남깁니다.",
    "읽기 권한과 보관 기간을 직접 통제하면서 미팅 액션아이템을 CRM에 자동 기록하세요.",
    "AI 요약보다 먼저, 고객 데이터가 어떻게 보호되는지 CTA 위에 보여주세요.",
  ],
  oneParagraphInsight:
    "이 케이스의 핵심은 AI 요약의 매력이 아니라 고객 대화 데이터에 대한 구매 승인 리스크입니다. B안은 세일즈 사이클을 늦추는 보안 질문을 먼저 건드리지만, 권한/보관 기준이 CTA 근처에 없으면 구매 승인자는 여전히 멈출 가능성이 큽니다. A안을 밀어붙이면 데모 신청은 늘어도 계약 클로징이 더 느려질 수 있습니다.",
  relevanceMix: { high: 70, medium: 20, low: 10 },
  confidence: {
    level: "medium",
    label: "중간 신뢰도",
    description: "B안이 우세하지만 구매 승인자와 실사용자의 반응 차이로 세그먼트별 재확인 권장",
  },
  cautionSignals: [
    {
      code: "small_sample",
      label: "표본 10명",
      description: "IT/기획/마케팅 직군 내 RevOps·보안 담당자는 별도 검증을 권장합니다.",
      severity: "info",
    },
    {
      code: "mixed_reactions",
      label: "직군별 반응 분산",
      description: "기획/마케팅은 B안을 강하게 선호하지만 IT/개발 직군은 두 안 모두 보안 근거 부족을 지적합니다.",
      severity: "warning",
    },
  ],
  segmentBreakdown: [
    {
      label: "IT/개발",
      preferA: 2, preferB: 2, tie: 0, total: 4,
      winner: "Tie",
      avgScoreA: 3.2, avgScoreB: 3.5,
      avgTrustA: 2.2, avgTrustB: 3.0,
      avgResistanceA: 2.5, avgResistanceB: 2.0,
      avgConfusionA: 2.5, avgConfusionB: 1.8,
    },
    {
      label: "기획/마케팅",
      preferA: 1, preferB: 5, tie: 0, total: 6,
      winner: "B",
      avgScoreA: 3.3, avgScoreB: 4.6,
      avgTrustA: 2.7, avgTrustB: 4.3,
      avgResistanceA: 2.3, avgResistanceB: 1.6,
      avgConfusionA: 3.0, avgConfusionB: 1.3,
    },
    {
      label: "25~33세",
      preferA: 2, preferB: 3, tie: 0, total: 5,
      winner: "B",
      avgScoreA: 3.4, avgScoreB: 4.0,
      avgTrustA: 2.6, avgTrustB: 3.6,
      avgResistanceA: 2.4, avgResistanceB: 1.9,
      avgConfusionA: 2.8, avgConfusionB: 1.6,
    },
    {
      label: "34~42세",
      preferA: 1, preferB: 4, tie: 0, total: 5,
      winner: "B",
      avgScoreA: 3.1, avgScoreB: 4.4,
      avgTrustA: 2.4, avgTrustB: 4.0,
      avgResistanceA: 2.3, avgResistanceB: 1.7,
      avgConfusionA: 2.6, avgConfusionB: 1.4,
    },
  ],
  segmentInsights: {
    resistant: {
      label: "IT/개발 직군",
      title: "보안 경험자는 두 안 모두 불충분하다고 봅니다",
      description: "IT/개발 직군은 B안에도 읽기 전용 권한, 보관 기간, 감사 로그 여부가 없으면 동의하지 않습니다. 헤드라인 아래에 기술 근거가 필요합니다.",
      preferredVariant: "Tie",
    },
    niche: {
      label: "34~42세 중간 관리자",
      title: "경험이 많을수록 B안을 강하게 선호합니다",
      description: "34세 이상 직군에서 B안 선호도가 4.4로 크게 높아집니다. 보안 질문을 직접 경험한 구매 검토자일수록 A안의 생산성 메시지보다 B안의 보호 프레임에 반응합니다.",
      preferredVariant: "B",
    },
    testFirst: {
      label: "기획/마케팅 직군",
      title: "구매 의향 격차가 가장 큰 세그먼트",
      description: "기획/마케팅은 A안 3.3 → B안 4.6으로 격차가 1.3점입니다. 이 세그먼트에서 B안 메시지를 먼저 검증하면 전환율 개선 가능성이 가장 높습니다.",
      preferredVariant: "B",
    },
  },
  unexpectedSignals: [
    {
      code: "trust_gap",
      title: "AI 효율보다 보안 승인 질문이 먼저 나옵니다",
      description: "실사용자는 CRM 입력 시간을 줄이고 싶어하지만 구매 검토자는 고객 대화 원문이 어디에 저장되는지부터 묻습니다. 헤드라인 바로 아래에 권한/보관/삭제 기준을 배치하지 않으면 데모 신청 이후 클로징이 계속 늦어집니다.",
      severity: "critical",
    },
    {
      code: "hidden_segment_risk",
      title: "좋아하는 사람과 승인하는 사람이 다릅니다",
      description: "AE/CSM은 자동 기록을 좋아하지만 RevOps와 보안 담당자는 접근 권한과 감사 로그를 먼저 봅니다. 한 줄 메시지만으로는 내부 공유 단계에서 막힐 수 있습니다.",
      severity: "warning",
    },
  ],
});

// ─────────────────────────────────────────────────────────
// Scenario 2: 스프린트 기능 결정 — "다음 스프린트 기능"
// 스토리: 명확한 승자 — 모든 세그먼트에서 B안이 압도
// 타깃: IT/기획/마케팅, 25~42세, 서울/경기/부산
// ─────────────────────────────────────────────────────────
const b2bFeatureRequest: SimulationRequest = {
  productDescription:
    "프로덕트/운영팀 회의 녹취를 받아 결정사항, 오너, 마감일을 정리해주는 협업 SaaS입니다. 현재 팀은 다음 스프린트에 기능 하나만 넣을 수 있고, 개발 리소스는 2주뿐입니다. 개발팀은 회의 요약을 위키에 저장하는 기능이 구현이 쉽다고 보고, PM은 회의 후 담당자와 마감일이 안 정해져 일이 빠지는 문제가 더 크다고 봅니다.",
  targetCustomer:
    "주 5회 이상 회의를 진행하고 회의 후 액션아이템 정리에 시간을 쓰는 PM, 팀 리더, 운영 담당자",
  marketType: "B2B",
  usageContext:
    "스프린트 플래닝 전에 다음 릴리즈의 핵심 기능을 하나 고르는 상황입니다. 성공 지표는 기능 사용률이 아니라 회의 후 24시간 내 액션아이템 생성률, 담당자 지정률, 슬랙 리마인드 클릭률입니다.",
  variantA: "회의 요약을 노션/컨플루언스 팀 위키에 자동 저장하는 기능",
  variantB: "회의가 끝나면 담당자, 마감일, 우선순위를 뽑아 슬랙으로 확인 요청을 보내는 기능",
  filters: {
    sexes: [],
    ageMin: 25,
    ageMax: 42,
    occupations: ["IT/개발", "기획", "마케팅"],
    provinces: ["서울", "경기", "부산"],
    maritalStatuses: [],
  },
  sampleSize: 10,
  decisionMode: "compare",
  inputType: "feature",
};

const b2bFeatureResponse = scenarioResponse({
  decisionMode: "compare",
  inputType: "feature",
  winner: "B",
  avgScoreA: 2.8,
  avgScoreB: 4.5,
  riskAxesA: { comprehension: 3.5, trust: 2.8, appeal: 3.0, resistance: 2.2, confusionRisk: 3.1 },
  riskAxesB: { comprehension: 4.7, trust: 4.3, appeal: 4.5, resistance: 1.3, confusionRisk: 1.2 },
  typeAxesA: { necessity: 2.6, urgency: 2.2, existingSolutionAwareness: 2.5 },
  typeAxesB: { necessity: 4.6, urgency: 4.1, existingSolutionAwareness: 4.2 },
  topLikedPoints: [
    "B안은 회의 후 실제로 일이 빠지는 지점인 '담당자와 마감일 미확정'을 정면으로 해결합니다.",
    "슬랙 확인 요청까지 이어지는 흐름이 PM의 후속 관리 부담을 구조적으로 줄입니다.",
    "기존 노션/위키 대비 '확인을 받는다'는 점이 차별화로 명확하게 인식됩니다.",
  ],
  topConcerns: [
    "자동 지정이 틀렸을 때 누가 수정하는지 승인 흐름이 없으면 팀 혼선을 만들 수 있습니다.",
    "A안은 구현은 쉬워 보이지만 이미 노션으로 하고 있어 사용자가 매일 돌아올 이유가 약합니다.",
  ],
  recommendedCopies: [
    "담당자와 마감일은 AI가 초안으로 만들고, 팀원이 슬랙에서 1클릭으로 확인하게 하세요.",
    "위키 저장이 아니라 '누가 무엇을 언제까지 할지'를 핵심 가치로 올리세요.",
    "자동 생성 후 수정 가능한 흐름을 기능 설명과 온보딩에 포함하면 초기 신뢰가 높아집니다.",
  ],
  oneParagraphInsight:
    "이 케이스는 팀 논쟁이 있을 때 데이터가 얼마나 빠르게 방향을 잡아주는지 보여줍니다. 개발 편의성(A안)과 실제 사용자 고통 해결(B안) 중 무엇이 더 강한 동기를 만드는지를 물었을 때, 모든 세그먼트가 B안을 압도적으로 선택했습니다. 단, 자동 지정의 수정 흐름을 함께 설계해야 팀 리더가 실제로 채택합니다.",
  relevanceMix: { high: 80, medium: 18, low: 2 },
  confidence: {
    level: "high",
    label: "높은 신뢰도",
    description: "B안이 모든 세그먼트에서 1.5점 이상 차이로 압도합니다. 추가 검증 없이 B안으로 진행 가능합니다.",
  },
  cautionSignals: [
    {
      code: "residual_risk",
      label: "승인 흐름 미설계 리스크",
      description: "B안 선택은 명확하지만, 자동 담당자 지정이 틀렸을 때 수정하는 흐름이 없으면 팀 리더가 채택을 꺼릴 수 있습니다.",
      severity: "info",
    },
  ],
  segmentBreakdown: [
    {
      label: "IT/개발",
      preferA: 0, preferB: 4, tie: 0, total: 4,
      winner: "B",
      avgScoreA: 2.6, avgScoreB: 4.4,
      avgTrustA: 2.5, avgTrustB: 4.2,
      avgResistanceA: 2.3, avgResistanceB: 1.4,
      avgConfusionA: 3.2, avgConfusionB: 1.2,
    },
    {
      label: "기획",
      preferA: 0, preferB: 3, tie: 0, total: 3,
      winner: "B",
      avgScoreA: 2.9, avgScoreB: 4.6,
      avgTrustA: 3.0, avgTrustB: 4.4,
      avgResistanceA: 2.1, avgResistanceB: 1.2,
      avgConfusionA: 3.0, avgConfusionB: 1.1,
    },
    {
      label: "마케팅",
      preferA: 0, preferB: 3, tie: 0, total: 3,
      winner: "B",
      avgScoreA: 2.9, avgScoreB: 4.5,
      avgTrustA: 2.8, avgTrustB: 4.3,
      avgResistanceA: 2.2, avgResistanceB: 1.3,
      avgConfusionA: 3.0, avgConfusionB: 1.3,
    },
    {
      label: "25~33세",
      preferA: 0, preferB: 5, tie: 0, total: 5,
      winner: "B",
      avgScoreA: 2.8, avgScoreB: 4.4,
      avgTrustA: 2.7, avgTrustB: 4.2,
      avgResistanceA: 2.2, avgResistanceB: 1.3,
      avgConfusionA: 3.1, avgConfusionB: 1.2,
    },
  ],
  segmentInsights: {
    niche: {
      label: "전 세그먼트",
      title: "예외 없이 B안을 선택했습니다",
      description: "IT/개발·기획·마케팅 직군, 25~33세·34~42세 모두 B안을 선택했습니다. 이처럼 전 세그먼트가 동일한 방향을 가리키는 경우는 드뭅니다. 팀 내 이견이 있더라도 데이터 근거로 빠르게 결정할 수 있습니다.",
      preferredVariant: "B",
    },
    testFirst: {
      label: "팀 리더 세그먼트",
      title: "채택의 병목은 승인 흐름 설계입니다",
      description: "선호도는 B안이 압도적이지만, 자동 담당자 지정의 수정 흐름이 없으면 팀 리더가 실제 사용을 꺼릴 수 있습니다. 이 점만 보완하면 채택률이 높아질 것으로 예상됩니다.",
      preferredVariant: "B",
    },
  },
  unexpectedSignals: [
    {
      code: "clarity_without_action",
      title: "정확도보다 수정 흐름이 더 중요할 수 있습니다",
      description: "담당자 자동 생성은 강한 must-have 신호가 있지만, AI가 틀렸을 때 바로 수정할 수 있다는 통제감이 없으면 팀 리더는 리스크로 봅니다. '초안 + 확인' 프레임을 기능 설명에 포함하세요.",
      severity: "warning",
    },
  ],
});

// ─────────────────────────────────────────────────────────
// Scenario 3: D2C SaaS 가격표 — "싼 가격이 오히려 구매를 막는다"
// 스토리: 종량제가 저렴해 보여도 예측 불가능이 거부감을 만든다
// 타깃: 자영업/마케팅/경영, 28~45세
// ─────────────────────────────────────────────────────────
const commercePricingRequest: SimulationRequest = {
  productDescription:
    "정기배송을 운영하는 D2C 브랜드가 구독 주문, 배송 주기 변경, 결제 실패, 재고 알림, 해지 방어 캠페인을 한 화면에서 관리하는 SaaS입니다. 현재 베타 고객은 건강식품, 반려동물 용품, 커피 구독 브랜드이고 월 구독 주문은 100~2,000건 사이입니다. 영업팀은 시작 가격을 낮춰야 리드가 늘어난다고 주장하고, 운영팀은 주문이 늘수록 월 비용이 예측되지 않으면 대표가 결제를 꺼린다고 봅니다.",
  targetCustomer:
    "월 구독 주문 100~2,000건 사이의 D2C 브랜드 대표, 운영 매니저, CRM 마케터",
  marketType: "B2B",
  usageContext:
    "가격 페이지 개편 직전입니다. 목표는 무료 상담 신청률을 높이되, 상담 후 가격 설명에서 이탈하는 비율을 줄이는 것입니다. 구매자는 대표나 운영 리드이고, 실제 사용자는 고객 문의와 구독 변경을 처리하는 운영 담당자입니다.",
  variantA: "월 49,000원 고정 요금. 구독 주문 500건까지 추가 비용 없이 관리",
  variantB: "주문 1건당 120원. 주문이 없으면 비용도 없는 사용량 기반 요금",
  filters: {
    sexes: [],
    ageMin: 28,
    ageMax: 45,
    occupations: ["자영업", "마케팅", "기획"],
    provinces: ["서울", "경기", "인천"],
    maritalStatuses: [],
  },
  sampleSize: 10,
  decisionMode: "compare",
  inputType: "pricing",
};

const commercePricingResponse = scenarioResponse({
  decisionMode: "compare",
  inputType: "pricing",
  winner: "A",
  avgScoreA: 4.0,
  avgScoreB: 2.9,
  riskAxesA: { comprehension: 4.5, trust: 4.0, appeal: 3.9, resistance: 1.8, confusionRisk: 1.5 },
  riskAxesB: { comprehension: 3.8, trust: 2.8, appeal: 3.2, resistance: 2.6, confusionRisk: 2.9 },
  typeAxesA: { perceivedValue: 4.2, affordability: 3.8, willingnessToPay: 3.9 },
  typeAxesB: { perceivedValue: 3.0, affordability: 3.5, willingnessToPay: 2.7 },
  topLikedPoints: [
    "A안은 대표와 운영 매니저가 월 비용을 바로 예측할 수 있어 다음 달 청구액 불안이 없습니다.",
    "500건 기준이 명확해 상담 전 자기 브랜드 규모에 대입하기 쉽습니다.",
    "고정 요금은 성수기와 비성수기 상관없이 비용을 계획에 넣을 수 있다는 안정감을 줍니다.",
  ],
  topConcerns: [
    "초기 브랜드(월 50건 이하)는 49,000원도 고정비로 느낄 수 있어 첫 달 무료/체험 장치가 없으면 진입이 어렵습니다.",
    "B안은 단가는 싸 보여도 성수기 주문량에서 월 비용을 다시 계산해야 해 운영 담당자에게 인지 부담이 됩니다.",
  ],
  recommendedCopies: [
    "월 49,000원으로 500건까지, 성수기에도 청구액 걱정 없이 관리하세요.",
    "초기 브랜드는 첫 달 무료로 주문량을 확인한 뒤 고정 요금으로 전환하세요.",
    "가격표에 주문 100·300·500·1,000건 기준 예상 월 비용 비교를 같이 보여주세요.",
  ],
  oneParagraphInsight:
    "이 케이스는 '낮은 단가 = 더 쉬운 구매'라는 가정이 틀릴 수 있음을 보여줍니다. B2B 구매자는 낮은 단가보다 예측 가능한 월 비용을 더 신뢰합니다. 주문당 120원은 계산기를 꺼내야 하는 순간 구매 의향을 떨어뜨리고, 특히 성수기 물량이 있는 브랜드에서 저항감이 강해집니다.",
  relevanceMix: { high: 60, medium: 28, low: 12 },
  confidence: {
    level: "medium",
    label: "중간 신뢰도",
    description: "A안이 전반적으로 우세하지만 초기 소규모 브랜드(월 100건 이하)에서는 B안 선호가 역전될 수 있어 별도 확인 권장",
  },
  cautionSignals: [
    {
      code: "close_call",
      label: "소규모 브랜드에서 B안 역전 가능",
      description: "자영업·소규모 브랜드(월 100건 이하)는 49,000원 고정이 부담스러울 수 있습니다. 이 세그먼트만 따로 보면 B안이 우세할 가능성이 있습니다.",
      severity: "warning",
    },
  ],
  segmentBreakdown: [
    {
      label: "자영업",
      preferA: 1, preferB: 2, tie: 0, total: 3,
      winner: "B",
      avgScoreA: 3.4, avgScoreB: 3.7,
      avgTrustA: 3.2, avgTrustB: 2.9,
      avgResistanceA: 2.6, avgResistanceB: 2.2,
      avgConfusionA: 1.8, avgConfusionB: 3.2,
    },
    {
      label: "마케팅/기획",
      preferA: 6, preferB: 1, tie: 0, total: 7,
      winner: "A",
      avgScoreA: 4.3, avgScoreB: 2.5,
      avgTrustA: 4.3, avgTrustB: 2.7,
      avgResistanceA: 1.4, avgResistanceB: 2.8,
      avgConfusionA: 1.3, avgConfusionB: 2.7,
    },
    {
      label: "28~35세",
      preferA: 3, preferB: 2, tie: 0, total: 5,
      winner: "A",
      avgScoreA: 3.8, avgScoreB: 3.1,
      avgTrustA: 3.7, avgTrustB: 2.9,
      avgResistanceA: 1.9, avgResistanceB: 2.5,
      avgConfusionA: 1.6, avgConfusionB: 3.0,
    },
    {
      label: "36~45세",
      preferA: 4, preferB: 1, tie: 0, total: 5,
      winner: "A",
      avgScoreA: 4.2, avgScoreB: 2.7,
      avgTrustA: 4.3, avgTrustB: 2.7,
      avgResistanceA: 1.6, avgResistanceB: 2.8,
      avgConfusionA: 1.4, avgConfusionB: 2.8,
    },
  ],
  segmentInsights: {
    resistant: {
      label: "자영업 소규모 브랜드",
      title: "주문량이 불확실한 초기 브랜드는 B안을 선호합니다",
      description: "자영업 세그먼트는 B안을 소폭 선호합니다. 월 주문 100건 이하의 초기 브랜드에게는 49,000원 고정이 부담스러운 고정비로 느껴집니다. 첫 달 무료나 소규모 플랜이 없으면 이 세그먼트가 상담 신청 전에 이탈합니다.",
      preferredVariant: "B",
    },
    niche: {
      label: "마케팅/기획 중규모 운영자",
      title: "규모가 클수록 A안의 예측 가능성을 압도적으로 선호합니다",
      description: "마케팅/기획 직군은 A안을 6:1로 선호합니다. 월 300건 이상 운영하는 브랜드는 성수기 물량 계산 없이 고정 비용을 예산에 넣을 수 있는 A안을 신뢰합니다.",
      preferredVariant: "A",
    },
    testFirst: {
      label: "자영업 + 28~33세 초기 창업자",
      title: "소규모 진입 장벽을 먼저 해결하세요",
      description: "전체 평균은 A안이지만 초기 창업자 세그먼트는 고정 비용 부담으로 이탈 가능성이 있습니다. 이 세그먼트 대상으로 '30일 무료 체험 후 고정 요금 전환' 옵션을 먼저 테스트하는 것을 권장합니다.",
      preferredVariant: "A",
    },
  },
  unexpectedSignals: [
    {
      code: "clarity_without_action",
      title: "싸 보이는 단가가 대표에게는 불확실성입니다",
      description: "주문당 120원은 작아 보이지만 성수기 주문량을 곱해야 합니다. 운영자는 낮은 단가보다 다음 달 청구액을 예측할 수 있는 가격표에 더 안정적으로 반응합니다.",
      severity: "warning",
    },
  ],
});

// ─────────────────────────────────────────────────────────
// Scenario 4: 무료체험 종료 모달 — "이 문구로 가면 CS 문의가 늘어납니다"
// 스토리: 전환율을 올리려다 해지와 문의를 동시에 늘리는 함정
// 타깃: 전체, 20~44세 모바일 커머스 사용자
// ─────────────────────────────────────────────────────────
const commerceConversionRequest: SimulationRequest = {
  productDescription:
    "식단/생필품 정기배송 커머스 앱에서 첫 달 무료 멤버십 체험을 제공하고 있습니다. 멤버십은 무료배송, 5% 적립, 배송일 변경 우선권을 포함하지만, 무료 체험 종료 48시간 전 업그레이드 모달에서 전환율이 낮고 CS에는 '언제 결제되는지 모르겠다'는 문의가 들어옵니다. Growth팀은 긴급감을 높이고 싶고, CX팀은 압박 문구가 해지와 문의를 늘린다고 우려합니다.",
  targetCustomer:
    "무료배송과 정기배송 혜택을 경험한 20~40대 모바일 커머스 사용자",
  marketType: "B2C",
  usageContext:
    "무료 체험 종료 48시간 전 앱 첫 진입 시 뜨는 업그레이드 모달 문구입니다. 목표 지표는 유료 전환율이지만, 동시에 결제 관련 CS 문의와 즉시 해지율을 늘리면 안 됩니다.",
  variantA:
    "무료 체험이 48시간 후 종료됩니다. 무료배송과 5% 적립을 계속 받으려면 오늘 멤버십을 유지하세요.",
  variantB: "",
  filters: {
    sexes: [],
    ageMin: 20,
    ageMax: 44,
    occupations: [],
    provinces: ["서울", "경기", "인천"],
    maritalStatuses: [],
  },
  sampleSize: 10,
  decisionMode: "review",
  inputType: "copy",
};

const commerceConversionResponse = scenarioResponse({
  decisionMode: "review",
  inputType: "copy",
  winner: "A",
  avgScoreA: 2.9,
  avgScoreB: 0,
  riskAxesA: { comprehension: 4.1, trust: 2.5, appeal: 3.0, resistance: 2.3, confusionRisk: 3.2 },
  riskAxesB: undefined,
  typeAxesB: undefined,
  segmentBreakdown: [],
  topLikedPoints: [
    "48시간 후 종료라는 시점이 명확해 사용자가 상황을 바로 이해합니다.",
    "무료배송과 5% 적립이라는 이미 경험한 혜택을 언급해 유지 근거가 구체적입니다.",
  ],
  topConcerns: [
    "'오늘 멤버십을 유지하세요'는 혜택 안내보다 결제 압박으로 먼저 읽힐 수 있습니다.",
    "다음 결제일, 해지 방법, 자동 갱신 여부가 보이지 않으면 모달 닫기 후 CS 문의로 전환됩니다.",
    "긴급감이 높아질수록 '일단 해지하고 나중에 다시 가입'을 선택하는 사용자가 늘어납니다.",
  ],
  recommendedCopies: [
    "이번 달 받은 무료배송과 적립 혜택을 먼저 보여주고, '48시간 후 혜택이 종료됩니다' 순서로 바꾸세요.",
    "다음 결제일과 '언제든 해지 가능'을 CTA 바로 아래에 배치하면 CS 문의가 줄어듭니다.",
    "절약 금액을 먼저 계산해 보여준 다음 멤버십 유지 CTA를 두는 순서가 전환율과 CS를 동시에 개선합니다.",
  ],
  oneParagraphInsight:
    "이 문구는 이해는 되지만 신뢰를 만들지 못합니다. 이해도 4.1인 반면 신뢰도 2.5는 '뭔지는 알겠는데 선뜻 결제하기 싫다'는 상태입니다. Growth가 원하는 긴급감이 CX 리스크를 만들 수 있는 구조입니다. 전환율만 보지 말고 결제 문의와 즉시 해지율까지 함께 추적하면, 지금 문구는 단기 전환은 올려도 LTV를 낮출 가능성이 있습니다.",
  relevanceMix: { high: 50, medium: 35, low: 15 },
  confidence: {
    level: "low",
    label: "낮은 신뢰도 — 수정 후 재검증 권장",
    description: "이해도는 높지만 신뢰도와 명확성이 낮습니다. 현재 문구로 출시하면 CS 문의 증가 가능성이 높습니다.",
  },
  cautionSignals: [
    {
      code: "mixed_reactions",
      label: "세그먼트별 반응 분산 큼",
      description: "20대는 긴급감에 반응하지만, 30~40대는 압박 문구를 신뢰 하락으로 읽는 비율이 높습니다.",
      severity: "warning",
    },
    {
      code: "missing_context",
      label: "결제 정보 부재",
      description: "다음 결제일, 자동 갱신, 해지 방법이 모달에 없어 '모르겠으니 일단 해지'를 선택하는 사용자가 발생할 수 있습니다.",
      severity: "critical",
    },
    {
      code: "residual_risk",
      label: "CS 문의 증가 리스크",
      description: "현재 문구 구조상 전환율이 올라도 동시에 '언제 결제되냐'는 CS 문의가 늘어나는 패턴이 예상됩니다.",
      severity: "warning",
    },
  ],
  unexpectedSignals: [
    {
      code: "trust_gap",
      title: "전환율을 올리려다 CS 문의와 해지가 동시에 늘 수 있습니다",
      description: "이해도(4.1)와 신뢰도(2.5) 사이의 1.6점 갭이 위험 신호입니다. 무엇인지는 알지만 결제하기 싫다는 상태에서 긴급감을 높이면 전환 대신 즉시 해지를 선택하는 비율이 올라갑니다.",
      severity: "critical",
    },
    {
      code: "clarity_without_action",
      title: "명확하게 이해했지만 행동하지 않는 사용자가 많습니다",
      description: "이해도는 4.1로 높지만 행동 의향은 2.9입니다. 이 갭을 줄이려면 긴급감이 아니라 '이미 받은 혜택의 근거'와 '결제 투명성'이 먼저 필요합니다.",
      severity: "warning",
    },
  ],
});

// ─────────────────────────────────────────────────────────
// Scenario 5: 학부모 결제 앱 — "결제자와 사용자가 다릅니다"
// 스토리: 학부모 신뢰와 학생 지속 사용 동기를 한 문구로 해결하려는 함정
// 타깃: 기혼 여성/남성, 30~49세
// ─────────────────────────────────────────────────────────
const educationMismatchRequest: SimulationRequest = {
  productDescription:
    "중학생이 매일 15분 수학 문제를 풀면 AI가 오답 원인, 다음 문제, 주간 학습 리포트를 만들어주는 학습 앱입니다. 학생은 앱에서 문제를 풀고 뱃지와 랭킹을 보지만, 실제 결제자는 학부모입니다. 팀 내부에서는 '학생이 재미있어야 계속 쓴다'는 주장과 '학부모가 성적 변화와 학습 습관을 믿어야 결제한다'는 주장이 갈립니다.",
  targetCustomer:
    "중학생 자녀를 둔 35~49세 학부모와 실제 앱을 매일 쓰는 중학생",
  marketType: "B2C",
  usageContext:
    "학부모 대상 랜딩 첫 화면 문구를 정하는 상황입니다. 목표는 무료 진단 신청률과 첫 달 유료 전환율입니다. 다만 실제 유지율은 학생이 앱을 계속 여는지에 달려 있어, 문구가 학부모 신뢰와 학생 사용 동기를 동시에 건드려야 합니다.",
  variantA: "아이는 게임처럼 풀고, 부모는 성적 변화를 보는 AI 수학 코치",
  variantB: "매일 15분, AI가 오답 원인을 찾아 다음 문제를 골라줍니다",
  filters: {
    sexes: [],
    ageMin: 30,
    ageMax: 49,
    occupations: ["교육", "사무직", "기획"],
    provinces: ["서울", "경기", "인천"],
    maritalStatuses: ["기혼"],
  },
  sampleSize: 10,
  decisionMode: "compare",
  inputType: "copy",
};

const educationMismatchResponse = scenarioResponse({
  decisionMode: "compare",
  inputType: "copy",
  winner: "B",
  avgScoreA: 3.4,
  avgScoreB: 4.1,
  riskAxesA: { comprehension: 3.8, trust: 3.0, appeal: 4.2, resistance: 2.1, confusionRisk: 2.5 },
  riskAxesB: { comprehension: 4.4, trust: 4.1, appeal: 3.8, resistance: 1.7, confusionRisk: 1.8 },
  topLikedPoints: [
    "B안은 학부모가 결제 전에 확인하고 싶은 오답 원인과 다음 학습 계획을 직접 말합니다.",
    "매일 15분이라는 구체적인 시간이 학부모의 현실적인 기대치와 일치합니다.",
    "AI가 오답 원인을 찾아준다는 표현이 단순 문제 반복이 아닌 맞춤 교육으로 인식됩니다.",
  ],
  topConcerns: [
    "'게임처럼 풀고'라는 표현은 학생 동기를 자극하지만 학부모에게는 학습의 진지함을 낮게 보이게 할 수 있습니다.",
    "B안은 학부모 설득은 강하지만 학생이 매일 앱을 열 이유가 충분히 드러나지 않습니다.",
  ],
  recommendedCopies: [
    "아이는 매일 15분 풀고, 부모는 오답 변화와 다음 학습 계획을 확인합니다.",
    "학생 화면에는 도전 과제와 뱃지를, 학부모 화면에는 오답 원인과 성장 리포트를 보여주세요.",
    "랜딩 첫 문장은 학부모 신뢰(오답 원인·리포트), 두 번째 문장은 학생 지속 동기(게임·랭킹)로 분리하세요.",
  ],
  oneParagraphInsight:
    "교육 앱은 학생이 쓰고 학부모가 결제합니다. 한 문구로 둘을 동시에 설득하려 하면 메시지가 흐려집니다. B안은 학부모 신뢰를 먼저 잡는 데 성공하지만, 학생 유지율을 높이려면 앱 내 학생용 경험(게임성, 랭킹)과 학부모용 경험(리포트, 성적 변화)을 화면에서 물리적으로 분리해야 합니다.",
  relevanceMix: { high: 65, medium: 25, low: 10 },
  confidence: {
    level: "medium",
    label: "중간 신뢰도",
    description: "학부모(결제자) 관점에서는 B안이 우세하지만 학생(사용자) 관점을 별도 검증해야 유지율 예측이 가능합니다.",
  },
  cautionSignals: [
    {
      code: "mixed_reactions",
      label: "30~34세 젊은 부모에서 A안 역전 가능",
      description: "30~34세 부모는 게임성과 재미 요소에 더 공감해 A안을 선호하는 경향이 있습니다. 이 세그먼트가 타깃이라면 문구 조정이 필요합니다.",
      severity: "info",
    },
  ],
  segmentBreakdown: [
    {
      label: "기혼 여성 35~45세",
      preferA: 1, preferB: 4, tie: 0, total: 5,
      winner: "B",
      avgScoreA: 3.1, avgScoreB: 4.4,
      avgTrustA: 2.8, avgTrustB: 4.3,
      avgResistanceA: 2.4, avgResistanceB: 1.5,
      avgConfusionA: 2.7, avgConfusionB: 1.6,
    },
    {
      label: "기혼 남성 35~45세",
      preferA: 1, preferB: 2, tie: 0, total: 3,
      winner: "B",
      avgScoreA: 3.5, avgScoreB: 3.9,
      avgTrustA: 3.2, avgTrustB: 3.8,
      avgResistanceA: 2.0, avgResistanceB: 1.8,
      avgConfusionA: 2.3, avgConfusionB: 1.9,
    },
    {
      label: "30~34세 부모",
      preferA: 1, preferB: 1, tie: 0, total: 2,
      winner: "Tie",
      avgScoreA: 3.8, avgScoreB: 3.7,
      avgTrustA: 3.5, avgTrustB: 3.6,
      avgResistanceA: 1.8, avgResistanceB: 1.9,
      avgConfusionA: 2.0, avgConfusionB: 1.8,
    },
    {
      label: "교육직 종사자",
      preferA: 0, preferB: 3, tie: 0, total: 3,
      winner: "B",
      avgScoreA: 3.2, avgScoreB: 4.5,
      avgTrustA: 2.9, avgTrustB: 4.4,
      avgResistanceA: 2.2, avgResistanceB: 1.3,
      avgConfusionA: 2.5, avgConfusionB: 1.4,
    },
  ],
  segmentInsights: {
    resistant: {
      label: "40대+ 기혼 여성",
      title: "핵심 구매자가 '게임처럼'이라는 표현에 부정적입니다",
      description: "가장 구매 영향력이 큰 40대 어머니 세그먼트에서 A안의 '게임처럼 풀고'라는 표현이 학습 진지함을 낮게 보이게 합니다. 결제 전환의 병목은 이 세그먼트입니다.",
      preferredVariant: "B",
    },
    niche: {
      label: "30~34세 젊은 부모",
      title: "젊은 부모는 학생 재미 요소에 공감합니다",
      description: "30~34세 부모는 A·B 모두 비슷하게 평가합니다. 이 세그먼트는 학생이 재미있어야 계속 쓴다는 관점을 공유하며, 게임성 요소에 거부감이 적습니다.",
      preferredVariant: "Tie",
    },
    testFirst: {
      label: "기혼 여성 35~45세",
      title: "핵심 구매자 세그먼트를 먼저 설득해야 합니다",
      description: "전체 전환율의 병목은 이 세그먼트입니다. B안을 베이스로 하되, '아이가 매일 자발적으로 여는 이유'를 두 번째 문장에 추가하면 신뢰와 유지율을 동시에 잡을 수 있습니다.",
      preferredVariant: "B",
    },
  },
  unexpectedSignals: [
    {
      code: "buyer_user_mismatch",
      title: "좋아하는 사람과 결제하는 사람이 다릅니다",
      description: "학생에게는 게임성과 도전 과제가 필요하지만 학부모에게는 오답 원인, 성장 리포트, 학습 습관 근거가 먼저입니다. 한 문장에 섞기보다 화면과 역할을 나눠야 합니다.",
      severity: "critical",
    },
  ],
});

// ─────────────────────────────────────────────────────────
// Scenario 6: 계좌 연결 첫 화면 — "이해는 4.4인데 허락은 못 하겠다"
// 스토리: 이해도와 행동 의향 사이의 극적인 신뢰 갭
// 타깃: 25~39세, IT/사무직/마케팅
// ─────────────────────────────────────────────────────────
const fintechTrustRequest: SimulationRequest = {
  productDescription:
    "급여 입금, 카드값, 고정비, 구독 결제를 분석해 다음 달 말 예상 잔고와 이번 달 줄일 수 있는 지출을 보여주는 개인 금융 앱입니다. 사용자는 카드 내역과 계좌를 연결해야 첫 리포트를 볼 수 있습니다. 마케팅팀은 '돈이 새는 곳을 찾아준다'는 강한 문제 제기를 원하고, 제품/법무팀은 계좌 연결 전 불안감과 개인정보 우려를 낮추는 문구가 먼저라고 봅니다.",
  targetCustomer:
    "월급은 받지만 카드값, 고정비, 구독비 때문에 다음 달 잔고가 불안한 25~39세 직장인",
  marketType: "B2C",
  usageContext:
    "첫 가입 후 계좌 연결 직전 화면의 헤드라인입니다. 목표 지표는 계좌 연결 완료율과 첫 리포트 조회율입니다. 단, 과장되거나 감시받는 느낌을 주면 금융 데이터 접근 허용 단계에서 이탈할 수 있습니다.",
  variantA: "당신의 돈이 어디로 새는지 AI가 자동으로 찾아드립니다",
  variantB: "계좌를 읽기 전용으로 연결하고, 다음 달 남는 돈을 미리 확인하세요",
  filters: {
    sexes: [],
    ageMin: 25,
    ageMax: 39,
    occupations: ["IT/개발", "사무직", "마케팅"],
    provinces: ["서울", "경기"],
    maritalStatuses: [],
  },
  sampleSize: 10,
  decisionMode: "compare",
  inputType: "copy",
};

const fintechTrustResponse = scenarioResponse({
  decisionMode: "compare",
  inputType: "copy",
  winner: "B",
  avgScoreA: 3.1,
  avgScoreB: 3.8,
  riskAxesA: { comprehension: 4.3, trust: 2.3, appeal: 4.4, resistance: 2.2, confusionRisk: 2.0 },
  riskAxesB: { comprehension: 4.5, trust: 3.4, appeal: 4.1, resistance: 1.9, confusionRisk: 1.6 },
  topLikedPoints: [
    "B안은 '다음 달 남는 돈'이라는 결과가 구체적이라 사용자가 얻는 값을 바로 이해합니다.",
    "'읽기 전용 연결'이라는 표현이 계좌 접근 범위를 명시해 불안을 일부 낮춥니다.",
    "미래 잔고를 미리 확인한다는 프레임이 감시보다 예측 도구로 인식됩니다.",
  ],
  topConcerns: [
    "A안의 '돈이 새는지'는 문제 의식은 강하지만 사용자를 평가하거나 감시하는 느낌을 줄 수 있습니다.",
    "B안도 금융 데이터 접근 범위와 연결 해제 방법이 없으면 계좌 연결 직전 이탈이 남습니다.",
    "두 안 모두 'AI가 내 통장을 보는 것'에 대한 허락 근거가 충분하지 않습니다.",
  ],
  recommendedCopies: [
    "계좌 연결 전, 읽기 전용으로 어떤 데이터만 가져오는지 먼저 보여주세요.",
    "'돈이 샌다'보다 '다음 달 남는 돈을 미리 확인한다'는 결과를 앞세우세요.",
    "언제든 연결 해제 가능, 저장하지 않는 데이터, 금융보안원 인증을 CTA 근처에 배치하세요.",
  ],
  oneParagraphInsight:
    "이 케이스는 흥미롭지만 허락하기 어려운 상태의 전형입니다. A안의 이해도 4.3, 매력도 4.4는 훌륭하지만 신뢰도 2.3이 발목을 잡습니다. 핀테크 첫 연결 화면은 관심을 끄는 문구보다 '이 앱에게 계좌를 보여줘도 된다'는 허락 근거가 먼저입니다. B안은 신뢰를 3.4까지 올렸지만, 읽기 전용 범위·해제 가능·보안 인증을 함께 보여줘야 연결 완료율로 이어집니다.",
  relevanceMix: { high: 65, medium: 25, low: 10 },
  confidence: {
    level: "medium",
    label: "중간 신뢰도",
    description: "B안이 신뢰도에서 우세하지만 두 안 모두 계좌 연결 허락 근거가 부족해 추가 UX 개선이 필요합니다.",
  },
  cautionSignals: [
    {
      code: "missing_context",
      label: "허락 근거 부재",
      description: "두 안 모두 읽기 전용 범위, 해제 방법, 보안 인증 정보가 없어 계좌 연결 직전 이탈이 예상됩니다.",
      severity: "critical",
    },
    {
      code: "close_call",
      label: "사무직 비IT 세그먼트 이탈 위험",
      description: "금융 데이터 접근에 가장 보수적인 사무직 비IT 직군에서 두 안 모두 신뢰 점수가 낮습니다.",
      severity: "warning",
    },
  ],
  segmentBreakdown: [
    {
      label: "IT/개발",
      preferA: 1, preferB: 3, tie: 0, total: 4,
      winner: "B",
      avgScoreA: 3.4, avgScoreB: 4.2,
      avgTrustA: 2.8, avgTrustB: 3.9,
      avgResistanceA: 2.0, avgResistanceB: 1.6,
      avgConfusionA: 1.8, avgConfusionB: 1.5,
    },
    {
      label: "사무직/마케팅",
      preferA: 2, preferB: 4, tie: 0, total: 6,
      winner: "B",
      avgScoreA: 2.9, avgScoreB: 3.5,
      avgTrustA: 2.0, avgTrustB: 3.1,
      avgResistanceA: 2.4, avgResistanceB: 2.1,
      avgConfusionA: 2.1, avgConfusionB: 1.7,
    },
    {
      label: "25~30세",
      preferA: 2, preferB: 3, tie: 0, total: 5,
      winner: "B",
      avgScoreA: 3.3, avgScoreB: 3.9,
      avgTrustA: 2.5, avgTrustB: 3.5,
      avgResistanceA: 2.1, avgResistanceB: 1.8,
      avgConfusionA: 1.9, avgConfusionB: 1.6,
    },
    {
      label: "31~39세",
      preferA: 1, preferB: 4, tie: 0, total: 5,
      winner: "B",
      avgScoreA: 2.9, avgScoreB: 3.7,
      avgTrustA: 2.1, avgTrustB: 3.3,
      avgResistanceA: 2.3, avgResistanceB: 2.0,
      avgConfusionA: 2.1, avgConfusionB: 1.6,
    },
  ],
  segmentInsights: {
    resistant: {
      label: "사무직·비IT 직군",
      title: "금융 데이터 접근에 가장 보수적인 세그먼트입니다",
      description: "IT 직군은 '읽기 전용'의 의미를 즉각 이해하지만 사무직·비IT 직군은 계좌 연결 자체에 거부감이 있습니다. 이 세그먼트가 계좌 연결 완료율의 병목입니다. 권한 설명이 없으면 이탈합니다.",
      preferredVariant: "B",
    },
    niche: {
      label: "IT/개발 직군",
      title: "기술 이해도가 높은 사용자는 '읽기 전용'에 즉각 반응합니다",
      description: "IT 직군은 B안에서 신뢰도가 3.9까지 올라갑니다. 이 세그먼트는 '읽기 전용', '접근 범위 제한' 같은 기술 용어를 신뢰 근거로 인식합니다.",
      preferredVariant: "B",
    },
    testFirst: {
      label: "사무직·비IT 31~39세",
      title: "계좌 연결의 병목 세그먼트를 먼저 해결하세요",
      description: "신뢰도가 가장 낮은 이 세그먼트에서 접근 범위 설명, 해제 가능 문구, 보안 인증 배지를 테스트하면 전체 연결 완료율 개선 효과가 가장 클 것으로 예상됩니다.",
      preferredVariant: "B",
    },
  },
  unexpectedSignals: [
    {
      code: "trust_gap",
      title: "이해도 4.3, 행동 의향 2.6 — 허락 근거가 없습니다",
      description: "A안은 흥미와 이해도는 4점 이상이지만 신뢰도가 2.3입니다. 이 격차는 '뭔지는 알겠는데 내 통장을 보여주긴 싫다'는 상태입니다. 강한 문제 제기보다 허락할 수 있는 근거가 먼저 필요합니다.",
      severity: "critical",
    },
    {
      code: "clarity_without_action",
      title: "이해는 완벽한데 행동이 안 나옵니다",
      description: "이해도(4.3~4.5)와 행동 의향(2.6~3.0) 사이의 1.5점 이상 갭이 지속됩니다. 헤드라인을 바꾸는 것만으로는 해결되지 않으며, CTA 근처의 신뢰 신호(보안 인증, 해제 가능, 접근 범위)가 필수입니다.",
      severity: "warning",
    },
  ],
});

// ─────────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────────
export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: "b2b-saas-message",
    label: "보안이 막는 SaaS 랜딩",
    description: "AI 효율 vs 보안 신뢰 — 구매자와 사용자의 반응이 다릅니다",
    request: b2bMessageRequest,
    response: b2bMessageResponse,
  },
  {
    id: "b2b-saas-feature",
    label: "다음 스프린트 기능 결정",
    description: "팀 논쟁을 데이터로 끝내기 — 전 세그먼트 압도적 B안",
    request: b2bFeatureRequest,
    response: b2bFeatureResponse,
  },
  {
    id: "commerce-pricing",
    label: "D2C SaaS 가격표",
    description: "싼 단가가 오히려 구매를 막는다 — 예측 가능성이 핵심",
    request: commercePricingRequest,
    response: commercePricingResponse,
  },
  {
    id: "commerce-conversion",
    label: "무료체험 종료 모달",
    description: "전환율을 올리려다 CS 문의와 해지를 동시에 늘리는 함정",
    request: commerceConversionRequest,
    response: commerceConversionResponse,
  },
  {
    id: "education-buyer-user",
    label: "학부모 결제 앱",
    description: "결제자와 사용자가 다를 때 — 한 문구로 둘을 설득하려는 실수",
    request: educationMismatchRequest,
    response: educationMismatchResponse,
  },
  {
    id: "fintech-trust",
    label: "계좌 연결 첫 화면",
    description: "이해도 4.4, 행동 의향 2.6 — 신뢰 갭의 전형",
    request: fintechTrustRequest,
    response: fintechTrustResponse,
  },
];

export const DEFAULT_DEMO_SCENARIO = DEMO_SCENARIOS[0];
