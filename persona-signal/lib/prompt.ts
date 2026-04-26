import { DecisionMode, InputType, PersonaRecord } from "./types";
import { getInputTypeCopy, getVariantLabel } from "./display";

export function buildPersonaContext(p: PersonaRecord): string {
  const profileBits = [
    `성별: ${p.sex}`,
    `나이: ${p.age}세`,
    `직업: ${p.occupation}`,
    `거주지: ${p.province}${p.district ? ` ${p.district}` : ""}`,
    `학력: ${p.education_level ?? "미상"}`,
    `결혼여부: ${p.marital_status ?? "미상"}`,
    `가족 형태: ${p.family_type ?? "미상"}`,
    `주거: ${p.housing_type ?? "미상"}`,
    p.bachelors_field ? `전공: ${p.bachelors_field}` : null,
    p.military_status ? `병역: ${p.military_status}` : null,
    p.country ? `국가: ${p.country}` : null,
  ]
    .filter(Boolean)
    .join(" | ");

  const parts = [
    `이름/배경: ${p.persona}`,
    p.professional_persona && `직업적 특성: ${p.professional_persona}`,
    p.family_persona && `가족/생활: ${p.family_persona}`,
    p.hobbies_and_interests && `관심사: ${p.hobbies_and_interests}`,
    p.hobbies_and_interests_list && `관심 키워드: ${p.hobbies_and_interests_list}`,
    p.career_goals_and_ambitions && `목표: ${p.career_goals_and_ambitions}`,
    p.arts_persona && `예술/취향: ${p.arts_persona}`,
    p.sports_persona && `스포츠: ${p.sports_persona}`,
    p.culinary_persona && `음식: ${p.culinary_persona}`,
    p.travel_persona && `여행: ${p.travel_persona}`,
    p.cultural_background && `문화적 배경: ${p.cultural_background}`,
    p.skills_and_expertise && `스킬: ${p.skills_and_expertise}`,
    p.skills_and_expertise_list && `스킬 키워드: ${p.skills_and_expertise_list}`,
  ]
    .filter(Boolean)
    .join("\n");

  return `[페르소나 정보]
${profileBits}

${parts}`;
}

export function buildSystemPrompt(): string {
  return `당신은 아래 주어진 한국인입니다. 지금 SNS나 웹을 보다가 어떤 제품 제안이나 문구를 처음 마주쳤습니다.

[반드시 지켜야 할 행동 규칙]
1. 당신은 카피라이터나 심사위원이 아닙니다. 실제 타깃 사용자처럼 직관적으로 반응하세요.
2. 이 제품에 대해 아무것도 모릅니다. 제시된 정보만 보고 첫 인상을 답하세요. 조사하거나 과도하게 추론하지 마세요.
3. 먼저 이 제안이 당신의 삶/업무와 원래 관련 있는지 판단하세요. 관련이 낮으면 낮다고 말해도 됩니다.
4. 하지만 관련이 높고, 효익이 구체적이며, 표현이 명확하면 분명하게 긍정적으로 반응해도 됩니다. 억지로 비판적으로 굴지 마세요.
5. 장점과 단점을 균형 있게 보세요. 좋게 느낀 점이 없으면 "없음"이라고 쓰고, 문제점이 없으면 "없음"이라고 써도 됩니다.
6. 점수는 현실적으로 매기세요. 4점은 "전반적으로 좋고 약간만 수정하면 됨", 5점은 "매우 명확하고 바로 행동하고 싶음"입니다.
7. 3점은 "이해는 되지만 설득력이 약함", 2점은 "핵심이 불명확하거나 신뢰가 부족함", 1점은 "이해/신뢰/매력 모두 낮음"입니다.
8. 마케팅 업계식 평론을 하지 말고, 실제 사용자처럼 "나와 관련 있는지 / 믿을 수 있는지 / 행동하고 싶은지" 기준으로 답하세요.
9. 반드시 JSON만 출력하세요. 다른 텍스트 없이.`;
}

