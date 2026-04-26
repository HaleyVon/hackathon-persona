# Persona Signal — 진행 현황

> **이 문서는 세션이 끝날 때마다 자동 업데이트됩니다.**
> 작업 완료 내역, 현재 상태, 다음 할 일을 한 곳에서 관리합니다.

---

## 현재 상태

**단계:** 구현 중 (H6/H7)
**마지막 업데이트:** 2026-04-26
**남은 시간(추정):** 해커톤 진행 중

---

## 완료된 작업 ✅

### 제품 재정의 (2026-04-26)
- [x] 포지션 재정의: "페르소나 생성기" → "제품팀 pre-validation workflow tool"
- [x] 5축 평가 모델 도입: comprehension / trust / appeal / resistance / confusionRisk
- [x] 리스크 중심 UI: 승자/패자 프레임 → 더 명확한 안 / 신뢰 리스크 / 혼란 리스크 카드
- [x] RiskRadar 컴포넌트 신규: 5축 레이더 차트 (A vs B 오버레이)
- [x] 소비자 페르소나 프롬프트 강화: 8개 행동 규칙 + 5축 구체적 기준 적용
- [x] 요약 프롬프트 강화: 혼란/리스크 원인 구체화 지시
- [x] V1.5 확장: 결정 모드(compare/review) + 입력 타입(copy/pricing/feature/positioning) 도입
- [x] 타입별 심층 분석 모듈 추가 (`type-result-module.tsx`)
- [x] review 모드 단일 결과 렌더링 및 optional `axesB` 처리 정리
- [x] 1-pager 기준 IA 반영: `결정 과업 → 입력 타입 → 제품 맥락 → 타깃 → 결과` 흐름 정리
- [x] MVP 노출 범위 잠금: 입력 타입 UI를 `카피/메시지`, `가격/플랜`, `기능 필요성` 3개로 제한
- [x] 제품 맥락 필드 추가: `주 타깃 고객`, `시장 유형`, `사용/구매 맥락`
- [x] 결과 화면 P2 반영: `추천 결론 → 핵심 리스크 → 수정 제안` 우선 구조로 재배치
- [x] `decision-brief.tsx` 추가로 상단 의사결정 브리프 도입
- [x] 결과 신뢰성 P3 반영: `리스크 탐지용 결과` 문구, confidence signal, 주의 배지 추가
- [x] 표본 수/맥락 부족/반응 분산/근소한 차이/잔여 리스크를 summary 메타 신호로 계산
- [x] 세그먼트 해석 P4 반영: `특히 거부하는 세그먼트 / 특히 잘 먹히는 세그먼트 / 먼저 검증할 세그먼트` 해석 카드 추가
- [x] 세그먼트 집계 확장: 선호도뿐 아니라 평균 점수/신뢰/혼란 메타를 함께 계산
- [x] 결과 지표를 `이해도 / 신뢰도 / 매력도 / 수용도 / 명확성`의 긍정 축으로 재구성
- [x] 레이더 차트와 요약 카드를 `높을수록 좋은 지표` 기준으로 통일
- [x] 비교 차트를 dumbbell chart로 교체, review 차트를 분포형으로 교체
- [x] 결과 상단에 실제 추천안 전문과 즉시 적용할 수정 방향을 크게 노출
- [x] 입력 타입별 결과 문구 일반화: 메시지/플랜/기능안/검토안 라벨 체계 적용
- [x] 샘플 페르소나 수 옵션 확대: `10 / 20 / 30 / 50`
- [x] 데모 케이스 확장: 메시지/가격/기능 × compare/review 6개 시나리오
- [x] `개선안 3개 생성` API 및 UI 추가 (`/api/improve`)
- [x] 페르소나 평가를 균형형으로 재보정: reviewer 톤 완화, 4점/5점 앵커 현실화, 장점/우려 동시 수집
- [x] relevance check 도입: `high / medium / low` 관련도와 이유를 페르소나 평가 결과에 포함
- [x] summary 가중치 보정: low relevance 반응은 가중치 낮춰 집계, `relevanceMix`와 `비타깃 표본 섞임` 주의 신호 추가
- [x] 개선안 생성 결과에 `원문 대비 개선 delta`와 `남은 이슈` 메타 추가
- [x] 페르소나 카드/결과 브리프에 타깃 적합도 표시 추가

### 인프라 / 데이터
- [x] Supabase 프로젝트 연결 (`ijptkmnrhvrujvyvrpth`)
- [x] `personas` 테이블 생성 — 원본 26개 필드 전부 + `raw JSONB`
- [x] Nemotron-Personas-Korea 스트리밍 샘플링 — 5,000개, 연령대별 균등 분포
- [x] 필드명 변환 (snake_case → camelCase) 및 개별 컬럼 backfill
- [x] 인덱스 생성 (age, sex, occupation, province, district)
- [x] 실제 필드값 확인 — `sex: 남자/여자`, `province: 서울/경기...` 등

