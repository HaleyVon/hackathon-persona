# Persona Signal Technical Architecture

## 1. 목표
Nemotron-Personas-Korea 기반의 한국인 합성 페르소나를 샘플링하고, 제품 설명/랜딩 카피 A/B에 대한 반응을 LLM으로 시뮬레이션해 **구매의향, 거부 포인트, 개선 제안**을 보여주는 해커톤 MVP를 만든다.

핵심은 **복잡한 리서치 플랫폼이 아니라, 한 번의 입력으로 설득력 있는 비교 결과를 보여주는 데모 가능한 검증 툴**이다.

---

## 2. 최종 권장 기술스택
### 필수
- **Framework**: Next.js 14+ App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI primitives**: shadcn/ui
- **Charts**: Recharts
- **Runtime API**: Next.js Route Handlers (`app/api/...`)
- **LLM Provider**: OpenAI (`gpt-4o-mini`)
- **Data Source Runtime**: local JSON file (`data/personas.sample.json`)
- **Deploy**: Vercel (Pro 또는 `maxDuration = 60` 설정 필수)

### 개발용 보조
- **Validation**: Zod
- **Class merging**: clsx + tailwind-merge
- **Lint/format**: ESLint + Prettier

### 의도적으로 제외
- 별도 Python backend
- DB(Postgres, SQLite, Supabase)
- Auth
- 백오피스
- 멀티페이지 라우팅
- 실시간 스트리밍 아키텍처
- queue / websocket

**원칙:** 해커톤 MVP는 **Next.js 단일 앱**으로 끝낸다.

---

## 3. 왜 이 스택이 최적인가
### Next.js App Router
- 프론트/백을 한 리포에서 처리 가능
- Vercel 배포가 가장 빠름
- Route Handler로 API까지 한 번에 해결 가능

### Tailwind + shadcn/ui
- 속도가 빠름
- 대시보드 스타일 UI 조립이 쉬움
- 발표 직전 미세 수정이 빠름

### Recharts
- A/B 비교 차트 하나만 깔끔하게 만들기 좋음
- 구현 복잡도가 낮음

### local JSON 샘플
- 100만 rows 전체 질의 필요 없음
- runtime 불안정성 감소
- 발표 중 네트워크/latency 리스크 축소

---

## 4. 시스템 컨텍스트
```text
사용자
  ↓
브라우저 UI (Next.js page)
  ↓ POST /api/simulate
Route Handler
  ├─ personas.sample.json 로드
  ├─ filter + sampling
  ├─ prompt 생성
  ├─ LLM 호출
  └─ 결과 집계
  ↓
JSON 응답
  ↓
결과 UI 렌더링
```

---

## 5. 런타임 데이터 플로우
### 입력
- productDescription
- variantA
- variantB
- filters
  - sexes
  - ageMin / ageMax
  - occupations
  - provinces
- sampleSize (기본값: 5, 발표용: 8)

### 처리 단계
1. 요청 validation (Zod)
2. 샘플 JSON 로드 (`personas.sample.json`)
3. 필터 조건 적용
4. 페르소나 n명 랜덤 샘플링 (0건이면 조건 완화 fallback)
5. **Promise.all로 n개 병렬 LLM 호출** — 페르소나 1명당 A/B 반응을 한 번에 생성
6. 개별 결과 JSON parse + normalize
7. **요약 LLM 호출 1회** — 전체 반응을 입력으로 집계 인사이트 + 개선 카피 3개 생성
8. 세그먼트 분화 계산 (성별/연령대별 A/B 선호 집계)
9. UI용 response 생성

### LLM 호출 수 계산
- sampleSize=5: 5 (병렬) + 1 (요약) = **총 6회**
- sampleSize=8: 8 (병렬) + 1 (요약) = **총 9회**
- 예상 응답 시간: 10~20초

### Vercel 타임아웃 설정 (필수)
```ts
// app/api/simulate/route.ts 최상단
export const maxDuration = 60;
```

### 출력
- summary (winner, avgScoreA, avgScoreB, segmentBreakdown)
- personas[]
- insights
- recommendations

---

## 6. 권장 폴더 구조
```text
app/
  layout.tsx
  globals.css
  page.tsx
  api/
    simulate/
      route.ts
components/
  input-form.tsx
  filter-panel.tsx
  run-toolbar.tsx
  result-summary.tsx
  score-chart.tsx
  insight-cards.tsx
  persona-card.tsx
  empty-state.tsx
  loading-state.tsx
lib/
  types.ts
  constants.ts
  personas.ts
  prompt.ts
  llm.ts
  summarize.ts
  demo.ts
  utils.ts
data/
  personas.sample.json
  demo-request.json
  demo-response.json
scripts/
  prepare_personas.py

docs/
  architecture/
  hackathon/
plans/
```

---

