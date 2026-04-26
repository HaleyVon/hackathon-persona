# Persona Signal Results Clarity And Improvement Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 결과 지표를 전부 "높을수록 좋음" 체계로 통일하고, 결과 화면을 추천안/개선안 중심으로 재구성하며, 케이스별 데모 데이터와 개선안 생성 기능까지 추가한다.

**Architecture:** 먼저 공통 평가축과 라벨 체계를 재정의해 레이더 차트, 요약 카드, 결과 문구를 같은 의미 체계로 맞춘다. 그 다음 결과 상단 브리프와 차트 표현을 입력 타입/결정 모드에 맞게 일반화하고, 마지막 단계에서 케이스별 데모 픽스처와 `개선안 3개 생성` 서버 플로우를 추가한다.

**Tech Stack:** Next.js App Router, TypeScript, Recharts, OpenAI SDK, shadcn/ui

---

## 설계 결정

### 1. 공통 평가축 재정의

현재:
- 이해도
- 신뢰도
- 매력도
- 거부감
- 혼란

변경:
- 이해도
- 신뢰도
- 매력도
- 수용도: `6 - resistance`
- 명확성: `6 - confusionRisk`

원칙:
- 모든 축은 `1 낮음 / 5 높음`
- 레이더 차트 면적이 넓을수록 더 좋은 안으로 읽혀야 함
- "리스크"라는 단어는 보조 설명에서만 사용하고, 메인 수치는 전부 긍정 지표로 표시

### 2. 요약 카드 지표 재정의

현재:
- 더 명확한 안
- 신뢰 리스크
- 혼란 리스크

변경:
- 명확성 우세
- 신뢰도 우세
- 수용도 우세

보조 문구:
- `높을수록 좋음`
- 카드 색상은 승자 강조용으로만 사용
- 낮은 점수의 경고는 카드 하단 보조 문장으로 처리

### 3. 차트 표현 재정의

비교 모드:
- 평균 비교 바 차트 제거
- 페르소나별 이중 바 차트 제거
- 대체안: `dumbbell chart`
  - 한 줄에 한 페르소나
  - A/B 점을 선으로 연결
  - 오른쪽으로 갈수록 더 긍정적
  - 차이가 작은지 큰지 즉시 인지 가능

단일 검토 모드:
- 대체안: `distribution strip / stacked distribution`
  - 1~5 점수 분포를 한 번에 보여줌
  - 평균값보다 분산을 읽기 쉬움

### 4. 결과 상단 재구성

상단 히어로는 아래 순서로 재구성:
- 추천 결론
- 추천되는 실제 문구/플랜/기능안 전문
- 왜 추천되는지 한 줄 요약
- 바로 적용할 수정 방향 3개
- `개선안 3개 생성` 버튼

공통 라벨 헬퍼 필요:
- `카피 A/B` 하드코딩 제거
- `메시지 A/B`, `플랜 A/B`, `기능안 A/B`, `검토안`으로 입력 타입/결정 모드별 문구 통일

### 5. 데모 전략

최소 6개 데모 시나리오:
- `copy-compare`
- `copy-review`
- `pricing-compare`
- `pricing-review`
- `feature-compare`
- `feature-review`

각 시나리오 구성:
- request fixture
- response fixture
- 설명 라벨

UI:
- `데모 모드` 진입 시 케이스 선택기 제공
- 제품 유형별로 다른 가치가 드러나도록 데이터 편차를 의도적으로 설계

### 6. 개선안 생성 기능

사용자 액션:
- 결과 상단에서 `개선안 3개 생성` 클릭

서버 플로우:
- 새 API route 추가: `/api/improve`
- 입력:
  - product context
  - decisionMode
  - inputType
  - selected baseline text
  - summary top concerns
  - recommendedCopies
  - optional winner / winning rationale
- 출력:
  - 개선안 최소 3개
  - 각 개선안의 전략 태그
  - 왜 이렇게 바꿨는지 한 줄 설명

UI:
- 브리프 하단 또는 별도 섹션에 카드 3개 노출
- 각 카드에 `원문 대비 무엇을 바꿨는지` 요약 포함

---

## 파일 영향 범위

### 수정 파일
- `persona-signal/lib/types.ts`
- `persona-signal/lib/constants.ts`
- `persona-signal/lib/summarize.ts`
- `persona-signal/lib/prompt.ts`
- `persona-signal/lib/llm.ts`
- `persona-signal/app/api/simulate/route.ts`
- `persona-signal/app/page.tsx`
- `persona-signal/components/risk-radar.tsx`
- `persona-signal/components/result-summary.tsx`
- `persona-signal/components/score-chart.tsx`
- `persona-signal/components/decision-brief.tsx`
- `persona-signal/components/persona-card.tsx`
- `persona-signal/components/type-result-module.tsx`
- `persona-signal/data/demo-response.json`
- `PROGRESS.md`

