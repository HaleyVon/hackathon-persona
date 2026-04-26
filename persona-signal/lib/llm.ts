import OpenAI from "openai";
import {
  PersonaRecord,
  VariantReaction,
  PersonaComparisonResult,
} from "./types";
import {
  buildSystemPrompt,
  buildUserPrompt,
  buildSummaryPrompt,
} from "./prompt";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

type RawReaction = {
  reactionA: VariantReaction;
  reactionB: VariantReaction;
  preferredVariant: "A" | "B" | "Tie";
  preferenceReason: string;
};

async function callLLM(system: string, user: string): Promise<string> {
  const res = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    temperature: 0.7,
    response_format: { type: "json_object" },
  });
  return res.choices[0].message.content ?? "{}";
}

export async function simulatePersona(
  persona: PersonaRecord,
  productDescription: string,
  variantA: string,
  variantB: string
): Promise<PersonaComparisonResult> {
  const userPrompt = buildUserPrompt(persona, productDescription, variantA, variantB);

  let raw: RawReaction | null = null;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const text = await callLLM(buildSystemPrompt(), userPrompt);
      raw = JSON.parse(text) as RawReaction;
      break;
    } catch {
      if (attempt === 1) {
        // 최종 fallback
        raw = makeFallbackReaction();
      }
    }
  }

  const r = raw!;
  return {
    persona,
    reactionA: normalizeReaction(r.reactionA),
    reactionB: normalizeReaction(r.reactionB),
    preferredVariant: r.preferredVariant ?? "Tie",
    preferenceReason: r.preferenceReason ?? "",
  };
}

export async function simulateAll(
  personas: PersonaRecord[],
  productDescription: string,
  variantA: string,
  variantB: string
): Promise<PersonaComparisonResult[]> {
  return Promise.all(
    personas.map((p) => simulatePersona(p, productDescription, variantA, variantB))
  );
}

export async function generateSummaryInsights(
  productDescription: string,
  variantA: string,
  variantB: string,
  results: PersonaComparisonResult[]
): Promise<{
  topLikedPoints: string[];
  topConcerns: string[];
  recommendedCopies: string[];
  oneParagraphInsight: string;
}> {
  const reactionsText = results
    .map(
      (r, i) =>
        `페르소나${i + 1}(${r.persona.age}세 ${r.persona.sex} ${r.persona.occupation}): ` +
        `A반응="${r.reactionA.oneSentenceReaction}" B반응="${r.reactionB.oneSentenceReaction}" 선호=${r.preferredVariant}`
    )
    .join("\n");

  try {
    const text = await callLLM(
      "당신은 마케팅 리서치 분석가입니다. JSON만 출력하세요.",
      buildSummaryPrompt(productDescription, variantA, variantB, reactionsText)
    );
    return JSON.parse(text);
  } catch {
    return {
      topLikedPoints: ["데이터 집계 실패"],
      topConcerns: ["데이터 집계 실패"],
      recommendedCopies: [],
      oneParagraphInsight: "요약 생성에 실패했습니다. 개별 페르소나 반응을 참고하세요.",
    };
  }
}

function clamp(v: unknown): number | undefined {
  const n = Number(v);
  if (isNaN(n)) return undefined;
  return Math.min(5, Math.max(1, Math.round(n)));
}

function normalizeReaction(r: Partial<VariantReaction>): VariantReaction {
  return {
    purchaseIntent: Math.min(5, Math.max(1, Number(r?.purchaseIntent) || 3)),
    comprehension: clamp(r?.comprehension),
    trust: clamp(r?.trust),
    appeal: clamp(r?.appeal),
    resistance: clamp(r?.resistance),
    confusionRisk: clamp(r?.confusionRisk),
    likedPoints: r?.likedPoints ?? [],
    concerns: r?.concerns ?? [],
    memorablePhrase: r?.memorablePhrase ?? "",
    oneSentenceReaction: r?.oneSentenceReaction ?? "",
  };
}

function makeFallbackReaction(): RawReaction {
  const neutral = {
    purchaseIntent: 3,
    likedPoints: ["분석 실패"],
    concerns: ["분석 실패"],
    memorablePhrase: "-",
    oneSentenceReaction: "응답 생성에 실패했습니다.",
  };
  return {
    reactionA: neutral,
    reactionB: neutral,
    preferredVariant: "Tie",
    preferenceReason: "분석 실패",
  };
}
