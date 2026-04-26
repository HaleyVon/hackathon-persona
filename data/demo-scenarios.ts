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
  productDescription: "B2B 영업팀과 CS팀이 고객 미팅 녹취나 콜 메모를 업로드하면 AI가 고객 요구사항, 다음 액션, 리스크 키워드를 정리해 CRM에 붙여주는 SaaS입니다. 베타 고객은 30~300명 규모의 B2B SaaS 회사이고, 데모 후 가장 자주 막히는 질문은 '고객 대화 데이터를 AI에 넣어도 되는가', '퇴사자나 외주 인력이 녹취를 볼 수 있는가'입니다. 마케팅팀은 AI 자동 요약으로 생산성 메시지를 크게 밀고 싶어하고, 세일즈팀은 보안 질문 때문에 계약 검토가 2주씩 늘어난다고 보고 있습니다.",
  targetCustomer: "Head of Sales, CS Lead, RevOps Manager처럼 고객 대화 데이터를 다루는 팀의 구매 검토자와 실제로 콜 메모를 남기는 AE/CSM",
  marketType: "B2B",
  usageContext: "랜딩 페이지 첫 화면의 헤드라인을 정하는 상황입니다. 목표 지표는 데모 신청 전환율이지만, 실제 병목은 데모 이후 보안 질의로 세일즈 사이클이 길어지는 문제입니다. 구매 검토자는 보안/권한/삭제 정책을 먼저 확인하고, 실제 사용자는 콜 종료 후 CRM 입력 시간을 줄이고 싶어합니다.",
  variantA: "고객 미팅을 자동 요약해 CRM 업데이트 시간을 절반으로 줄이세요",
  variantB: "민감한 고객 대화는 보호하고, 영업팀이 할 일만 CRM에 남깁니다",
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
  productDescription: "프로덕트/운영팀 회의 녹취를 받아 결정사항, 오너, 마감일을 정리해주는 협업 SaaS입니다. 현재 팀은 다음 스프린트에 기능 하나만 넣을 수 있고, 개발 리소스는 2주뿐입니다. 개발팀은 회의 요약을 위키에 저장하는 기능이 구현이 쉽다고 보고, PM은 회의 후 담당자와 마감일이 안 정해져 일이 빠지는 문제가 더 크다고 봅니다.",
  targetCustomer: "주 5회 이상 회의를 진행하고 회의 후 액션아이템 정리에 시간을 쓰는 PM, 팀 리더, 운영 담당자",
  usageContext: "스프린트 플래닝 전에 다음 릴리즈의 핵심 기능을 하나 고르는 상황입니다. 성공 지표는 기능 사용률이 아니라 회의 후 24시간 내 액션아이템 생성률, 담당자 지정률, 슬랙 리마인드 클릭률입니다.",
  variantA: "회의 요약을 노션/컨플루언스 팀 위키에 자동 저장하는 기능",
  variantB: "회의가 끝나면 담당자, 마감일, 우선순위를 뽑아 슬랙으로 확인 요청을 보내는 기능",
  inputType: "feature",
};

