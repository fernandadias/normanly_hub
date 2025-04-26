export interface CoreActionDimension {
  id: string;
  name: string;
  description: string;
  questions: string[];
  score?: number;
}

export interface CoreActionResult {
  coreAction: string;
  dimensions: CoreActionDimension[];
  overallScore: number;
  analysis: string;
  productName: string;
  productDescription: string;
  targetAudience: string | null;
  businessModel: string | null;
  currentActions: string[];
}

export interface CoreActionFormData {
  productName: string;
  productDescription: string;
  targetAudience?: string;
  businessModel?: string;
  currentActions?: string[];
}

export interface ValidationErrors {
  productName?: string;
  productDescription?: string;
  targetAudience?: string;
  businessModel?: string;
  currentActions?: string;
}
