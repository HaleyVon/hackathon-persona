import OpenAI from "openai";
import {
  DecisionMode,
  ImprovementOption,
  ImprovementResponse,
  InputType,
  PersonaRecord,
  RelevanceLevel,
  VariantReaction,
  PersonaComparisonResult,
} from "./types";
import {
  buildSystemPrompt,
  buildUserPrompt,
  buildSummaryPrompt,
  buildImprovePrompt,
} from "./prompt";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

type RawReaction = {
  relevanceLevel?: RelevanceLevel;
  relevanceReason?: string;
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
    temperature: 0.5,
    response_format: { type: "json_object" },
  });
  return res.choices[0].message.content ?? "{}";
}

function relevanceWeight(level: RelevanceLevel | undefined): number {
  if (level === "high") return 1;
  if (level === "medium") return 0.7;
  return 0.4;
}

function normalizeRelevanceLevel(level: unknown): RelevanceLevel {
  if (level === "high" || level === "medium" || level === "low") {
    return level;
  }
  return "medium";
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
    relevance: {
      level: normalizeRelevanceLevel(r.relevanceLevel),
      weight: relevanceWeight(normalizeRelevanceLevel(r.relevanceLevel)),
      reason: r.relevanceReason ?? "",
    },
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
            `관련도=${r.relevance.level}(${r.relevance.reason || "사유 없음"}) ` +
            `반응="${r.reactionA.oneSentenceReaction}" 구매의향=${r.reactionA.purchaseIntent} ` +
            `이해도=${r.reactionA.comprehension ?? "-"} 신뢰도=${r.reactionA.trust ?? "-"} ` +
            `우려=${r.reactionA.concerns.join(" / ")}`
          : `페르소나${i + 1}(${r.persona.age}세 ${r.persona.sex} ${r.persona.occupation}): ` +
            `관련도=${r.relevance.level}(${r.relevance.reason || "사유 없음"}) ` +
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

export async function generateImprovementOptions(params: {
  productDescription: string;
  targetCustomer: string;
  marketType: string;
  usageContext: string;
  inputType: InputType;
  decisionMode: DecisionMode;
  variantA: string;
  variantB?: string;
  winner?: "A" | "B" | "Tie";
  topConcerns: string[];
  recommendedCopies: string[];
  oneParagraphInsight: string;
}): Promise<ImprovementResponse> {
  try {
    const text = await callLLM(
      "당신은 제품팀을 돕는 편집자입니다. JSON만 출력하세요.",
      buildImprovePrompt(params)
    );
    const parsed = JSON.parse(text) as { options?: ImprovementOption[] };
    return {
      options: (parsed.options ?? [])
        .slice(0, 3)
        .map((option) => ({
          strategy: option.strategy,
          content: option.content,
          rationale: option.rationale,
          improved: option.improved ?? true,
          improvementDelta: option.improvementDelta ?? "원문 대비 개선 포인트가 정리되지 않았습니다.",
          remainingIssues: option.remainingIssues ?? [],
        })),
    };
  } catch {
    const fallbackBase = params.recommendedCopies.slice(0, 3);
    const options = (fallbackBase.length ? fallbackBase : [params.variantA, params.variantB ?? params.variantA, params.variantA])
      .slice(0, 3)
      .map((content, index) => ({
        strategy: ["명확화", "신뢰 보강", "행동 유도"][index] ?? `개선안 ${index + 1}`,
        content,
        rationale: "자동 생성에 실패해 기존 추천안을 우선 표시합니다.",
        improved: true,
        improvementDelta: "원문 대비 핵심 우려를 줄이는 방향으로 우선 정리했습니다.",
        remainingIssues: ["실제 재평가가 필요합니다."],
      }));
    return { options };
  }
}

function clamp(v: unknown): number | undefined {
  const n = Number(v);
  if (isNaN(n)) return undefined;
  return Math.min(5, Math.max(1, Math.round(n)));
}

function normalizeReaction(r: Partial<VariantReaction>): VariantReaction {
  const likedPoints = (r?.likedPoints ?? []).filter((value) => value && value !== "없음");
  const concerns = (r?.concerns ?? []).filter((value) => value && value !== "없음");
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
    likedPoints,
    concerns,
    memorablePhrase: r?.memorablePhrase === "없음" ? "" : r?.memorablePhrase ?? "",
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
    relevanceLevel: "medium",
    relevanceReason: "분석 실패",
    reactionA: neutral,
    reactionB: neutral,
    preferredVariant: "Tie",
    preferenceReason: "분석 실패",
  };
}
