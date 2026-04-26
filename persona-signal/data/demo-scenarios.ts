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
      relevance: persona.relevance ?? {
        level: "medium",
        weight: 0.7,
        reason: "데모 데이터 기본값",
      },
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
      persona: {
        ...base.persona,
        id: Number(`${base.persona.id}${personas.length}`),
      },
    });
    cursor += 1;
  }

  return {
    ...response,
    personas,
  };
}

function withSummary(response: SimulationResponse, patch: Partial<SimulationResponse["summary"]>): SimulationResponse {
  return {
    ...response,
    summary: {
      ...response.summary,
      ...patch,
    },
  };
}

function scenarioResponse(patch: Partial<SimulationResponse["summary"]>): SimulationResponse {
  return withSummary(duplicatePersonas(cloneResponse()), patch);
}

const baseFilters = {
  sexes: [],
  ageMin: 25,
  ageMax: 49,
  occupations: [],
  provinces: ["서울", "경기"],
  maritalStatuses: [],
};

const b2bMessageRequest: SimulationRequest = {
  productDescription: "보안 문서와 회의 내용을 자동으로 요약해주는 B2B 협업 SaaS",
  targetCustomer: "IT, 기획, 운영팀에서 문서와 회의 공유를 자주 하는 팀 리더와 실무자",
  marketType: "B2B",
  usageContext: "회의록, 고객 미팅 노트, 내부 정책 문서를 팀에 빠르게 공유해야 하는 업무 환경",
  variantA: "회의와 문서를 자동으로 요약하는 AI 협업 도구",
  variantB: "민감한 회의 내용은 보호하면서, 팀이 바로 실행할 할 일을 정리합니다",
  filters: {
    ...baseFilters,
    ageMin: 25,
    ageMax: 42,
    occupations: ["IT/개발", "기획", "마케팅"],
  },
  sampleSize: 10,
  decisionMode: "compare",
  inputType: "copy",
};

const b2bFeatureRequest: SimulationRequest = {
  ...b2bMessageRequest,
  productDescription: "반복 회의가 많은 팀을 위한 AI 업무 정리 도구",
  targetCustomer: "회의 후 실행 항목 정리에 시간이 많이 드는 PM, 팀 리더, 운영 담당자",
  usageContext: "회의가 끝난 뒤 담당자, 마감일, 우선순위를 슬랙과 노션에 다시 정리해야 하는 상황",
  variantA: "회의 요약을 팀 위키에 자동 저장하는 기능",
  variantB: "회의가 끝나면 담당자, 마감일, 우선순위를 자동 생성하는 기능",
  inputType: "feature",
};

const commercePricingRequest: SimulationRequest = {
  productDescription: "소규모 브랜드를 위한 정기 배송 구독 커머스 운영 도구",
  targetCustomer: "월 매출 1천만~1억 원 규모의 D2C 브랜드 운영자와 마케터",
  marketType: "B2B",
  usageContext: "구독 결제, 재고, 배송 주기 변경, 이탈 방지를 한 화면에서 관리해야 하는 상황",
  variantA: "월 49,000원 고정 요금으로 구독 주문 500건까지 관리",
  variantB: "주문 1건당 120원, 매출이 없으면 비용도 없는 사용량 기반 요금",
  filters: {
    ...baseFilters,
    ageMin: 28,
    ageMax: 45,
    occupations: ["마케팅", "경영/관리직", "자영업"],
  },
  sampleSize: 10,
  decisionMode: "compare",
  inputType: "pricing",
};

const commerceConversionRequest: SimulationRequest = {
  ...commercePricingRequest,
  productDescription: "멤버십 구독 고객의 무료 체험 종료 전 업그레이드를 유도하는 커머스 앱",
  targetCustomer: "무료 체험 중인 20~40대 온라인 쇼핑 고객",
  marketType: "B2C",
  usageContext: "무료 체험 종료 2일 전, 고객이 유료 전환 여부를 결정하는 시점",
  variantA: "무료 체험이 곧 종료됩니다. 계속 혜택을 받으려면 지금 업그레이드하세요.",
  variantB: "",
  filters: {
    ...baseFilters,
    ageMin: 20,
    ageMax: 44,
    occupations: ["사무/행정", "마케팅", "교육"],
  },
  decisionMode: "review",
  inputType: "copy",
};

