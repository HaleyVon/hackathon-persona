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
  if (filters.maritalStatuses && filters.maritalStatuses.length > 0) {
    query = query.in("marital_status", filters.maritalStatuses);
  }

  // occupation: 데이터셋 값이 다양하므로 ilike OR 방식
  if (filters.occupations.length > 0) {
    const occupationFilter = filters.occupations
      .map((o) => `occupation.ilike.%${o}%`)
      .join(",");
    query = query.or(occupationFilter);
  }

  const { data, error } = await query.limit(sampleSize * 15);

  if (error) throw new Error(`Supabase query failed: ${error.message}`);

  if (!data || data.length < sampleSize) {
    // 단계적 필터 완화: occupation → marital → province 순으로 제거
    const relaxed = await relaxedQuery(sb, filters, sampleSize);
    return shuffle(relaxed).slice(0, sampleSize) as PersonaRecord[];
  }

  return shuffle(data).slice(0, sampleSize) as PersonaRecord[];
}

async function relaxedQuery(
  sb: ReturnType<typeof createServiceClient>,
  filters: SimulationFilters,
  sampleSize: number
): Promise<PersonaRecord[]> {
  // 1차 완화: occupation 제거
  let q = sb
    .from("personas")
    .select("*")
    .gte("age", filters.ageMin)
    .lte("age", filters.ageMax);

  if (filters.sexes.length > 0) q = q.in("sex", filters.sexes);
  if (filters.provinces.length > 0) q = q.in("province", filters.provinces);
  if (filters.maritalStatuses?.length > 0) q = q.in("marital_status", filters.maritalStatuses);

  const { data: d1 } = await q.limit(sampleSize * 15);
  if (d1 && d1.length >= sampleSize) return d1;

  // 2차 완화: marital + occupation 제거
  let q2 = sb
    .from("personas")
    .select("*")
    .gte("age", filters.ageMin)
    .lte("age", filters.ageMax);

  if (filters.sexes.length > 0) q2 = q2.in("sex", filters.sexes);
  if (filters.provinces.length > 0) q2 = q2.in("province", filters.provinces);

  const { data: d2 } = await q2.limit(sampleSize * 15);
  if (d2 && d2.length >= sampleSize) return d2;

  // 3차 완화: 나이/성별만
  const { data: d3 } = await sb
    .from("personas")
    .select("*")
    .gte("age", filters.ageMin)
    .lte("age", filters.ageMax)
    .in("sex", filters.sexes.length > 0 ? filters.sexes : ["남자", "여자"])
    .limit(sampleSize * 15);

  return d3 ?? [];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
