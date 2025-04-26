export interface IdeationFeature {
  title: string;
  content: string;
}

export interface IdeationResult {
  features: IdeationFeature[];
  fullContent: string;
  currentFeature: string;
  userProblem: string;
  targetAudience: string | null;
  constraints: string | null;
}

export interface IdeationFormData {
  currentFeature: string;
  userProblem: string;
  targetAudience?: string;
  constraints?: string;
  featureCount?: number;
}

export interface ValidationErrors {
  currentFeature?: string;
  userProblem?: string;
  targetAudience?: string;
  constraints?: string;
  featureCount?: string;
}
