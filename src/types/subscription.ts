export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number | null;
  features: string[];
  limits: {
    [agentId: string]: number;
  };
  isPopular?: boolean;
  isEnterprise?: boolean;
}

export interface UserSubscription {
  userId: string;
  planId: string;
  status: 'active' | 'canceled' | 'expired' | 'trial';
  startDate: string;
  endDate: string;
  usageThisMonth: {
    [agentId: string]: number;
  };
}

export interface SubscriptionResponse {
  success: boolean;
  message: string;
  plan?: SubscriptionPlan;
  subscription?: UserSubscription;
  remainingUsage?: {
    [agentId: string]: number;
  };
}

export interface CheckoutResponse {
  success: boolean;
  message: string;
  checkoutUrl?: string;
}

export interface UsageResponse {
  success: boolean;
  message: string;
  canUse: boolean;
  remainingUsage?: number;
  totalUsage?: number;
  limit?: number;
}
