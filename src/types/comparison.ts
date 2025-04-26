export interface ComparisonCriterion {
  id: string;
  name: string;
  description: string;
  scores?: {
    ideaA: number;
    ideaB: number;
  };
}

export interface ComparisonResult {
  criteria: ComparisonCriterion[];
  winner: string;
  winnerJustification: string;
  analysis: string;
  ideaA: string;
  ideaB: string;
  problem: string;
  context: string | null;
}

export interface ComparisonFormData {
  ideaA: string;
  ideaB: string;
  problem: string;
  context?: string;
}

export interface ValidationErrors {
  ideaA?: string;
  ideaB?: string;
  problem?: string;
  context?: string;
}