function buildTypeAxesSchema(inputType: InputType): string {
  if (inputType === "pricing") {
    return `    "perceivedValue": <1=이 가격엔 가치가 없다 / 3=적당하다 / 5=가격 대비 충분히 납득된다>,
    "affordability": <1=나는 절대 못 낼 것 같다 / 3=고민될 것 같다 / 5=충분히 낼 수 있다>,
    "willingnessToPay": <1=공짜여도 안 쓸 것 같다 / 3=조건부로 고려 / 5=지금 결제하고 싶다>,`;
  }
  if (inputType === "feature") {
    return `    "necessity": <1=없어도 전혀 무관하다 / 3=있으면 좋겠다 / 5=이게 없으면 안 된다>,
    "urgency": <1=나중에 생각해볼 것 같다 / 3=관심은 있다 / 5=지금 당장 필요하다>,
    "existingSolutionAwareness": <1=이미 더 좋은 걸 쓰고 있다 / 3=비슷한 게 있지만 불편하다 / 5=이런 걸 찾고 있었다>,`;
  }
  if (inputType === "positioning") {
    return `    "uniqueness": <1=다른 브랜드와 다를 게 없다 / 3=약간 차별화된다 / 5=이건 확실히 다르다>,
    "toneFit": <1=나와 맞지 않는 느낌이다 / 3=무난하다 / 5=나를 위해 쓴 것 같다>,
    "audienceFit": <1=다른 사람을 위한 것 같다 / 3=나일 수도 있다 / 5=정확히 나 같은 사람을 위한 것>,`;
  }
  return "";
}

function buildReactionSchema(inputType: InputType, side: "A" | "B", label: string): string {
  return `  "reaction${side}": {
    "purchaseIntent": <1=무시하고 넘길 것 같다 / 2=관심은 낮다 / 3=이해는 되지만 더 설득이 필요하다 / 4=전반적으로 좋고 조금만 다듬으면 행동할 수 있다 / 5=매우 명확하고 바로 써보거나 결제하거나 더 알아보고 싶다>,
    "comprehension": <1=뭘 하는 건지 전혀 모르겠다 / 2=어렴풋이 짐작 / 3=대충 이해 / 4=이해됨 / 5=한 번에 바로 이해>,
    "trust": <1=광고 과장 같아 믿기 어렵다 / 2=의심스럽다 / 3=보통 / 4=믿을 수 있다 / 5=신뢰가 간다>,
    "appeal": <1=나와 전혀 상관없다 / 2=내 이야기 아님 / 3=약간 흥미 / 4=나한테 필요할 수도 / 5=나를 위한 것>,
    "resistance": <1=거슬리는 게 없다 / 2=약간 걸림 / 3=불편 / 4=꽤 거슬림 / 5=읽기 불쾌>,
    "confusionRisk": <1=오해 여지 없다 / 2=약간 애매 / 3=다르게 해석 가능 / 4=헷갈림 / 5=무슨 말인지 모름>,
${buildTypeAxesSchema(inputType)}
    "likedPoints": ["<${label}에서 공감되거나 끌렸던 구체적 표현이나 이유. 없으면 '없음'>"],
    "concerns": ["<불편하거나 이해 안 되거나 믿기 어려웠던 구체적 표현이나 이유. 없으면 '없음'>"],
    "memorablePhrase": "<읽고 나서 기억에 남는 표현. 없으면 '없음'>",
    "oneSentenceReaction": "<처음 봤을 때 드는 솔직한 한 문장 반응>"
  }`;
}

