# Persona Signal Hackathon Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Nemotron-Personas-Korea 기반의 한국인 페르소나 샘플링 + AI 반응 시뮬레이션 + A/B 문구 비교 리포트가 가능한 해커톤 MVP를 완성한다.

**Architecture:** 정적 웹앱 + 경량 API 조합으로 간다. 서버는 Hugging Face parquet에서 미리 추린 샘플 페르소나 JSON을 로드하고, 사용자의 타겟 조건에 맞춰 페르소나를 샘플링한다. 각 페르소나와 입력 문구를 LLM에 넣어 구매의향/호감 포인트/거부 포인트를 생성하고, 서버에서 요약 집계해 UI로 반환한다.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS, OpenAI-compatible LLM API(or Gemini/OpenAI), local JSON sample derived from Nemotron-Personas-Korea.

---

## 0. 해커톤 전략 요약
### 반드시 지킬 원칙
1. **데모 중심**: 완벽한 통계 서비스가 아니라, 설득력 있는 1개 루프를 완성한다.
2. **범위 축소**: 랜딩 문구/제품 설명 비교만 한다. 범용 설문 플랫폼으로 확장하지 않는다.
3. **샘플 데이터 사용**: 수백만 rows 풀스캔하지 않는다. 사전 계층 샘플링된 JSON으로 빠르게 간다.
4. **질문 수 최소화**: 구매의향, 한줄 호감, 한줄 거부, 개선 제안만 생성한다.
5. **발표 우선**: 제출 1시간 전부터 기능 추가 금지.

### LLM 확정 사항
- **Provider**: OpenAI
- **Model**: `gpt-4o-mini` (속도 + 비용 최적)
- **호출 전략**: 페르소나 1명당 A/B 반응을 **한 번에** 생성 → sampleSize=5 기준 5회 병렬 + 요약 1회 = **총 6회 호출**
- **병렬 처리**: `Promise.all` 고정 (순차 처리 옵션 제거)
- **예상 응답 시간**: 10~15초

### 우승을 위한 심사 메시지
- 생성 AI는 많지만 **검증 AI 레이어**는 적다.
- 한국 시장에서 **한국인 분포 기반 페르소나**를 쓴다.
- 실제 설문 대체가 아니라 **초기 가설 검증 보조 도구**다.
- **세그먼트별 반응 분화**를 보여준다 — "30대 여성은 B 선호, 20대 남성은 A 선호"

---

## 1. MVP 정의
### 반드시 되는 것 (Must)
- 제품/카피 입력 폼
- 타겟 조건 선택 (성별, 연령대, 직업군, 지역)
- 샘플 페르소나 5~10명 선택
- A/B 문구 각각에 대한 페르소나 반응 생성
- 결과 집계 카드
- 발표용 고정 데모 시나리오 1개

### 있으면 좋은 것 (Should)
- 결과를 JSON으로 저장
- 세그먼트별 평균 점수 차트
- 한 번의 클릭으로 데모 데이터 자동 채우기

### 시간 남으면 (Nice)
- 질문 템플릿 선택
- 1인 인터뷰 화면처럼 카드 넘김 UX
- 결과 공유용 링크

---

## 2. 예상 파일 구조
```text
app/
  page.tsx
  api/
    simulate/route.ts
components/
  input-form.tsx
  persona-card.tsx
  result-summary.tsx
  score-chart.tsx
lib/
  personas.ts
  prompt.ts
  summarize.ts
  types.ts
  demo.ts
public/
  demo-screenshot.png
  logo.svg
data/
  personas.sample.json
  demo-request.json
  demo-response.json
scripts/
  prepare_personas.py
.hermes/plans/
  2026-04-25_233746-persona-signal-hackathon-plan.md
  2026-04-25_233746-persona-signal-presentation-notes.md
docs/hackathon/
  2026-04-25_pitch_nemotron-personas-korea.md
```

---

## 3. 데이터 전략
### 사용할 데이터셋
- Hugging Face: `nvidia/Nemotron-Personas-Korea`
- 확인 사실:
  - 수백만 rows (streaming 필수)
  - 성별, 나이, 교육, 직업, 지역 + 자연어 persona 필드 존재
  - 라이선스: CC BY 4.0

### 해커톤용 처리 방식
- 전체 데이터셋을 앱 런타임에서 직접 질의하지 않는다.
- **사전 계층 샘플링**: `scripts/prepare_personas.py`로 `data/personas.sample.json` 1회 생성
- streaming 모드 사용: 전체 다운로드 없이 앞에서 50,000개만 읽어 샘플링
- **계층 샘플링 전략**: 연령대(20대/30대/40대/50대)별로 균등하게 총 5,000개 추출
  - 이유: 단순 랜덤 샘플링 시 특정 필터 조합에서 0건 발생 위험

