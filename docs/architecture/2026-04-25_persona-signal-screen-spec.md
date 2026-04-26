# Persona Signal Screen Specification

## 1. 화면 설계 원칙
### 핵심 목표
심사위원이 **10초 안에** 아래 3가지를 이해해야 한다.
1. 무엇을 입력하는지
2. 무엇을 비교하는지
3. 무엇이 결론인지

### 원칙
- 한 페이지에서 끝낸다.
- 입력과 결과를 동시에 보여준다.
- 시각적으로 가장 중요한 것은 **A/B 승자와 이유**다.
- 모바일 최적화보다 **노트북 발표 화면** 최적화가 우선이다.

---

## 2. 전체 페이지 레이아웃
```text
┌──────────────────────────────────────────────────────────────┐
│ Header                                                     │
│ Persona Signal / subtitle / demo button / run button       │
├───────────────────────┬──────────────────────────────────────┤
│ Left Input Panel      │ Right Result Panel                 │
│ 35~40% width          │ 60~65% width                       │
│                       │                                     │
│ Product description   │ KPI summary cards                  │
│ Variant A             │ A/B score chart                    │
│ Variant B             │ insight cards                      │
│ Target filters        │ representative persona cards       │
│ Sample size           │ optional debug/meta                │
└───────────────────────┴──────────────────────────────────────┘
```

### 권장 해상도
- 기준: 1440 x 900 또는 1512 x 982
- 발표 중 브라우저 zoom 90~100%

---

## 3. Header 명세
### 목적
프로젝트 정체성과 주요 액션을 즉시 보여준다.

### 구성 요소
- 프로젝트명: `Persona Signal`
- 설명: `한국인 합성 페르소나 기반 AI 메시지 검증 툴`
- 버튼 1: `Demo data 채우기`
- 버튼 2: `시뮬레이션 실행`

### 시각 우선순위
- 좌측: 브랜드/설명
- 우측: 액션 버튼

### UX 규칙
- `시뮬레이션 실행` 버튼은 primary
- `Demo data 채우기`는 secondary
- 로딩 시 버튼 disabled + spinner 표시

---

## 4. Left Input Panel 명세
### 폭
- 데스크톱 기준 35~40%

### 섹션 A: 제품 설명 카드
**컴포넌트:** textarea card

**필드**
- label: `제품/서비스 설명`
- placeholder: `예: AI가 회의록과 업무를 자동 정리해주는 팀 생산성 도구`
- rows: 4~5

**검증**
- 최소 15자 이상

---

### 섹션 B: A/B 카피 비교 카드
**컴포넌트:** 2-column stacked textareas

**필드**
- `Variant A`
- `Variant B`

**placeholder 예시**
- A: `회의록과 업무를 자동으로 정리하는 AI 비서`
- B: `퇴근 시간을 앞당겨주는 실무형 AI 워크 어시스턴트`

**검증**
- 둘 다 필수
- 둘이 완전히 동일하면 경고

---

### 섹션 C: 타겟 조건 카드
**컴포넌트:** filter controls

**필드**
- 성별: multi-select checkbox or pills
  - 남자
  - 여자
- 나이 범위: min/max slider 또는 두 개 select
- 직업군: multi-select
- 지역: multi-select
- 샘플 수: radio/select (`5`, `8`, `10`)

**권장 기본값**
- 성별: 전체
- 나이: 25~39
- 직업군: 사무직/기획/마케팅
- 지역: 서울/경기/인천
- 샘플 수: 8 또는 10

---

### 섹션 D: 실행 카드
**내용**
- helper text:
  - `이 도구는 실제 설문을 대체하지 않고, 초기 가설 검증을 돕습니다.`
- 버튼:
  - `시뮬레이션 실행`
- 상태 문구:
  - `한국인 페르소나를 샘플링하는 중...`
  - `반응을 시뮬레이션하는 중...`

---

## 5. Right Result Panel 명세
### 폭
- 데스크톱 기준 60~65%
- 반드시 왼쪽보다 넓어야 함

### 상태 1: Empty State
초기 상태에서 표시

**문구 예시**
- 제목: `입력 후 시뮬레이션을 실행해보세요`
- 설명: `제품 설명과 A/B 카피를 입력하면, 한국인 합성 페르소나 반응을 비교해드립니다.`

**구성**
- 아이콘 또는 일러스트 1개
- 핵심 3줄 안내

---

### 상태 2: Loading State
**필수 요소**
- spinner
- 단계형 진행 메시지
- skeleton cards 3~4개

**단계 문구 예시**
1. `타겟 조건에 맞는 페르소나를 찾는 중`
2. `카피 반응을 시뮬레이션하는 중`
3. `결과를 집계하는 중`

---

### 상태 3: Success State
결과 패널 렌더링 순서 (위 → 아래):
1. KPI Summary Row
2. A/B Score Chart
3. **세그먼트 분화 테이블** ← 와우 모먼트
4. Insight Cards
5. Representative Persona Cards