### 신규 파일
- `persona-signal/lib/display.ts`
- `persona-signal/app/api/improve/route.ts`
- `persona-signal/components/improvement-generator.tsx`
- `persona-signal/components/score-dumbbell-chart.tsx`
- `persona-signal/components/review-distribution-chart.tsx`
- `persona-signal/data/demo-scenarios.ts`
- `persona-signal/data/demo-scenarios/*.json`

---

## 구현 순서

### Task 1: 공통 지표 체계와 표시 라벨 정리
- [ ] `lib/display.ts`에 입력 타입별 라벨 헬퍼 추가
- [ ] `RiskAxes`의 표시용 변환 축 설계 추가
- [ ] `resistance`와 `confusionRisk`를 화면용 `acceptance`, `clarity`로 변환하는 함수 추가
- [ ] `risk-radar.tsx`를 긍정 지표 기준으로 교체
- [ ] `result-summary.tsx` 카드 제목/보조 문구를 긍정 지표 기준으로 교체
- [ ] `decision-brief.tsx`, `persona-card.tsx`, 기타 결과 텍스트에서 `카피` 하드코딩 제거

### Task 2: 샘플 수 정책 개편
- [ ] `SAMPLE_SIZE_OPTIONS`를 `10, 20, 30, 50`으로 변경
- [ ] request validation 상한을 `50`으로 상향
- [ ] loading/caution 문구에서 큰 표본 기준 안내 추가
- [ ] 실제 응답 시간/비용 리스크를 고려해 데모 모드 fallback 동작 재확인

### Task 3: 결과 차트 교체
- [ ] 비교 모드 전용 `score-dumbbell-chart.tsx` 추가
- [ ] 단일 검토 모드 전용 `review-distribution-chart.tsx` 추가
- [ ] `score-chart.tsx`는 orchestrator wrapper로 단순화하거나 제거
- [ ] `page.tsx`에서 decisionMode에 따라 적절한 차트 렌더링

### Task 4: 상단 결과 히어로 강화
- [ ] `decision-brief.tsx`를 추천안 중심 hero로 재구성
- [ ] 추천되는 실제 문구/플랜/기능안 전문을 크게 노출
- [ ] `왜 이 안인가`와 `바로 적용할 수정 방향`을 상단 첫 화면에 배치
- [ ] 입력 타입별 추천 문구 템플릿 일반화

### Task 5: 케이스별 데모 데이터 확장
- [ ] `demo-scenarios.ts`에 6개 데모 시나리오 registry 작성
- [ ] 각 시나리오용 request/response JSON 추가
- [ ] `page.tsx` 데모 모드에서 케이스 선택 UI 추가
- [ ] 각 시나리오가 다른 가치 포인트를 보여주는지 수동 점검

### Task 6: 개선안 3개 생성 기능 추가
- [ ] `types.ts`에 improvement response 타입 추가
- [ ] `/api/improve/route.ts` 구현
- [ ] `llm.ts` 또는 별도 helper에 개선안 생성 프롬프트 추가
- [ ] `improvement-generator.tsx` 추가
- [ ] `decision-brief.tsx`에 생성 버튼 연결
- [ ] compare/review와 copy/pricing/feature에서 모두 자연스럽게 동작하는지 분기 처리

### Task 7: 최종 QA 및 문서 정리
- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] 데모 6개 케이스 수동 확인
- [ ] `PROGRESS.md`와 `README`에 새 결과 체계 반영

---

## 작업 우선순위

1. `지표/라벨 통일`
2. `상단 결과 히어로 재구성`
3. `차트 교체`
4. `샘플 수 상향`
5. `데모 시나리오 확장`
6. `개선안 3개 생성`
7. `QA / 배포`

## 구현 메모

- `샘플 수 50`은 API 비용과 응답 시간을 밀어올리므로, 실제 실행은 `10/20` 기본 추천 + `30/50` 고급 옵션으로 두는 편이 안전하다.
- 레이더 차트 내부 계산은 기존 raw score를 유지하고, 화면 렌더 직전에만 `수용도/명확성`으로 뒤집는 편이 기존 로직과 충돌이 적다.
- `개선안 생성`은 시뮬레이션과 분리된 on-demand API로 두어야 초기 결과 로딩 속도를 지킬 수 있다.
- 가격/기능 타입도 결국 "안 A/B" 비교 구조는 같으므로, UI 문자열만 일반화하면 화면 재사용이 가능하다.
