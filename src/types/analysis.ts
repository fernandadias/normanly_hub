export type BusinessModel = 'marketplace' | 'social_network' | 'saas' | 'video_content' | 'audio_content' | 'finance';
export type ActionType = 'signup_login' | 'onboarding' | 'edit_create' | 'submit' | 'purchase' | 'delete' | 'search' | 'social' | 'customization' | 'support' | 'navigation';
export type FlowType = 'main_success' | 'alternative_exception' | 'error_block' | 'exploratory' | 'confirmation';
export type DeviceType = 'web' | 'tablet' | 'mobile';

export interface AnalysisImage {
  file: File;
  order: number;
  isStart?: boolean;
  isEnd?: boolean;
}

export interface AnalysisFormData {
  images: AnalysisImage[];
  businessModel: BusinessModel;
  actionType: ActionType;
  flowType: FlowType;
  device: DeviceType;
}

export interface ValidationErrors {
  images?: string;
  businessModel?: string;
  actionType?: string;
  flowType?: string;
  device?: string;
} 