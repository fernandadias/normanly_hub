"use client"

import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 'R$ 0',
    description: 'Ideal para quem está começando',
    features: [
      'Acesso a agentes básicos',
      '3 análises por mês',
      'Suporte por email',
      'Histórico limitado'
    ],
    buttonText: 'Usar Plano Gratuito',
    buttonVariant: 'outline' as const
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 'R$ 99',
    period: '/mês',
    description: 'Para profissionais que precisam de mais recursos',
    features: [
      'Todos os agentes disponíveis',
      'Análises ilimitadas',
      'Suporte prioritário',
      'Histórico completo',
      'Exportação de relatórios',
      'Acesso antecipado a novos agentes'
    ],
    buttonText: 'Assinar Plano Pro',
    buttonVariant: 'default' as const,
    isPopular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Personalizado',
    description: 'Solução completa para empresas',
    features: [
      'Todos os recursos do Pro',
      'API dedicada',
      'Suporte 24/7',
      'Treinamento da equipe',
      'Relatórios personalizados',
      'Integração com ferramentas internas'
    ],
    buttonText: 'Falar com Vendas',
    buttonVariant: 'outline' as const
  }
]

export default function PlansPage() {
  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto space-y-8 px-4 md:px-0">
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">Planos e Preços</h1>
          <p className="text-muted-foreground">
            Escolha o plano ideal para suas necessidades
          </p>
        </div>

        <ScrollArea className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 min-w-[800px] md:min-w-0">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative ${
                  plan.isPopular ? 'border-primary' : ''
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                      Mais Popular
                    </div>
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl md:text-3xl font-bold">{plan.price}</span>
                    {plan.period && (
                      <span className="text-muted-foreground">{plan.period}</span>
                    )}
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    variant={plan.buttonVariant}
                    className="w-full"
                  >
                    {plan.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </MainLayout>
  )
} 