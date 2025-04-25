import { BusinessModel, ActionType, FlowType, DeviceType } from '@/types/analysis';

interface SelectOption<T> {
  value: T;
  label: string;
}

export const BUSINESS_MODEL_OPTIONS: SelectOption<BusinessModel>[] = [
  { value: 'marketplace', label: 'Marketplace' },
  { value: 'social_network', label: 'Rede social' },
  { value: 'saas', label: 'SaaS/Web apps' },
  { value: 'video_content', label: 'Conteúdo em vídeo' },
  { value: 'audio_content', label: 'Conteúdo em áudio' },
  { value: 'finance', label: 'Finanças e gestão' }
];

export const ACTION_TYPE_OPTIONS: SelectOption<ActionType>[] = [
  { value: 'signup_login', label: 'Cadastro/Login' },
  { value: 'onboarding', label: 'Onboarding' },
  { value: 'edit_create', label: 'Edição/Criação' },
  { value: 'submit', label: 'Envio' },
  { value: 'purchase', label: 'Compra' },
  { value: 'delete', label: 'Exclusão' },
  { value: 'search', label: 'Busca' },
  { value: 'social', label: 'Interação social' },
  { value: 'customization', label: 'Personalização' },
  { value: 'support', label: 'Suporte' },
  { value: 'navigation', label: 'Navegação' }
];

export const FLOW_TYPE_OPTIONS: SelectOption<FlowType>[] = [
  { value: 'main_success', label: 'Principal/Sucesso' },
  { value: 'alternative_exception', label: 'Alternativo/Exceção' },
  { value: 'error_block', label: 'Erro/Bloqueio' },
  { value: 'exploratory', label: 'Exploratório' },
  { value: 'confirmation', label: 'Confirmação' }
];

export const DEVICE_OPTIONS: SelectOption<DeviceType>[] = [
  { value: 'web', label: 'Web' },
  { value: 'tablet', label: 'Tablet' },
  { value: 'mobile', label: 'Mobile' }
]; 