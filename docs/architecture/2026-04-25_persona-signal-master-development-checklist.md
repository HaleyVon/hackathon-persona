# Persona Signal Master Development Checklist

## 사용 방법
이 문서는 **AI coding agent 또는 인간 개발자**가 바로 체크하면서 개발을 진행하기 위한 실행 체크리스트입니다.

원칙:
- 위에서 아래로만 진행
- 현재 단계가 끝나기 전 다음 단계 시작 금지
- 각 단계 완료 시 직접 체크
- 발표 안정성이 기능 수보다 중요

---

## A. 프로젝트 셋업
- [ ] Next.js App Router 프로젝트 생성
- [ ] TypeScript 활성화
- [ ] Tailwind 설정 완료
- [ ] shadcn/ui 초기화
- [ ] Recharts 설치
- [ ] Zod 설치
- [ ] `.env.example` 작성
- [ ] `app/`, `components/`, `lib/`, `data/`, `scripts/` 구조 생성
- [ ] `npm run dev` 성공

## B. 타입/상수
- [ ] `lib/types.ts` 생성
- [ ] `lib/constants.ts` 생성
- [ ] demo input 상수 생성
- [ ] filter option 상수 생성
- [ ] import 에러 없음

## C. 데이터 준비 (코드 시작 전 반드시 완료)
- [ ] `pip install datasets huggingface_hub` 설치
- [ ] `scripts/prepare_personas.py` 생성 (streaming + 계층 샘플링)
- [ ] `data/personas.sample.json` 생성 (5,000개 이상)
- [ ] **⚠️ 실제 `occupation` 값 콘솔 출력 확인** → UI 필터 옵션과 일치 여부 검증
- [ ] **⚠️ 실제 `province` 값 콘솔 출력 확인** → "서울" vs "서울특별시" 등 확인
- [ ] **⚠️ 실제 `sex` 값 콘솔 출력 확인** → "남자"/"여자" vs "male"/"female" 확인
- [ ] 불일치 시 `constants.ts` 필터 옵션을 실제 값에 맞게 수정
- [ ] 샘플 row 3개 이상 수동 확인

## D. 샘플링 유틸
- [ ] JSON 로더 구현
- [ ] 성별 필터 구현
- [ ] 나이 범위 필터 구현
- [ ] 직업군 필터 구현
- [ ] 지역 필터 구현
- [ ] 랜덤 샘플링 구현
- [ ] 결과 0건 fallback 처리
- [ ] mock 입력으로 수동 확인

## E. LLM 계층
- [ ] prompt builder 구현 (페르소나 1명당 A/B 동시 반응 생성)
- [ ] system prompt 고정
- [ ] JSON-only 응답 강제 (스키마 명시)
- [ ] LLM client wrapper 구현 (`gpt-4o-mini`, Promise.all 병렬)
- [ ] `OPENAI_API_KEY`, `OPENAI_MODEL=gpt-4o-mini` 환경변수 연결
- [ ] 단일 persona 테스트 성공 (A/B 동시 반환)
- [ ] parse 실패 처리 존재 (1회 재시도 → fallback)
- [ ] **요약 LLM 호출 구현** (전체 반응 → 집계 인사이트 + 개선 카피 3개)

## F. 집계 로직
- [ ] 평균 점수 계산
- [ ] liked points 집계
- [ ] concerns 집계
- [ ] variant winner 계산
- [ ] one-paragraph insight 생성
- [ ] 추천 액션 생성
- [ ] mock data로 확인

## G. API
- [ ] `/api/simulate` route 생성
- [ ] **`export const maxDuration = 60` 최상단 추가** (Vercel 타임아웃 방지)
- [ ] request zod validation
- [ ] persona sampling 연결
- [ ] Promise.all 병렬 LLM simulation 연결
- [ ] 요약 LLM 호출 연결
- [ ] segmentBreakdown 계산 연결
- [ ] response schema 고정 (segmentBreakdown 포함)
- [ ] error response 통일
- [ ] curl/fetch 테스트 성공 (응답 시간 측정)

## H. 입력 UI
- [ ] header 구현
- [ ] product description textarea 구현
- [ ] variant A/B textarea 구현
- [ ] filter panel 구현
- [ ] sample size 선택 구현
- [ ] demo data autofill 버튼 구현
- [ ] run simulation 버튼 구현
- [ ] 로딩 상태 연결

## I. 결과 UI
- [ ] empty state 구현
- [ ] loading state 구현
- [ ] KPI summary cards 구현
- [ ] A/B score chart 구현
- [ ] **세그먼트 분화 테이블 구현** (와우 모먼트 — 우선순위 높음)
- [ ] insight cards 구현 (개선 카피 3개 포함)
- [ ] persona cards 구현 (3개만)
- [ ] 결과 패널 레이아웃 정리
- [ ] 첫 화면 스크롤 최소화

## J. 데모 안정화
- [ ] `data/demo-request.json` 작성
- [ ] `data/demo-response.json` 작성
- [ ] fallback 로직 구현
- [ ] 데모용 고정 시나리오 연결
- [ ] 발표에서 같은 결과 재현 가능

## K. 문서/배포
- [ ] README 보강
- [ ] 데이터 출처 기재
- [ ] 제한사항 명시
- [ ] 환경변수 설명 추가
- [ ] Vercel 배포
- [ ] 배포 URL 확인
- [ ] 브라우저 캐시/새로고침 확인

## L. 발표 전 최종 QA
- [ ] Demo data 버튼 한 번에 동작
- [ ] Run 버튼 한 번에 동작
- [ ] 30초 내 결과 노출
- [ ] A/B 승자 설명 가능
- [ ] 대표 페르소나 카드 읽기 쉬움
- [ ] `실제 설문 대체 아님` 답변 준비
- [ ] 인터넷 불안정 시 fallback 사용 가능
- [ ] 3분 발표 리허설 완료

---

## 최우선 우승 체크포인트
- [ ] 문제 정의가 한 문장으로 설명됨
- [ ] 한국 시장 특화성이 드러남
- [ ] 생성 AI가 아니라 **검증 AI 레이어**라는 메시지가 선명함
- [ ] UI가 복잡하지 않음
- [ ] 데모가 끊기지 않음

---

## 완료 기준
아래가 모두 충족되면 개발 완료로 본다.
- [ ] 로컬에서 동작
- [ ] 배포 URL에서 동작
- [ ] 데모 시나리오 재현 가능
- [ ] 발표 스크립트와 화면 일치
- [ ] README만 읽어도 제품 이해 가능