### Next.js 프로젝트
- [x] `persona-signal/` Next.js 14 App Router 생성
- [x] shadcn/ui, Recharts, Zod, OpenAI SDK, Supabase JS 설치
- [x] `.env.local` 연결 (OpenAI + Supabase 키)

### 백엔드
- [x] `lib/types.ts` — 전체 타입 정의 (PersonaRecord, SimulationRequest, SimulationResponse, SegmentBreakdown 등)
- [x] `lib/constants.ts` — 필터 옵션, 데모 기본값
- [x] `lib/supabase.ts` — 클라이언트/서비스 클라이언트 분리
- [x] `lib/personas.ts` — Supabase 필터링 + 랜덤 샘플링 + fallback
- [x] `lib/prompt.ts` — 페르소나 컨텍스트 빌더 (26개 필드 활용), A/B 동시 반응 프롬프트
- [x] `lib/llm.ts` — gpt-4o-mini, Promise.all 병렬 호출, 요약 LLM 호출
- [x] `lib/summarize.ts` — 집계, 세그먼트 분화(SegmentBreakdown) 계산
- [x] `app/api/simulate/route.ts` — `maxDuration=60`, Zod validation, 전체 파이프라인
- [x] 리스크 5축 점수(comprehension/trust/appeal/resistance/confusionRisk) 수집 및 요약 집계 추가

### 프론트엔드 UI
- [x] `app/layout.tsx` — 한국어 메타데이터
- [x] `app/page.tsx` — 2-column 레이아웃, 상태 관리, 에러 처리
- [x] `components/empty-state.tsx`
- [x] `components/loading-state.tsx` — 3단계 진행 메시지
- [x] `components/input-form.tsx` — 제품설명, A/B 카피, 성별/나이/지역/샘플수 필터
- [x] `components/result-summary.tsx` — KPI 3카드 (A점수, B점수, 승자)
- [x] `components/score-chart.tsx` — 평균 비교 + 페르소나별 바 차트
- [x] `components/segment-table.tsx` — **세그먼트 분화 (와우 모먼트)**
- [x] `components/insight-cards.tsx` — 전체 인사이트 + 호감/우려/개선 카피 3카드
- [x] `components/persona-card.tsx` — 페르소나 카드 (토글 상세)
- [x] `components/risk-radar.tsx` — 5축 리스크 레이더 차트
- [x] `components/result-summary.tsx` — 명확성/신뢰/혼란 리스크 중심 KPI 카드로 개편

### 문서
- [x] 피치 문서 (`docs/hackathon/`)
- [x] 기술 아키텍처 (`docs/architecture/`)
- [x] 구현 플랜 (`plans/`)
- [x] 결과 명확성/개선안 생성 구현 계획 문서 추가 (`docs/superpowers/plans/2026-04-26-results-clarity-and-improvement-plan.md`)
- [x] 교차검증 + 문서 업데이트 (Vercel maxDuration, snake→camel, segmentBreakdown 등)
- [x] 코드베이스 점검으로 현재 구현 범위/남은 작업 재확인
- [x] 정적 검증 완료 (`npm run lint`, `npm run build`)

### 협업 / 배포 준비
- [x] GitHub 레포 생성 및 초기 푸시 (`HaleyVon/hackathon-persona`)

---

## 다음 할 일 🔲

### 제품 고도화 우선순위 (1-pager 기준)

- [x] **P0. 정보구조(IA) 재정렬**
  - 홈 흐름을 `결정 과업 → 입력 타입 → 제품 맥락 → 타깃 → 결과` 순서로 고정
  - `compare/review`를 결과 프레임까지 명확히 분리
  - MVP 노출 범위를 `카피/메시지`, `가격/플랜`, `기능 필요성` 3개로 잠금

- [x] **P1. 제품 맥락 입력 보강**
  - `제품/서비스 설명` 외에 `주 타깃 한 줄`, `시장 유형(B2B/B2C/B2B2C)`, `사용/구매 맥락` 추가
  - 프롬프트에 맥락 필드가 실제로 반영되도록 정리
  - 가격 검토 시 `기준 가격대` 또는 `대안` 입력 필드는 후속 검토

- [x] **P2. 결과 화면을 "결론 + 리스크 + 수정 행동" 중심으로 재배치**
  - 상단에 `추천 결론`, `가장 큰 리스크 1~2개`, `수정 제안` 우선 노출
  - 차트/세그먼트 표는 해석 보조 위치로 조정
  - 타입별 모듈도 "다음 액션" 문장 중심으로 정리

- [x] **P3. 신뢰성 설계 추가**
  - 결과를 `예측`이 아닌 `리스크 탐지`로 일관되게 표기
  - 표본 적음/반응 분산 큼/맥락 부족 시 `주의 배지` 또는 `confidence signal` 추가
  - "왜 이런 결과가 나왔는가" 설명을 세그먼트/표현 단위로 더 투명하게 노출