### 필드 추출 및 변환
원본 필드 (snake_case) → 앱 필드 (camelCase):
- `persona` → `persona`
- `professional_persona` → `professionalPersona`
- `family_persona` → `familyPersona`
- `hobbies_and_interests` → `hobbies`
- `career_goals_and_ambitions` → `goals`
- `sex` → `sex`
- `age` → `age`
- `occupation` → `occupation`
- `province` → `province`
- `education_level` → `educationLevel`

**⚠️ 필수 확인**: 스크립트 실행 후 실제 `occupation`, `province`, `sex` 값이 UI 필터 옵션("사무직", "서울", "남자")과 일치하는지 수동 확인 필요. 불일치 시 필터가 항상 0건을 반환한다.

### 발표에서 말할 표현
- "실제 설문 데이터"라고 하지 말 것
- "실제 분포를 반영한 합성 페르소나를 기반으로 한 AI 시뮬레이션"이라고 말할 것

---

## 4. 사용자 플로우
1. 사용자가 제품 설명 입력
2. A/B 카피 입력
3. 타겟 조건 선택
4. 서버가 조건에 맞는 페르소나 5~10명 샘플링
5. 서버가 LLM으로 각 페르소나 반응 생성
6. 결과를 집계해 UI에 반환
7. 사용자는
   - 구매의향 평균
   - A/B 승자
   - 대표 거부 포인트
   - 대표 개선 제안
   을 확인

---

## 5. 프롬프트 설계 원칙
### 시스템 프롬프트 핵심
- 당신은 실제 사람이 아니라, 주어진 한국인 합성 페르소나의 관점으로 반응한다.
- 과장하지 말고 구체적으로 말한다.
- 한국어로 응답한다.
- 출력은 JSON만 반환한다.

### 모델 출력 스키마
```json
{
  "variant": "A",
  "purchase_intent": 4,
  "confidence": 4,
  "liked_points": ["...", "..."],
  "concerns": ["...", "..."],
  "memorable_phrase": "...",
  "suggested_improvement": "...",
  "one_sentence_reaction": "..."
}
```

### 집계 포맷
- 평균 구매의향 점수
- A/B 차이
- 반복 등장 우려 포인트 상위 3개
- 반복 등장 호감 포인트 상위 3개
- 추천 카피 수정안 3개

---

## 6. 구현 순서

### Task 1: 프로젝트 골격 생성
**Objective:** Next.js 기본 프로젝트와 폴더 구조를 만든다.

**Files:**
- Create: `app/page.tsx`
- Create: `app/api/simulate/route.ts`
- Create: `components/input-form.tsx`
- Create: `components/persona-card.tsx`
- Create: `components/result-summary.tsx`
- Create: `lib/types.ts`

**Step 1:** Next.js app 생성
- Run: `npx create-next-app@latest persona-signal --ts --tailwind --app --eslint --src-dir=false --import-alias "@/*"`
- Expected: `persona-signal/` 생성

**Step 2:** 필수 폴더 생성
- `components/`, `lib/`, `data/`, `scripts/`, `docs/hackathon/` 생성

**Step 3:** 빈 화면으로 실행 확인
- Run: `npm run dev`
- Expected: 로컬 페이지 접속 성공

---

### Task 2: 타입 정의
**Objective:** 요청/응답/페르소나 데이터 타입을 고정한다.

**Files:**
- Create: `lib/types.ts`

**Step 1:** 아래 타입 정의
```ts
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

export type PersonaReaction = {
  variant: "A" | "B";
  purchaseIntent: number;
  confidence: number;
  likedPoints: string[];
  concerns: string[];
  memorablePhrase: string;
  suggestedImprovement: string;
  oneSentenceReaction: string;
};
```

**Step 2:** 프론트/백엔드에서 동일 타입 사용

---

### Task 3: 샘플 데이터 준비 스크립트
**Objective:** Nemotron 데이터에서 앱용 샘플 JSON을 만든다.

**Files:**
- Create: `scripts/prepare_personas.py`
- Create: `data/personas.sample.json`

**Step 1:** 스크립트 목적
- parquet 또는 다운로드된 JSON/CSV를 읽는다.
- 필요한 필드만 추린다.
- null/이상치 제거
- 1천~1만 rows 샘플링
- `personas.sample.json` 저장

