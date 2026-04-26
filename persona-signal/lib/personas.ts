import { createServiceClient } from "./supabase";
import { PersonaRecord, SimulationFilters } from "./types";

const OCCUPATION_ALIASES: Record<string, string[]> = {
  "사무직": ["사무", "행정", "총무", "경리", "오피스", "관리"],
  "기획": ["기획", "PM", "프로덕트", "서비스 기획", "전략", "사업개발"],
  "마케팅": ["마케팅", "광고", "브랜드", "콘텐츠", "퍼포먼스", "CRM"],
  "영업": ["영업", "세일즈", "Sales", "BD", "고객관리"],
  "IT/개발": ["IT", "개발", "소프트웨어", "프로그래머", "엔지니어", "데이터", "웹", "앱", "시스템"],
  "교육": ["교육", "교사", "강사", "교수", "튜터", "학원"],
  "의료": ["의료", "간호", "의사", "약사", "병원", "보건"],
  "서비스업": ["서비스", "상담", "고객", "리테일", "매장", "판매"],
  "제조/생산": ["제조", "생산", "공장", "품질", "설비", "현장"],
  "자영업": ["자영업", "사업", "창업", "대표", "프리랜서", "소상공"],
  "무직/주부/학생": ["무직", "주부", "학생", "대학생", "취준", "구직"],
};

export async function samplePersonas(
  filters: SimulationFilters,
  sampleSize: number
): Promise<PersonaRecord[]> {
  const sb = createServiceClient();

  const occupationPatterns = getOccupationPatterns(filters.occupations);
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

  if (occupationPatterns.length > 0) {
    query = query.or(buildOccupationOr(occupationPatterns));
  }

  const { data, error } = await query.limit(sampleSize * 40);

  if (error) throw new Error(`Supabase query failed: ${error.message}`);

  if (!data || data.length < sampleSize) {
    const relaxed = await relaxedQuery(sb, filters, sampleSize, occupationPatterns, data ?? []);
    return stratifiedSample(relaxed as PersonaRecord[], filters, sampleSize);
  }

  return stratifiedSample(data as PersonaRecord[], filters, sampleSize);
}

async function relaxedQuery(
  sb: ReturnType<typeof createServiceClient>,
  filters: SimulationFilters,
  sampleSize: number,
  occupationPatterns: string[],
  currentCandidates: PersonaRecord[]
): Promise<PersonaRecord[]> {
  // 1차 완화: 지역/결혼 조건 제거, 직군은 유지한다.
  let q = sb
    .from("personas")
    .select("*")
    .gte("age", filters.ageMin)
    .lte("age", filters.ageMax);

  if (filters.sexes.length > 0) q = q.in("sex", filters.sexes);
  if (occupationPatterns.length > 0) q = q.or(buildOccupationOr(occupationPatterns));

  const { data: d1 } = await q.limit(sampleSize * 40);
  if (d1 && d1.length >= sampleSize) return d1;

  const occupationPreserved = [...currentCandidates, ...(d1 ?? [])];
  if (occupationPreserved.length > 0) return dedupePersonas(occupationPreserved);

  // 2차 완화: 직군까지 제거. 단, 가능한 경우 무직/주부/학생은 제외한다.
  let q2 = sb
    .from("personas")
    .select("*")
    .gte("age", filters.ageMin)
    .lte("age", filters.ageMax);

  if (filters.sexes.length > 0) q2 = q2.in("sex", filters.sexes);
  if (filters.provinces.length > 0) q2 = q2.in("province", filters.provinces);
  if (filters.maritalStatuses?.length > 0) q2 = q2.in("marital_status", filters.maritalStatuses);

  const { data: d2 } = await q2.limit(sampleSize * 40);
  const nonStudent = (d2 ?? []).filter((persona) => !isNonWorkingOccupation(persona.occupation));
  if (nonStudent.length > 0) return nonStudent;

  // 3차 완화: 나이/성별만
  const { data: d3 } = await sb
    .from("personas")
    .select("*")
    .gte("age", filters.ageMin)
    .lte("age", filters.ageMax)
    .in("sex", filters.sexes.length > 0 ? filters.sexes : ["남자", "여자"])
    .limit(sampleSize * 40);

  return d3 ?? [];
}

function getOccupationPatterns(occupations: string[]): string[] {
  return Array.from(new Set(
    occupations.flatMap((occupation) => OCCUPATION_ALIASES[occupation] ?? [occupation])
  ));
}

function buildOccupationOr(patterns: string[]): string {
  return patterns.map((pattern) => `occupation.ilike.%${pattern}%`).join(",");
}

function isNonWorkingOccupation(occupation: string): boolean {
  return /무직|주부|학생|대학생|취준|구직/.test(occupation);
}

function dedupePersonas(personas: PersonaRecord[]): PersonaRecord[] {
  const seen = new Set<number>();
  return personas.filter((persona) => {
    if (seen.has(persona.id)) return false;
    seen.add(persona.id);
    return true;
  });
}

function stratifiedSample(
  candidates: PersonaRecord[],
  filters: SimulationFilters,
  sampleSize: number
): PersonaRecord[] {
  const shuffled = shuffle(dedupePersonas(candidates));
  if (shuffled.length <= sampleSize) return shuffled;

  const sexes = filters.sexes.length > 0
    ? filters.sexes
    : Array.from(new Set(shuffled.map((persona) => persona.sex))).sort();
  const ageBuckets = buildAgeBuckets(filters.ageMin, filters.ageMax);
  const buckets = ageBuckets.flatMap((ageBucket) =>
    sexes.map((sex) => ({
      key: `${ageBucket.min}-${ageBucket.max}-${sex}`,
      min: ageBucket.min,
      max: ageBucket.max,
      sex,
      items: shuffled.filter((persona) =>
        persona.age >= ageBucket.min &&
        persona.age <= ageBucket.max &&
        persona.sex === sex
      ),
    }))
  ).filter((bucket) => bucket.items.length > 0);

  if (buckets.length === 0) return shuffled.slice(0, sampleSize);

  const selected: PersonaRecord[] = [];
  const used = new Set<number>();
  let cursor = 0;

  while (selected.length < sampleSize && buckets.some((bucket) => bucket.items.some((item) => !used.has(item.id)))) {
    const bucket = buckets[cursor % buckets.length];
    const next = bucket.items.find((item) => !used.has(item.id));
    if (next) {
      selected.push(next);
      used.add(next.id);
    }
    cursor += 1;
  }

  if (selected.length < sampleSize) {
    for (const persona of shuffled) {
      if (selected.length >= sampleSize) break;
      if (!used.has(persona.id)) {
        selected.push(persona);
        used.add(persona.id);
      }
    }
  }

  return selected;
}

function buildAgeBuckets(ageMin: number, ageMax: number): Array<{ min: number; max: number }> {
  const span = ageMax - ageMin;
  const size = span <= 25 ? 5 : 10;
  const buckets: Array<{ min: number; max: number }> = [];
  for (let min = ageMin; min <= ageMax; min += size) {
    buckets.push({ min, max: Math.min(ageMax, min + size - 1) });
  }
  return buckets;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
