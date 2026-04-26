import { DecisionMode, DisplayRiskAxes, InputType, RiskAxes } from "./types";

type InputTypeCopy = {
  inputTitle: string;
  compareA: string;
  compareB: string;
  review: string;
  short: string;
  recommendation: string;
};

const INPUT_TYPE_COPY: Record<InputType, InputTypeCopy> = {
  copy: {
    inputTitle: "메시지",
    compareA: "메시지 A",
    compareB: "메시지 B",
    review: "검토 문구",
    short: "문구",
    recommendation: "추천 문구",
  },
  pricing: {
    inputTitle: "플랜",
    compareA: "플랜 A",
    compareB: "플랜 B",
    review: "검토 플랜",
    short: "플랜",
    recommendation: "추천 플랜",
  },
  feature: {
    inputTitle: "기능안",
    compareA: "기능안 A",
    compareB: "기능안 B",
    review: "검토 기능안",
    short: "기능안",
    recommendation: "추천 기능안",
  },
  positioning: {
    inputTitle: "포지셔닝 메시지",
    compareA: "포지셔닝 A",
    compareB: "포지셔닝 B",
    review: "검토 포지셔닝",
    short: "포지셔닝",
    recommendation: "추천 포지셔닝",
  },
};

export const DISPLAY_AXIS_LABELS: Record<keyof DisplayRiskAxes, string> = {
  comprehension: "이해도",
  trust: "신뢰도",
  appeal: "매력도",
  acceptance: "수용도",
  clarity: "명확성",
};

export function getInputTypeCopy(inputType: InputType): InputTypeCopy {
  return INPUT_TYPE_COPY[inputType];
}

export function getVariantLabel(
  inputType: InputType,
  side: "A" | "B",
  decisionMode: DecisionMode = "compare"
): string {
  if (decisionMode === "review") {
    return getInputTypeCopy(inputType).review;
  }

  const labels = getInputTypeCopy(inputType);
  return side === "A" ? labels.compareA : labels.compareB;
}

export function getSelectionLabel(inputType: InputType, decisionMode: DecisionMode): string {
  return decisionMode === "review"
    ? getInputTypeCopy(inputType).review
    : getInputTypeCopy(inputType).recommendation;
}

export function formatRecommendationBadge(inputType: InputType, side: "A" | "B"): string {
  return `${getVariantLabel(inputType, side)} 추천`;
}

export function toDisplayRiskAxes(axes: RiskAxes): DisplayRiskAxes {
  return {
    comprehension: axes.comprehension,
    trust: axes.trust,
    appeal: axes.appeal,
    acceptance: 6 - axes.resistance,
    clarity: 6 - axes.confusionRisk,
  };
}
