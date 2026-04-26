export const SEX_OPTIONS = ["남자", "여자"];

export const PROVINCE_OPTIONS = [
  "서울", "경기", "인천",
  "부산", "대구", "광주", "대전", "울산",
  "경상남", "경상북", "전북", "전라남",
  "충청남", "충청북", "강원", "제주", "세종",
];

export const AGE_PRESETS = [
  { label: "10대", min: 15, max: 19 },
  { label: "20대", min: 20, max: 29 },
  { label: "30대", min: 30, max: 39 },
  { label: "40대", min: 40, max: 49 },
  { label: "50대+", min: 50, max: 65 },
];

export const OCCUPATION_OPTIONS = [
  "사무직", "기획", "마케팅", "영업", "IT/개발",
  "교육", "의료", "서비스업", "제조/생산", "자영업", "무직/주부/학생",
];

// Nemotron 데이터셋의 실제 marital_status 값
export const MARITAL_OPTIONS = [
  { value: "미혼", label: "미혼" },
  { value: "기혼", label: "기혼" },
  { value: "이혼", label: "이혼/기타" },
];

export const SAMPLE_SIZE_OPTIONS = [3, 5, 8, 10];

// ─── 타겟 프리셋 ───────────────────────────────────────────
export type TargetPreset = {
  id: string;
  label: string;
  description: string;
  filters: {
    sexes: string[];
    ageMin: number;
    ageMax: number;
    occupations: string[];
    provinces: string[];
    maritalStatuses: string[];
  };
};

export const TARGET_PRESETS: TargetPreset[] = [
  {
    id: "all",
    label: "전체 타겟",
    description: "모든 연령·성별·지역",
    filters: { sexes: [], ageMin: 18, ageMax: 65, provinces: [], occupations: [], maritalStatuses: [] },
  },
  {
    id: "young_female",
    label: "20대 여성",
    description: "20~29세 여성 · 서울/경기",
    filters: { sexes: ["여자"], ageMin: 20, ageMax: 29, provinces: ["서울", "경기"], occupations: [], maritalStatuses: ["미혼"] },
  },
  {
    id: "it_worker",
    label: "IT 종사자",
    description: "25~42세 · IT/개발직",
    filters: { sexes: [], ageMin: 25, ageMax: 42, provinces: [], occupations: ["IT/개발"], maritalStatuses: [] },
  },
  {
    id: "parent",
    label: "육아중 부모",
    description: "28~45세 기혼 · 자녀 있는 가정",
    filters: { sexes: [], ageMin: 28, ageMax: 45, provinces: [], occupations: [], maritalStatuses: ["기혼"] },
  },
  {
    id: "student",
    label: "대학생/취준생",
    description: "18~26세 미혼",
    filters: { sexes: [], ageMin: 18, ageMax: 26, provinces: [], occupations: [], maritalStatuses: ["미혼"] },
  },
  {
    id: "marketing_pm",
    label: "마케터/기획자",
    description: "25~40세 · 마케팅/기획직",
    filters: { sexes: [], ageMin: 25, ageMax: 40, provinces: [], occupations: ["마케팅", "기획"], maritalStatuses: [] },
  },
  {
    id: "saas_buyer",
    label: "SaaS 구매자",
    description: "28~45세 · IT/기획/마케팅",
    filters: { sexes: [], ageMin: 28, ageMax: 45, provinces: ["서울", "경기", "인천"], occupations: ["IT/개발", "기획", "마케팅"], maritalStatuses: [] },
  },
  {
    id: "senior_consumer",
    label: "50대+ 시니어",
    description: "50~65세 · 디지털 일반",
    filters: { sexes: [], ageMin: 50, ageMax: 65, provinces: [], occupations: [], maritalStatuses: [] },
  },
];

// ─── 데모 기본값 ───────────────────────────────────────────
export const DEMO_REQUEST = {
  productDescription: "AI가 회의록과 업무를 자동으로 정리해주는 팀 생산성 도구",
  variantA: "회의록과 업무를 자동으로 정리하는 AI 비서",
  variantB: "퇴근 시간을 앞당겨주는 실무형 AI 워크 어시스턴트",
  filters: {
    sexes: [] as string[],
    ageMin: 25,
    ageMax: 42,
    occupations: ["IT/개발", "기획", "마케팅"],
    provinces: ["서울", "경기"],
    maritalStatuses: [] as string[],
  },
  sampleSize: 5,
};