#### A. KPI Summary Row
가장 위에 3개 카드

1. `A 평균 구매의향`
2. `B 평균 구매의향`
3. `최종 승자`

**디자인 규칙**
- 숫자는 크게
- 승자 카드는 강조색 배경 사용 가능
- tie일 때는 중립 컬러

---

#### B. A/B Score Chart
**컴포넌트:** bar chart

**표현 내용**
- Variant A 평균 점수
- Variant B 평균 점수

**선택 옵션**
- sample size 표시
- confidence 평균 표시

**시각 원칙**
- A: blue
- B: violet

---

#### C. 세그먼트 분화 테이블 (와우 모먼트)
**이 섹션이 심사위원이 차별성을 즉각 느끼는 핵심 장면이다.**

**표현 형식**
```
세그먼트       A 선호   B 선호   동률
────────────────────────────────
30대 여성        1명     2명     0명
20대 남성        2명     1명     0명
40대 사무직      1명     1명     1명
```

**구현 규칙**
- 연령대(20대/30대/40대) + 성별 조합으로 자동 그루핑
- 샘플 수가 적으면 조합 수를 줄여서 표시
- 테이블 또는 pill badge 형태 허용

**발표 포인트**
> "같은 제품도 세그먼트마다 반응이 다릅니다. 30대 여성은 B를 더 선호하지만 20대 남성은 A를 더 선호합니다."

---

#### D. Insight Cards
3개 카드 고정

1. `왜 좋아했는가`
2. `왜 망설였는가`
3. `다음 카피 개선안` (요약 LLM이 생성한 개선 카피 3개)

**카드 내부 형식**
- bullet 3개
- 너무 긴 문장 금지
- 한 줄 1개 메시지

---

#### D. Representative Persona Cards
대표 3개만 기본 노출

**카드 구조**
- 상단: persona meta
  - 예: `34세 / 서울 / 사무직 / 여성`
- 본문: 한 줄 persona 요약
- 하단:
  - A 반응 요약
  - B 반응 요약
  - preferred variant badge

**표현 규칙**
- 텍스트 과밀 금지
- 각 카드 높이 균일
- 심사위원이 읽을 수 있게 2~3문장 내로 제한

---

## 6. 시각 디자인 토큰
### 컬러
- 배경: `slate-50` 또는 거의 흰색
- 카드: white
- border: `slate-200`
- primary: blue-600
- secondary: violet-600
- success/winner: emerald-600
- warning/concern: amber-500

### 타이포그래피
- 제목: 28~32px
- 섹션 타이틀: 18~20px
- KPI 숫자: 28~36px
- 카드 본문: 14~16px

### 여백
- 페이지 padding: 24px
- 카드 gap: 16px
- 큰 섹션 gap: 24px

---

## 7. 인터랙션 명세
### Demo data 채우기 버튼
누르면 아래 자동 입력
- productDescription
- variantA
- variantB
- filters
- sampleSize

### 실행 버튼
- request 시작
- 버튼 disabled
- 결과 panel loading 전환
- 응답 후 success 렌더링
- 실패시 error box 표시

### 에러 상태
오른쪽 panel 상단에 카드형 박스
- 제목: `시뮬레이션을 완료하지 못했습니다`
- 설명: 원인 안내
- 액션: `다시 시도`, `데모 결과 보기`

---

## 8. 발표 최적화 레이아웃 규칙
### 반드시 지킬 것
- 첫 화면에 스크롤이 거의 없어야 함
- 결과 화면에서도 핵심 요약은 fold above에 있어야 함
- 대표 페르소나 카드는 3개만 보이게
- 디버그 텍스트/긴 로그 노출 금지

### 발표 순서와 화면 움직임
1. 헤더 소개
2. 왼쪽에서 입력 확인
3. 실행 버튼 클릭
4. 오른쪽 결과 상단 KPI 설명
5. 차트 설명
6. 페르소나 카드 1~2개만 집어 설명
7. 인사이트 카드로 마무리

---

## 9. 반응형 규칙
### 데스크톱(기본)
- 2-column layout

### 태블릿 이하
- 1-column stack
- 결과 panel이 아래로 내려감

### 우선순위
- 발표는 데스크톱 기준이므로, 모바일 완성도에 시간 쓰지 않는다.

---

## 10. 구현용 컴포넌트 맵
```text
app/page.tsx
  ├─ HeaderBar
  ├─ InputForm
  │   ├─ ProductDescriptionField
  │   ├─ VariantFields
  │   ├─ FilterPanel
  │   └─ RunToolbar
  └─ ResultPanel
      ├─ EmptyState
      ├─ LoadingState
      └─ SuccessState
          ├─ ResultSummary
          ├─ ScoreChart
          ├─ InsightCards
          └─ PersonaCardList
```

---

## 11. 화면 설계 한 줄 요약
> **입력은 왼쪽에 간단히, 결론은 오른쪽에 크게.** 심사위원이 A/B 승자와 이유를 바로 이해하게 만드는 대시보드형 단일 화면이 최적이다.