**Step 2:** 샘플 출력 확인
- JSON 배열 길이 확인
- 필드 이름 통일

**Verification:**
- `data/personas.sample.json` 생성
- 임의 3개 row 수동 확인

---

### Task 4: 필터링/샘플링 유틸 작성
**Objective:** 타겟 조건에 맞는 페르소나를 빠르게 고른다.

**Files:**
- Create: `lib/personas.ts`
- Modify: `lib/types.ts`

**Step 1:** JSON load 함수 작성
**Step 2:** 필터 적용 함수 작성
- 성별
- 나이 범위
- 직업
- 지역

**Step 3:** 랜덤 샘플링 함수 작성
- requested sample size만큼 뽑기
- 없으면 가능한 범위에서 fallback

**Verification:**
- 노드 스크립트로 샘플 5명 뽑히는지 확인

---

### Task 5: 프롬프트 빌더 작성
**Objective:** 페르소나 + 제품 설명 + 카피를 JSON 응답 프롬프트로 변환한다.

**Files:**
- Create: `lib/prompt.ts`

**Step 1:** 시스템 프롬프트 작성
**Step 2:** 사용자 프롬프트 템플릿 작성
**Step 3:** 출력 형식 강제 문구 추가

**Verification:**
- 예시 프롬프트 로그 출력 확인
- JSON 형식 지시가 명확한지 점검

---

### Task 6: LLM 호출 래퍼 작성
**Objective:** OpenAI-compatible API 호출 함수를 만든다.

**Files:**
- Create: `lib/llm.ts`
- Create: `.env.example`

**Step 1:** 환경변수 정의
- `OPENAI_API_KEY` 또는 호환 provider 키
- `OPENAI_MODEL`

**Step 2:** 단일 반응 생성 함수 작성
**Step 3:** JSON parse 및 예외 처리 추가

**Verification:**
- 하드코딩된 페르소나 1명으로 응답 생성 성공

---

### Task 7: 결과 집계 유틸 작성
**Objective:** 개별 반응을 발표용 요약으로 묶는다.

**Files:**
- Create: `lib/summarize.ts`

**Step 1:** 평균 구매의향 계산
**Step 2:** 호감/우려 포인트 빈도 집계
**Step 3:** A/B 승자 계산
**Step 4:** 발표용 한 문단 요약 생성

**Verification:**
- mock reactions로 요약 함수 테스트

---

### Task 8: API route 구현
**Objective:** 프론트 입력을 받아 샘플링 → 생성 → 집계까지 처리한다.

**Files:**
- Modify: `app/api/simulate/route.ts`
- Modify: `lib/personas.ts`
- Modify: `lib/llm.ts`
- Modify: `lib/summarize.ts`

**Step 1:** 요청 validation
**Step 2:** persona 샘플링
**Step 3:** A/B 반응 생성
**Step 4:** 집계 후 JSON 반환

**Verification:**
- `curl` 또는 fetch로 route 응답 확인
- 응답 시간 측정

---

### Task 9: 입력 폼 UI 구현
**Objective:** 발표자가 빠르게 데모할 수 있는 입력 UI를 만든다.

**Files:**
- Modify: `components/input-form.tsx`
- Modify: `app/page.tsx`
- Create: `lib/demo.ts`

**Step 1:** 입력 필드 구성
- 제품 설명
- A 카피
- B 카피
- 필터 조건
- 샘플 수

**Step 2:** "데모 데이터 채우기" 버튼 추가
**Step 3:** 제출 상태 로딩 표시

**Verification:**
- 클릭 2~3번 안에 데모 시작 가능해야 함

---

### Task 10: 결과 UI 구현
**Objective:** 심사위원이 한눈에 이해하는 결과 화면을 만든다.

**Files:**
- Modify: `components/persona-card.tsx`
- Modify: `components/result-summary.tsx`
- Create: `components/score-chart.tsx`
- Modify: `app/page.tsx`

**Step 1:** 상단 요약 카드
- A 평균 점수
- B 평균 점수
- 승자

**Step 2:** 대표 페르소나 카드 3개 노출
**Step 3:** 공통 우려 포인트/호감 포인트 표시
**Step 4:** 개선 제안 표시

**Verification:**
- 첫 화면에서 10초 내 가치 이해 가능해야 함

---

### Task 11: 데모 고정 시나리오 저장
**Objective:** 발표를 안정적으로 하기 위한 고정 데모 입력/출력을 마련한다.

