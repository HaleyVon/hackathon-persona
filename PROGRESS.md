# Persona Signal — 진행 현황

> **이 문서는 세션이 끝날 때마다 자동 업데이트됩니다.**
> 작업 완료 내역, 현재 상태, 다음 할 일을 한 곳에서 관리합니다.

---

## 현재 상태

**단계:** 구현 중 (H4/H7)
**마지막 업데이트:** 2026-04-26
**남은 시간(추정):** 해커톤 진행 중

---

## 완료된 작업 ✅

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
- [x] 교차검증 + 문서 업데이트 (Vercel maxDuration, snake→camel, segmentBreakdown 등)

### 협업 / 배포 준비
- [x] GitHub 레포 생성 및 초기 푸시 (`HaleyVon/hackathon-persona`)

---

## 다음 할 일 🔲

### 즉시 (H5 — 지금)

- [x] **fallback demo-response.json 생성**
  - 경로: `persona-signal/data/demo-response.json`
  - 내용: 리스크 5축 필드를 포함한 실제형 API 응답 저장
  - 목적: 발표 중 네트워크/LLM 불안정 시 데모 강행 가능

- [ ] **데모 모드 토글 추가**
  - `app/page.tsx`에 "데모 모드" 버튼 추가
  - API 대신 `demo-response.json`을 바로 렌더링

- [ ] **Vercel 배포**
  - `vercel --prod` 또는 GitHub 연결
  - 환경변수 설정: OPENAI_API_KEY, OPENAI_MODEL, SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_KEY, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
  - 배포 URL 확인 및 실제 시뮬레이션 테스트

### H6 — 안정화

- [ ] **QA 체크**
  - 데모 데이터 채우기 버튼 동작 확인
  - 시뮬레이션 실행 → 결과 30초 내 표시
  - A/B 승자 시각적으로 명확한지 확인
  - 에러 발생 시 fallback 전환 확인
  - 세그먼트 분화 테이블 데이터 올바른지 확인

### H7 — 발표 준비

- [ ] **README 마무리** (`persona-signal/README.md`)
  - 문제 / 해결 / 데모 방법 / 데이터 출처 / 한계
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
