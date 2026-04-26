# Persona Signal AI Build Playbook

> **For Hermes or any coding agent:** Follow this document top-to-bottom. Do not skip ahead. Mark each item complete before moving on.

## 1. 목표
AI coding agent가 이 문서만 보고도 **실패 확률을 최소화하며 Persona Signal MVP를 바로 구현**할 수 있도록 한다.

이 문서는 다음을 포함한다.
- 개발 시작 전 고정 의사결정
- 정확한 파일 구조
- 최적 개발 순서
- 작업별 to-do checklist
- 각 단계의 검증 기준
- 흔한 실패와 우회 전략

---

## 2. 절대 바꾸지 말아야 할 제품 정의
### 제품 한 줄
한국인 합성 페르소나를 기반으로 랜딩페이지/제품 문구 A/B의 반응을 시뮬레이션하는 AI 메시지 검증 툴

### 반드시 지킬 범위
- A/B 카피 비교만 한다
- 실제 설문 대체가 아니라 초기 가설 검증 보조로 표현한다
- 단일 페이지에서 끝낸다
- 결과는 구매의향/호감/거부/개선 제안까지만 보여준다

### 금지 범위
- 설문 플랫폼화
- 로그인
- DB
- 히스토리 저장
- 멀티프로젝트 기능
- 복잡한 통계 해석
- 의료/금융 등 민감 의사결정 툴 포지셔닝

---

## 3. 개발 시작 전 고정 기술결정
- Framework: Next.js App Router
- Language: TypeScript
- UI: Tailwind + shadcn/ui
- Chart: Recharts
- Validation: Zod
- LLM: OpenAI-compatible API 단일 provider
- Data runtime: local `personas.sample.json`
- Deploy: Vercel

---

## 4. 작업 우선순위 원칙
### 제일 먼저 만들어야 하는 것
1. **데모가 돌아가는 최소 루프**
2. 입력 → API → 결과 반환
3. 대표 결과 요약 카드

### 나중에 만들어도 되는 것
- 예쁜 차트
- 세부 필터 개선
- polished UI
- 부가 설명

### 마지막까지 미뤄도 되는 것
- 애니메이션
- 공유 링크
- 저장 기능

---

## 5. 권장 파일 구조
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
```

---

## 6. Master To-Do List

## Phase 0 — 프로젝트 생성
- [ ] Next.js 프로젝트 생성
- [ ] Tailwind/shadcn/ui 설정
- [ ] Recharts 설치
- [ ] Zod 설치
- [ ] `.env.example` 생성
- [ ] 기본 `README.md` 유지 또는 보강

### 완료 조건
- `npm run dev`가 에러 없이 켜진다
- 빈 페이지가 로컬에서 보인다

---

## Phase 1 — 타입과 상수 정의
- [ ] `lib/types.ts` 작성
- [ ] `lib/constants.ts` 작성
- [ ] demo 기본값 상수 정의
- [ ] 필터 option 상수 정의

### 완료 조건
- 타입 import 에러 없음
- 나중에 컴포넌트와 API가 같은 타입을 사용 가능

---

## Phase 2 — 데이터 준비 (전체 개발 중 가장 먼저 실행)
- [ ] `pip install datasets huggingface_hub`
- [ ] `scripts/prepare_personas.py` 작성 (streaming + 계층 샘플링)
- [ ] `data/personas.sample.json` 생성 (5,000개 목표)
- [ ] 실제 occupation/province/sex 값 콘솔 출력 확인
- [ ] 필요시 `constants.ts` 필터 옵션 값 조정

### 스크립트 핵심 구조
```python
from datasets import load_dataset
import json, random

ds = load_dataset("nvidia/Nemotron-Personas-Korea", split="train", streaming=True)

pool = list(ds.take(50000))

# 연령대별 계층 샘플링
age_groups = [(20, 29), (30, 39), (40, 49), (50, 59)]
result = []
for min_age, max_age in age_groups:
    group = [r for r in pool if r.get("age") and min_age <= int(r["age"]) <= max_age]
    result.extend(random.sample(group, min(1250, len(group))))

# snake_case → camelCase 변환하여 저장
converted = [
    {
        "id": str(i),
        "persona": r.get("persona", ""),
        "professionalPersona": r.get("professional_persona"),
        "familyPersona": r.get("family_persona"),
        "hobbies": r.get("hobbies_and_interests"),
        "goals": r.get("career_goals_and_ambitions"),
        "sex": r.get("sex", ""),
        "age": r.get("age"),
        "occupation": r.get("occupation", ""),
        "province": r.get("province", ""),
        "educationLevel": r.get("education_level"),
    }
    for i, r in enumerate(result)
]

