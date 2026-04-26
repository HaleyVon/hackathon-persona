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
};

export type SimulationRequest = {
  productDescription: string;
  variantA: string;
  variantB: string;
  filters: SimulationFilters;
  sampleSize: number;
};

export type VariantReaction = {
  purchaseIntent: number; // 1~5
  likedPoints: string[];
  concerns: string[];
  memorablePhrase: string;
  oneSentenceReaction: string;
};

export type PersonaComparisonResult = {
  persona: PersonaRecord;
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
};

export type SimulationSummary = {
  winner: "A" | "B" | "Tie";
  avgScoreA: number;
  avgScoreB: number;
  topLikedPoints: string[];
  topConcerns: string[];
  recommendedCopies: string[];
  oneParagraphInsight: string;
  segmentBreakdown: SegmentBreakdown[];
};

export type SimulationResponse = {
  summary: SimulationSummary;
  personas: PersonaComparisonResult[];
};
