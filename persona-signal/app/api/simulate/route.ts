export const maxDuration = 60;

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { samplePersonas } from "@/lib/personas";
import { simulateAll, generateSummaryInsights } from "@/lib/llm";
import { buildSummary } from "@/lib/summarize";

const RequestSchema = z.object({
  productDescription: z.string().min(5),
  targetCustomer: z.string().min(3),
  marketType: z.enum(["B2B", "B2C", "B2B2C"]),
  usageContext: z.string().default(""),
  variantA: z.string().min(1),
  variantB: z.string().default(""),
  filters: z.object({
    sexes: z.array(z.string()),
    ageMin: z.number().min(0).max(100),
    ageMax: z.number().min(0).max(100),
    occupations: z.array(z.string()),
    provinces: z.array(z.string()),
    maritalStatuses: z.array(z.string()).optional().default([]),
  }),
  sampleSize: z.number().min(1).max(10),
  decisionMode: z.enum(["compare", "review"]).default("compare"),
  inputType: z.enum(["copy", "pricing", "feature", "positioning"]).default("copy"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = RequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "입력값이 올바르지 않습니다.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const {
      productDescription,
      targetCustomer,
      marketType,
      usageContext,
      variantA,
      variantB,
      filters,
      sampleSize,
      decisionMode,
      inputType,
    } = parsed.data;

    // review 모드에서 variantB가 비어있으면 variantA 복사
    const effectiveB = decisionMode === "review" && !variantB ? variantA : variantB;

    // 1. 페르소나 샘플링
    const personas = await samplePersonas(filters, sampleSize);
    if (personas.length === 0) {
      return NextResponse.json(
        { error: "조건에 맞는 페르소나가 없습니다. 필터를 완화해보세요." },
        { status: 404 }
      );
    }

    // 2. 병렬 LLM 시뮬레이션
    const results = await simulateAll(
      personas,
      productDescription,
      targetCustomer,
      marketType,
      usageContext,
      variantA,
      effectiveB,
      inputType,
      decisionMode
    );

    // 3. 요약 LLM 호출
    const insights = await generateSummaryInsights(
      productDescription,
      targetCustomer,
      marketType,
      usageContext,
      variantA,
      effectiveB,
      results,
      inputType,
      decisionMode
    );

    // 4. 집계
    const summary = buildSummary(results, insights, inputType, decisionMode);

    return NextResponse.json({ summary, personas: results });
  } catch (err) {
    console.error("simulate error:", err);
    return NextResponse.json(
      { error: "시뮬레이션 중 오류가 발생했습니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