# 실제 값 확인 출력
print("occupation 샘플:", list({r["occupation"] for r in converted[:100]}))
print("province 샘플:", list({r["province"] for r in converted[:100]}))
print("sex 샘플:", list({r["sex"] for r in converted[:100]}))

with open("data/personas.sample.json", "w", encoding="utf-8") as f:
    json.dump(converted, f, ensure_ascii=False, indent=2)
print(f"완료: {len(converted)}개 저장")
```

### 완료 조건
- JSON 유효
- 5,000개 이상
- occupation/province/sex 실제 값 확인 후 constants.ts에 반영
- snake_case 필드가 JSON에 없고 camelCase만 존재

### 실패 방지 팁
- 전체 수백만 row 직접 로드 시도 금지 (streaming 필수)
- 샘플링 후 반드시 실제 값 확인 — 필터가 작동하지 않으면 모든 UI가 무의미해짐

---

## Phase 3 — 페르소나 필터링 유틸
- [ ] `lib/personas.ts` 작성
- [ ] JSON load 함수 구현
- [ ] 필터 함수 구현
- [ ] 랜덤 샘플링 함수 구현
- [ ] fallback 로직 구현

### 완료 조건
- mock request로 5명 이상 정상 반환
- 필터가 너무 강하면 fallback 메시지나 완화 동작 존재

### 검증
- [ ] 성별 필터 동작
- [ ] 연령 범위 필터 동작
- [ ] 직업군 필터 동작
- [ ] 지역 필터 동작

---

## Phase 4 — 프롬프트 및 LLM 래퍼
- [ ] `lib/prompt.ts` 작성 (페르소나 1명당 A/B 동시 반응 생성 프롬프트)
- [ ] `lib/llm.ts` 작성 (`gpt-4o-mini`, Promise.all 병렬 처리)
- [ ] JSON-only 응답 프롬프트 고정 (스키마 명시)
- [ ] 파싱 실패 1회 재시도 → 그래도 실패시 fallback 처리
- [ ] `OPENAI_API_KEY`, `OPENAI_MODEL=gpt-4o-mini` 환경변수 연결

### 프롬프트 핵심 구조
- 1번 호출로 A와 B 모두 응답 (호출 수 절반)
- 출력 스키마: `{ reactionA: {...}, reactionB: {...}, preferredVariant, preferenceReason }`
- 구매의향 점수: 1~5 고정

### 완료 조건
- 단일 페르소나로 A/B 동시 반응 생성 성공
- 5명 Promise.all 병렬 호출 15초 내 완료 확인

### 실패 방지 팁
- 프롬프트에서 자유문 응답 허용 금지
- 반드시 JSON 스키마를 강제
- 구매의향 점수 범위는 1~5로 고정

---

## Phase 5 — 집계 유틸
- [ ] `lib/summarize.ts` 작성
- [ ] 평균 점수 계산
- [ ] 공통 liked points 추출
- [ ] 공통 concerns 추출
- [ ] 추천 개선안 정리
- [ ] 요약 문단 생성

### 완료 조건
- mock reaction 배열로 `summary` 객체 반환
- UI가 바로 소비할 수 있는 형태

---

## Phase 6 — API route
- [ ] `app/api/simulate/route.ts` 작성
- [ ] **`export const maxDuration = 60` 최상단에 추가** (Vercel 타임아웃 방지 — 없으면 발표 중 터짐)
- [ ] request validation(zod)
- [ ] personas filtering 연결
- [ ] Promise.all A/B 시뮬레이션 실행
- [ ] 요약 LLM 호출 (집계 인사이트 + 개선 카피 3개)
- [ ] segmentBreakdown 계산
- [ ] JSON response 반환 (segmentBreakdown 포함)
- [ ] 에러 응답 형식 통일

### 완료 조건
- curl 테스트로 정상 응답 확인
- 응답 시간 20초 이내 확인
- invalid request 처리 확인

### 검증 명령 예시
```bash
curl -X POST http://localhost:3000/api/simulate \
  -H 'Content-Type: application/json' \
  -d @data/demo-request.json
