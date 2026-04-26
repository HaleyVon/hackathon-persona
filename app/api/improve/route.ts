export const maxDuration = 60;

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateImprovementOptions } from "@/lib/llm";

const RequestSchema = z.object({
  productDescription: z.string().min(5),
  targetCustomer: z.string().min(3),
  marketType: z.enum(["B2B", "B2C", "B2B2C"]),
  usageContext: z.string().default(""),
  inputType: z.enum(["copy", "pricing", "feature", "positioning"]),
  decisionMode: z.enum(["compare", "review"]),
  variantA: z.string().min(1),
  variantB: z.string().optional(),
  winner: z.enum(["A", "B", "Tie"]).optional(),
  topConcerns: z.array(z.string()).default([]),
  recommendedCopies: z.array(z.string()).default([]),
  oneParagraphInsight: z.string().default(""),
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

    const options = await generateImprovementOptions(parsed.data);
    return NextResponse.json(options);
  } catch (error) {
    console.error("improve error:", error);
    return NextResponse.json(
      { error: "개선안 생성 중 오류가 발생했습니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
