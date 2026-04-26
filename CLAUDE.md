# Persona Signal — 프로젝트 규칙

## 세션 종료 시 필수 규칙

모든 세션이 끝날 때마다 `PROGRESS.md`를 업데이트합니다.

업데이트 항목:

- 이번 세션에서 완료된 작업
- 새로 발견된 이슈나 변경사항
- 다음 할 일
- 현재 상태 날짜

## 프로젝트 개요

Persona Signal은 제품팀이 카피, 가격, 기능 같은 작은 의사결정을 감으로만 하지 않도록, 타깃 페르소나 관점의 구조화된 사전 검토를 제공하는 pre-validation tool입니다.

현재 Next.js 앱은 레포 루트에 있습니다.

## 기술 스택

- Framework: Next.js App Router + TypeScript
- UI: Tailwind CSS + shadcn-style UI primitives + Recharts
- LLM: OpenAI `gpt-4o-mini`
- DB: Supabase PostgreSQL
- Deploy target: Vercel

## 핵심 제약

- `app/api/simulate/route.ts` 최상단의 `export const maxDuration = 60`을 유지합니다.
- LLM 호출은 서버 route handler에서만 수행합니다.
- API key를 클라이언트 코드에 노출하지 않습니다.
- DB 스키마 변경 시 `supabase/migrations/`에 SQL 파일을 추가합니다.
- `lib/personas.ts`의 fallback과 층화 샘플링 로직을 임의로 제거하지 않습니다.

## 현재 제품 정책

- 지원 모드: 비교하기, 검토하기
- 지원 입력 타입: 카피/메시지, 가격/플랜, 기능 필요성
- 표본 수 옵션: 10명, 20명, 30명, 50명
- 결과 지표는 모두 높을수록 좋은 방향으로 표시합니다.
- 결과는 예측이 아니라 리스크 탐지와 개선 방향 제시로 설명합니다.

## 문서 기준

- 제품 설명, 실행 방법, 기술 구조는 루트 `README.md`가 기준입니다.
- 진행 현황은 `PROGRESS.md`에 기록합니다.
