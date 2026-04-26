import OpenAI from "openai";
import {
  DecisionMode,
  InputType,
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
  targetCustomer: string,
  marketType: string,
  usageContext: string,
  variantA: string,
  variantB: string,
  inputType: InputType = "copy",
  decisionMode: DecisionMode = "compare"
): Promise<PersonaComparisonResult> {
  const isReview = decisionMode === "review";
  const userPrompt = buildUserPrompt(
    persona,
    productDescription,
    targetCustomer,
    marketType,
    usageContext,
    variantA,
    variantB,
    inputType,
    isReview
  );

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
  const reactionA = normalizeReaction(r.reactionA);
  const reactionB =
    decisionMode === "review"
      ? reactionA
      : normalizeReaction(r.reactionB);

  return {
    persona,
    reactionA,
    reactionB,
    preferredVariant: decisionMode === "review" ? "A" : r.preferredVariant ?? "Tie",
    preferenceReason: r.preferenceReason ?? "",
  };
}

export async function simulateAll(
  personas: PersonaRecord[],
  productDescription: string,
  targetCustomer: string,
  marketType: string,
  usageContext: string,
  variantA: string,
  variantB: string,
  inputType: InputType = "copy",
  decisionMode: DecisionMode = "compare"
): Promise<PersonaComparisonResult[]> {
  return Promise.all(
    personas.map((p) =>
      simulatePersona(
        p,
        productDescription,
        targetCustomer,
        marketType,
        usageContext,
        variantA,
        variantB,
        inputType,
        decisionMode
      )
    )
  );
}

export async function generateSummaryInsights(
  productDescription: string,
  targetCustomer: string,
  marketType: string,
  usageContext: string,
  variantA: string,
  variantB: string,
  results: PersonaComparisonResult[],
  inputType: InputType = "copy",
  decisionMode: DecisionMode = "compare"
): Promise<{
  topLikedPoints: string[];
  topConcerns: string[];
  recommendedCopies: string[];
  oneParagraphInsight: string;
}> {
  const reactionsText = results
    .map(
      (r, i) =>
        decisionMode === "review"
          ? `페르소나${i + 1}(${r.persona.age}세 ${r.persona.sex} ${r.persona.occupation}): ` +
            `반응="${r.reactionA.oneSentenceReaction}" 구매의향=${r.reactionA.purchaseIntent} ` +
            `이해도=${r.reactionA.comprehension ?? "-"} 신뢰도=${r.reactionA.trust ?? "-"} ` +
            `우려=${r.reactionA.concerns.join(" / ")}`
          : `페르소나${i + 1}(${r.persona.age}세 ${r.persona.sex} ${r.persona.occupation}): ` +
            `A반응="${r.reactionA.oneSentenceReaction}" B반응="${r.reactionB.oneSentenceReaction}" 선호=${r.preferredVariant}`
    )
    .join("\n");

  try {
    const text = await callLLM(
      "당신은 마케팅 리서치 분석가입니다. JSON만 출력하세요.",
      buildSummaryPrompt(
        productDescription,
        targetCustomer,
        marketType,
        usageContext,
        variantA,
        variantB,
        reactionsText,
        inputType,
        decisionMode
      )
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
    // pricing axes
    perceivedValue: clamp(r?.perceivedValue),
    affordability: clamp(r?.affordability),
    willingnessToPay: clamp(r?.willingnessToPay),
    // feature axes
    necessity: clamp(r?.necessity),
    urgency: clamp(r?.urgency),
    existingSolutionAwareness: clamp(r?.existingSolutionAwareness),
    // positioning axes
    uniqueness: clamp(r?.uniqueness),
    toneFit: clamp(r?.toneFit),
    audienceFit: clamp(r?.audienceFit),
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