## 7. 핵심 타입 설계
```ts
// personas.sample.json의 각 항목 (snake_case → camelCase 변환 후)
export type PersonaRecord = {
  id: string;
  persona: string;
  professionalPersona?: string;
  familyPersona?: string;
  hobbies?: string;
  goals?: string;
  sex: string;
  age: number;
  occupation: string;
  province: string;
  educationLevel?: string;
};

export type SimulationRequest = {
  productDescription: string;
  variantA: string;
  variantB: string;
  filters: {
    sexes: string[];
    ageMin: number;
    ageMax: number;
    occupations: string[];
    provinces: string[];
  };
  sampleSize: number;
};

// LLM이 페르소나 1명당 반환하는 구조 (A/B 동시 생성)
export type PersonaReactionPair = {
  reactionA: {
    purchaseIntent: number;   // 1~5
    likedPoints: string[];
    concerns: string[];
    memorablePhrase: string;
    oneSentenceReaction: string;
  };
  reactionB: {
    purchaseIntent: number;   // 1~5
    likedPoints: string[];
    concerns: string[];
    memorablePhrase: string;
    oneSentenceReaction: string;
  };
  preferredVariant: "A" | "B" | "Tie";
  preferenceReason: string;
};

export type PersonaComparisonResult = {
  persona: PersonaRecord;
} & PersonaReactionPair;

// 세그먼트 분화 (와우 모먼트)
export type SegmentBreakdown = {
  label: string;             // 예: "30대 여성"
  preferA: number;           // 명수
  preferB: number;
  tie: number;
};

export type SimulationResponse = {
  summary: {
    winner: "A" | "B" | "Tie";
    avgScoreA: number;
    avgScoreB: number;
    topLikedPoints: string[];
    topConcerns: string[];
    recommendedCopies: string[];   // 개선 카피 3개 (요약 LLM 생성)
    oneParagraphInsight: string;
    segmentBreakdown: SegmentBreakdown[];  // 세그먼트 분화
  };
  personas: PersonaComparisonResult[];
};
```

### snake_case → camelCase 변환 (lib/personas.ts 책임)
```ts
// 원본 JSON row를 PersonaRecord로 변환
function toPersonaRecord(raw: Record<string, unknown>, index: number): PersonaRecord {
  return {
    id: String(index),
    persona: String(raw.persona ?? ""),
    professionalPersona: raw.professional_persona as string | undefined,
    familyPersona: raw.family_persona as string | undefined,
    hobbies: raw.hobbies_and_interests as string | undefined,
    goals: raw.career_goals_and_ambitions as string | undefined,
    sex: String(raw.sex ?? ""),
    age: Number(raw.age ?? 0),
    occupation: String(raw.occupation ?? ""),
    province: String(raw.province ?? ""),
    educationLevel: raw.education_level as string | undefined,
  };
}
```

---

## 8. API 스펙
### Endpoint
`POST /api/simulate`

### Request
```json
{
  "productDescription": "AI가 업무를 자동 정리해주는 생산성 도구",
  "variantA": "회의록과 업무를 자동으로 정리하는 AI 비서",
  "variantB": "퇴근 시간을 앞당겨주는 실무형 AI 워크 어시스턴트",
  "filters": {
    "sexes": ["남자", "여자"],
    "ageMin": 25,
    "ageMax": 39,
    "occupations": ["사무직", "기획", "마케팅"],
    "provinces": ["서울", "경기", "인천"]
  },
  "sampleSize": 10
}
```

### Response
```json
{
  "summary": {
    "winner": "B",
    "avgScoreA": 3.4,
    "avgScoreB": 4.1,
    "topLikedPoints": ["실무적 표현", "시간 절약", "직접 효용"],
    "topConcerns": ["너무 추상적임", "실제 기능 불명확", "광고 문구 같음"],
    "recommendedNextActions": [
      "성과를 더 구체적으로 적기",
      "자동화 범위를 명시하기",
      "신뢰를 주는 예시 추가"
    ],
    "oneParagraphInsight": "25~39세 수도권 사무직 기준으로 B 문구가 더 높은 반응을 얻었다..."
  },
  "personas": []
}
```

---

## 9. 상태 관리 원칙
### 로컬 state만 사용
- `useState`
- `useMemo`
- `useTransition` 또는 `isLoading`

### 전역 상태 도구 불필요
- Zustand
- Redux
- React Query
전부 제외 가능

**원칙:** 단일 페이지, 단일 요청, 단일 결과 구조이므로 로컬 상태면 충분하다.

---

## 10. 오류/실패 처리 설계
### 반드시 처리할 실패
1. 필터 조건에 맞는 페르소나 없음
2. LLM 응답 JSON 파싱 실패
3. LLM timeout
4. API key 미설정
5. 사용자가 빈 입력 제출

### 대응 UX
- 에러 alert 대신 **카드형 에러 박스**
- 문구 예시:
  - `조건에 맞는 페르소나가 부족합니다. 지역 또는 직업 조건을 완화해보세요.`
  - `AI 응답 생성 중 형식 오류가 발생했습니다. 다시 시도하거나 데모 모드로 전환하세요.`

### 데모 안전장치
- `demo-response.json` fallback
- `데모 모드` 토글
- 발표 직전엔 실제 API보다 fallback까지 준비

---

## 11. 성능 원칙
- sample size 기본값 `10`
- 1회 요청당 persona 5~10명만 사용
- 병렬 호출이 불안하면 1명씩 순차 호출도 허용
- 결과 정확도보다 **발표 안정성** 우선

### 추천 전략
- 개발 중: `sampleSize = 5`
- 발표용: `sampleSize = 8` 또는 `10`

---

## 12. 보안/운영 원칙
- API key는 `.env.local`만 사용
- 클라이언트에 key 노출 금지
- route handler 내부에서만 LLM 호출
- PII 저장 금지
- 이 앱은 synthetic persona 기반이므로 민감 개인 데이터 저장 없음

---

## 13. 배포 전략
### 1순위
- Vercel 배포

### 이유
- Next.js 최적
- 해커톤에서 URL 공유 쉬움
- 배포 실패시 수정과 재배포 빠름

### 환경변수
- `OPENAI_API_KEY`
- `OPENAI_MODEL`

---

## 14. 개발 시 절대 하지 말 것
- 백엔드 분리
- DB 붙이기
- 사용자 로그인
- 검색 기능 확장
- 여러 페이지 만들기
- 실시간 협업 기능
- 상세 통계 분석 대시보드 욕심내기

---

## 15. 기술 의사결정 한 줄 요약
> **Next.js 단일 앱 + local JSON + LLM API 1개**로 끝내는 것이 해커톤 MVP의 최적 구조다.