const commercePricingRequest: SimulationRequest = {
  productDescription: "정기배송을 운영하는 D2C 브랜드가 구독 주문, 배송 주기 변경, 결제 실패, 재고 알림, 해지 방어 캠페인을 한 화면에서 관리하는 SaaS입니다. 현재 베타 고객은 건강식품, 반려동물 용품, 커피 구독 브랜드이고 월 구독 주문은 100~2,000건 사이입니다. 영업팀은 시작 가격을 낮춰야 리드가 늘어난다고 주장하고, 운영팀은 주문이 늘수록 월 비용이 예측되지 않으면 대표가 결제를 꺼린다고 봅니다.",
  targetCustomer: "월 구독 주문 100~2,000건 사이의 D2C 브랜드 대표, 운영 매니저, CRM 마케터",
  marketType: "B2B",
  usageContext: "가격 페이지 개편 직전입니다. 목표는 무료 상담 신청률을 높이되, 상담 후 가격 설명에서 이탈하는 비율을 줄이는 것입니다. 구매자는 대표나 운영 리드이고, 실제 사용자는 고객 문의와 구독 변경을 처리하는 운영 담당자입니다.",
  variantA: "월 49,000원 고정 요금. 구독 주문 500건까지 추가 비용 없이 관리",
  variantB: "주문 1건당 120원. 주문이 없으면 비용도 없는 사용량 기반 요금",
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
  productDescription: "식단/생필품 정기배송 커머스 앱에서 첫 달 무료 멤버십 체험을 제공하고 있습니다. 멤버십은 무료배송, 5% 적립, 배송일 변경 우선권을 포함하지만, 무료 체험 종료 48시간 전 업그레이드 모달에서 전환율이 낮고 CS에는 '언제 결제되는지 모르겠다'는 문의가 들어옵니다. Growth팀은 긴급감을 높이고 싶고, CX팀은 압박 문구가 해지와 문의를 늘린다고 우려합니다.",
  targetCustomer: "무료배송과 정기배송 혜택을 경험한 20~40대 모바일 커머스 사용자",
  marketType: "B2C",
  usageContext: "무료 체험 종료 48시간 전 앱 첫 진입 시 뜨는 업그레이드 모달 문구입니다. 목표 지표는 유료 전환율이지만, 동시에 결제 관련 CS 문의와 즉시 해지율을 늘리면 안 됩니다.",
  variantA: "무료 체험이 48시간 후 종료됩니다. 무료배송과 5% 적립을 계속 받으려면 오늘 멤버십을 유지하세요.",
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
  productDescription: "중학생이 매일 15분 수학 문제를 풀면 AI가 오답 원인, 다음 문제, 주간 학습 리포트를 만들어주는 학습 앱입니다. 학생은 앱에서 문제를 풀고 뱃지와 랭킹을 보지만, 실제 결제자는 학부모입니다. 팀 내부에서는 '학생이 재미있어야 계속 쓴다'는 주장과 '학부모가 성적 변화와 학습 습관을 믿어야 결제한다'는 주장이 갈립니다.",
  targetCustomer: "중학생 자녀를 둔 35~49세 학부모와 실제 앱을 매일 쓰는 중학생",
  marketType: "B2C",
  usageContext: "학부모 대상 랜딩 첫 화면 문구를 정하는 상황입니다. 목표는 무료 진단 신청률과 첫 달 유료 전환율입니다. 다만 실제 유지율은 학생이 앱을 계속 여는지에 달려 있어, 문구가 학부모 신뢰와 학생 사용 동기를 동시에 건드려야 합니다.",
  variantA: "아이는 게임처럼 풀고, 부모는 성적 변화를 보는 AI 수학 코치",
  variantB: "매일 15분, AI가 오답 원인을 찾아 다음 문제를 골라줍니다",
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
  productDescription: "급여 입금, 카드값, 고정비, 구독 결제를 분석해 다음 달 말 예상 잔고와 이번 달 줄일 수 있는 지출을 보여주는 개인 금융 앱입니다. 사용자는 카드 내역과 계좌를 연결해야 첫 리포트를 볼 수 있습니다. 마케팅팀은 '돈이 새는 곳을 찾아준다'는 강한 문제 제기를 원하고, 제품/법무팀은 계좌 연결 전 불안감과 개인정보 우려를 낮추는 문구가 먼저라고 봅니다.",
  targetCustomer: "월급은 받지만 카드값, 고정비, 구독비 때문에 다음 달 잔고가 불안한 25~39세 직장인",
  marketType: "B2C",
  usageContext: "첫 가입 후 계좌 연결 직전 화면의 헤드라인입니다. 목표 지표는 계좌 연결 완료율과 첫 리포트 조회율입니다. 단, 과장되거나 감시받는 느낌을 주면 금융 데이터 접근 허용 단계에서 이탈할 수 있습니다.",
  variantA: "당신의 돈이 어디로 새는지 AI가 자동으로 찾아드립니다",
  variantB: "계좌를 읽기 전용으로 연결하고, 다음 달 남는 돈을 미리 확인하세요",
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
    "B안은 세일즈팀이 실제로 막히는 보안 질문을 첫 문장부터 다룹니다.",
    "CRM에 남길 실행 항목이라는 결과물이 AE/CSM의 반복 업무와 바로 연결됩니다.",
    "민감한 고객 대화라는 표현이 구매 승인자의 검토 기준을 건드립니다.",
  ],
  topConcerns: [
    "A안은 생산성은 좋아 보이지만 '고객 대화 데이터'를 다룬다는 민감도가 보이지 않습니다.",
    "B안도 읽기 전용 권한, 보관 기간, 삭제 정책 중 하나가 없으면 보안팀 질문을 막기 어렵습니다.",
  ],
  recommendedCopies: [
    "고객 대화 원문은 보호하고, 영업팀에는 다음 액션만 남깁니다.",
    "읽기 권한과 보관 기간을 통제하면서 미팅 액션아이템을 CRM에 자동 기록하세요.",
    "AI 요약보다 먼저, 고객 데이터가 어떻게 보호되는지 보여주세요.",
  ],
  oneParagraphInsight: "이 케이스의 핵심은 AI 요약의 매력이 아니라 고객 대화 데이터에 대한 승인 리스크입니다. B안은 세일즈 사이클을 늦추는 질문을 먼저 건드리지만, 보안 근거가 CTA 근처에 없으면 구매 승인자는 여전히 멈출 가능성이 큽니다.",
  relevanceMix: { high: 70, medium: 20, low: 10 },
  unexpectedSignals: [
    {
      code: "trust_gap",
      title: "AI 효율보다 보안 승인 질문이 먼저 나옵니다",
      description: "실사용자는 CRM 입력 시간을 줄이고 싶어하지만 구매 검토자는 고객 대화 원문이 어디에 저장되는지부터 묻습니다. 헤드라인 바로 아래에 권한/보관/삭제 기준이 필요합니다.",
      severity: "critical",
    },
    {
      code: "hidden_segment_risk",
      title: "좋아하는 사람과 승인하는 사람이 다릅니다",
      description: "AE/CSM은 자동 기록을 좋아하지만 RevOps나 보안 담당자는 접근 권한과 감사 로그를 먼저 봅니다. 메시지를 한 줄로만 끝내면 내부 공유에서 막힐 수 있습니다.",
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
    "B안은 회의 후 실제로 일이 빠지는 지점인 담당자와 마감일을 직접 건드립니다.",
    "슬랙 확인 요청까지 이어지는 흐름이 PM의 후속 관리 부담을 줄여줍니다.",
  ],
  topConcerns: [
    "자동 지정이 틀렸을 때 누가 승인하거나 수정하는지 보이지 않으면 팀 혼선을 만들 수 있습니다.",
    "요약 저장은 구현은 쉬워 보이지만 사용자가 매일 돌아올 이유가 약합니다.",
  ],
  recommendedCopies: [
    "담당자와 마감일은 AI가 초안으로 만들고, 팀원이 슬랙에서 확인하게 하세요.",
    "회의록 저장이 아니라 '누가 무엇을 언제까지 할지'를 핵심 가치로 올리세요.",
    "자동 생성 후 승인/수정 가능한 흐름을 기능 설명에 포함하세요.",
  ],
  oneParagraphInsight: "팀이 다음 스프린트에 하나만 만든다면 B안이 더 강합니다. 위키 저장은 정리된 느낌은 주지만, 회의 후 업무가 빠지는 원인을 해결하지 못하고 B안은 실행 공백을 직접 줄입니다. 다만 자동 지정은 초안이며 사람이 확인한다는 통제감을 함께 줘야 합니다.",
  relevanceMix: { high: 80, medium: 20, low: 0 },
  unexpectedSignals: [
    {
      code: "clarity_without_action",
      title: "정확도보다 승인 흐름이 더 중요할 수 있습니다",
      description: "담당자 자동 생성은 강한 must-have 신호가 있지만, 틀렸을 때 바로 고칠 수 있다는 장치가 없으면 팀 리더는 오히려 리스크로 봅니다.",
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
    "A안은 대표와 운영 매니저가 월 비용을 바로 예측할 수 있습니다.",
    "500건 기준이 있어 상담 전 자기 브랜드 규모에 대입하기 쉽습니다.",
  ],
  topConcerns: [
    "초기 브랜드는 49,000원도 고정비로 느낄 수 있어 첫 달 체험 장치가 필요합니다.",
    "B안은 주문당 120원이 싸 보여도 성수기 주문량에서 월 비용을 다시 계산해야 합니다.",
  ],
  recommendedCopies: [
    "월 49,000원으로 500건까지, 성수기에도 비용 예측이 쉽습니다.",
    "초기 브랜드는 첫 달 무료로 주문량을 확인한 뒤 고정 요금으로 전환하세요.",
    "주문 500건, 1,000건 기준 예상 월 비용을 가격표에 같이 보여주세요.",
  ],
  oneParagraphInsight: "이 케이스는 낮은 진입 장벽보다 예측 가능한 월 비용이 더 강한 구매 근거가 됩니다. 주문당 과금은 상담 신청은 늘릴 수 있지만, 실제 결제 단계에서는 대표가 월말 청구액을 다시 계산해야 해 불안이 생깁니다.",
  relevanceMix: { high: 55, medium: 30, low: 15 },
  unexpectedSignals: [
    {
      code: "clarity_without_action",
      title: "싸 보이는 단가가 대표에게는 불확실성입니다",
      description: "주문당 120원은 작아 보이지만 성수기 주문량을 곱해야 합니다. 운영자는 낮은 단가보다 다음 달 청구액을 예측할 수 있는 가격표에 더 안정적으로 반응합니다.",
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
    "48시간 후 종료라는 시점은 명확해서 사용자가 상황을 바로 이해합니다.",
    "무료배송과 5% 적립을 유지한다는 표현은 이미 경험한 혜택과 연결됩니다.",
  ],
  topConcerns: [
    "오늘 유지하세요라는 표현은 혜택 안내보다 결제 압박으로 먼저 읽힐 수 있습니다.",
    "언제 과금되는지, 해지는 쉬운지 보이지 않으면 CS 문의가 늘 수 있습니다.",
  ],
  recommendedCopies: [
    "48시간 후 무료 체험이 끝납니다. 이번 달 받은 무료배송과 적립 혜택을 계속 유지할 수 있어요.",
    "이번 달 절약한 금액을 먼저 보여주고, 그 아래에 멤버십 유지 CTA를 두세요.",
    "다음 결제일과 언제든 해지 가능 문구를 CTA 근처에 함께 보여주세요.",
  ],
  oneParagraphInsight: "문구 자체는 명확하지만 Growth가 원하는 긴급감이 CX 리스크를 만들 수 있습니다. 전환율만 보지 말고 결제 문의와 즉시 해지율까지 같이 보면, 압박보다 받은 혜택의 근거를 먼저 보여주는 편이 안전합니다.",
  relevanceMix: { high: 45, medium: 35, low: 20 },
  unexpectedSignals: [
    {
      code: "trust_gap",
      title: "전환율을 올리려다 CS 문의가 늘 수 있습니다",
      description: "종료 시점은 선명하지만 결제일과 해지 가능성이 보이지 않으면 업그레이드보다 문의가 먼저 발생할 수 있습니다.",
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
    "B안은 학부모가 결제 전에 확인하고 싶은 오답 원인과 다음 학습 계획을 직접 말합니다.",
    "A안은 학생 사용 동기를 건드리지만 학부모에게는 성과 근거가 부족하게 보입니다.",
  ],
  topConcerns: [
    "게임처럼이라는 표현은 학생에게는 좋지만 학부모에게는 학습 진지함을 낮게 보이게 할 수 있습니다.",
    "B안은 학부모 설득은 강하지만 학생이 매일 열 이유가 충분히 드러나지 않습니다.",
  ],
  recommendedCopies: [
    "아이는 매일 15분 풀고, 부모는 오답 변화와 다음 학습 계획을 확인합니다.",
    "학생 화면에는 도전 과제를, 학부모 화면에는 오답 원인과 성장 리포트를 보여주세요.",
    "랜딩 첫 문장은 학부모 신뢰, 두 번째 문장은 학생 지속 사용 동기로 분리하세요.",
  ],
  oneParagraphInsight: "교육 앱은 학생이 쓰고 학부모가 결제합니다. 한 문구로 둘을 동시에 설득하려 하면 메시지가 흐려지고, 학부모 신뢰와 학생 지속 사용 동기를 화면 안에서 분리해 보여주는 편이 더 현실적입니다.",
  relevanceMix: { high: 50, medium: 35, low: 15 },
  unexpectedSignals: [
    {
      code: "buyer_user_mismatch",
      title: "좋아하는 사람과 결제하는 사람이 다릅니다",
      description: "학생에게는 게임성과 도전 과제가 필요하지만 학부모에게는 오답 원인, 성장 리포트, 학습 습관 근거가 먼저입니다. 한 문장에 섞기보다 화면에서 역할을 나눠야 합니다.",
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
    "B안은 다음 달 남는 돈이라는 결과가 구체적이라 사용자가 얻는 값을 바로 이해합니다.",
    "읽기 전용 연결이라는 표현이 계좌 연결 불안을 일부 낮춥니다.",
  ],
  topConcerns: [
    "A안의 '돈이 새는지'는 강하지만 사용자를 평가하거나 감시하는 느낌을 줄 수 있습니다.",
    "B안도 금융 데이터 접근 범위와 해제 방법이 없으면 연결 직전 이탈이 남습니다.",
  ],
  recommendedCopies: [
    "계좌 연결 전, 읽기 전용으로 어떤 데이터만 가져오는지 먼저 보여주세요.",
    "돈이 샌다는 표현보다 다음 달 남는 돈을 미리 확인한다는 결과를 앞세우세요.",
    "언제든 연결 해제 가능, 저장하지 않는 데이터, 보안 인증을 CTA 근처에 붙이세요.",
  ],
  oneParagraphInsight: "핀테크 첫 연결 화면은 관심을 끄는 문구보다 허락할 수 있는 근거가 더 중요합니다. A안은 문제 제기가 강하지만 감시감이 있고, B안은 결과가 구체적이지만 읽기 전용, 해제 가능, 데이터 범위를 함께 보여줘야 연결 완료율로 이어집니다.",
  relevanceMix: { high: 60, medium: 25, low: 15 },
  unexpectedSignals: [
    {
      code: "trust_gap",
      title: "흥미는 높은데 계좌 연결에서 멈춥니다",
      description: "현금 흐름 예측은 매력적이지만 사용자는 계좌 접근 범위와 연결 해제 방법을 확인한 뒤에야 허락합니다. 헤드라인만 강하면 연결 직전 이탈이 생깁니다.",
      severity: "critical",
    },
    {
      code: "clarity_without_action",
      title: "이해는 되지만 허락하기 어렵습니다",
      description: "무엇을 해주는지는 분명하지만 금융 데이터의 접근 범위, 저장 여부, 해제 방법이 보이지 않으면 행동 의향이 눌립니다.",
      severity: "warning",
    },
  ],
});

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: "b2b-saas-message",
    label: "보안이 막는 SaaS 랜딩",
    description: "AI 요약 메시지 vs 보안 승인 리스크",
    request: b2bMessageRequest,
    response: b2bMessageResponse,
  },
  {
    id: "b2b-saas-feature",
    label: "다음 스프린트 기능",
    description: "위키 저장 vs 담당자/마감일 자동 추출",
    request: b2bFeatureRequest,
    response: b2bFeatureResponse,
  },
  {
    id: "commerce-pricing",
    label: "D2C SaaS 가격표",
    description: "고정 요금 vs 주문당 과금",
    request: commercePricingRequest,
    response: commercePricingResponse,
  },
  {
    id: "commerce-conversion",
    label: "무료체험 종료 모달",
    description: "전환율과 CS 문의 사이의 긴장",
    request: commerceConversionRequest,
    response: commerceConversionResponse,
  },
  {
    id: "education-buyer-user",
    label: "학부모 결제 앱",
    description: "학생 사용성 vs 학부모 신뢰",
    request: educationMismatchRequest,
    response: educationMismatchResponse,
  },
  {
    id: "fintech-trust",
    label: "계좌 연결 첫 화면",
    description: "강한 문제 제기 vs 금융 데이터 신뢰",
    request: fintechTrustRequest,
    response: fintechTrustResponse,
  },
];

export const DEFAULT_DEMO_SCENARIO = DEMO_SCENARIOS[0];