export function buildUserPrompt(
  persona: PersonaRecord,
  productDescription: string,
  targetCustomer: string,
  marketType: string,
  usageContext: string,
  variantA: string,
  variantB: string,
  inputType: InputType = "copy",
  isReview = false
): string {
  const label = getInputTypeCopy(inputType).inputTitle;

  if (isReview) {
    const schema = `{
  "relevanceLevel": "<high | medium | low>",
  "relevanceReason": "<이 제안이 왜 나와 관련 있거나 없는지 한 문장>",
${buildReactionSchema(inputType, "A", label)},
  "preferredVariant": "A",
  "preferenceReason": "<이 ${label}의 핵심 강점과 약점 한 문장>"
}`;
    return `${buildPersonaContext(persona)}

[제품 설명]
${productDescription}

[주 타깃 고객]
${targetCustomer}

[시장 유형]
${marketType}

[사용 / 구매 맥락]
${usageContext || "별도 설명 없음"}

[검토할 ${getVariantLabel(inputType, "A", "review")}]
${variantA}

위 페르소나의 관점에서 이 ${label}에 대한 반응을 JSON으로 출력하세요 (reactionA에만 작성):
${schema}`;
  }

  const schema = `{
  "relevanceLevel": "<high | medium | low>",
  "relevanceReason": "<이 제안이 왜 나와 관련 있거나 없는지 한 문장>",
${buildReactionSchema(inputType, "A", label)},
${buildReactionSchema(inputType, "B", label)},
  "preferredVariant": "<A 또는 B 또는 Tie>",
  "preferenceReason": "<먼저 A와 B를 각각 따로 본 뒤, 둘 중 어느 쪽이 이 사람의 삶에 더 와닿는지 이유 한 문장. 둘 다 별로면 솔직히 그렇게 써도 됩니다>"
}`;

  return `${buildPersonaContext(persona)}

[제품 설명]
${productDescription}

[주 타깃 고객]
${targetCustomer}

[시장 유형]
${marketType}

[사용 / 구매 맥락]
${usageContext || "별도 설명 없음"}

[${getVariantLabel(inputType, "A")}]
${variantA}

[${getVariantLabel(inputType, "B")}]
${variantB}

위 페르소나의 관점에서 두 ${label}에 대한 반응을 JSON으로 출력하세요:
${schema}`;
}

export function buildSummaryPrompt(
  productDescription: string,
  targetCustomer: string,
  marketType: string,
  usageContext: string,
  variantA: string,
  variantB: string,
  reactions: string,
  inputType: InputType = "copy",
  decisionMode: DecisionMode = "compare"
): string {
  const label = getInputTypeCopy(inputType).inputTitle;

  if (decisionMode === "review") {
    return `당신은 마케팅 리서처입니다. 아래는 실제 소비자들이 어떤 ${label}을 처음 봤을 때의 반응 데이터입니다.

[제품]
${productDescription}

[주 타깃 고객]
${targetCustomer}

[시장 유형]
${marketType}

[사용 / 구매 맥락]
${usageContext || "별도 설명 없음"}

[검토한 ${getVariantLabel(inputType, "A", "review")}]
${variantA}

[소비자 반응 데이터]
${reactions}

위 데이터를 분석하되, 다음 관점으로 답하세요:
- related personas의 반응과 low relevance 반응을 구분해 과도하게 섞지 마세요.
- topLikedPoints: 공통으로 좋게 반응한 구체적 표현이나 이유
- topConcerns: 혼란, 불신, 거부감의 원인. 어떤 표현이 왜 문제인지 구체적으로
- recommendedCopies: 현재 안을 더 명확하고 설득력 있게 다듬은 수정안 2~3개
- oneParagraphInsight: 전반적 반응, 가장 큰 리스크, 우선 수정할 포인트를 2~3문장으로

JSON만 출력:
{
  "topLikedPoints": ["<구체적 호감 포인트 1>", "<2>", "<3>"],
  "topConcerns": ["<구체적 우려/혼란 포인트 1>", "<2>", "<3>"],
  "recommendedCopies": ["<수정 문장 1>", "<2>"],
  "oneParagraphInsight": "<핵심 분석 2~3문장>"
}`;
  }

  return `당신은 마케팅 리서처입니다. 아래는 실제 소비자들이 ${label} 두 안을 처음 봤을 때의 반응 데이터입니다.

[제품]
${productDescription}

[주 타깃 고객]
${targetCustomer}

[시장 유형]
${marketType}

[사용 / 구매 맥락]
${usageContext || "별도 설명 없음"}

[${getVariantLabel(inputType, "A")}] ${variantA}
[${getVariantLabel(inputType, "B")}] ${variantB}

[소비자 반응 데이터]
${reactions}

위 데이터를 분석하되, 다음 관점으로 답하세요:
- related personas의 반응과 low relevance 반응을 구분해 과도하게 섞지 마세요.
- topLikedPoints: 여러 페르소나에서 공통으로 나온 긍정 반응. 구체적인 표현이나 이유를 명시하세요.
- topConcerns: 혼란, 불신, 거부감의 원인. "~라는 표현이 ~처럼 들린다" 형식으로 구체적으로.
- recommendedCopies: 위 리스크를 줄이면서 더 명확하게 전달하는 개선안 2~3개. 실제로 쓸 수 있는 문장.
- oneParagraphInsight: A/B 차이의 핵심 원인, 어느 세그먼트에서 어떤 리스크가 높은지, 우선 개선해야 할 것. 2~3문장.

JSON만 출력:
{
  "topLikedPoints": ["<구체적 호감 포인트 1>", "<2>", "<3>"],
  "topConcerns": ["<구체적 우려/혼란 포인트 1>", "<2>", "<3>"],
  "recommendedCopies": ["<개선 카피 문장 1>", "<2>"],
  "oneParagraphInsight": "<핵심 분석 2~3문장>"
}`;
}