const educationMismatchRequest: SimulationRequest = {
  productDescription: "중학생의 수학 오답을 분석하고 다음 학습 계획을 추천하는 AI 학습 앱",
  targetCustomer: "자녀 학습 관리를 돕고 싶은 학부모와 실제 앱을 쓰는 중학생",
  marketType: "B2C",
  usageContext: "학생은 매일 문제를 풀고, 학부모는 결제와 학습 성과를 확인하는 상황",
  variantA: "학생에게는 게임처럼, 학부모에게는 성적 변화가 보이는 AI 수학 코치",
  variantB: "매일 15분, AI가 오답을 분석해 우리 아이의 다음 문제를 골라줍니다",
  filters: {
    ...baseFilters,
    ageMin: 30,
    ageMax: 49,
    occupations: ["교육", "사무/행정", "경영/관리직"],
    maritalStatuses: ["기혼"],
  },
  sampleSize: 10,
  decisionMode: "compare",
  inputType: "copy",
};

const fintechTrustRequest: SimulationRequest = {
  productDescription: "월급, 카드값, 구독비를 분석해 다음 달 현금 흐름을 예측해주는 개인 금융 앱",
  targetCustomer: "고정 지출과 구독비가 많아 다음 달 잔고를 미리 알고 싶은 25~39세 직장인",
  marketType: "B2C",
  usageContext: "월급일 전후로 카드값, 고정비, 저축 가능 금액을 확인하는 상황",
  variantA: "당신의 돈이 어디로 새는지 AI가 자동으로 찾아드립니다",
  variantB: "계좌를 연결하면 다음 달 남는 돈을 미리 계산해드립니다",
  filters: {
    ...baseFilters,
    ageMin: 25,
    ageMax: 39,
    occupations: ["사무/행정", "IT/개발", "마케팅", "금융"],
  },
  sampleSize: 10,
  decisionMode: "compare",
  inputType: "copy",
};

const b2bMessageResponse = scenarioResponse({
  decisionMode: "compare",
  inputType: "copy",
  winner: "B",
  avgScoreA: 3.4,
  avgScoreB: 4.1,
  topLikedPoints: [
    "B안은 보안과 실행 항목을 동시에 말해 업무 맥락이 선명합니다.",
    "민감한 회의 내용이라는 표현이 실제 B2B 도입 장벽을 건드립니다.",
    "팀이 바로 실행할 할 일이라는 결과물이 구체적입니다.",
  ],
  topConcerns: [
    "A안은 AI 협업 도구라는 표현이 넓어 기존 SaaS와 차별점이 약합니다.",
    "B안도 어떤 보안 기준을 충족하는지 근거가 없으면 도입 승인 단계에서 막힐 수 있습니다.",
  ],
  recommendedCopies: [
    "회의 내용은 보호하고, 실행할 일만 팀에 남깁니다.",
    "보안이 필요한 회의도 AI가 담당자와 마감일만 정리합니다.",
    "민감한 내용은 지키고, 팀이 해야 할 일은 바로 보이게 하세요.",
  ],
  oneParagraphInsight: "B안은 기능 설명보다 도입 리스크를 먼저 건드려 B2B 의사결정자에게 더 안정적으로 읽힙니다. 다만 보안이라는 단어를 썼다면 저장 방식, 권한, 삭제 정책 중 하나는 바로 보여줘야 신뢰가 따라옵니다.",
  relevanceMix: { high: 70, medium: 20, low: 10 },
  unexpectedSignals: [
    {
      code: "trust_gap",
      title: "관심보다 보안 근거가 먼저 필요합니다",
      description: "실무자는 자동 정리를 좋아하지만 팀 도입자는 회의 내용 저장 방식부터 확인하려고 합니다. 랜딩 첫 화면에 보안 근거가 없으면 관심이 승인으로 이어지기 어렵습니다.",
      severity: "critical",
    },
    {
      code: "hidden_segment_risk",
      title: "관리자 세그먼트에서 승인 리스크가 커집니다",
      description: "실무자는 시간 절약에 반응하지만 관리자와 운영 담당자는 권한 관리와 데이터 보관 기준을 더 먼저 봅니다.",
      severity: "warning",
    },
  ],
});

