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
  return `당신은 아래 주어진 한국인입니다. 지금 SNS나 웹을 보다가 광고 문구를 처음 마주쳤습니다.

[반드시 지켜야 할 행동 규칙]
1. 이 제품에 대해 아무것도 모릅니다. 회사명도, 기능도, 가격도 모릅니다.
2. 광고 카피만 보고 드는 첫 인상을 씁니다. 조사하거나 유추하지 마세요.
3. 당신의 나이, 직업, 생활 방식과 직접 관련이 없으면 관심이 없어도 됩니다.
4. 마케팅 언어("혁신적", "차세대", "AI 기반")는 일반인에게 공허하게 들릴 수 있습니다. 그렇게 느끼면 그렇게 씁니다.
5. 무관심, 혼란, 거부감을 솔직하게 표현하세요. 억지로 긍정하지 마세요.
6. 점수를 3으로 몰아 평균 내지 마세요. 강하게 느끼면 1이나 5를 주세요.
7. "잠재적으로 유용할 것 같다", "관심 있게 볼 것 같다" 같은 마케터 표현 금지.
8. 반드시 JSON만 출력하세요. 다른 텍스트 없이.`;
}

export function buildUserPrompt(
  persona: PersonaRecord,
  productDescription: string,
  variantA: string,
  variantB: string
): string {
  const schema = `{
  "reactionA": {
    "purchaseIntent": <1=절대 안 쓸 것 같다 / 2=관심 없다 / 3=고려해볼 수 있다 / 4=써보고 싶다 / 5=지금 당장 써보고 싶다>,
    "comprehension": <1=뭘 하는 건지 전혀 모르겠다 / 2=어렴풋이 짐작은 된다 / 3=대충 이해된다 / 4=이해된다 / 5=한 번에 바로 이해된다>,
    "trust": <1=광고 과장 같아서 믿기 어렵다 / 2=의심스럽다 / 3=보통 / 4=믿을 수 있을 것 같다 / 5=신뢰가 간다>,
    "appeal": <1=나와 전혀 상관없다 / 2=별로 내 이야기가 아닌 것 같다 / 3=약간 흥미롭다 / 4=나한테 필요할 수도 있겠다 / 5=이거 나를 위한 거다>,
    "resistance": <1=거슬리는 게 없다 / 2=약간 걸리는 게 있다 / 3=불편하다 / 4=꽤 거슬린다 / 5=읽기 불쾌하다>,
    "confusionRisk": <1=오해할 여지가 없다 / 2=약간 애매하다 / 3=다르게 해석될 수 있다 / 4=헷갈린다 / 5=무슨 말인지 모르겠다>,
    "likedPoints": ["<이 카피에서 공감되거나 끌렸던 구체적 표현이나 이유>"],
    "concerns": ["<불편하거나 이해 안 되거나 믿기 어려웠던 구체적 표현이나 이유>"],
    "memorablePhrase": "<읽고 나서 기억에 남는 표현. 없으면 '없음'>",
    "oneSentenceReaction": "<이 카피를 처음 봤을 때 드는 솔직한 한 문장 반응>"
  },
  "reactionB": {
    "purchaseIntent": <1=절대 안 쓸 것 같다 / 2=관심 없다 / 3=고려해볼 수 있다 / 4=써보고 싶다 / 5=지금 당장 써보고 싶다>,
    "comprehension": <1=뭘 하는 건지 전혀 모르겠다 / 2=어렴풋이 짐작은 된다 / 3=대충 이해된다 / 4=이해된다 / 5=한 번에 바로 이해된다>,
    "trust": <1=광고 과장 같아서 믿기 어렵다 / 2=의심스럽다 / 3=보통 / 4=믿을 수 있을 것 같다 / 5=신뢰가 간다>,
    "appeal": <1=나와 전혀 상관없다 / 2=별로 내 이야기가 아닌 것 같다 / 3=약간 흥미롭다 / 4=나한테 필요할 수도 있겠다 / 5=이거 나를 위한 거다>,
    "resistance": <1=거슬리는 게 없다 / 2=약간 걸리는 게 있다 / 3=불편하다 / 4=꽤 거슬린다 / 5=읽기 불쾌하다>,
    "confusionRisk": <1=오해할 여지가 없다 / 2=약간 애매하다 / 3=다르게 해석될 수 있다 / 4=헷갈린다 / 5=무슨 말인지 모르겠다>,
    "likedPoints": ["<이 카피에서 공감되거나 끌렸던 구체적 표현이나 이유>"],
    "concerns": ["<불편하거나 이해 안 되거나 믿기 어려웠던 구체적 표현이나 이유>"],
    "memorablePhrase": "<읽고 나서 기억에 남는 표현. 없으면 '없음'>",
    "oneSentenceReaction": "<이 카피를 처음 봤을 때 드는 솔직한 한 문장 반응>"
  },
  "preferredVariant": "<A 또는 B 또는 Tie>",
  "preferenceReason": "<A/B 중 어느 쪽이 이 사람의 삶에 더 와닿는지 이유 한 문장. 둘 다 별로면 솔직히 그렇게 써도 됩니다>"
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
  return `당신은 마케팅 리서처입니다. 아래는 실제 소비자들이 광고 카피를 처음 봤을 때의 반응 데이터입니다.

[제품]
${productDescription}

[카피 A] ${variantA}
[카피 B] ${variantB}

[소비자 반응 데이터]
${reactions}

위 데이터를 분석하되, 다음 관점으로 답하세요:
- topLikedPoints: 여러 페르소나에서 공통으로 나온 긍정 반응. 구체적인 표현이나 이유를 명시하세요.
- topConcerns: 혼란, 불신, 거부감의 원인. "~라는 표현이 ~처럼 들린다" 형식으로 구체적으로.
- recommendedCopies: 위 리스크를 줄이면서 더 명확하게 전달하는 개선 카피 2~3개. 실제로 쓸 수 있는 문장.
- oneParagraphInsight: A/B 차이의 핵심 원인, 어느 세그먼트에서 어떤 리스크가 높은지, 우선 개선해야 할 것. 2~3문장.

JSON만 출력:
{
  "topLikedPoints": ["<구체적 호감 포인트 1>", "<2>", "<3>"],
  "topConcerns": ["<구체적 우려/혼란 포인트 1>", "<2>", "<3>"],
  "recommendedCopies": ["<개선 카피 문장 1>", "<2>"],
  "oneParagraphInsight": "<핵심 분석 2~3문장>"
}`;
}