```

---

## Phase 7 — 입력 UI
- [ ] `components/input-form.tsx`
- [ ] `components/filter-panel.tsx`
- [ ] `components/run-toolbar.tsx`
- [ ] `app/page.tsx` 좌측 패널 구성
- [ ] demo data autofill 버튼 구현

### 완료 조건
- 사용자가 입력 후 클릭 1번으로 API 호출 가능
- demo data 버튼이 즉시 폼을 채움

### 실패 방지 팁
- 입력 필드 너무 많게 만들지 말 것
- 드롭다운은 최소화
- 기본값 적극 사용

---

## Phase 8 — 결과 UI
- [ ] `components/result-summary.tsx`
- [ ] `components/score-chart.tsx`
- [ ] `components/insight-cards.tsx`
- [ ] `components/persona-card.tsx`
- [ ] `components/empty-state.tsx`
- [ ] `components/loading-state.tsx`
- [ ] `app/page.tsx` 우측 패널 구성

### 완료 조건
- 첫 결과 화면에서 10초 내 가치 이해 가능
- A/B 승자, 평균 점수, 이유가 위쪽에 노출됨
- 대표 페르소나 3개 보임

---

## Phase 9 — 데모 안정화
- [ ] `data/demo-request.json` 작성
- [ ] `data/demo-response.json` 작성
- [ ] `lib/demo.ts` 작성
- [ ] API 실패 시 데모 응답 fallback 설계
- [ ] 발표용 고정 시나리오 반영

### 완료 조건
- 인터넷/LLM 불안정해도 결과 화면 시연 가능
- 발표 리허설이 같은 결과로 안정적으로 가능

---

## Phase 10 — 마감 전 정리
- [ ] README 보강
- [ ] 데이터 출처/라이선스 명시
- [ ] 제한사항 명시
- [ ] 환경변수 문서 정리
- [ ] Vercel 배포
- [ ] 실제 URL 접속 확인
- [ ] 최종 리허설 3회

### 완료 조건
- 배포 URL 동작
- README로 제품 설명 가능
- 발표 스크립트와 실제 화면이 일치

---

## 7. 정확한 개발 순서
### 추천 순서
1. 프로젝트 생성
2. 타입 정의
3. 샘플 데이터 준비
4. 필터링 유틸
5. 프롬프트/LLM 래퍼
6. 집계 유틸
7. API route
8. 입력 UI
9. 결과 UI
10. 데모 fallback
11. README/배포

### 이유
- 가장 불확실한 부분은 **데이터/LLM/API 연결**이다.
- UI를 먼저 만들면 예쁘지만 안 돌아가는 앱이 된다.
- 따라서 **백엔드 최소 루프를 먼저 고정**해야 한다.

---

## 8. 단계별 검증 규칙
### 각 Phase 종료 시 반드시 확인
- [ ] 타입 에러 없음
- [ ] lint 오류 치명적 수준 없음
- [ ] 한 단계 전 기능이 깨지지 않음
- [ ] console error 없음
- [ ] 실패 시 fallback 또는 에러 메시지 있음

---

## 9. AI 에이전트 작업 규칙
### 코드 작성 규칙
- 한 번에 너무 많은 파일을 바꾸지 말 것
- 큰 리팩터링 금지
- 우선 동작하는 최소 코드 작성
- UI polish는 마지막

### 커밋 규칙
각 phase 끝날 때마다 커밋

예시:
- `chore: initialize nextjs app`
- `feat: add persona sampling utilities`
- `feat: add simulation api route`
- `feat: implement result dashboard`
- `docs: update readme and deployment notes`

---

## 10. 흔한 오류와 우회 전략
### 오류 1: LLM 응답이 JSON이 아님
**대응**
- JSON-only prompt 강화
- parse 실패시 1회 재시도
- 그래도 실패하면 fallback response 사용

### 오류 2: 필터 결과가 0건
**대응**
- 직업/지역 조건 완화
- 샘플 JSON을 더 넓게 생성
- UI에서 조건 완화 안내

### 오류 3: 응답 시간이 너무 길다
**대응**
- sample size 줄이기
- sequential 대신 소규모 병렬화
- 발표용은 fixed demo-response 사용

### 오류 4: UI가 복잡해서 가치가 안 보임
**대응**
- 상단 KPI 카드 먼저
- 카드 수 줄이기
- persona card 3개만 표시

### 오류 5: 배포에서 파일 경로 문제
**대응**
- 상대경로 사용
- server-side file read 검증
- Vercel에서 `data/` 포함 확인

---

## 11. 발표 직전 체크리스트
- [ ] Demo data 버튼 동작
- [ ] Execute 버튼 동작
- [ ] 결과 상단 KPI 표시
- [ ] A/B 차트 노출
- [ ] 대표 페르소나 카드 3개 표시
- [ ] 에러 발생시 fallback 가능
- [ ] `실제 설문 대체가 아니다` 문구 준비
- [ ] URL 접속 확인

---

## 12. 최종 산출물 정의
### 코드 산출물
- 동작하는 Next.js 앱
- sample persona JSON
- simulation API
- 단일 화면 대시보드

### 문서 산출물
- README
- pitch 문서
- 발표 메모
- technical architecture
- screen spec
- 이 build playbook

---

## 13. 가장 중요한 한 줄
> **예쁜 제품보다, 입력 → 시뮬레이션 → A/B 결론이 안정적으로 보이는 제품이 우승 확률이 높다.**
