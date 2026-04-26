import { PersonaRecord } from "./types";

export function buildPersonaContext(p: PersonaRecord): string {
  const parts = [
    `이름/배경: ${p.persona}`,
    p.professional_persona && `직업적 특성: ${p.professional_persona}`,
    p.family_persona && `가족/생활: ${p.family_persona}`,
    p.hobbies_and_interests && `관심사: ${p.hobbies_and_interests}`,
    p.career_goals_and_ambitions && `목표: ${p.career_goals_and_ambitions}`,
    p.sports_persona && `스포츠: ${p.sports_persona}`,
    p.culinary_persona && `음식: ${p.culinary_persona}`,
    p.travel_persona && `여행: ${p.travel_persona}`,
    p.cultural_background && `문화적 배경: ${p.cultural_background}`,
    p.skills_and_expertise && `스킬: ${p.skills_and_expertise}`,
  ]
    .filter(Boolean)
    .join("\n");

  return `[페르소나 정보]
성별: ${p.sex} | 나이: ${p.age}세 | 직업: ${p.occupation}
거주지: ${p.province}${p.district ? " " + p.district : ""} | 학력: ${p.education_level ?? "미상"}
결혼여부: ${p.marital_status ?? "미상"} | 주거: ${p.housing_type ?? "미상"}

${parts}`;
}

export function buildSystemPrompt(): string {
  return `당신은 한국인 합성 페르소나입니다.
주어진 페르소나 정보를 바탕으로, 그 사람의 관점에서 제품 카피 A와 B에 반응합니다.
- 실제 그 사람처럼 솔직하고 구체적으로 반응하세요.
- 과장하거나 마케팅적으로 긍정적으로 쓰지 마세요.
- 반드시 아래 JSON 형식만 출력하세요. 다른 텍스트 없이.`;
}

export function buildUserPrompt(
  persona: PersonaRecord,
  productDescription: string,
  variantA: string,
  variantB: string
): string {
  const schema = `{
  "reactionA": {
    "purchaseIntent": <1~5 정수. 구매/사용 의향>,
    "comprehension": <1~5 정수. 메시지가 명확히 이해되는가. 5=매우 명확>,
    "trust": <1~5 정수. 믿을 수 있는 느낌. 5=매우 신뢰>,
    "appeal": <1~5 정수. 관심/매력도. 5=매우 매력적>,
    "resistance": <1~5 정수. 거부감. 5=매우 강한 거부감>,
    "confusionRisk": <1~5 정수. 오해/혼동 가능성. 5=매우 혼란스러움>,
    "likedPoints": ["<좋았던 점 1>", "<좋았던 점 2>"],
    "concerns": ["<거부감/우려 1>", "<거부감/우려 2>"],
    "memorablePhrase": "<가장 기억에 남는 표현>",
    "oneSentenceReaction": "<한 문장 반응>"
  },
  "reactionB": {
    "purchaseIntent": <1~5 정수. 구매/사용 의향>,
    "comprehension": <1~5 정수. 메시지가 명확히 이해되는가. 5=매우 명확>,
    "trust": <1~5 정수. 믿을 수 있는 느낌. 5=매우 신뢰>,
    "appeal": <1~5 정수. 관심/매력도. 5=매우 매력적>,
    "resistance": <1~5 정수. 거부감. 5=매우 강한 거부감>,
    "confusionRisk": <1~5 정수. 오해/혼동 가능성. 5=매우 혼란스러움>,
    "likedPoints": ["<좋았던 점 1>", "<좋았던 점 2>"],
    "concerns": ["<거부감/우려 1>", "<거부감/우려 2>"],
    "memorablePhrase": "<가장 기억에 남는 표현>",
    "oneSentenceReaction": "<한 문장 반응>"
  },
  "preferredVariant": "<A 또는 B 또는 Tie>",
  "preferenceReason": "<A/B 중 어느 쪽을 선호하는지 이유 한 문장>"
}`;

  return `${buildPersonaContext(persona)}

[제품 설명]
${productDescription}

[카피 A]
${variantA}

[카피 B]
${variantB}

위 페르소나의 관점에서 두 카피에 대한 반응을 JSON으로 출력하세요:
${schema}`;
}

export function buildSummaryPrompt(
  productDescription: string,
  variantA: string,
  variantB: string,
  reactions: string
): string {
  return `다음은 한국인 페르소나들의 두 카피에 대한 반응 데이터입니다.

[제품]
${productDescription}

[카피 A] ${variantA}
[카피 B] ${variantB}

[페르소나 반응 데이터]
${reactions}

위 데이터를 분석해 아래 JSON만 출력하세요:
{
  "topLikedPoints": ["<공통 호감 포인트 1>", "<2>", "<3>"],
  "topConcerns": ["<공통 우려 포인트 1>", "<2>", "<3>"],
  "recommendedCopies": ["<개선 카피 제안 1>", "<2>", "<3>"],
  "oneParagraphInsight": "<전체 인사이트 2~3문장. A/B 차이와 타겟별 특성 포함>"
}`;
}
