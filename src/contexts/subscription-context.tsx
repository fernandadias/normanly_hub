"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { SubscriptionPlan, UserSubscription, SubscriptionResponse } from '@/types/subscription'
import { useToast } from '@/components/ui/use-toast'

interface SubscriptionContextType {
  isLoading: boolean;
  currentPlan: SubscriptionPlan | null;
  subscription: UserSubscription | null;
  remainingUsage: Record<string, number>;
  checkAgentUsage: (agentId: string) => Promise<boolean>;
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan | null>(null)
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [remainingUsage, setRemainingUsage] = useState<Record<string, number>>({})

  useEffect(() => {
    refreshSubscription()
  }, [])

  const refreshSubscription = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/subscription')
      const data: SubscriptionResponse = await response.json()
      
      if (data.success) {
        if (data.plan) setCurrentPlan(data.plan)
        if (data.subscription) setSubscription(data.subscription)
        if (data.remainingUsage) setRemainingUsage(data.remainingUsage)
      } else {
        toast({
          title: "Erro ao carregar assinatura",
          description: data.message,
          variant: "destructive"
        })
      }
    } catch (error: any) {
      console.error('Erro ao carregar assinatura:', error)
      toast({
        title: "Erro ao carregar assinatura",
        description: error.message || "Ocorreu um erro ao carregar os dados da assinatura",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const checkAgentUsage = async (agentId: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ agentId }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Atualizar o uso restante para este agente
        if (data.remainingUsage !== undefined) {
          setRemainingUsage(prev => ({
            ...prev,
            [agentId]: data.remainingUsage
          }))
        }
        
        if (!data.canUse) {
          toast({
            title: "Limite de uso atingido",
            description: `Você atingiu o limite de uso para ${agentId}. Considere fazer upgrade do seu plano para continuar usando.`,
            variant: "destructive"
          })
        }
        
        return data.canUse
      } else {
        toast({
          title: "Erro ao verificar uso",
          description: data.message,
          variant: "destructive"
        })
        return false
      }
    } catch (error: any) {
      console.error('Erro ao verificar uso:', error)
      toast({
        title: "Erro ao verificar uso",
        description: error.message || "Ocorreu um erro ao verificar o uso do agente",
        variant: "destructive"
      })
      return false
    }
  }

  return (
    <SubscriptionContext.Provider value={{
      isLoading,
      currentPlan,
      subscription,
      remainingUsage,
      checkAgentUsage,
      refreshSubscription
    }}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider')
  }
  return context
}
