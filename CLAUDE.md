# Persona Signal — 프로젝트 규칙

## 세션 종료 시 필수 규칙

**모든 세션이 끝날 때마다 반드시 `PROGRESS.md`를 업데이트한다.**

업데이트 항목:
1. 이번 세션에서 완료된 작업 → `## 완료된 작업` 섹션에 `[x]` 체크
2. 새로 발견된 이슈/변경사항 → 해당 섹션에 추가
3. 다음 할 일 목록 → `## 다음 할 일` 섹션 갱신
4. `현재 상태` 블록의 단계/날짜 업데이트

**이 규칙은 선택이 아니다. 세션 마지막 행동은 항상 PROGRESS.md 업데이트다.**

---

## 프로젝트 개요

**Persona Signal** — 한국인 합성 페르소나 기반 A/B 카피 검증 AI 도구
- 데이터: NVIDIA Nemotron-Personas-Korea (Supabase에 5,000개 로드됨)
- 앱: `persona-signal/` (Next.js 14 App Router)
- DB: Supabase (`ijptkmnrhvrujvyvrpth`)

---

## 기술 스택 및 확정 사항

- **Framework**: Next.js 14 App Router + TypeScript
- **UI**: Tailwind CSS + shadcn/ui + Recharts
- **LLM**: OpenAI `gpt-4o-mini`, Promise.all 병렬 호출
- **DB**: Supabase (PostgreSQL) — `personas` 테이블, 인덱스 완비
- **Deploy**: Vercel (`maxDuration=60` 필수)

---

## 절대 하지 말 것

- 페르소나 샘플 수를 10명 이상으로 늘리지 말 것 (latency)
- DB 스키마 변경 시 반드시 `supabase/migrations/`에 SQL 파일 추가
- API key를 클라이언트 코드에 노출하지 말 것
- 발표 1시간 전부터 기능 추가 금지

---

## 진행 현황 문서

→ [`PROGRESS.md`](./PROGRESS.md)
