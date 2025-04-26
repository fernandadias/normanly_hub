"use client"

import { useState, useEffect } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { SubscriptionPlan, UserSubscription, SubscriptionResponse } from '@/types/subscription'
import { Check, X, Loader2, ArrowRight, CreditCard, Users, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function SubscriptionPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan | null>(null)
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [remainingUsage, setRemainingUsage] = useState<Record<string, number>>({})
  const [activeTab, setActiveTab] = useState<string>('plans')
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchSubscriptionData()
  }, [])

  const fetchSubscriptionData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/subscription')
      const data: SubscriptionResponse = await response.json()
      
      if (data.success) {
        if (data.plan) setCurrentPlan(data.plan)
        if (data.subscription) setSubscription(data.subscription)
        if (data.remainingUsage) setRemainingUsage(data.remainingUsage)
        
        // Obter todos os planos disponíveis
        const plansResponse = await fetch('/api/subscription/plans')
        const plansData = await plansResponse.json()
        if (plansData.success) {
          setPlans(plansData.plans)
        }
      } else {
        toast({
          title: "Erro ao carregar assinatura",
          description: data.message,
          variant: "destructive"
        })
      }
    } catch (error: any) {
      toast({
        title: "Erro ao carregar assinatura",
        description: error.message || "Ocorreu um erro ao carregar os dados da assinatura",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCheckout = async (planId: string) => {
    setCheckoutLoading(planId)
    try {
      const response = await fetch('/api/subscription', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId }),
      })
      
      const data = await response.json()
      
      if (data.success && data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else {
        toast({
          title: "Erro ao iniciar checkout",
          description: data.message,
          variant: "destructive"
        })
      }
    } catch (error: any) {
      toast({
        title: "Erro ao iniciar checkout",
        description: error.message || "Ocorreu um erro ao iniciar o processo de checkout",
        variant: "destructive"
      })
    } finally {
      setCheckoutLoading(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR')
  }

  const getAgentName = (agentId: string) => {
    const agentNames: Record<string, string> = {
      'heuristics': 'Análise Heurística',
      'patterns': 'Repositório de Padrões',
      'usecases': 'Gerador de Casos de Uso',
      'coreaction': 'Definição de Core Action',
      'comparison': 'Confronto de Ideias',
      'ideation': 'Ideação de Novas Features'
    }
    return agentNames[agentId] || agentId
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Gerenciamento de Assinatura</h1>
          <p className="text-gray-600">Gerencie seu plano e acompanhe o uso dos agentes</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Carregando informações da assinatura...</span>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="plans">Planos</TabsTrigger>
              <TabsTrigger value="usage">Uso dos Agentes</TabsTrigger>
              <TabsTrigger value="details">Detalhes da Assinatura</TabsTrigger>
            </TabsList>
            
            <TabsContent value="plans">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {plans.map((plan) => (
                  <Card key={plan.id} className={`flex flex-col ${plan.isPopular ? 'border-primary' : ''}`}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{plan.name}</CardTitle>
                          <CardDescription>{plan.description}</CardDescription>
                        </div>
                        {plan.isPopular && (
                          <Badge className="bg-primary">Popular</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="mb-4">
                        {plan.price === null ? (
                          <div className="text-2xl font-bold">Personalizado</div>
                        ) : plan.price === 0 ? (
                          <div className="text-2xl font-bold">Grátis</div>
                        ) : (
                          <div>
                            <span className="text-2xl font-bold">R$ {plan.price}</span>
                            <span className="text-sm text-muted-foreground">/mês</span>
                          </div>
                        )}
                      </div>
                      <ul className="space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full" 
                        variant={plan.id === currentPlan?.id ? "outline" : (plan.isPopular ? "default" : "secondary")}
                        onClick={() => handleCheckout(plan.id)}
                        disabled={checkoutLoading !== null || plan.id === currentPlan?.id}
                      >
                        {checkoutLoading === plan.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processando...
                          </>
                        ) : plan.id === currentPlan?.id ? (
                          'Plano Atual'
                        ) : plan.isEnterprise ? (
                          <>
                            <Users className="mr-2 h-4 w-4" />
                            Fale Conosco
                          </>
                        ) : plan.price === 0 ? (
                          'Começar Grátis'
                        ) : (
                          <>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Assinar Agora
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="usage">
              <Card>
                <CardHeader>
                  <CardTitle>Uso dos Agentes</CardTitle>
                  <CardDescription>
                    Acompanhe o uso dos agentes no seu plano atual ({currentPlan?.name})
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {Object.keys(remainingUsage).map((agentId) => {
                      const limit = currentPlan?.limits[agentId] || 0;
                      const used = limit - remainingUsage[agentId];
                      const percentage = limit > 0 ? (used / limit) * 100 : 0;
                      
                      return (
                        <div key={agentId}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{getAgentName(agentId)}</span>
                            <span>
                              {used} / {limit === 999999 ? '∞' : limit}
                            </span>
                          </div>
                          <Progress value={percentage} max={100} className="h-2" />
                          <p className="text-sm text-muted-foreground mt-1">
                            {remainingUsage[agentId] === 0 ? (
                              <span className="text-red-500">Limite atingido</span>
                            ) : limit === 999999 ? (
                              'Uso ilimitado'
                            ) : (
                              `${remainingUsage[agentId]} usos restantes`
                            )}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
                <CardFooter>
                  {currentPlan?.id !== 'pro' && (
                    <Button onClick={() => setActiveTab('plans')} className="w-full">
                      Fazer Upgrade <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="details">
              {subscription && (
                <Card>
                  <CardHeader>
                    <CardTitle>Detalhes da Assinatura</CardTitle>
                    <CardDescription>
                      Informações sobre sua assinatura atual
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Plano</h3>
                          <p className="text-lg font-medium">{currentPlan?.name}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                          <div className="flex items-center">
                            <Badge variant={subscription.status === 'active' ? 'default' : 'destructive'}>
                              {subscription.status === 'active' ? 'Ativo' : 
                               subscription.status === 'canceled' ? 'Cancelado' :
                               subscription.status === 'expired' ? 'Expirado' : 'Trial'}
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Data de Início</h3>
                          <p>{formatDate(subscription.startDate)}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Próxima Cobrança</h3>
                          <p>{formatDate(subscription.endDate)}</p>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Preço</h3>
                        {currentPlan?.price === null ? (
                          <p>Personalizado - Entre em contato para detalhes</p>
                        ) : currentPlan?.price === 0 ? (
                          <p>Grátis</p>
                        ) : (
                          <p className="text-lg font-medium">R$ {currentPlan?.price},00 / mês</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                    {currentPlan?.id !== 'pro' && (
                      <Button onClick={() => setActiveTab('plans')} className="w-full sm:w-auto">
                        <Zap className="mr-2 h-4 w-4" />
                        Fazer Upgrade
                      </Button>
                    )}
                    {subscription.status === 'active' && currentPlan?.price !== 0 && (
                      <Button variant="outline" className="w-full sm:w-auto">
                        Cancelar Assinatura
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </MainLayout>
  )
}