const b2bFeatureResponse = scenarioResponse({
  decisionMode: "compare",
  inputType: "feature",
  winner: "B",
  avgScoreA: 3.0,
  avgScoreB: 4.2,
  typeAxesA: { necessity: 2.9, urgency: 2.5, existingSolutionAwareness: 2.8 },
  typeAxesB: { necessity: 4.4, urgency: 3.9, existingSolutionAwareness: 4.0 },
  topLikedPoints: [
    "담당자와 마감일을 바로 만든다는 점이 회의 후 수작업을 직접 줄입니다.",
    "위키 저장보다 실행 항목 생성이 더 당장 필요한 문제로 읽힙니다.",
  ],
  topConcerns: [
    "자동 생성된 담당자와 마감일이 틀리면 오히려 팀 혼선이 생길 수 있습니다.",
    "슬랙이나 노션 같은 기존 워크플로우와 어떻게 연결되는지 설명이 필요합니다.",
  ],
  recommendedCopies: [
    "자동 생성 후 사람이 확인하는 흐름을 명확히 보여주세요.",
    "회의록 저장보다 담당자, 마감일, 우선순위를 먼저 강조하세요.",
    "슬랙/노션 전송 예시를 한 줄로 붙이세요.",
  ],
  oneParagraphInsight: "B안은 nice-to-have 저장 기능이 아니라 회의 직후 생기는 실행 공백을 줄인다는 점에서 우선순위가 높게 나옵니다. 단, 자동화 정확도와 수정 가능성을 함께 보여줘야 신뢰 리스크를 줄일 수 있습니다.",
  relevanceMix: { high: 80, medium: 20, low: 0 },
  unexpectedSignals: [
    {
      code: "clarity_without_action",
      title: "자동화보다 통제감이 전환을 좌우합니다",
      description: "담당자 자동 생성은 매력적이지만 틀렸을 때 누가 수정하는지가 보이지 않으면 팀 리더가 도입을 망설일 수 있습니다.",
      severity: "warning",
    },
  ],
});

const commercePricingResponse = scenarioResponse({
  decisionMode: "compare",
  inputType: "pricing",
  winner: "A",
  avgScoreA: 3.9,
  avgScoreB: 3.3,
  typeAxesA: { perceivedValue: 4.0, affordability: 3.7, willingnessToPay: 3.8 },
  typeAxesB: { perceivedValue: 3.4, affordability: 3.1, willingnessToPay: 3.0 },
  topLikedPoints: [
    "A안은 월 비용 예측이 쉬워 운영자가 예산을 잡기 좋습니다.",
    "B안은 초기 비용이 낮아 보이지만 주문이 늘 때 비용 불확실성이 큽니다.",
  ],
  topConcerns: [
    "주문량이 작은 브랜드는 A안의 49,000원이 고정비로 부담될 수 있습니다.",
    "B안은 주문당 비용이 누적될 때 실제 월 비용을 머릿속으로 계산해야 합니다.",
  ],
  recommendedCopies: [
    "월 49,000원으로 500건까지, 주문이 늘어도 비용 예측이 쉽습니다.",
    "초기 브랜드는 첫 달 무료로 주문량을 확인한 뒤 고정 요금으로 전환하세요.",
    "주문 500건 기준 사용량 요금 대비 얼마나 절약되는지 함께 보여주세요.",
  ],
  oneParagraphInsight: "운영자는 낮은 시작 비용보다 월말 비용 예측 가능성에 더 안정적으로 반응합니다. 가격표에는 단가보다 대표 주문량 기준 월 비용을 먼저 보여주는 편이 좋습니다.",
  relevanceMix: { high: 55, medium: 30, low: 15 },
  unexpectedSignals: [
    {
      code: "clarity_without_action",
      title: "싸 보이는 과금이 오히려 계산 부담을 만듭니다",
      description: "사용량 기반 요금은 초기 진입 장벽은 낮지만 주문이 늘 때 월 비용을 예측하기 어렵다는 반응이 나옵니다.",
      severity: "warning",
    },
  ],
});

