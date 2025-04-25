"use client"

import Link from "next/link"
import { MainLayout } from "@/components/layout/main-layout"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, AlertCircle, CheckCircle2 } from "lucide-react"

type Status = 'completed' | 'in_progress' | 'failed'

interface Analysis {
  id: string
  agent: string
  title: string
  date: string
  status: Status
  preview: string
}

const mockHistory: Analysis[] = [
  {
    id: "1",
    agent: "Análise Heurística",
    title: "Análise do repositório frontend-components",
    date: "2024-03-20T10:30:00Z",
    status: "completed",
    preview: "Foram encontrados 3 problemas de usabilidade que precisam ser corrigidos..."
  },
  {
    id: "2", 
    agent: "Análise de Segurança",
    title: "Verificação de vulnerabilidades API",
    date: "2024-03-19T15:45:00Z",
    status: "in_progress",
    preview: "Analisando endpoints e configurações de segurança..."
  },
  {
    id: "3",
    agent: "Análise de Performance",
    title: "Otimização de queries do banco de dados",
    date: "2024-03-18T09:15:00Z",
    status: "failed",
    preview: "A análise falhou devido a problemas de conexão com o banco de dados..."
  }
]

const statusConfig: Record<Status, { icon: any, variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  completed: { icon: CheckCircle2, variant: "default" },
  in_progress: { icon: Clock, variant: "secondary" },
  failed: { icon: AlertCircle, variant: "destructive" }
}

export default function HistoryPage() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-8 p-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Histórico de Análises</h1>
          <p className="text-muted-foreground">
            Visualize e acompanhe todas as análises realizadas no seu código
          </p>
        </div>

        <div className="grid gap-4">
          {mockHistory.map((analysis) => {
            const StatusIcon = statusConfig[analysis.status].icon
            
            return (
              <Link key={analysis.id} href={`/analysis/${analysis.id}`}>
                <Card className="p-6 hover:bg-accent/50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{analysis.title}</h3>
                        <Badge variant={statusConfig[analysis.status].variant}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {analysis.status === 'in_progress' ? 'Em progresso' : 
                            analysis.status === 'completed' ? 'Concluído' : 'Falhou'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{analysis.preview}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{analysis.agent}</span>
                        <span>{new Date(analysis.date).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </MainLayout>
  )
} 