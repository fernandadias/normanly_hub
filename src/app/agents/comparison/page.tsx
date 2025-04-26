"use client"

import { useState } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Label } from '@/components/ui/label'
import { AlertCircle, Loader2, ArrowLeft, ArrowRight } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ComparisonFormData, ValidationErrors, ComparisonResult, ComparisonCriterion } from '@/types/comparison'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function ComparisonPage() {
  const { toast } = useToast()
  const [formData, setFormData] = useState<ComparisonFormData>({
    ideaA: '',
    ideaB: '',
    problem: '',
    context: ''
  })
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ComparisonResult | null>(null)
  const [activeTab, setActiveTab] = useState<string>('overview')

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}

    if (!formData.ideaA.trim()) {
      newErrors.ideaA = 'Por favor, descreva a primeira ideia'
    }
    if (!formData.ideaB.trim()) {
      newErrors.ideaB = 'Por favor, descreva a segunda ideia'
    }
    if (!formData.problem.trim()) {
      newErrors.problem = 'Por favor, descreva o problema a ser resolvido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/comparison', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`)
      }

      const result = await response.json()
      setResult(result)
    } catch (error: any) {
      toast({
        title: "Erro ao comparar ideias",
        description: error.message || "Ocorreu um erro ao processar seu pedido. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      ideaA: '',
      ideaB: '',
      problem: '',
      context: ''
    })
    setErrors({})
    setResult(null)
    setActiveTab('overview')
  }

  // Função para obter a cor baseada na pontuação
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-500'
    if (score >= 5) return 'text-amber-500'
    return 'text-red-500'
  }

  // Função para obter a cor da barra de progresso
  const getProgressColor = (score: number) => {
    if (score >= 8) return 'bg-green-500'
    if (score >= 5) return 'bg-amber-500'
    return 'bg-red-500'
  }

  // Função para determinar qual ideia tem a maior pontuação em um critério
  const getWinnerForCriterion = (criterion: ComparisonCriterion) => {
    if (!criterion.scores) return null;
    if (criterion.scores.ideaA > criterion.scores.ideaB) return 'A';
    if (criterion.scores.ideaB > criterion.scores.ideaA) return 'B';
    return null; // Empate
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Confronto de Ideias</h1>
          <p className="text-gray-600">Compare duas ideias e determine qual é a melhor solução para seu problema</p>
        </div>

        {result ? (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Resultado da Comparação</h2>
              <Button variant="outline" onClick={resetForm}>
                Nova Comparação
              </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="criteria">Critérios</TabsTrigger>
                <TabsTrigger value="analysis">Análise Completa</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className={result.winner === 'ideaA' ? 'border-green-500 border-2' : ''}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        Ideia A
                        {result.winner === 'ideaA' && (
                          <Badge className="ml-2 bg-green-500">Vencedora</Badge>
                        )}
                      </CardTitle>
                      <CardDescription>
                        Primeira solução proposta
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-line">{result.ideaA}</p>
                    </CardContent>
                    <CardFooter>
                      <div className="w-full">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Pontuação Total</span>
                          <span className="font-bold">
                            {result.criteria.reduce((sum, criterion) => sum + (criterion.scores?.ideaA || 0), 0)} / {result.criteria.length * 10}
                          </span>
                        </div>
                        <Progress 
                          value={result.criteria.reduce((sum, criterion) => sum + (criterion.scores?.ideaA || 0), 0) / result.criteria.length * 10} 
                          max={100} 
                          className="h-2" 
                        />
                      </div>
                    </CardFooter>
                  </Card>

                  <Card className={result.winner === 'ideaB' ? 'border-green-500 border-2' : ''}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        Ideia B
                        {result.winner === 'ideaB' && (
                          <Badge className="ml-2 bg-green-500">Vencedora</Badge>
                        )}
                      </CardTitle>
                      <CardDescription>
                        Segunda solução proposta
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-line">{result.ideaB}</p>
                    </CardContent>
                    <CardFooter>
                      <div className="w-full">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Pontuação Total</span>
                          <span className="font-bold">
                            {result.criteria.reduce((sum, criterion) => sum + (criterion.scores?.ideaB || 0), 0)} / {result.criteria.length * 10}
                          </span>
                        </div>
                        <Progress 
                          value={result.criteria.reduce((sum, criterion) => sum + (criterion.scores?.ideaB || 0), 0) / result.criteria.length * 10} 
                          max={100} 
                          className="h-2" 
                        />
                      </div>
                    </CardFooter>
                  </Card>
                </div>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Justificativa</CardTitle>
                    <CardDescription>
                      Por que a ideia {result.winner === 'ideaA' ? 'A' : 'B'} é a melhor solução
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-line">{result.winnerJustification}</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="criteria">
                <div className="space-y-6">
                  {result.criteria.map((criterion) => (
                    <Card key={criterion.id}>
                      <CardHeader>
                        <CardTitle>{criterion.name}</CardTitle>
                        <CardDescription>{criterion.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="font-medium mb-2 flex items-center">
                              Ideia A
                              {getWinnerForCriterion(criterion) === 'A' && (
                                <Badge className="ml-2 bg-green-500">Melhor</Badge>
                              )}
                            </h3>
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`text-xl font-bold ${getScoreColor(criterion.scores?.ideaA || 0)}`}>
                                {criterion.scores?.ideaA || 0}/10
                              </span>
                            </div>
                            <Progress 
                              value={(criterion.scores?.ideaA || 0) * 10} 
                              max={100} 
                              className={`h-2 ${getProgressColor(criterion.scores?.ideaA || 0)}`} 
                            />
                          </div>
                          
                          <div>
                            <h3 className="font-medium mb-2 flex items-center">
                              Ideia B
                              {getWinnerForCriterion(criterion) === 'B' && (
                                <Badge className="ml-2 bg-green-500">Melhor</Badge>
                              )}
                            </h3>
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`text-xl font-bold ${getScoreColor(criterion.scores?.ideaB || 0)}`}>
                                {criterion.scores?.ideaB || 0}/10
                              </span>
                            </div>
                            <Progress 
                              value={(criterion.scores?.ideaB || 0) * 10} 
                              max={100} 
                              className={`h-2 ${getProgressColor(criterion.scores?.ideaB || 0)}`} 
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="analysis">
                <Card>
                  <CardHeader>
                    <CardTitle>Análise Detalhada</CardTitle>
                    <CardDescription>
                      Comparação completa das duas ideias
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <div className="whitespace-pre-line">
                        {result.analysis}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Compare Suas Ideias</CardTitle>
                  <CardDescription>
                    Descreva duas ideias diferentes para resolver o mesmo problema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="problem">Problema a ser Resolvido <span className="text-red-500">*</span></Label>
                      <Textarea
                        id="problem"
                        placeholder="Ex: Usuários abandonam o carrinho de compras antes de finalizar a compra..."
                        rows={3}
                        value={formData.problem}
                        onChange={(e) => {
                          setFormData({ ...formData, problem: e.target.value })
                          if (errors.problem) setErrors({ ...errors, problem: undefined })
                        }}
                        className={errors.problem ? 'border-destructive' : ''}
                      />
                      {errors.problem && (
                        <Alert variant="destructive" className="mt-1">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{errors.problem}</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="ideaA">Ideia A <span className="text-red-500">*</span></Label>
                        <Textarea
                          id="ideaA"
                          placeholder="Ex: Implementar um sistema de descontos progressivos..."
                          rows={5}
                          value={formData.ideaA}
                          onChange={(e) => {
                            setFormData({ ...formData, ideaA: e.target.value })
                            if (errors.ideaA) setErrors({ ...errors, ideaA: undefined })
                          }}
                          className={errors.ideaA ? 'border-destructive' : ''}
                        />
                        {errors.ideaA && (
                          <Alert variant="destructive" className="mt-1">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{errors.ideaA}</AlertDescription>
                          </Alert>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="ideaB">Ideia B <span className="text-red-500">*</span></Label>
                        <Textarea
                          id="ideaB"
                          placeholder="Ex: Simplificar o processo de checkout reduzindo o número de etapas..."
                          rows={5}
                          value={formData.ideaB}
                          onChange={(e) => {
                            setFormData({ ...formData, ideaB: e.target.value })
                            if (errors.ideaB) setErrors({ ...errors, ideaB: undefined })
                          }}
                          className={errors.ideaB ? 'border-destructive' : ''}
                        />
                        {errors.ideaB && (
                          <Alert variant="destructive" className="mt-1">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{errors.ideaB}</AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="context">Contexto Adicional (opcional)</Label>
                      <Textarea
                        id="context"
                        placeholder="Ex: O site é um e-commerce de moda com público-alvo de 25-35 anos..."
                        rows={3}
                        value={formData.context || ''}
                        onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                      />
                    </div>

                    <Button 
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Comparando Ideias...
                        </>
                      ) : 'Comparar Ideias'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Critérios de Avaliação</CardTitle>
                  <CardDescription>
                    Como suas ideias serão comparadas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm">
                    <div>
                      <h3 className="font-medium">Viabilidade</h3>
                      <p className="mt-1 text-muted-foreground">
                        Quão viável é implementar esta ideia considerando recursos, tempo e tecnologia disponíveis?
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium">Impacto</h3>
                      <p className="mt-1 text-muted-foreground">
                        Qual o potencial impacto desta ideia na resolução do problema e na experiência do usuário?
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium">Inovação</h3>
                      <p className="mt-1 text-muted-foreground">
                        Quão inovadora é esta ideia em comparação com soluções existentes no mercado?
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium">Escalabilidade</h3>
                      <p className="mt-1 text-muted-foreground">
                        Quão bem esta ideia pode escalar para atender a um número crescente de usuários ou casos de uso?
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium">Alinhamento</h3>
                      <p className="mt-1 text-muted-foreground">
                        Quão bem esta ideia se alinha com os objetivos de negócio e necessidades dos usuários?
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
