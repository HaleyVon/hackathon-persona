// Nemotron-Personas-Korea 전체 필드
export type PersonaRecord = {
  id: number;
  uuid?: string;
  sex: string;
  age: number;
  occupation: string;
  province: string;
  district?: string;
  education_level?: string;
  marital_status?: string;
  military_status?: string;
  family_type?: string;
  housing_type?: string;
  bachelors_field?: string;
  country?: string;
  persona: string;
  professional_persona?: string;
  family_persona?: string;
  hobbies_and_interests?: string;
  hobbies_and_interests_list?: string;
  career_goals_and_ambitions?: string;
  skills_and_expertise?: string;
  skills_and_expertise_list?: string;
  sports_persona?: string;
  arts_persona?: string;
  travel_persona?: string;
  culinary_persona?: string;
  cultural_background?: string;
};

export type SimulationFilters = {
  sexes: string[];
  ageMin: number;
  ageMax: number;
  occupations: string[];
  provinces: string[];
  maritalStatuses: string[];
};

export type DecisionMode = "compare" | "review";
export type InputType = "copy" | "pricing" | "feature" | "positioning";
export type MarketType = "B2B" | "B2C" | "B2B2C";
export type RelevanceLevel = "high" | "medium" | "low";

export type SimulationRequest = {
  productDescription: string;
  targetCustomer: string;
  marketType: MarketType;
  usageContext: string;
  variantA: string;
  variantB: string;
  filters: SimulationFilters;
  sampleSize: number;
  decisionMode: DecisionMode;
  inputType: InputType;
};

export type VariantReaction = {
  purchaseIntent: number;
  // 공통 5축
  comprehension?: number;
  trust?: number;
  appeal?: number;
  resistance?: number;
  confusionRisk?: number;
  // 가격/플랜 추가 축
  perceivedValue?: number;
  affordability?: number;
  willingnessToPay?: number;
  // 기능/아이디어 추가 축
  necessity?: number;
  urgency?: number;
  existingSolutionAwareness?: number;
  // 포지셔닝/브랜드 추가 축
  uniqueness?: number;
  toneFit?: number;
  audienceFit?: number;
  likedPoints: string[];
  concerns: string[];
  memorablePhrase: string;
  oneSentenceReaction: string;
};

export type PersonaComparisonResult = {
  persona: PersonaRecord;
  relevance: {
    level: RelevanceLevel;
    weight: number;
    reason: string;
  };
  reactionA: VariantReaction;
  reactionB: VariantReaction;
  preferredVariant: "A" | "B" | "Tie";
  preferenceReason: string;
};

export type SegmentBreakdown = {
  label: string;
  preferA: number;
  preferB: number;
  tie: number;
  total: number;
  winner?: "A" | "B" | "Tie";
  avgScoreA?: number;
  avgScoreB?: number;
  avgTrustA?: number;
  avgTrustB?: number;
  avgResistanceA?: number;
  avgResistanceB?: number;
  avgConfusionA?: number;
  avgConfusionB?: number;
};

export type SegmentInsight = {
  label: string;
  title: string;
  description: string;
  preferredVariant?: "A" | "B" | "Tie";
};

export type SegmentInsights = {
  resistant?: SegmentInsight;
  niche?: SegmentInsight;
  testFirst?: SegmentInsight;
};

export type UnexpectedSignal = {
  code:
    | "hidden_segment_risk"
    | "trust_gap"
    | "clarity_without_action"
    | "low_relevance_dilution"
    | "split_decision"
    | "buyer_user_mismatch";
  title: string;
  description: string;
  severity: "info" | "warning" | "critical";
};

export type RiskAxes = {
  comprehension: number;
  trust: number;
  appeal: number;
  resistance: number;
  confusionRisk: number;
};

export type DisplayRiskAxes = {
  comprehension: number;
  trust: number;
  appeal: number;
  acceptance: number;
  clarity: number;
};

export type SummaryConfidenceLevel = "high" | "medium" | "low";
export type SummaryCautionCode =
  | "small_sample"
  | "mixed_reactions"
  | "missing_context"
  | "close_call"
  | "residual_risk"
  | "low_relevance_mix";

export type SummaryConfidence = {
  level: SummaryConfidenceLevel;
  label: string;
  description: string;
};

export type SummaryCautionSignal = {
  code: SummaryCautionCode;
  label: string;
  description: string;
  severity: "info" | "warning" | "critical";
};

export type SimulationSummary = {
  winner: "A" | "B" | "Tie";
  avgScoreA: number;
  avgScoreB: number;
  riskAxesA?: RiskAxes;
  riskAxesB?: RiskAxes;
  typeAxesA?: Record<string, number>;
  typeAxesB?: Record<string, number>;
  topLikedPoints: string[];
  topConcerns: string[];
  recommendedCopies: string[];
  oneParagraphInsight: string;
  segmentBreakdown: SegmentBreakdown[];
  decisionMode?: DecisionMode;
  inputType?: InputType;
  confidence?: SummaryConfidence;
  cautionSignals?: SummaryCautionSignal[];
  segmentInsights?: SegmentInsights;
  unexpectedSignals?: UnexpectedSignal[];
  relevanceMix?: Record<RelevanceLevel, number>;
};

export type SimulationResponse = {
  summary: SimulationSummary;
  personas: PersonaComparisonResult[];
};

export type ImprovementOption = {
  strategy: string;
  content: string;
  rationale: string;
  improved?: boolean;
  improvementDelta?: string;
  remainingIssues?: string[];
};

export type ImprovementResponse = {
  options: ImprovementOption[];
};
