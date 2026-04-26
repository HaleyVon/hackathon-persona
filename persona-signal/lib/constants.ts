export const SEX_OPTIONS = ["남자", "여자"];

export const PROVINCE_OPTIONS = [
  "서울", "경기", "인천",
  "부산", "대구", "광주", "대전", "울산",
  "경상남", "경상북", "전북", "전라남",
  "충청남", "충청북", "강원", "제주", "세종",
];

export const AGE_PRESETS = [
  { label: "20대", min: 20, max: 29 },
  { label: "30대", min: 30, max: 39 },
  { label: "40대", min: 40, max: 49 },
  { label: "50대", min: 50, max: 59 },
];

export const OCCUPATION_OPTIONS = [
  "사무직", "기획", "마케팅", "영업", "IT/개발",
  "교육", "의료", "서비스업", "제조/생산", "무직",
];

export const SAMPLE_SIZE_OPTIONS = [3, 5, 8, 10];

export const DEMO_REQUEST = {
  productDescription: "AI가 회의록과 업무를 자동으로 정리해주는 팀 생산성 도구",
  variantA: "회의록과 업무를 자동으로 정리하는 AI 비서",
  variantB: "퇴근 시간을 앞당겨주는 실무형 AI 워크 어시스턴트",
  filters: {
    sexes: ["남자", "여자"],
    ageMin: 25,
    ageMax: 39,
    occupations: [],
    provinces: ["서울", "경기", "인천"],
  },
  sampleSize: 5,
};