export function buildImprovePrompt(params: {
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
}): string {
  const {
    productDescription,
    targetCustomer,
    marketType,
    usageContext,
    inputType,
    decisionMode,
    variantA,
    variantB,
    winner = "Tie",
    topConcerns,
    recommendedCopies,
    oneParagraphInsight,
  } = params;
  const labels = getInputTypeCopy(inputType);

  return `당신은 제품팀을 위한 수석 카피/오퍼 전략가입니다. 아래 결과를 바탕으로 개선안을 3개 생성하세요.

[제품]
${productDescription}

[주 타깃 고객]
${targetCustomer}

[시장 유형]
${marketType}

[사용 / 구매 맥락]
${usageContext || "별도 설명 없음"}

[결정 모드]
${decisionMode === "review" ? "단일 검토" : "A/B 비교"}

[입력 타입]
${labels.inputTitle}

[원안]
${getVariantLabel(inputType, "A")}: ${variantA}
${variantB ? `${getVariantLabel(inputType, "B")}: ${variantB}` : ""}

[현재 결론]
${winner === "Tie" ? "두 안의 장단점을 섞어 새 안을 만드는 것이 좋음" : `${getVariantLabel(inputType, winner)} 방향이 상대적으로 우세`}

[핵심 우려]
${topConcerns.map((concern, index) => `${index + 1}. ${concern}`).join("\n")}

[기존 수정 제안]
${recommendedCopies.map((copy, index) => `${index + 1}. ${copy}`).join("\n") || "없음"}

[요약 분석]
${oneParagraphInsight}

조건:
- 반드시 3개 이상 제안
- 서로 다른 전략이어야 함
- ${labels.inputTitle} 타입에 맞는 결과물이어야 함
- 피드백을 반영하되 원래 의도는 유지할 것
- 각 개선안마다 원문 대비 더 나아졌는지 판단할 것

아래 형식으로 채우세요:
{
  "options": [
    {
      "strategy": "<어떤 전략으로 바꿨는지 8자 내외>",
      "content": "<실제로 바로 쓸 수 있는 개선안 전문>",
      "rationale": "<왜 이렇게 바꿨는지 한 줄 설명>",
      "improved": <true 또는 false>,
      "improvementDelta": "<원문 대비 무엇이 더 명확/신뢰/행동유도 측면에서 좋아졌는지>",
      "remainingIssues": ["<아직 남아 있는 문제 1>", "<2>"]
    }
  ]
}`;
}
