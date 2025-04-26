import { NextRequest, NextResponse } from 'next/server';
import { SubscriptionPlan, UserSubscription, SubscriptionResponse, CheckoutResponse, UsageResponse } from '@/types/subscription';

// Planos de assinatura disponíveis
const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Para designers que querem experimentar a plataforma',
    price: 0,
    features: [
      '3 usos de cada agente por mês',
      'Acesso a todos os agentes',
      'Suporte por email'
    ],
    limits: {
      'heuristics': 3,
      'patterns': 3,
      'usecases': 3,
      'coreaction': 3,
      'comparison': 3,
      'ideation': 3
    }
  },
  {
    id: 'designer',
    name: 'Designer',
    description: 'Para designers que trabalham em projetos regulares',
    price: 97,
    features: [
      '15 análises heurísticas por mês',
      '15 usos dos outros agentes por mês',
      'Suporte prioritário',
      'Exportação de relatórios'
    ],
    limits: {
      'heuristics': 15,
      'patterns': 15,
      'usecases': 15,
      'coreaction': 15,
      'comparison': 15,
      'ideation': 15
    },
    isPopular: true
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Para designers profissionais e freelancers',
    price: 197,
    features: [
      'Uso ilimitado de todos os agentes',
      'Suporte prioritário 24/7',
      'Exportação de relatórios',
      'API de integração',
      'Acesso antecipado a novos recursos'
    ],
    limits: {
      'heuristics': 999999,
      'patterns': 999999,
      'usecases': 999999,
      'coreaction': 999999,
      'comparison': 999999,
      'ideation': 999999
    }
  },
  {
    id: 'team',
    name: 'Team',
    description: 'Para equipes de design e empresas',
    price: null,
    features: [
      'Acesso para 5-10 membros da equipe',
      'Dashboard de gerenciamento de equipe',
      'Relatórios consolidados',
      'Compartilhamento de resultados',
      'Implementação personalizada',
      'Suporte dedicado'
    ],
    limits: {
      'heuristics': 999999,
      'patterns': 999999,
      'usecases': 999999,
      'coreaction': 999999,
      'comparison': 999999,
      'ideation': 999999
    },
    isEnterprise: true
  }
];

// Usuário simulado para testes
const MOCK_USER: UserSubscription = {
  userId: 'user-123',
  planId: 'free',
  status: 'active',
  startDate: new Date().toISOString(),
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias a partir de hoje
  usageThisMonth: {
    'heuristics': 0,
    'patterns': 0,
    'usecases': 0,
    'coreaction': 0,
    'comparison': 0,
    'ideation': 0
  }
};

// Endpoint para obter informações do plano atual
export async function GET(request: NextRequest) {
  try {
    // Em um sistema real, obteríamos o usuário a partir do token de autenticação
    const user = MOCK_USER;
    
    // Obter o plano do usuário
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === user.planId);
    
    if (!plan) {
      return NextResponse.json({
        success: false,
        message: 'Plano não encontrado'
      } as SubscriptionResponse, { status: 404 });
    }
    
    // Calcular uso restante
    const remainingUsage: Record<string, number> = {};
    Object.keys(plan.limits).forEach(agentId => {
      remainingUsage[agentId] = plan.limits[agentId] - (user.usageThisMonth[agentId] || 0);
    });
    
    return NextResponse.json({
      success: true,
      message: 'Informações de assinatura obtidas com sucesso',
      plan,
      subscription: user,
      remainingUsage
    } as SubscriptionResponse);
  } catch (error: any) {
    console.error('Erro ao obter informações de assinatura:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Erro interno no servidor'
    } as SubscriptionResponse, { status: 500 });
  }
}