const commerceConversionResponse = scenarioResponse({
  decisionMode: "review",
  inputType: "copy",
  winner: "A",
  avgScoreA: 3.1,
  avgScoreB: 3.1,
  riskAxesB: undefined,
  typeAxesB: undefined,
  segmentBreakdown: [],
  topLikedPoints: [
    "무료 체험 종료 시점을 분명히 알려주는 점은 이해하기 쉽습니다.",
    "혜택 유지라는 표현은 현재 사용 경험과 연결됩니다.",
  ],
  topConcerns: [
    "지금 업그레이드하세요라는 표현이 압박처럼 느껴질 수 있습니다.",
    "무엇을 계속 받는지 혜택이 구체적이지 않아 결제 이유가 약합니다.",
  ],
  recommendedCopies: [
    "무료 체험은 곧 종료됩니다. 저장한 혜택과 배송 할인을 계속 유지할 수 있어요.",
    "이번 달 절약한 금액을 확인하고, 계속 받을 혜택을 선택하세요.",
    "결제 전 언제든 해지할 수 있다는 문구를 함께 보여주세요.",
  ],
  oneParagraphInsight: "종료 안내는 명확하지만 업그레이드 이유보다 압박감이 먼저 읽힙니다. 전환 문구는 손실 회피보다 지금까지 받은 혜택과 앞으로 유지될 가치를 먼저 보여주는 편이 안전합니다.",
  relevanceMix: { high: 45, medium: 35, low: 20 },
  unexpectedSignals: [
    {
      code: "trust_gap",
      title: "전환 압박이 혜택보다 먼저 보입니다",
      description: "문구는 명확하지만 결제 행동으로 이어지려면 지금 잃는 것보다 계속 얻는 혜택을 먼저 보여줘야 합니다.",
      severity: "warning",
    },
  ],
});

const educationMismatchResponse = scenarioResponse({
  decisionMode: "compare",
  inputType: "copy",
  winner: "B",
  avgScoreA: 3.5,
  avgScoreB: 4.0,
  topLikedPoints: [
    "B안은 학부모가 결제 전에 알고 싶은 오답 분석과 다음 문제 추천을 직접 말합니다.",
    "A안은 학생 흥미를 건드리지만 학부모 입장에서는 성과 근거가 부족합니다.",
  ],
  topConcerns: [
    "학생에게는 게임처럼이라는 표현이 학습 진지함을 낮게 보이게 할 수 있습니다.",
    "학부모는 성적 변화나 학습 습관 개선 근거를 더 보고 싶어합니다.",
  ],
  recommendedCopies: [
    "아이는 매일 15분 풀고, 부모는 오답 변화와 다음 학습 계획을 확인합니다.",
    "게임처럼 시작하지만, 학부모에게는 오답 원인과 성장 리포트를 보여줍니다.",
    "학생의 몰입과 학부모의 확인 욕구를 같은 화면에서 분리해 설명하세요.",
  ],
  oneParagraphInsight: "이 케이스는 실사용자와 결제자가 다릅니다. 학생에게 재미있어 보이는 표현만으로는 학부모의 구매 신뢰를 만들기 어렵고, 학부모 설득만 강하면 학생 사용성이 약해질 수 있습니다.",
  relevanceMix: { high: 50, medium: 35, low: 15 },
  unexpectedSignals: [
    {
      code: "buyer_user_mismatch",
      title: "좋아하는 사람과 결제하는 사람이 다릅니다",
      description: "학생에게는 게임성이 매력일 수 있지만 학부모에게는 성과와 관리 가능성이 먼저입니다. 한 문구에서 두 관점을 섞으면 둘 다 약해질 수 있습니다.",
      severity: "critical",
    },
  ],
});