- [x] **P4. 세그먼트 해석 고도화**
  - 단순 선호 표가 아니라 `누가 특히 거부하는가`, `누구에게만 먹히는가`, `누구를 먼저 검증해야 하는가`로 해석
  - 결과를 후속 인터뷰/실험 액션으로 연결

### 구현 마무리 (현재 브랜치)

- [ ] **V1.5 구현 정리**
  - `review` 모드 결과 해석을 compare와 구분해 UI/summary 전반 재점검
  - `copy` 타입의 기억성 축(memorability)은 점수 축이 아니라 정성 신호(`memorablePhrase`)로 유지
  - `TypeResultModule`와 타입별 요약 프롬프트 일관성 최종 점검

### 즉시 운영 작업

- [x] **fallback demo-response.json 생성**
  - 경로: `persona-signal/data/demo-response.json`
  - 내용: 리스크 5축 필드를 포함한 실제형 API 응답 저장
  - 목적: 발표 중 네트워크/LLM 불안정 시 데모 강행 가능

- [x] **데모 모드 토글 추가**
  - `app/page.tsx`에 "⚡ 데모 모드" 버튼 추가
  - API 대신 `demo-response.json`을 바로 렌더링

- [ ] **Vercel 배포**
  - `vercel --prod` 또는 GitHub 연결
  - 환경변수 설정: OPENAI_API_KEY, OPENAI_MODEL, SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_KEY, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
  - 배포 URL 확인 및 실제 시뮬레이션 테스트

### H6 — 안정화

- [ ] **QA 체크**
  - 현재 상태: lint/build 통과, 브라우저 동작 QA와 실제 API 응답 확인은 필요
  - compare/review 모드가 모두 자연스럽게 보이는지 확인
  - 카피/가격/기능 타입별 결과 모듈이 의도대로 바뀌는지 확인
  - 제품 맥락 필드 추가 후 프롬프트 반영 결과 확인
  - 6개 데모 케이스가 모두 자연스럽게 보이는지 확인
  - `개선안 3개 생성`이 타입별로 어색하지 않은지 확인
  - 데모 데이터 채우기 버튼 동작 확인
  - 시뮬레이션 실행 → 결과 30초 내 표시
  - A/B 승자 시각적으로 명확한지 확인
  - 에러 발생 시 fallback 전환 확인
  - 세그먼트 분화 테이블 데이터 올바른지 확인

### H7 — 발표 준비

- [ ] **README 마무리** (`persona-signal/README.md`)
  - 문제 / 해결 / 데모 방법 / 데이터 출처 / 한계
  - `pre-validation tool` 포지셔닝과 `리스크 탐지` 메시지 반영
- [ ] **리허설 3회**
  - 3분 발표 스크립트 확인
  - 심사위원 예상 질문 답변 준비
- [ ] **기능 추가 금지 — 리허설만**

---

## 주요 기술 결정 기록

| 결정 | 내용 | 이유 |
|---|---|---|
| DB | Supabase (PostgreSQL) | 전체 필드 보존, 실시간 쿼리 데모 스토리 |
| LLM | gpt-4o-mini | 속도 + 비용 최적 |
| 호출 방식 | Promise.all 병렬 | 응답 시간 10~15초 목표 |
| 프롬프트 | 페르소나 1명당 A/B 동시 생성 | 호출 수 절반 |
| Vercel timeout | maxDuration=60 | 기본 10초 → 시뮬레이션 timeout 방지 |
| 샘플링 | 연령대별 계층 샘플링 | 특정 필터 조합 0건 방지 |

---

## 파일 구조 현황

```
hackathon-persona/
├── PROGRESS.md                    ← 이 파일
├── supabase/migrations/           ← DB 스키마
├── scripts/prepare_personas.py    ← 데이터 로딩
├── docs/                          ← 설계 문서
├── plans/                         ← 구현 계획
└── persona-signal/                ← Next.js 앱
    ├── app/
    │   ├── page.tsx               ✅ 완료
    │   └── api/simulate/route.ts  ✅ 완료
    ├── components/                ✅ 전체 완료
    ├── lib/                       ✅ 전체 완료
    └── data/
        ├── demo-response.json     🔲 미완성
        └── demo-request.json      🔲 미완성
```

---

## 발표 직전 최종 체크리스트

- [ ] 데모 데이터 채우기 버튼 동작
- [ ] 시뮬레이션 실행 → 30초 내 결과
- [ ] A/B 승자 카드 눈에 띔
- [ ] 세그먼트 분화 테이블 보임
- [ ] fallback 데모 모드 작동
- [ ] Vercel URL 접속 확인
- [ ] "실제 설문 대체 아님" 답변 준비
- [ ] 3분 리허설 완료
