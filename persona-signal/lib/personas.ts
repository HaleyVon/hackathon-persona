import { createServiceClient } from "./supabase";
import { PersonaRecord, SimulationFilters } from "./types";

export async function samplePersonas(
  filters: SimulationFilters,
  sampleSize: number
): Promise<PersonaRecord[]> {
  const sb = createServiceClient();

  let query = sb
    .from("personas")
    .select("*")
    .gte("age", filters.ageMin)
    .lte("age", filters.ageMax);

  if (filters.sexes.length > 0) {
    query = query.in("sex", filters.sexes);
  }
  if (filters.provinces.length > 0) {
    query = query.in("province", filters.provinces);
  }

  // occupation은 직업명이 다양해서 contains 방식으로 fallback
  // (exact match로 0건이면 필터 제거)
  const { data, error } = await query
    .limit(sampleSize * 10); // 넉넉하게 가져온 뒤 랜덤 샘플링

  if (error) throw new Error(`Supabase query failed: ${error.message}`);
  if (!data || data.length === 0) {
    // 필터 완화: province/occupation 제거하고 연령/성별만
    const { data: fallback } = await sb
      .from("personas")
      .select("*")
      .gte("age", filters.ageMin)
      .lte("age", filters.ageMax)
      .in("sex", filters.sexes.length > 0 ? filters.sexes : ["남자", "여자"])
      .limit(sampleSize * 10);
    return shuffle(fallback ?? []).slice(0, sampleSize) as PersonaRecord[];
  }

  return shuffle(data).slice(0, sampleSize) as PersonaRecord[];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