const fintechTrustResponse = scenarioResponse({
  decisionMode: "compare",
  inputType: "copy",
  winner: "B",
  avgScoreA: 3.2,
  avgScoreB: 3.7,
  riskAxesA: { comprehension: 4.0, trust: 2.6, appeal: 4.2, resistance: 2.7, confusionRisk: 2.1 },
  riskAxesB: { comprehension: 4.4, trust: 3.2, appeal: 4.0, resistance: 2.2, confusionRisk: 1.8 },
  topLikedPoints: [
    "다음 달 남는 돈이라는 결과가 직관적이고 자주 확인할 만합니다.",
    "계좌 연결 후 계산된다는 흐름은 기능 사용 장면이 분명합니다.",
  ],
  topConcerns: [
    "계좌 연결은 개인정보와 보안 걱정을 바로 일으킵니다.",
    "AI가 돈이 어디로 새는지 찾는다는 표현은 감시당하는 느낌을 줄 수 있습니다.",
  ],
  recommendedCopies: [
    "계좌 연결 전, 어떤 데이터가 쓰이는지 먼저 보여주세요.",
    "새는 돈을 찾는다는 표현보다 다음 달 남는 돈을 미리 확인한다는 표현을 쓰세요.",
    "보안 인증, 읽기 전용 연결, 언제든 해제 가능 문구를 CTA 근처에 붙이세요.",
  ],
  oneParagraphInsight: "핀테크 케이스는 흥미와 불안이 동시에 큽니다. A안은 주목도는 높지만 감시감이 강하고, B안은 행동 장면이 구체적이지만 계좌 연결 신뢰 장치가 필요합니다.",
  relevanceMix: { high: 60, medium: 25, low: 15 },
  unexpectedSignals: [
    {
      code: "trust_gap",
      title: "흥미는 높은데 계좌 연결에서 멈춥니다",
      description: "현금 흐름 예측은 매력적이지만 금융 데이터 접근 근거가 없으면 가장 관심 있는 사용자도 마지막 단계에서 이탈할 수 있습니다.",
      severity: "critical",
    },
    {
      code: "clarity_without_action",
      title: "이해는 되지만 허락하기 어렵습니다",
      description: "무엇을 해주는지는 분명하지만 개인정보 접근 범위와 해제 방법이 보이지 않으면 행동 의향이 눌립니다.",
      severity: "warning",
    },
  ],
});

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: "b2b-saas-message",
    label: "B2B SaaS 메시지",
    description: "보안과 실행 항목이 랜딩 메시지에서 어떻게 갈리는지 확인",
    request: b2bMessageRequest,
    response: b2bMessageResponse,
  },
  {
    id: "b2b-saas-feature",
    label: "B2B 기능 우선순위",
    description: "회의 요약 저장과 액션아이템 생성 중 무엇이 더 필요한지 비교",
    request: b2bFeatureRequest,
    response: b2bFeatureResponse,
  },
  {
    id: "commerce-pricing",
    label: "커머스 가격",
    description: "고정 요금과 사용량 기반 과금의 체감가치를 비교",
    request: commercePricingRequest,
    response: commercePricingResponse,
  },
  {
    id: "commerce-conversion",
    label: "구독 전환 문구",
    description: "무료 체험 종료 메시지의 압박감과 설득력을 점검",
    request: commerceConversionRequest,
    response: commerceConversionResponse,
  },
  {
    id: "education-buyer-user",
    label: "교육 결제자 불일치",
    description: "학생 사용성과 학부모 구매 신뢰가 충돌하는 케이스",
    request: educationMismatchRequest,
    response: educationMismatchResponse,
  },
  {
    id: "fintech-trust",
    label: "핀테크 신뢰",
    description: "흥미는 높지만 계좌 연결 신뢰가 막는 케이스",
    request: fintechTrustRequest,
    response: fintechTrustResponse,
  },
];

export const DEFAULT_DEMO_SCENARIO = DEMO_SCENARIOS[0];
