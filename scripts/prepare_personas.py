"""
Nemotron-Personas-Korea → Supabase 로딩 스크립트

실행 전:
  pip install datasets huggingface_hub supabase python-dotenv

실행:
  python scripts/prepare_personas.py

환경변수 (.env.local 또는 shell):
  SUPABASE_URL=https://ijptkmnrhvrujvyvrpth.supabase.co
  SUPABASE_SERVICE_KEY=<service_role key>
"""

import os
import random
import json
from dotenv import load_dotenv
from datasets import load_dataset
from supabase import create_client

load_dotenv(".env.local")

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_SERVICE_KEY"]
TARGET_PER_GROUP = 1250   # 4그룹 × 1250 = 5,000개
STREAM_TAKE = 100_000     # 스트리밍으로 앞에서 읽을 수

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


def main():
    print("▶ Nemotron-Personas-Korea 스트리밍 시작...")
    ds = load_dataset(
        "nvidia/Nemotron-Personas-Korea",
        split="train",
        streaming=True,
        trust_remote_code=True,
    )

    pool = []
    for i, row in enumerate(ds):
        pool.append(dict(row))
        if i + 1 >= STREAM_TAKE:
            break
        if (i + 1) % 10000 == 0:
            print(f"  {i+1:,}개 읽는 중...")

    print(f"  총 {len(pool):,}개 로드 완료")

    # 실제 필드값 확인 (한 번만 출력)
    print("\n── 실제 필드 목록:", list(pool[0].keys()))
    print("── sex 값 샘플:", sorted({str(r.get("sex")) for r in pool[:500]}))
    print("── occupation 샘플:", sorted({str(r.get("occupation")) for r in pool[:500]})[:15])
    print("── province 샘플:", sorted({str(r.get("province")) for r in pool[:500]}))
    print()

    # 연령대별 계층 샘플링
    age_groups = [(20, 29), (30, 39), (40, 49), (50, 59)]
    sampled = []
    for min_age, max_age in age_groups:
        group = [
            r for r in pool
            if r.get("age") is not None and min_age <= int(r["age"]) <= max_age
        ]
        n = min(TARGET_PER_GROUP, len(group))
        sampled.extend(random.sample(group, n))
        print(f"  {min_age}~{max_age}대: {len(group):,}명 중 {n}명 샘플링")

    print(f"\n총 샘플: {len(sampled):,}개")

    # DB row 변환 (알려진 필드 명시 + raw 전체 보존)
    rows = []
    for r in sampled:
        age_val = r.get("age")
        rows.append({
            "sex":                          r.get("sex"),
            "age":                          int(age_val) if age_val is not None else None,
            "occupation":                   r.get("occupation"),
            "province":                     r.get("province"),
            "education_level":              r.get("education_level"),
            "persona":                      r.get("persona"),
            "professional_persona":         r.get("professional_persona"),
            "family_persona":               r.get("family_persona"),
            "hobbies_and_interests":        r.get("hobbies_and_interests"),
            "career_goals_and_ambitions":   r.get("career_goals_and_ambitions"),
            "raw":                          r,
        })

    # Supabase 배치 INSERT
    print("\n▶ Supabase INSERT 시작...")
    batch_size = 500
    for i in range(0, len(rows), batch_size):
        batch = rows[i : i + batch_size]
        supabase.table("personas").insert(batch).execute()
        print(f"  {min(i + batch_size, len(rows)):,} / {len(rows):,} 완료")

    # 최종 확인
    count = supabase.table("personas").select("id", count="exact").execute()
    print(f"\n✅ 완료! DB 총 {count.count:,}개")


if __name__ == "__main__":
    main()
