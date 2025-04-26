export interface UseCaseType {
  id: string;
  name: string;
  description: string;
}

export interface UseCase {
  content: string;
}

export interface UseCaseCategory {
  id: string;
  name: string;
  description: string;
  cases: UseCase[];
}

export interface UseCaseReport {
  useCases: UseCaseCategory[];
  feature: string;
  userType: string | null;
  systemContext: string | null;
  fullReport: string;
}

export interface UseCaseFormData {
  feature: string;
  userType?: string;
  systemContext?: string;
}

export interface ValidationErrors {
  feature?: string;
  userType?: string;
  systemContext?: string;
}
