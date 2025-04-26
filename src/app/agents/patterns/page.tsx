"use client"

import { useState } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Label } from '@/components/ui/label'
import { AlertCircle, Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PatternFormData, ValidationErrors, PatternReport, PatternCategory } from '@/types/patterns'
import { Badge } from '@/components/ui/badge'

export default function PatternsPage() {
  const { toast } = useToast()
  const [formData, setFormData] = useState<PatternFormData>({
    challenge: '',
    context: '',
    industryType: ''
  })
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [report, setReport] = useState<PatternReport | null>(null)

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}

    if (!formData.challenge.trim()) {
      newErrors.challenge = 'Por favor, descreva seu desafio de design'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/patterns', {
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
      setReport(result)
    } catch (error: any) {
      toast({
        title: "Erro ao gerar relatório",
        description: error.message || "Ocorreu um erro ao processar seu pedido. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      challenge: '',
      context: '',
      industryType: ''
    })
    setErrors({})
    setReport(null)
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Repositório de Padrões UX/UI</h1>
          <p className="text-gray-600">Receba recomendações de padrões, melhores práticas e estratégias para seu desafio de design</p>
        </div>

        {report ? (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Relatório de Padrões UX/UI</h2>
              <Button variant="outline" onClick={resetForm}>
                Novo Relatório
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Desafio de Design</CardTitle>
                <CardDescription>
                  Seu desafio e contexto fornecidos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Desafio:</h3>
                    <p className="mt-1">{report.challenge}</p>
                  </div>
                  
                  {report.context && (
                    <div>
                      <h3 className="font-medium">Contexto:</h3>
                      <p className="mt-1">{report.context}</p>
                    </div>
                  )}
                  
                  {report.industryType && (
                    <div>
                      <h3 className="font-medium">Indústria:</h3>
                      <p className="mt-1">{report.industryType}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Categorias Relevantes</CardTitle>
                <CardDescription>
                  Categorias de padrões identificadas para seu desafio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {report.categories.map((category) => (
                    <Badge key={category.id} variant="outline" className="px-3 py-1">
                      {category.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Relatório Detalhado</CardTitle>
                <CardDescription>
                  Padrões UX/UI, melhores práticas e recomendações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <div className="whitespace-pre-line">
                    {report.report}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Descreva seu Desafio</CardTitle>
                  <CardDescription>
                    Forneça detalhes sobre o problema de design que você está enfrentando
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="challenge">Desafio de Design <span className="text-red-500">*</span></Label>
                      <Textarea
                        id="challenge"
                        placeholder="Ex: Estou redesenhando o fluxo de checkout de um e-commerce e preciso reduzir a taxa de abandono..."
                        rows={5}
                        value={formData.challenge}
                        onChange={(e) => {
                          setFormData({ ...formData, challenge: e.target.value })
                          if (errors.challenge) setErrors({ ...errors, challenge: undefined })
                        }}
                        className={errors.challenge ? 'border-destructive' : ''}
                      />
                      {errors.challenge && (
                        <Alert variant="destructive" className="mt-1">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{errors.challenge}</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="context">Contexto Adicional (opcional)</Label>
                      <Textarea
                        id="context"
                        placeholder="Ex: O público-alvo são pessoas de 30-45 anos, com pouca familiaridade tecnológica..."
                        rows={3}
                        value={formData.context || ''}
                        onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="industryType">Tipo de Indústria (opcional)</Label>
                      <Input
                        id="industryType"
                        placeholder="Ex: E-commerce, Saúde, Finanças, Educação..."
                        value={formData.industryType || ''}
                        onChange={(e) => setFormData({ ...formData, industryType: e.target.value })}
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
                          Gerando Relatório...
                        </>
                      ) : 'Gerar Relatório de Padrões'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Dicas</CardTitle>
                  <CardDescription>
                    Como obter melhores resultados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm">
                    <div>
                      <h3 className="font-medium">Seja específico</h3>
                      <p className="mt-1 text-muted-foreground">
                        Quanto mais detalhes você fornecer sobre seu desafio, mais relevantes serão as recomendações.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium">Inclua contexto</h3>
                      <p className="mt-1 text-muted-foreground">
                        Informações sobre seu público-alvo, objetivos de negócio e restrições ajudam a personalizar as recomendações.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium">Especifique a indústria</h3>
                      <p className="mt-1 text-muted-foreground">
                        Diferentes setores têm padrões específicos que podem ser aplicados ao seu caso.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium">Foque em um problema</h3>
                      <p className="mt-1 text-muted-foreground">
                        Relatórios para desafios específicos tendem a ser mais úteis do que para problemas muito amplos.
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
