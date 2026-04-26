@AGENTS.md

# Persona Signal — Next.js 앱 규칙

## 세션 종료 시 필수

세션이 끝날 때마다 **반드시** `../PROGRESS.md`를 업데이트한다.
- 완료된 작업 체크
- 다음 할 일 갱신
- 현재 상태 날짜 업데이트

## 핵심 제약

- `app/api/simulate/route.ts` 최상단에 `export const maxDuration = 60` 유지
- LLM 호출은 서버(route handler)에서만 — 클라이언트 노출 금지
- 샘플 수 기본값 5, 최대 10 유지
- `lib/personas.ts`의 fallback 로직 제거 금지

## 환경변수 (`.env.local` 필수)

```
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_KEY
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
OPENAI_API_KEY
OPENAI_MODEL=gpt-4o-mini
```
