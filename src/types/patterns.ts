export interface PatternCategory {
  id: string;
  name: string;
  description: string;
}

export interface PatternReport {
  report: string;
  categories: PatternCategory[];
  challenge: string;
  context: string | null;
  industryType: string | null;
}

export interface PatternFormData {
  challenge: string;
  context?: string;
  industryType?: string;
}

export interface ValidationErrors {
  challenge?: string;
  context?: string;
  industryType?: string;
}