// Endpoint para verificar se o usuário pode usar um agente específico
export async function POST(request: NextRequest) {
  try {
    const { agentId } = await request.json();
    
    if (!agentId) {
      return NextResponse.json({
        success: false,
        message: 'ID do agente não fornecido',
        canUse: false
      } as UsageResponse, { status: 400 });
    }
    
    // Em um sistema real, obteríamos o usuário a partir do token de autenticação
    const user = MOCK_USER;
    
    // Obter o plano do usuário
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === user.planId);
    
    if (!plan) {
      return NextResponse.json({
        success: false,
        message: 'Plano não encontrado',
        canUse: false
      } as UsageResponse, { status: 404 });
    }
    
    // Verificar se o agente existe no plano
    if (!(agentId in plan.limits)) {
      return NextResponse.json({
        success: false,
        message: 'Agente não encontrado',
        canUse: false
      } as UsageResponse, { status: 404 });
    }
    
    // Verificar se o usuário ainda tem usos disponíveis
    const currentUsage = user.usageThisMonth[agentId] || 0;
    const limit = plan.limits[agentId];
    const remaining = limit - currentUsage;
    const canUse = remaining > 0;
    
    // Em um sistema real, atualizaríamos o contador de uso no banco de dados
    if (canUse) {
      user.usageThisMonth[agentId] = currentUsage + 1;
    }
    
    return NextResponse.json({
      success: true,
      message: canUse ? 'Uso autorizado' : 'Limite de uso atingido',
      canUse,
      remainingUsage: remaining - (canUse ? 1 : 0),
      totalUsage: currentUsage + (canUse ? 1 : 0),
      limit
    } as UsageResponse);
  } catch (error: any) {
    console.error('Erro ao verificar uso de agente:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Erro interno no servidor',
      canUse: false
    } as UsageResponse, { status: 500 });
  }
}

// Endpoint para iniciar processo de checkout (simulado)
export async function PUT(request: NextRequest) {
  try {
    const { planId } = await request.json();
    
    if (!planId) {
      return NextResponse.json({
        success: false,
        message: 'ID do plano não fornecido'
      } as CheckoutResponse, { status: 400 });
    }
    
    // Verificar se o plano existe
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
    
    if (!plan) {
      return NextResponse.json({
        success: false,
        message: 'Plano não encontrado'
      } as CheckoutResponse, { status: 404 });
    }
    
    // Se for o plano Team, retornar URL para formulário de contato
    if (plan.isEnterprise) {
      return NextResponse.json({
        success: true,
        message: 'Redirecionando para formulário de contato',
        checkoutUrl: '/contact?plan=team'
      } as CheckoutResponse);
    }
    
    // Para outros planos, simular URL de checkout da Hotmart
    // Em um sistema real, integraríamos com a API da Hotmart para criar um checkout
    const checkoutUrl = plan.price === 0 
      ? '/subscription/confirm?plan=free' 
      : `/subscription/checkout?plan=${planId}&price=${plan.price}`;
    
    return NextResponse.json({
      success: true,
      message: 'Checkout iniciado com sucesso',
      checkoutUrl
    } as CheckoutResponse);
  } catch (error: any) {
    console.error('Erro ao iniciar checkout:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Erro interno no servidor'
    } as CheckoutResponse, { status: 500 });
  }
}

// Endpoint para atualizar plano (simulado)
export async function PATCH(request: NextRequest) {
  try {
    const { planId } = await request.json();
    
    if (!planId) {
      return NextResponse.json({
        success: false,
        message: 'ID do plano não fornecido'
      } as SubscriptionResponse, { status: 400 });
    }
    
    // Verificar se o plano existe
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
    
    if (!plan) {
      return NextResponse.json({
        success: false,
        message: 'Plano não encontrado'
      } as SubscriptionResponse, { status: 404 });
    }
    
    // Em um sistema real, atualizaríamos o plano do usuário no banco de dados
    MOCK_USER.planId = planId;
    
    // Resetar contadores de uso
    MOCK_USER.usageThisMonth = {
      'heuristics': 0,
      'patterns': 0,
      'usecases': 0,
      'coreaction': 0,
      'comparison': 0,
      'ideation': 0
    };
    
    // Atualizar datas
    MOCK_USER.startDate = new Date().toISOString();
    MOCK_USER.endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    
    return NextResponse.json({
      success: true,
      message: 'Plano atualizado com sucesso',
      plan,
      subscription: MOCK_USER
    } as SubscriptionResponse);
  } catch (error: any) {
    console.error('Erro ao atualizar plano:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Erro interno no servidor'
    } as SubscriptionResponse, { status: 500 });
  }
}

// Exportar planos para uso em outros componentes
export { SUBSCRIPTION_PLANS };
