"use client"

import { MainLayout } from '@/components/layout/main-layout'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

const mockAnalysis = {
  metrics: [
    { name: 'Engajamento', weight: 0.3 },
    { name: 'Conversão', weight: 0.4 },
    { name: 'Satisfação', weight: 0.3 }
  ],
  factors: [
    { name: 'Complexidade', weight: 0.2 },
    { name: 'Custo', weight: 0.2 },
    { name: 'Tempo', weight: 0.2 },
    { name: 'Risco', weight: 0.2 },
    { name: 'Escalabilidade', weight: 0.2 }
  ]
}

export default function ComparisonPage() {
  const [problem, setProblem] = useState('')
  const [option1, setOption1] = useState('')
  const [option2, setOption2] = useState('')
  const [analysis, setAnalysis] = useState<{
    option1: { score: number; pros: string[]; cons: string[] };
    option2: { score: number; pros: string[]; cons: string[] };
    recommendation: string;
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!problem.trim() || !option1.trim() || !option2.trim()) return

    setIsLoading(true)

    // Simulando análise
    setTimeout(() => {
      const score1 = Math.random() * 100
      const score2 = Math.random() * 100

      const pros1 = [
        'Melhor experiência do usuário',
        'Menor complexidade técnica',
        'Mais rápido para implementar'
      ]
      const cons1 = [
        'Maior custo inicial',
        'Menos flexível para mudanças'
      ]

      const pros2 = [
        'Menor custo inicial',
        'Mais flexível para mudanças',
        'Melhor para MVP'
      ]
      const cons2 = [
        'Experiência do usuário menos refinada',
        'Maior complexidade técnica'
      ]

      const recommendation = score1 > score2
        ? `Recomendo a primeira opção (${option1}) pois tem maior pontuação geral e melhor equilíbrio entre os fatores analisados.`
        : `Recomendo a segunda opção (${option2}) pois tem maior pontuação geral e melhor equilíbrio entre os fatores analisados.`

      setAnalysis({
        option1: { score: score1, pros: pros1, cons: cons1 },
        option2: { score: score2, pros: pros2, cons: cons2 },
        recommendation
      })
      setIsLoading(false)
    }, 1500)
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Confronto de Ideias</h1>
          <p className="text-muted-foreground mt-2">
            Compare duas possíveis soluções para um problema e receba uma análise detalhada
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Descreva o problema</Label>
            <Input
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="Ex: Como aumentar o engajamento dos usuários?"
            />
          </div>

          <div className="space-y-2">
            <Label>Primeira opção</Label>
            <Input
              value={option1}
              onChange={(e) => setOption1(e.target.value)}
              placeholder="Ex: Reduzir o número de etapas no fluxo"
            />
          </div>

          <div className="space-y-2">
            <Label>Segunda opção</Label>
            <Input
              value={option2}
              onChange={(e) => setOption2(e.target.value)}
              placeholder="Ex: Adicionar uma barra de progresso animada"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Analisando...' : 'Iniciar Análise'}
          </Button>
        </form>

        {analysis && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 bg-card rounded-lg">
                <h3 className="font-semibold mb-2">{option1}</h3>
                <div className="text-2xl font-bold text-primary mb-4">
                  {analysis.option1.score.toFixed(1)}%
                </div>
                <div className="space-y-2">
                  <div>
                    <h4 className="font-medium text-sm">Pontos Positivos</h4>
                    <ul className="text-sm text-muted-foreground">
                      {analysis.option1.pros.map((pro, i) => (
                        <li key={i}>• {pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Pontos de Atenção</h4>
                    <ul className="text-sm text-muted-foreground">
                      {analysis.option1.cons.map((con, i) => (
                        <li key={i}>• {con}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-card rounded-lg">
                <h3 className="font-semibold mb-2">{option2}</h3>
                <div className="text-2xl font-bold text-primary mb-4">
                  {analysis.option2.score.toFixed(1)}%
                </div>
                <div className="space-y-2">
                  <div>
                    <h4 className="font-medium text-sm">Pontos Positivos</h4>
                    <ul className="text-sm text-muted-foreground">
                      {analysis.option2.pros.map((pro, i) => (
                        <li key={i}>• {pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Pontos de Atenção</h4>
                    <ul className="text-sm text-muted-foreground">
                      {analysis.option2.cons.map((con, i) => (
                        <li key={i}>• {con}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-primary/10 rounded-lg">
              <h3 className="font-semibold mb-2">Recomendação</h3>
              <p className="text-muted-foreground">{analysis.recommendation}</p>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
} 