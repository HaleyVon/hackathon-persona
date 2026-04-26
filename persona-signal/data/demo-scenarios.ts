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
    summary: {
      ...response.summary,
      relevanceMix: response.summary.relevanceMix ?? { high: 50, medium: 30, low: 20 },
    },
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

const copyCompareRequest: SimulationRequest = {
  productDescription: "AI가 회의록과 업무를 자동으로 정리해주는 팀 생산성 도구",
  targetCustomer: "25~42세의 IT/기획/마케팅 직군 팀 리더와 실무자",
  marketType: "B2B",
  usageContext: "반복되는 회의 후 액션 아이템 정리와 팀 공유가 번거로운 협업 환경",
  variantA: "회의록과 업무를 자동으로 정리하는 AI 비서",
  variantB: "퇴근 시간을 앞당겨주는 실무형 AI 워크 어시스턴트",
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

const copyCompareResponse = withSummary(duplicatePersonas(cloneResponse()), {
  decisionMode: "compare",
  inputType: "copy",
  winner: "B",
  avgScoreA: 3.2,
  avgScoreB: 4.1,
});

const copyReviewResponse = withSummary(duplicatePersonas(cloneResponse()), {
  decisionMode: "review",
  inputType: "copy",
  winner: "A",
  avgScoreA: 3.6,
  avgScoreB: 3.6,
  riskAxesB: undefined,
  typeAxesB: undefined,
  segmentBreakdown: [],
  recommendedCopies: [
    "회의가 끝나면 할 일과 담당자가 바로 정리됩니다",
    "회의 후 정리 시간을 줄여주는 실무용 AI 어시스턴트",
    "복잡한 회의 내용을 팀이 바로 실행할 수 있게 정리합니다",
  ],
  topConcerns: [
    "어떤 툴과 연동되는지 바로 드러나지 않아 기대 대비 구체성이 부족합니다.",
    "보안과 데이터 처리 방식이 먼저 설명되지 않으면 팀 도입이 망설여질 수 있습니다.",
  ],
});

const pricingCompareResponse = withSummary(duplicatePersonas(cloneResponse()), {
  decisionMode: "compare",
  inputType: "pricing",
  winner: "A",
  avgScoreA: 3.8,
  avgScoreB: 3.1,
  typeAxesA: { perceivedValue: 4.1, affordability: 3.8, willingnessToPay: 3.7 },
  typeAxesB: { perceivedValue: 3.2, affordability: 2.6, willingnessToPay: 2.9 },
  oneParagraphInsight: "플랜 A는 도입 장벽이 낮고 팀이 바로 시험해보기 쉬워 더 안정적으로 받아들여졌습니다. 플랜 B는 상위 플랜 혜택은 좋아 보이지만 시작 가격과 과금 구조가 복잡하게 느껴졌습니다.",
  recommendedCopies: [
    "팀 5명까지는 바로 시작할 수 있게 진입 장벽을 낮추세요.",
    "과금 단위를 줄이고 어떤 시점에 업그레이드가 필요한지 명확히 설명하세요.",
    "무료와 유료의 차이를 기능 대신 업무 결과 중심으로 보여주세요.",
  ],
});

const featureCompareResponse = withSummary(duplicatePersonas(cloneResponse()), {
  decisionMode: "compare",
  inputType: "feature",
  winner: "B",
  avgScoreA: 3.0,
  avgScoreB: 4.0,
  typeAxesA: { necessity: 2.8, urgency: 2.6, existingSolutionAwareness: 2.7 },
  typeAxesB: { necessity: 4.1, urgency: 3.8, existingSolutionAwareness: 3.9 },
  oneParagraphInsight: "기능안 B는 회의 직후 자동으로 담당자와 마감일을 정리해준다는 점이 명확해 '당장 필요하다'는 반응을 더 끌어냈습니다. 기능안 A는 있으면 좋지만 기존 툴로도 대체 가능하다는 인식이 강했습니다.",
  recommendedCopies: [
    "기능 설명을 '무엇을 보여준다'보다 '어떤 일을 대신 해준다'로 바꾸세요.",
    "회의 직후 바로 실행되는 장면을 예시로 보여주세요.",
    "기존 수작업 대비 얼마나 줄어드는지 숫자로 보강하세요.",
  ],
});

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: "copy-compare",
    label: "메시지 비교",
    description: "랜딩 메시지 A/B를 비교하는 기본 데모",
    request: copyCompareRequest,
    response: copyCompareResponse,
  },
  {
    id: "copy-review",
    label: "메시지 검토",
    description: "단일 온보딩 문구를 점검하는 데모",
    request: {
      ...copyCompareRequest,
      decisionMode: "review",
      variantA: "회의가 끝나면 할 일과 담당자가 자동으로 정리됩니다",
      variantB: "",
    },
    response: copyReviewResponse,
  },
  {
    id: "pricing-compare",
    label: "가격 비교",
    description: "두 플랜 구조 중 어느 쪽이 더 납득되는지 비교",
    request: {
      ...copyCompareRequest,
      inputType: "pricing",
      variantA: "Starter 월 29,000원 · 5명까지 사용 · 회의 200건 자동 정리",
      variantB: "Pro 월 99,000원 · 사용자 무제한 · 모든 AI 기능 제공",
    },
    response: pricingCompareResponse,
  },
  {
    id: "pricing-review",
    label: "가격 검토",
    description: "단일 플랜의 가격 저항을 점검하는 데모",
    request: {
      ...copyCompareRequest,
      decisionMode: "review",
      inputType: "pricing",
      variantA: "팀당 월 79,000원 · 사용자 무제한 · 회의 자동 정리와 공유 포함",
      variantB: "",
    },
    response: withSummary(pricingCompareResponse, {
      decisionMode: "review",
      winner: "A",
      avgScoreB: 3.4,
      riskAxesB: undefined,
      typeAxesB: undefined,
      segmentBreakdown: [],
    }),
  },
  {
    id: "feature-compare",
    label: "기능 비교",
    description: "무엇을 먼저 만들지 판단하는 기능안 비교",
    request: {
      ...copyCompareRequest,
      inputType: "feature",
      variantA: "회의 요약을 팀 위키에 자동 저장하는 기능",
      variantB: "회의가 끝나면 담당자·마감일·우선순위를 자동 생성하는 기능",
    },
    response: featureCompareResponse,
  },
  {
    id: "feature-review",
    label: "기능 검토",
    description: "단일 기능 아이디어의 필요성과 긴급성을 점검",
    request: {
      ...copyCompareRequest,
      decisionMode: "review",
      inputType: "feature",
      variantA: "회의 후 생성된 액션 아이템을 슬랙과 노션에 동시에 동기화하는 기능",
      variantB: "",
    },
    response: withSummary(featureCompareResponse, {
      decisionMode: "review",
      winner: "A",
      avgScoreA: 3.9,
      avgScoreB: 3.9,
      riskAxesB: undefined,
      typeAxesB: undefined,
      segmentBreakdown: [],
    }),
  },
];

export const DEFAULT_DEMO_SCENARIO = DEMO_SCENARIOS[0];
