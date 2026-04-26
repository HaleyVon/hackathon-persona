# AGENTS.md

이 레포는 Persona Signal 단일 제품 레포입니다. 실제 Next.js 앱은 루트에 있습니다.

## 작업 원칙

1. 루트 `README.md`를 제품 프레젠테이션 문서의 기준으로 유지합니다.
2. 동작이나 구조가 바뀌면 `PROGRESS.md`도 함께 업데이트합니다.
3. LLM 호출은 서버 route handler에서만 수행합니다.
4. `app/api/simulate/route.ts`의 `export const maxDuration = 60`을 유지합니다.
5. Supabase 스키마 변경은 `supabase/migrations/`에 SQL 파일로 남깁니다.

## 검증

코드 변경 후 가능한 경우 다음 명령을 확인합니다.

```bash
npm run lint
npm run build
```