**Files:**
- Create: `data/demo-request.json`
- Create: `data/demo-response.json`
- Modify: `lib/demo.ts`

**Step 1:** 대표 시나리오 1개 선정
- B2B 생산성 툴 혹은 AI 서비스

**Step 2:** API 실패 시 fallback 가능한 mock response 준비
**Step 3:** 발표 중 네트워크 이슈 대비 토글 추가

**Verification:**
- 인터넷/LLM 불안정해도 데모 강행 가능

---

### Task 12: 발표 마감 전 정리
**Objective:** 제출물과 발표를 마감 상태로 만든다.

**Files:**
- Create: `README.md`
- Modify: `docs/hackathon/2026-04-25_pitch_nemotron-personas-korea.md`

**Step 1:** README 최소 구성
- 문제
- 해결
- 데모 방법
- 한계
- 데이터 출처

**Step 2:** 발표 체크리스트 작성
**Step 3:** 최종 리허설 3회

---

## 7. 환경 변수
```bash
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
```

---

## 8. 테스트/검증
### 기능 검증
- 제품 설명 입력 후 결과가 30초 내 반환되는가
- 필터 조건을 바꾸면 다른 페르소나가 선택되는가
- A/B 평균 점수 차이가 보이는가
- 대표 우려 포인트가 읽기 쉬운가

### 발표 검증
- 3분 안에 끝나는가
- 첫 20초 안에 문제와 가치가 전달되는가
- "실제 설문 대체 아님"을 분명히 말하는가

---

## 9. 리스크와 대응
### 리스크 1: 데이터 로딩이 무겁다
- 대응: 샘플 JSON만 사용

### 리스크 2: LLM 응답이 흔들린다
- 대응: JSON 강제 + fallback demo response 저장

### 리스크 3: 심사위원이 정확도를 공격한다
- 대응: 조사 대체가 아닌 **가설 검증 보조**라고 명확히 말함

### 리스크 4: 시간이 부족하다
- 대응: 차트/세련된 UI보다 결과 요약 카드 먼저 완성

---

## 10. 발표 직전 체크리스트
- [ ] 데모 데이터 자동 입력 버튼 있음
- [ ] fallback mock 결과 있음
- [ ] A/B 비교 화면 바로 뜸
- [ ] 대표 페르소나 3개 카드가 읽힘
- [ ] 데이터 출처 문구 준비됨
- [ ] "이건 실제 설문 대체가 아니다" 답변 준비됨

---

## 11. 해커톤 7시간 타임라인
> 코드 시작 전 데이터 준비가 반드시 먼저다.

### H1 (1시간): 데이터 준비 + 프로젝트 셋업
- `pip install datasets huggingface_hub` 설치
- `scripts/prepare_personas.py` 작성 및 실행
- `data/personas.sample.json` 생성 확인
- **⚠️ 실제 occupation/province/sex 값 콘솔 출력해서 확인**
- Next.js 프로젝트 생성, 폴더 구조 세팅
- `.env.local` OpenAI API key 설정

### H2 (1시간): 백엔드 루프
- `lib/types.ts` 작성 (segmentBreakdown 포함)
- `lib/personas.ts` 작성 (snake→camel 변환 포함)
- `lib/prompt.ts` 작성 (A/B 동시 반응 생성 프롬프트)
- `lib/llm.ts` 작성 (Promise.all 병렬 호출)

### H3 (1시간): API 완성 + 테스트
- `lib/summarize.ts` 작성 (집계 + 요약 LLM 호출)
- `app/api/simulate/route.ts` 완성
- `export const maxDuration = 60` 추가
- curl 테스트로 응답 확인

### H4 (1시간): 입력 UI
- `components/input-form.tsx`
- `components/filter-panel.tsx`
- demo data autofill 버튼
- 로딩 상태 연결

### H5 (1시간): 결과 UI
- KPI 요약 카드 (A/B 평균 점수, 승자)
- 세그먼트 분화 테이블 (와우 모먼트)
- 대표 페르소나 카드 3개
- insight 카드

### H6 (1시간): 데모 안정화
- `data/demo-response.json` fallback 작성
- 데모 모드 토글
- Vercel 배포 + URL 확인

### H7 (1시간): 발표 준비
- 기능 추가 금지
- 리허설 3회
- README 마무리

---

## 12. 우승을 위한 한 문장
> **Persona Signal은 생성 AI가 만든 메시지를, 한국인 페르소나 기반으로 빠르게 검증하는 AI 리서치 레이어입니다.**
